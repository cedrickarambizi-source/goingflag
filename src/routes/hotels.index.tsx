import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Breadcrumbs, CheckoutLink, Stars } from "@/components/gf/ui";
import { searchStays } from "@/lib/gf/hotelbeds.functions";
import type { LiveHotel } from "@/lib/gf/hotelbeds.types";
import { cn } from "@/lib/utils";

type StaySearch = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
};

function str(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function num(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

export const Route = createFileRoute("/hotels/")({
  validateSearch: (search: Record<string, unknown>): StaySearch => ({
    ...(str(search["destination"]) || str(search["q"])
      ? { destination: (str(search["destination"]) ?? str(search["q"])) as string }
      : {}),
    ...(str(search["checkIn"]) ? { checkIn: str(search["checkIn"]) as string } : {}),
    ...(str(search["checkOut"]) ? { checkOut: str(search["checkOut"]) as string } : {}),
    ...(num(search["adults"]) ? { adults: num(search["adults"]) as number } : {}),
    ...(num(search["children"]) !== undefined ? { children: num(search["children"]) as number } : {}),
    ...(num(search["rooms"]) ? { rooms: num(search["rooms"]) as number } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Stays — live hotel availability and prices | GoingFlag" },
      {
        name: "description",
        content:
          "Search live hotel availability worldwide: real rooms, real prices, board basis and cancellation terms, confirmed at the moment you search.",
      },
      { property: "og:title", content: "Stays — live hotel availability and prices" },
      {
        property: "og:description",
        content: "Real rooms, real prices and cancellation terms, straight from our supply partner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotelsIndex,
});

const SORTS = [
  { id: "best", label: "Best match" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "stars", label: "Star rating" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

function money(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function tomorrow(offsetDays: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function HotelsIndex() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const run = useServerFn(searchStays);

  const [destination, setDestination] = useState(search.destination ?? "");
  const [checkIn, setCheckIn] = useState(search.checkIn ?? "");
  const [checkOut, setCheckOut] = useState(search.checkOut ?? "");
  const [adults, setAdults] = useState(search.adults ?? 2);
  const [children, setChildren] = useState(search.children ?? 0);
  const [rooms, setRooms] = useState(search.rooms ?? 1);

  const [budget, setBudget] = useState<number | null>(null);
  const [minStars, setMinStars] = useState(0);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [sort, setSort] = useState<SortId>("best");
  const [saved, setSaved] = useState<string[]>([]);

  const params = {
    destination: search.destination ?? "",
    checkIn: search.checkIn ?? "",
    checkOut: search.checkOut ?? "",
    adults: search.adults ?? 2,
    children: search.children ?? 0,
    rooms: search.rooms ?? 1,
  };
  const ready = Boolean(params.destination && params.checkIn && params.checkOut);

  const query = useQuery({
    queryKey: ["stays", params],
    queryFn: () => run({ data: params }),
    enabled: ready,
    staleTime: 60_000,
    retry: false,
  });

  const result = query.data;
  const hotels = result?.status === "ok" ? result.hotels : [];

  const maxRate = useMemo(
    () => (hotels.length ? Math.ceil(Math.max(...hotels.map((h) => h.minRate))) : 0),
    [hotels],
  );

  const visible = useMemo(() => {
    const list = hotels.filter((h) => {
      if (budget !== null && h.minRate > budget) return false;
      if (minStars && h.stars < minStars) return false;
      if (refundableOnly && !h.freeCancellation) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.minRate - b.minRate);
      case "price-desc":
        return [...list].sort((a, b) => b.minRate - a.minRate);
      case "stars":
        return [...list].sort((a, b) => b.stars - a.stars);
      default:
        return list;
    }
  }, [hotels, budget, minStars, refundableOnly, sort]);

  function submit() {
    setBudget(null);
    navigate({
      to: "/hotels",
      search: {
        destination: destination.split(",")[0]?.trim() ?? "",
        checkIn: checkIn || tomorrow(14),
        checkOut: checkOut || tomorrow(16),
        adults,
        children,
        rooms,
      },
    });
  }

  return (
    <>
      {/* ------------------------------------------- Search band (results header) */}
      <section className="bg-ink pb-8 pt-7">
        <div className="gf-shell">
          <p className="gf-caption text-white/60">Live hotel availability</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-3 rounded-2xl bg-gold p-[3px]"
          >
            <div className="flex flex-col gap-[3px] md:flex-row">
              <label className="min-w-0 flex-[1.4] rounded-xl bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-emerald">
                <span className="gf-caption text-iron">Where to</span>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="City or destination"
                  aria-label="Destination"
                  className="mt-1 w-full bg-transparent text-[15px] font-medium text-ink placeholder:text-smoke focus:outline-none"
                />
              </label>
              <label className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-emerald">
                <span className="gf-caption text-iron">Check in</span>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="gf-nums mt-1 w-full bg-transparent text-[15px] font-medium text-ink focus:outline-none"
                />
              </label>
              <label className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-emerald">
                <span className="gf-caption text-iron">Check out</span>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="gf-nums mt-1 w-full bg-transparent text-[15px] font-medium text-ink focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-3 gap-[3px] md:max-w-[300px]">
                <Stepper label="Adults" value={adults} min={1} max={8} onChange={setAdults} />
                <Stepper label="Children" value={children} min={0} max={6} onChange={setChildren} />
                <Stepper label="Rooms" value={rooms} min={1} max={4} onChange={setRooms} />
              </div>
              <button
                type="submit"
                className="gf-sub rounded-xl bg-emerald px-8 py-4 text-white transition-colors hover:bg-ink md:min-w-[130px]"
              >
                Search
              </button>
            </div>
          </form>
          <p className="gf-body mt-4 text-white/70">
            {query.isFetching
              ? "Checking live availability…"
              : result?.status === "ok"
                ? `${result.total} properties available in ${result.destination.name} · ${result.nights} night${result.nights > 1 ? "s" : ""} · prices for ${params.adults} adult${params.adults > 1 ? "s" : ""}${params.children ? ` + ${params.children} children` : ""}, ${params.rooms} room${params.rooms > 1 ? "s" : ""}`
                : "Rates come straight from our supply partner at the moment you search."}
          </p>
        </div>
      </section>

      <div className="gf-shell gf-section">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stays" }]} />

        <header className="mt-[30px]">
          <h1 className="gf-heading">Stays</h1>
          <p className="gf-body mt-3 text-graphite">
            Totals shown are for the whole stay and selected occupancy, taxes as quoted by the property.
          </p>
        </header>

        <div className="mt-[30px] grid gap-[30px] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-[40px]">
          {/* ------------------------------------------------ Filter sidebar */}
          <aside className="h-fit rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-[92px]">
            <p className="gf-sub text-[15px]">Filters</p>

            <FilterBlock label="Total price for the stay">
              <input
                type="range"
                min={0}
                max={maxRate || 100}
                step={10}
                disabled={!maxRate}
                value={budget ?? maxRate}
                onChange={(e) => setBudget(Number(e.target.value))}
                aria-label="Maximum total price"
                className="w-full accent-emerald disabled:opacity-40"
              />
              <p className="gf-body mt-2 text-graphite">
                {maxRate
                  ? `Up to ${(budget ?? maxRate).toLocaleString("en-US")} ${hotels[0]?.currency ?? ""}`
                  : "Search to see prices"}
              </p>
            </FilterBlock>

            <FilterBlock label="Cancellation">
              <label className="flex cursor-pointer items-center gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={refundableOnly}
                  onChange={(e) => setRefundableOnly(e.target.checked)}
                  className="h-4 w-4 accent-emerald"
                />
                Refundable rates only
              </label>
            </FilterBlock>

            <FilterBlock label="Star rating">
              <div className="flex flex-wrap gap-2">
                {[0, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={minStars === s}
                    onClick={() => setMinStars(s)}
                    className={cn(
                      "gf-caption rounded-full border px-3 py-2 transition-colors",
                      minStars === s
                        ? "border-emerald bg-emerald text-white"
                        : "border-line text-graphite hover:border-ink hover:text-ink",
                    )}
                  >
                    {s === 0 ? "Any" : `${s}★+`}
                  </button>
                ))}
              </div>
            </FilterBlock>
          </aside>

          {/* --------------------------------------------------- Result list */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-sand px-5 py-4">
              <p className="gf-body text-graphite">
                <span className="text-ink">{visible.length}</span> properties shown
              </p>
              <label className="flex items-center gap-3">
                <span className="gf-caption text-iron">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortId)}
                  className="rounded-xl border border-line bg-white px-4 py-2 text-[15px] focus:border-emerald focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {!ready ? (
              <Notice
                title="Start your search"
                body="Enter a destination and your dates above to see live rooms and prices."
              />
            ) : query.isPending || query.isFetching ? (
              <ul className="mt-[30px] space-y-[18px]" aria-busy="true">
                {[0, 1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="h-[220px] animate-pulse rounded-3xl border border-line bg-sand"
                  />
                ))}
              </ul>
            ) : query.isError ? (
              <Notice
                title="We couldn’t reach live availability"
                body="Something went wrong on the way to our supply partner. Please try the search again."
                action={{ label: "Retry search", onClick: () => query.refetch() }}
              />
            ) : result?.status === "invalid" || result?.status === "no-destination" ? (
              <Notice title="Check your search" body={result.message} />
            ) : result?.status === "error" ? (
              <Notice
                title="Live availability is unavailable"
                body={result.message}
                action={{ label: "Try again", onClick: () => query.refetch() }}
              />
            ) : result?.status === "empty" ? (
              <Notice title="No availability for those dates" body={result.message} />
            ) : visible.length === 0 ? (
              <Notice
                title="No properties match those filters"
                body="Widen the price range or clear the star and cancellation filters."
                action={{
                  label: "Clear filters",
                  onClick: () => {
                    setBudget(null);
                    setMinStars(0);
                    setRefundableOnly(false);
                  },
                }}
              />
            ) : (
              <ul className="mt-[30px] space-y-[18px]">
                {visible.map((h) => (
                  <HotelCard
                    key={h.code}
                    hotel={h}
                    params={params}
                    saved={saved.includes(h.code)}
                    onSave={() =>
                      setSaved((prev) =>
                        prev.includes(h.code) ? prev.filter((c) => c !== h.code) : [...prev, h.code],
                      )
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------- Hotel card */

function HotelCard({
  hotel: h,
  params,
  saved,
  onSave,
}: {
  hotel: LiveHotel;
  params: { destination: string; checkIn: string; checkOut: string; adults: number; children: number; rooms: number };
  saved: boolean;
  onSave: () => void;
}) {
  const cheapest = h.rooms
    .flatMap((r) => r.rates)
    .sort((a, b) => a.net - b.net)[0];
  const detailSearch = { ...params, code: h.code };

  return (
    <li className="overflow-hidden rounded-3xl border border-line bg-white transition-shadow hover:gf-shadow-lift">
      <div className="grid gap-0 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,230px)]">
        <div className="relative">
          <Link
            to="/hotels/$slug"
            params={{ slug: h.code }}
            search={detailSearch}
            className="block h-full"
            aria-label={`View ${h.name}`}
          >
            {h.image ? (
              <img
                src={h.image}
                alt={`${h.name}, ${h.destinationName}`}
                loading="lazy"
                className="h-full min-h-[200px] w-full object-cover"
              />
            ) : (
              <div className="grid h-full min-h-[200px] place-items-center bg-sand">
                <span className="gf-caption text-iron">No photo supplied</span>
              </div>
            )}
          </Link>
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${h.name} from saved` : `Save ${h.name}`}
            onClick={onSave}
            className={cn(
              "absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-[15px] transition-colors",
              saved ? "text-emerald" : "text-graphite hover:text-ink",
            )}
          >
            {saved ? "♥" : "♡"}
          </button>
        </div>

        <div className="border-line p-6 md:border-x">
          {h.stars ? <Stars count={h.stars} /> : <span className="gf-caption text-iron">{h.categoryName}</span>}
          <h2 className="gf-sub mt-2">
            <Link to="/hotels/$slug" params={{ slug: h.code }} search={detailSearch} className="hover:text-emerald">
              {h.name}
            </Link>
          </h2>
          <p className="gf-body mt-2 text-graphite">
            {[h.zoneName, h.destinationName, h.countryCode].filter(Boolean).join(" · ")}
          </p>
          {h.address ? <p className="gf-caption mt-1 text-iron">{h.address}</p> : null}

          {h.amenities.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {h.amenities.slice(0, 4).map((a) => (
                <li key={a} className="gf-caption rounded-full border border-line px-3 py-1 text-graphite">
                  {a}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="gf-caption mt-4 text-iron">
            {h.rooms.length} room type{h.rooms.length === 1 ? "" : "s"} · {h.ratesCount} rate
            {h.ratesCount === 1 ? "" : "s"} available
            {cheapest ? ` · ${cheapest.boardName.toLowerCase()}` : ""}
          </p>
          {cheapest?.cancellationNote ? (
            <p className={cn("gf-caption mt-1", cheapest.refundable ? "text-emerald" : "text-iron")}>
              {cheapest.cancellationNote}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-4 p-6">
          <div className="text-right">
            <p className="gf-caption text-iron">
              {h.nights} night{h.nights > 1 ? "s" : ""} total
            </p>
            <p className="gf-nums mt-1 text-[20px] text-ink">{money(h.minRate, h.currency)}</p>
            {cheapest?.allotment ? (
              <p className="gf-caption mt-1 text-iron">{cheapest.allotment} left at this rate</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/hotels/$slug"
              params={{ slug: h.code }}
              search={detailSearch}
              className="gf-caption rounded-full border border-ink px-5 py-3 text-center transition-colors hover:bg-ink hover:text-white"
            >
              See rooms
            </Link>
            {cheapest ? (
              <CheckoutLink
                draft={{
                  kind: "stay",
                  slug: `${h.code}--${cheapest.rateKey.slice(0, 24)}`,
                  title: `${h.name} — ${cheapest.roomName}`,
                  location: [h.destinationName, h.countryCode].filter(Boolean).join(", "),
                  ...(h.image ? { image: h.image } : {}),
                  price: Math.round(cheapest.net),
                  unit: `${h.nights} night stay (${h.currency})`,
                  start: params.checkIn,
                  end: params.checkOut,
                  travellers: params.adults + params.children,
                  quantity: 1,
                }}
              >
                Reserve
              </CheckoutLink>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------- bits */

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <label className="min-w-0 rounded-xl bg-white px-3 py-3">
      <span className="gf-caption block text-iron">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        aria-label={label}
        className="gf-nums mt-1 w-full bg-transparent text-[15px] font-medium text-ink focus:outline-none"
      />
    </label>
  );
}

function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mt-[30px] rounded-3xl border border-line bg-white p-[30px]" role="status">
      <p className="gf-sub">{title}</p>
      <p className="gf-body mt-3 text-graphite">{body}</p>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="gf-caption mt-5 rounded-full border border-ink px-5 py-3 transition-colors hover:bg-ink hover:text-white"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-hairline pt-5">
      <p className="gf-caption text-iron">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
