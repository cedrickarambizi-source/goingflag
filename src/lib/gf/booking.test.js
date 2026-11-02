import { describe, expect, test } from "bun:test";
import { checkoutSearchSchema, checkoutTotals, formatCurrency, isSupplierStay } from "./booking";

describe("Hotelbeds checkout", () => {
  test("preserves EUR 248.84 without adding charges or multiplying nights", () => {
    expect(checkoutTotals(248.84, 2, true)).toEqual({ subtotal: 248.84, taxes: 0, total: 248.84 });
    expect(formatCurrency(248.84, "EUR")).toBe("EUR 248.84");
  });
  test("preserves full rate key and selected occupancy", () => {
    const key = "20261116|20261118|W|1|hotel|room|board|full-rate-key";
    const draft = checkoutSearchSchema.parse({ currency: "EUR", price: 248.84, rateKey: key, adults: 2, children: 1, rooms: 1 });
    expect(draft.rateKey).toBe(key);
    expect([draft.adults, draft.children, draft.rooms]).toEqual([2, 1, 1]);
    expect(draft.price).toBe(248.84);
    expect(draft.currency).toBe("EUR");
  });
  test("identifies both current and legacy Hotelbeds selections", () => {
    expect(isSupplierStay("stay", "123--legacy-key")).toBe(true);
    expect(isSupplierStay("stay", "123", "complete-key")).toBe(true);
    expect(isSupplierStay("experience", "123--key")).toBe(false);
  });
});