import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin, assertLocalCancellation } from "./admin";

export const getAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (error) throw new Error("Could not check administrator access. Please try again.");
    return { isAdmin: data === true };
  });

export const listAdminReservations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError) throw new Error("Could not check administrator access.");
    assertAdmin(allowed);
    // Page through the Data API limit so all reservations are searchable.
    const rows = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await context.supabase.from("reservations").select("*")
        .order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
      if (error) throw new Error("Could not load reservations. Please try again.");
      rows.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    return rows;
  });

export const cancelAdminReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError) throw new Error("Could not check administrator access.");
    assertAdmin(allowed);
    const { data: row, error: readError } = await context.supabase.from("reservations")
      .select("id, kind, item_slug, status").eq("id", data.id).maybeSingle();
    if (readError || !row) throw new Error("Reservation not found.");
    assertLocalCancellation(row);
    const { data: updated, error } = await context.supabase.from("reservations")
      .update({ status: "cancelled" }).eq("id", row.id).select("id, status").single();
    if (error || !updated) throw new Error("Could not cancel this reservation. Please try again.");
    return updated;
  });