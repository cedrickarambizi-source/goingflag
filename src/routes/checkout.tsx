import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Breadcrumbs, GfButton, GfButtonLink, SectionHead } from "@/components/gf/ui";
import { checkoutSearchSchema, formatDollars } from "@/lib/gf/booking";
import { createReservation } from "@/lib/gf/reservations.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search) => checkoutSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Checkout — GoingFlag" },
      {
        name: "description",
        content: "Review your selection, add traveller details and confirm your GoingFlag reservation.",
      },
      { property: "og:title", content: "Checkout — GoingFlag" },
      { property: "og:description", content: "Review, add traveller details, confirm." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const NIGHT_KINDS = new Set(["stay"]);

function Checkout() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const reserve = useServerFn(createReservation);

  const [quantity, setQuantity] = useState(search.quantity);
  const [travellers, setTravellers] = useState(search.travellers);
  const [start, setStart] = useState(search.start ?? "");
  const [end, setEnd] = useState(search.end ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = search.price * quantity;
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + taxes;
  const unitLabel = useMemo(
    () => (NIGHT_KINDS.has(search.kind) ? "night" : search.unit || "item"),
    [search.kind, search.unit],
  );

  if (!search.title) {
    return (
      <div className="gf-shell gf-section">
        <SectionHead
          index="Checkout"
          title="Nothing selected yet"
          intro="Pick a stay, flight or experience and its reserve button will bring you here with the details attached."
        />
        <div className="mt-[30px] flex flex-wrap gap-[10px]">
          <GfButtonLink to="/hotels">Browse stays</GfButtonLink>
          <GfButtonLink to="/experiences" variant="secondary">
            Browse experiences
          </GfButtonLink>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await reserve({
        data: {
          kind: search.kind,
          itemSlug: search.slug || search.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 100),
          title: search.title,
          location: search.location ?? null,
          imageUrl: search.image ?? null,
          startDate: start || null,
          endDate: end || null,
          travellers,
          quantity,
          unitPriceCents: Math.round(search.price * 100),
          leadName: name,
          leadEmail: email,
          leadPhone: phone || null,
          notes: notes || null,
        },
      });
      navigate({ to: "/booking/$reference", params: { reference: res.reference } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Checkout" }]} />

      <div className="mt-[30px] grid gap-[30px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-[56px]">
        <div>
          <SectionHead
            index="Step 1 — Details"
            title="Confirm your booking"
            intro="Everything below is shown as a single total. No fees appear later."
          />

          {loading ? (
            <p className="gf-body mt-[30px] text-graphite">Checking your session…</p>
          ) : !user ? (
            <div className="mt-[30px] rounded-2xl border border-line bg-sand p-[30px]">
              <p className="gf-sub">Sign in to hold this reservation</p>
              <p className="gf-body mt-3 text-graphite">
                Reservations are saved to your account so you can find, change or cancel them later.
              </p>
              <div className="mt-6 flex flex-wrap gap-[10px]">
                <GfButtonLink to="/signin">Sign in or create an account</GfButtonLink>
              </div>
            </div>
          ) : (
            <form className="mt-[30px] space-y-[30px]" onSubmit={submit}>
              <fieldset className="grid gap-5 sm:grid-cols-2">
                <Field label="Lead traveller" htmlFor="ck-name">
                  <input
                    id="ck-name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="Full name"
                  />
                </Field>
                <Field label="Email" htmlFor="ck-email">
                  <input
                    id="ck-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Phone (optional)" htmlFor="ck-phone">
                  <input
                    id="ck-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputCls}
                    placeholder="+250 …"
                  />
                </Field>
                <Field label="Travellers" htmlFor="ck-travellers">
                  <input
                    id="ck-travellers"
                    type="number"
                    min={1}
                    max={20}
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className={inputCls}
                  />
                </Field>
                <Field label={search.kind === "stay" ? "Check in" : "Date"} htmlFor="ck-start">
                  <input
                    id="ck-start"
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                {search.kind === "stay" ? (
                  <Field label="Check out" htmlFor="ck-end">
                    <input
                      id="ck-end"
                      type="date"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                ) : null}
                <Field label={`Number of ${unitLabel}s`} htmlFor="ck-qty">
                  <input
                    id="ck-qty"
                    type="number"
                    min={1}
                    max={60}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className={inputCls}
                  />
                </Field>
              </fieldset>

              <Field label="Notes for the supplier (optional)" htmlFor="ck-notes">
                <textarea
                  id="ck-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputCls} resize-y`}
                  placeholder="Late arrival, dietary needs, accessibility…"
                />
              </Field>

              {error ? (
                <p role="alert" className="gf-body text-emerald">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-[10px]">
                <GfButton type="submit" disabled={busy}>
                  {busy ? "Confirming…" : `Confirm — ${formatDollars(total)}`}
                </GfButton>
                <Link to="/hotels" className="gf-body text-graphite underline underline-offset-4">
                  Keep browsing
                </Link>
              </div>
              <p className="gf-body text-graphite">
                Payment is collected by the supplier at the property or on the day. Free cancellation
                terms are shown on your confirmation.
              </p>
            </form>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-line bg-white p-[30px] lg:sticky lg:top-[92px]">
          {search.image ? (
            <div className="gf-frame aspect-[3/2] overflow-hidden rounded-2xl">
              <img src={search.image} alt={search.title} loading="lazy" />
            </div>
          ) : null}
          <p className="gf-caption mt-5 text-iron">{search.kind}</p>
          <p className="gf-sub mt-2">{search.title}</p>
          {search.location ? <p className="gf-body mt-1 text-graphite">{search.location}</p> : null}

          <dl className="mt-[30px] space-y-3 border-t border-line pt-5">
            <Row label={`${formatDollars(search.price)} × ${quantity} ${unitLabel}${quantity > 1 ? "s" : ""}`} value={formatDollars(subtotal)} />
            <Row label="Taxes and charges" value={formatDollars(taxes)} />
            <Row label="Travellers" value={String(travellers)} />
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="gf-caption text-iron">Total</span>
            <span className="gf-nums gf-sub">{formatDollars(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-smoke focus:border-emerald focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="gf-caption text-iron">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="gf-body text-graphite">{label}</dt>
      <dd className="gf-nums gf-body">{value}</dd>
    </div>
  );
}
