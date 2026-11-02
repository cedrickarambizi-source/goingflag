import { z } from "zod";

/** Booking draft carried in the /checkout URL, so a selection survives refresh. */
export const checkoutSearchSchema = z.object({
  kind: z.enum(["stay", "flight", "experience", "transfer", "car", "package"]).default("stay"),
  slug: z.string().default(""),
  title: z.string().default(""),
  location: z.string().optional(),
  image: z.string().optional(),
  price: z.coerce.number().min(0).default(0),
  unit: z.string().default("item"),
  start: z.string().optional(),
  end: z.string().optional(),
  travellers: z.coerce.number().int().min(1).max(20).default(2),
  quantity: z.coerce.number().int().min(1).max(60).default(1),
  currency: z.string().regex(/^[A-Z]{3}$/).default("USD"),
  rateKey: z.string().max(2000).optional(),
  adults: z.coerce.number().int().min(1).max(8).optional(),
  children: z.coerce.number().int().min(0).max(6).optional(),
  rooms: z.coerce.number().int().min(1).max(4).optional(),
  cancellation: z.string().max(600).optional(),
});

export type CheckoutSearch = z.infer<typeof checkoutSearchSchema>;

export function money(cents: number, currency = "USD") {
  return formatCurrency(cents / 100, currency);
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, currencyDisplay: "code" }).format(value);
}

/** Supplier quotes are totals, not per-night prices. No unquoted charges are added. */
export function checkoutTotals(price: number, quantity: number, supplierQuote: boolean) {
  const subtotal = supplierQuote ? price : price * quantity;
  return { subtotal, taxes: 0, total: subtotal };
}

export function isSupplierStay(kind: string, slug: string, rateKey?: string) {
  return kind === "stay" && (Boolean(rateKey) || /^\d+--/.test(slug));
}

export function formatDollars(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}
