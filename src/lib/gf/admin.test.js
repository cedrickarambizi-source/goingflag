import { describe, expect, test } from "bun:test";
import { assertAdmin, assertLocalCancellation, filterReservations } from "./admin";

describe("Admin reservations", () => {
  test("only administrators may manage all reservations", () => {
    expect(() => assertAdmin(true)).not.toThrow();
    expect(() => assertAdmin(false)).toThrow("Administrator access required.");
    expect(() => assertAdmin(null)).toThrow("Administrator access required.");
  });
  test("search finds another traveller by email, name or reference", () => {
    const rows = [{ reference: "GF-ABC234", title: "Kigali transfer", lead_name: "Jane Doe", lead_email: "jane@example.com", location: "Kigali", kind: "transfer", status: "confirmed" }, { reference: "GF-XYZ456", title: "City tour", lead_name: "John", lead_email: "john@example.com", kind: "experience", status: "cancelled" }];
    for (const term of [" jane@example.com ", "JANE DOE", "gf-abc234"]) expect(filterReservations(rows, term, "all")).toEqual([rows[0]]);
    expect(filterReservations(rows, "", "cancelled")).toEqual([rows[1]]);
    expect(filterReservations(rows, "missing", "all")).toEqual([]);
  });
  test("local cancellation never claims to cancel Hotelbeds inventory", () => {
    expect(() => assertLocalCancellation({ kind: "stay", item_slug: "123--rate" })).toThrow("Supplier bookings");
    expect(() => assertLocalCancellation({ kind: "transfer", item_slug: "kigali" })).not.toThrow();
  });
});