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
});

export type CheckoutSearch = z.infer<typeof checkoutSearchSchema>;

export function money(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDollars(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}
