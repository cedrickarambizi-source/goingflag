import type { Tables } from "@/integrations/supabase/types";
import { isSupplierStay } from "./booking";

export function assertAdmin(allowed: boolean | null) {
  if (allowed !== true) throw new Error("Administrator access required.");
}

export function assertLocalCancellation(row: Pick<Tables<"reservations">, "kind" | "item_slug">) {
  if (isSupplierStay(row.kind, row.item_slug)) {
    throw new Error("Supplier bookings must be cancelled with the supplier; no cancellation or refund has been made.");
  }
}

export function filterReservations(rows: Tables<"reservations">[], search: string, status: string) {
  const term = search.trim().toLowerCase();
  return rows.filter((row) =>
    (status === "all" || row.status === status) &&
    [row.reference, row.title, row.lead_name, row.lead_email, row.location, row.kind]
      .some((value) => value?.toLowerCase().includes(term)),
  );
}