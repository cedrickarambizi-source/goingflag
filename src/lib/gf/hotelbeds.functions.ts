import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { HotelDetailResult, StaySearchResult } from "./hotelbeds.types";

const searchSchema = z.object({
  destination: z.string().trim().min(2).max(80),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(8),
  children: z.coerce.number().int().min(0).max(6),
  rooms: z.coerce.number().int().min(1).max(4),
});

function datesInvalid(checkIn: string, checkOut: string) {
  const inDate = new Date(`${checkIn}T00:00:00Z`).getTime();
  const outDate = new Date(`${checkOut}T00:00:00Z`).getTime();
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  if (Number.isNaN(inDate) || Number.isNaN(outDate)) return "Those dates aren’t valid.";
  if (inDate < today) return "Check-in can’t be in the past.";
  if (outDate <= inDate) return "Check-out must be after check-in.";
  if (outDate - inDate > 30 * 86_400_000) return "Stays are limited to 30 nights.";
  return null;
}

export const searchStays = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<StaySearchResult> => {
    const parsed = searchSchema.safeParse(data);
    if (!parsed.success) {
      return { status: "invalid", message: "Add a destination and valid dates to search." };
    }
    const input = parsed.data;
    const dateError = datesInvalid(input.checkIn, input.checkOut);
    if (dateError) return { status: "invalid", message: dateError };

    try {
      const { resolveDestination, searchAvailability } = await import("./hotelbeds.server");
      const destination = await resolveDestination(input.destination);
      if (!destination) {
        return {
          status: "no-destination",
          message: `We couldn’t match “${input.destination}” to a destination. Try a city name such as Kigali or Zanzibar.`,
        };
      }
      const result = await searchAvailability(input, destination.code);
      const dest = { code: destination.code, name: destination.name };
      if (!result.hotels.length) {
        return {
          status: "empty",
          message: `No availability in ${destination.name} for those dates and guests.`,
          destination: dest,
        };
      }
      return {
        status: "ok",
        hotels: result.hotels,
        total: result.total,
        nights: result.nights,
        destination: dest,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
      };
    } catch (error) {
      console.error("[searchStays]", error);
      return { status: "error", message: "Live availability is temporarily unavailable. Please try again." };
    }
  });

const detailSchema = searchSchema.extend({ code: z.string().regex(/^\d+$/) });

export const getStay = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<HotelDetailResult> => {
    const parsed = detailSchema.safeParse(data);
    if (!parsed.success) return { status: "error", message: "That hotel link is missing search details." };
    const input = parsed.data;
    try {
      const { hotelAvailability } = await import("./hotelbeds.server");
      const { hotel, available } = await hotelAvailability(input.code, input);
      if (!hotel) return { status: "error", message: "We couldn’t load that property." };
      if (!available || hotel.ratesCount === 0) {
        return {
          status: "unavailable",
          message: "No rooms are available here for those dates. Try different dates or fewer guests.",
          hotel,
        };
      }
      return { status: "ok", hotel };
    } catch (error) {
      console.error("[getStay]", error);
      return { status: "error", message: "Live availability is temporarily unavailable. Please try again." };
    }
  });
