import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createInput = z.object({
  kind: z.enum(["stay", "flight", "experience", "transfer", "car", "package"]),
  itemSlug: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  location: z.string().max(160).optional().nullable(),
  imageUrl: z.string().max(600).optional().nullable(),
  startDate: z.string().max(20).optional().nullable(),
  endDate: z.string().max(20).optional().nullable(),
  travellers: z.number().int().min(1).max(20),
  quantity: z.number().int().min(1).max(60),
  unitPriceCents: z.number().int().min(0).max(100_000_00),
  leadName: z.string().min(2).max(120),
  leadEmail: z.string().email().max(160),
  leadPhone: z.string().max(40).optional().nullable(),
  notes: z.string().max(600).optional().nullable(),
});

export type CreateReservationInput = z.infer<typeof createInput>;

function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `GF-${out}`;
}

export const createReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createInput.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const total = data.unitPriceCents * data.quantity;

    let lastError: string | null = null;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const reference = makeReference();
      const { data: row, error } = await supabase
        .from("reservations")
        .insert({
          user_id: userId,
          reference,
          kind: data.kind,
          item_slug: data.itemSlug,
          title: data.title,
          location: data.location ?? null,
          image_url: data.imageUrl ?? null,
          start_date: data.startDate || null,
          end_date: data.endDate || null,
          travellers: data.travellers,
          quantity: data.quantity,
          unit_price_cents: data.unitPriceCents,
          total_cents: total,
          currency: "USD",
          status: "confirmed",
          lead_name: data.leadName,
          lead_email: data.leadEmail,
          lead_phone: data.leadPhone ?? null,
          notes: data.notes ?? null,
        })
        .select("reference")
        .single();

      if (!error && row) return { reference: row.reference };
      lastError = error?.message ?? "Unknown error";
      if (error && !error.message.toLowerCase().includes("duplicate")) break;
    }

    throw new Error(`Could not create the reservation: ${lastError ?? "unknown error"}`);
  });

export const listReservations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getReservation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ reference: z.string().min(3).max(20) }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("reservations")
      .select("*")
      .eq("reference", data.reference)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const cancelReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
