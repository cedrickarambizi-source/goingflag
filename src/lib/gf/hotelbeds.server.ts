/**
 * Server-only Hotelbeds (APItude) client.
 * Credentials come from HOTELBEDS_API_KEY / HOTELBEDS_SECRET and never leave the server.
 */

import type { LiveHotel, LiveRate, StaySearchInput } from "./hotelbeds.types";

const BOOKING_BASE = "https://api.hotelbeds.com/hotel-api/3.0";
const CONTENT_BASE = "https://api.hotelbeds.com/hotel-content-api/1.0";
const IMAGE_BASE = "https://photos.hotelbeds.com/giata/bigger/";

async function sha256Hex(input: string) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function authHeaders() {
  const apiKey = process.env["HOTELBEDS_API_KEY"];
  const secret = process.env["HOTELBEDS_SECRET"];
  if (!apiKey || !secret) throw new Error("Hotelbeds credentials are not configured");
  const stamp = Math.floor(Date.now() / 1000);
  return {
    "Api-key": apiKey,
    "X-Signature": await sha256Hex(`${apiKey}${secret}${stamp}`),
    Accept: "application/json",
    "Accept-Encoding": "gzip",
  } as Record<string, string>;
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(await authHeaders()), ...(init?.body ? { "Content-Type": "application/json" } : {}), ...(init?.headers as Record<string, string> | undefined) },
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("[hotelbeds]", res.status, url, text.slice(0, 600));
    throw new Error(`Hotelbeds request failed (${res.status})`);
  }
  return JSON.parse(text) as T;
}

/* ------------------------------------------------------------ destinations */

type RawDestination = { code: string; name?: { content?: string }; countryCode?: string };
let destinationCache: { code: string; name: string; countryCode: string }[] | null = null;

async function destinations() {
  if (destinationCache) return destinationCache;
  const list: { code: string; name: string; countryCode: string }[] = [];
  for (let page = 0; page < 6; page += 1) {
    const from = page * 1000 + 1;
    const data = await call<{ destinations?: RawDestination[] }>(
      `${CONTENT_BASE}/locations/destinations?language=ENG&fields=all&from=${from}&to=${from + 999}`,
    );
    const chunk = data.destinations ?? [];
    for (const d of chunk) {
      if (d.code && d.name?.content) {
        list.push({ code: d.code, name: d.name.content, countryCode: d.countryCode ?? "" });
      }
    }
    if (chunk.length < 1000) break;
  }
  destinationCache = list;
  return list;
}

export async function resolveDestination(term: string) {
  const q = term.trim().toLowerCase();
  if (!q) return null;
  const all = await destinations();
  if (/^[A-Z]{3}$/.test(term.trim().toUpperCase())) {
    const byCode = all.find((d) => d.code === term.trim().toUpperCase());
    if (byCode) return byCode;
  }
  return (
    all.find((d) => d.name.toLowerCase() === q) ??
    all.find((d) => d.name.toLowerCase().startsWith(q)) ??
    all.find((d) => d.name.toLowerCase().includes(q)) ??
    null
  );
}

/* -------------------------------------------------------------- content API */

type RawContentHotel = {
  code: number;
  name?: { content?: string };
  description?: { content?: string };
  categoryName?: string;
  category?: { description?: { content?: string } };
  address?: { content?: string };
  city?: { content?: string };
  countryCode?: string;
  destinationName?: string;
  coordinates?: { latitude?: number; longitude?: number };
  images?: { path?: string; imageTypeCode?: string; order?: number }[];
  facilities?: { description?: { content?: string }; facilityGroupCode?: number }[];
};

async function contentFor(codes: string[]) {
  const map = new Map<string, RawContentHotel>();
  if (!codes.length) return map;
  for (let i = 0; i < codes.length; i += 60) {
    const chunk = codes.slice(i, i + 60);
    try {
      const data = await call<{ hotels?: RawContentHotel[] }>(
        `${CONTENT_BASE}/hotels?codes=${chunk.join(",")}&language=ENG&fields=all&from=1&to=${chunk.length}&useSecondaryLanguage=false`,
      );
      for (const h of data.hotels ?? []) map.set(String(h.code), h);
    } catch (error) {
      console.error("[hotelbeds] content lookup failed", error);
    }
  }
  return map;
}

/* --------------------------------------------------------- availability API */

type RawRate = {
  rateKey?: string;
  net?: string;
  sellingRate?: string;
  boardName?: string;
  rateClass?: string;
  cancellationPolicies?: { amount?: string; from?: string }[];
  allotment?: number;
  adults?: number;
  children?: number;
};
type RawRoom = { code?: string; name?: string; rates?: RawRate[] };
type RawAvailHotel = {
  code?: number;
  name?: string;
  categoryName?: string;
  categoryCode?: string;
  destinationName?: string;
  zoneName?: string;
  latitude?: string;
  longitude?: string;
  currency?: string;
  minRate?: string;
  maxRate?: string;
  rooms?: RawRoom[];
};
type AvailResponse = { hotels?: { total?: number; checkIn?: string; checkOut?: string; hotels?: RawAvailHotel[] } };

function nightsBetween(checkIn: string, checkOut: string) {
  const ms = new Date(`${checkOut}T00:00:00Z`).getTime() - new Date(`${checkIn}T00:00:00Z`).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

function starsFrom(categoryCode?: string, categoryName?: string) {
  const digits = `${categoryCode ?? ""}${categoryName ?? ""}`.match(/(\d)/);
  const value = digits?.[1] ? Number(digits[1]) : 0;
  return value >= 1 && value <= 5 ? value : 0;
}

function mapRate(raw: RawRate, roomName: string, currency: string): LiveRate | null {
  if (!raw.rateKey || !raw.net) return null;
  const policies = raw.cancellationPolicies ?? [];
  const refundable = (raw.rateClass ?? "") !== "NRF";
  const first = policies[0];
  return {
    rateKey: raw.rateKey,
    roomName,
    boardName: raw.boardName ?? "Room only",
    rateClass: raw.rateClass ?? "",
    refundable,
    cancellationNote: !refundable
      ? "Non-refundable"
      : first?.from
        ? `Free cancellation until ${first.from.slice(0, 10)}`
        : "Cancellation charges may apply",
    net: Number(raw.net),
    sellingRate: raw.sellingRate ? Number(raw.sellingRate) : null,
    currency,
    allotment: typeof raw.allotment === "number" ? raw.allotment : null,
    adults: raw.adults ?? 0,
    children: raw.children ?? 0,
  };
}

function mapHotel(raw: RawAvailHotel, content: RawContentHotel | undefined, nights: number): LiveHotel {
  const currency = raw.currency ?? "EUR";
  const rooms = (raw.rooms ?? []).map((room) => ({
    code: room.code ?? room.name ?? "room",
    name: room.name ?? content?.name?.content ?? "Room",
    rates: (room.rates ?? [])
      .map((r) => mapRate(r, room.name ?? "Room", currency))
      .filter((r): r is LiveRate => r !== null),
  }));
  const images = (content?.images ?? [])
    .filter((i) => i.path)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .slice(0, 10)
    .map((i) => `${IMAGE_BASE}${i.path}`);
  const rates = rooms.flatMap((r) => r.rates);

  return {
    code: String(raw.code ?? ""),
    name: raw.name ?? content?.name?.content ?? `Hotel ${raw.code}`,
    categoryName: raw.categoryName ?? content?.categoryName ?? content?.category?.description?.content ?? "",
    stars: starsFrom(raw.categoryCode, raw.categoryName ?? content?.categoryName),
    destinationName: raw.destinationName ?? content?.destinationName ?? content?.city?.content ?? "",
    zoneName: raw.zoneName ?? "",
    address: content?.address?.content ?? "",
    countryCode: content?.countryCode ?? "",
    image: images[0] ?? null,
    images,
    description: content?.description?.content ?? null,
    amenities: (content?.facilities ?? [])
      .map((f) => f.description?.content)
      .filter((f): f is string => Boolean(f))
      .slice(0, 14),
    latitude: raw.latitude ? Number(raw.latitude) : (content?.coordinates?.latitude ?? null),
    longitude: raw.longitude ? Number(raw.longitude) : (content?.coordinates?.longitude ?? null),
    currency,
    minRate: raw.minRate ? Number(raw.minRate) : Math.min(...rates.map((r) => r.net), 0),
    maxRate: raw.maxRate ? Number(raw.maxRate) : null,
    nights,
    rooms,
    ratesCount: rates.length,
    freeCancellation: rates.some((r) => r.refundable),
  };
}

async function availability(body: Record<string, unknown>) {
  return call<AvailResponse>(`${BOOKING_BASE}/hotels`, { method: "POST", body: JSON.stringify(body) });
}

function occupancy(input: StaySearchInput) {
  return [
    {
      rooms: input.rooms,
      adults: input.adults,
      children: input.children,
      ...(input.children > 0
        ? { paxes: Array.from({ length: input.children }, () => ({ type: "CH", age: 8 })) }
        : {}),
    },
  ];
}

export async function searchAvailability(input: StaySearchInput, destinationCode: string) {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  const data = await availability({
    stay: { checkIn: input.checkIn, checkOut: input.checkOut },
    occupancies: occupancy(input),
    destination: { code: destinationCode },
  });
  const raw = data.hotels?.hotels ?? [];
  const content = await contentFor(raw.map((h) => String(h.code)).filter(Boolean));
  return {
    total: data.hotels?.total ?? raw.length,
    nights,
    hotels: raw.map((h) => mapHotel(h, content.get(String(h.code)), nights)),
  };
}

export async function hotelAvailability(code: string, input: StaySearchInput) {
  const nights = nightsBetween(input.checkIn, input.checkOut);
  const data = await availability({
    stay: { checkIn: input.checkIn, checkOut: input.checkOut },
    occupancies: occupancy(input),
    hotels: { hotel: [Number(code)] },
  });
  const raw = data.hotels?.hotels?.[0];
  const content = await contentFor([code]);
  if (!raw) {
    const only = content.get(code);
    if (!only) return { hotel: null, available: false };
    return {
      hotel: mapHotel({ code: Number(code), name: only.name?.content }, only, nights),
      available: false,
    };
  }
  return { hotel: mapHotel(raw, content.get(code), nights), available: true };
}
