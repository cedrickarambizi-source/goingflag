import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs, CheckoutLink, Stars } from "@/components/gf/ui";
import { hotels, money } from "@/lib/gf/data";
import { photo } from "@/lib/gf/photos";
import {
  POPULAR_FILTERS,
  PROPERTY_TYPES,
  SORTS,
  sortResults,
  stayResults,
  type PopularFilter,
  type PropertyType,
  type SortId,
} from "@/lib/gf/hotelSearch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hotels/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Stays — compare hotels, villas and lodges | GoingFlag" },
      {
        name: "description",
        content:
          "Search hand-picked stays in Kigali, Zanzibar, Nairobi and Lisbon. Filter by price, guest rating, property type and perks, then reserve in one step.",
      },
      { property: "og:title", content: "Stays — compare hotels, villas and lodges" },
      {
        property: "og:description",
        content: "Filter by price, guest rating, property type and perks, then reserve in one step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotelsIndex,
});

const maxNightly = Math.max(...hotels.map((h) => h.nightly));

function HotelsIndex() {
  const cities = useMemo(() => Array.from(new Set(hotels.map((h) => h.destination))).sort(), []);

  const { q: initialQuery } = Route.useSearch();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [budget, setBudget] = useState(maxNightly);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [perks, setPerks] = useState<PopularFilter[]>([]);
  const [minStars, setMinStars] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState<SortId>("best");
  const [saved, setSaved] = useState<string[]>([]);

  function toggle<T>(list: T[], value: T, set: (next: T[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stayResults.filter((r) => {
      const h = r.hotel;
      if (q && !`${h.name} ${h.destination} ${h.country} ${h.descriptor}`.toLowerCase().includes(q))
        return false;
      if (h.nightly > budget) return false;
      if (selectedCities.length && !selectedCities.includes(h.destination)) return false;
      if (types.length && !types.includes(r.propertyType)) return false;
      if (perks.length && !perks.every((p) => r.perks.includes(p))) return false;
      if (minStars && h.stars < minStars) return false;
      if (minScore && r.score < minScore) return false;
      return true;
    });
  }, [query, budget, selectedCities, types, perks, minStars, minScore]);

  const results = useMemo(() => sortResults(filtered, sort), [filtered, sort]);

  const activeCount =
    (query ? 1 : 0) +
    (budget < maxNightly ? 1 : 0) +
    selectedCities.length +
    types.length +
    perks.length +
    (minStars ? 1 : 0) +
    (minScore ? 1 : 0);

  function clearAll() {
    setQuery("");
    setBudget(maxNightly);
    setSelectedCities([]);
    setTypes([]);
    setPerks([]);
    setMinStars(0);
    setMinScore(0);
  }

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stays" }]} />

      <header className="mt-[30px]">
        <h1 className="gf-heading">Stays</h1>
        <p className="gf-body mt-3 text-graphite">
          {results.length} of {stayResults.length} properties · rates per night for two adults, taxes
          included, one total at checkout.
        </p>
      </header>

      <div className="mt-[30px] grid gap-[30px] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-[40px]">
        {/* -------------------------------------------------- Filter sidebar */}
        <aside className="h-fit rounded-3xl border border-line bg-white p-6 lg:sticky lg:top-[92px]">
          <div className="flex items-baseline justify-between">
            <p className="gf-sub text-[15px]">Filters</p>
            {activeCount ? (
              <button
                type="button"
                onClick={clearAll}
                className="gf-caption text-emerald underline underline-offset-4"
              >
                Clear ({activeCount})
              </button>
            ) : null}
          </div>

          <FilterBlock label="Search by name">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Property or city"
              aria-label="Search stays by name"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-smoke focus:border-emerald focus:outline-none"
            />
          </FilterBlock>

          <FilterBlock label="Your budget (per night)">
            <input
              type="range"
              min={40}
              max={maxNightly}
              step={5}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label="Maximum nightly price"
              className="w-full accent-emerald"
            />
            <p className="gf-body mt-2 text-graphite">
              Up to <span className="gf-nums text-ink">{money(budget)}</span> a night
            </p>
          </FilterBlock>

          <FilterBlock label="Popular filters">
            <ul className="space-y-3">
              {POPULAR_FILTERS.map((p) => (
                <li key={p}>
                  <Check
                    label={p}
                    count={stayResults.filter((r) => r.perks.includes(p)).length}
                    checked={perks.includes(p)}
                    onChange={() => toggle(perks, p, setPerks)}
                  />
                </li>
              ))}
            </ul>
          </FilterBlock>

          <FilterBlock label="Destination">
            <ul className="space-y-3">
              {cities.map((c) => (
                <li key={c}>
                  <Check
                    label={c}
                    count={hotels.filter((h) => h.destination === c).length}
                    checked={selectedCities.includes(c)}
                    onChange={() => toggle(selectedCities, c, setSelectedCities)}
                  />
                </li>
              ))}
            </ul>
          </FilterBlock>

          <FilterBlock label="Property type">
            <ul className="space-y-3">
              {PROPERTY_TYPES.map((t) => (
                <li key={t}>
                  <Check
                    label={t}
                    count={stayResults.filter((r) => r.propertyType === t).length}
                    checked={types.includes(t)}
                    onChange={() => toggle(types, t, setTypes)}
                  />
                </li>
              ))}
            </ul>
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

          <FilterBlock label="Guest rating">
            <div className="flex flex-wrap gap-2">
              {[0, 8, 8.5, 9].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={minScore === s}
                  onClick={() => setMinScore(s)}
                  className={cn(
                    "gf-caption rounded-full border px-3 py-2 transition-colors",
                    minScore === s
                      ? "border-emerald bg-emerald text-white"
                      : "border-line text-graphite hover:border-ink hover:text-ink",
                  )}
                >
                  {s === 0 ? "Any" : `${s}+`}
                </button>
              ))}
            </div>
          </FilterBlock>
        </aside>

        {/* ------------------------------------------------------- Result list */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-sand px-5 py-4">
            <p className="gf-body text-graphite">
              <span className="text-ink">{results.length}</span> properties match your filters
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

          {results.length === 0 ? (
            <div className="mt-[30px] rounded-3xl border border-line bg-white p-[30px]">
              <p className="gf-sub">No properties match those filters</p>
              <p className="gf-body mt-3 text-graphite">
                Widen the budget or clear a filter to see the full collection again.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="gf-caption mt-5 rounded-full border border-ink px-5 py-3 transition-colors hover:bg-ink hover:text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <ul className="mt-[30px] space-y-[18px]">
              {results.map((r) => {
                const h = r.hotel;
                const isSaved = saved.includes(h.slug);
                return (
                  <li
                    key={h.slug}
                    className="overflow-hidden rounded-3xl border border-line bg-white transition-shadow hover:gf-shadow-lift"
                  >
                    <div className="grid gap-0 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,220px)]">
                      <div className="relative">
                        <Link
                          to="/hotels/$slug"
                          params={{ slug: h.slug }}
                          className="block h-full"
                          aria-label={`View ${h.name}`}
                        >
                          <img
                            src={photo(h.photoId, 700, 1.35)}
                            alt={`${h.name} in ${h.destination}, ${h.country}`}
                            loading="lazy"
                            className="h-full min-h-[200px] w-full object-cover"
                          />
                        </Link>
                        {r.promoted ? (
                          <span className="gf-caption absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-white">
                            Promoted
                          </span>
                        ) : null}
                        <button
                          type="button"
                          aria-pressed={isSaved}
                          aria-label={isSaved ? `Remove ${h.name} from saved` : `Save ${h.name}`}
                          onClick={() =>
                            setSaved((prev) =>
                              prev.includes(h.slug)
                                ? prev.filter((s) => s !== h.slug)
                                : [...prev, h.slug],
                            )
                          }
                          className={cn(
                            "absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-[15px] transition-colors",
                            isSaved ? "text-emerald" : "text-graphite hover:text-ink",
                          )}
                        >
                          {isSaved ? "♥" : "♡"}
                        </button>
                      </div>

                      <div className="border-line p-6 md:border-x">
                        <Stars count={h.stars} />
                        <h2 className="gf-sub mt-2">
                          <Link to="/hotels/$slug" params={{ slug: h.slug }} className="hover:text-emerald">
                            {h.name}
                          </Link>
                        </h2>
                        <p className="gf-body mt-2 text-graphite">
                          {r.propertyType} · {h.descriptor} · {h.destination}, {h.country}
                        </p>
                        <p className="gf-caption mt-1 text-iron">
                          {r.distanceKm} km to centre · location score {r.locationScore}
                        </p>

                        <ul className="mt-4 flex flex-wrap gap-2">
                          {r.perks.slice(0, 3).map((p) => (
                            <li
                              key={p}
                              className="gf-caption rounded-full border border-line px-3 py-1 text-graphite"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>

                        <p className="gf-body mt-4 line-clamp-2 text-graphite">{h.intro}</p>

                        <p className="gf-caption mt-3 text-emerald">
                          Booked {r.bookedToday} times today
                          {r.roomsLeft ? ` · only ${r.roomsLeft} left at this rate` : ""}
                        </p>
                      </div>

                      <div className="flex flex-col justify-between gap-5 p-6">
                        <div className="flex items-start gap-3">
                          <span className="gf-nums rounded-xl bg-emerald px-3 py-2 text-[15px] font-medium text-white">
                            {r.score.toFixed(1)}
                          </span>
                          <span>
                            <span className="gf-body block text-ink">{r.scoreLabel}</span>
                            <span className="gf-caption text-iron">
                              {r.reviews.toLocaleString("en-US")} reviews
                            </span>
                          </span>
                        </div>

                        <div className="md:text-right">
                          <p className="gf-caption text-iron">Per night before taxes</p>
                          <p className="mt-1 flex items-baseline gap-2 md:justify-end">
                            <span className="gf-nums text-[15px] text-smoke line-through">
                              {money(r.wasNightly)}
                            </span>
                            <span className="gf-caption text-emerald">−{r.discountPct}%</span>
                          </p>
                          <p className="gf-nums mt-1 text-[20px] text-ink">{money(h.nightly)}</p>
                          {r.freeCancellation ? (
                            <p className="gf-caption mt-1 text-emerald">Free cancellation</p>
                          ) : null}
                          <CheckoutLink
                            className="mt-4 w-full"
                            draft={{
                              kind: "stay",
                              slug: h.slug,
                              title: h.name,
                              location: `${h.destination}, ${h.country}`,
                              image: photo(h.photoId, 900, 1.5),
                              price: h.nightly,
                              unit: "night",
                            }}
                          >
                            Reserve
                          </CheckoutLink>
                          <Link
                            to="/hotels/$slug"
                            params={{ slug: h.slug }}
                            className="gf-caption mt-3 block text-graphite underline underline-offset-4 hover:text-ink md:text-right"
                          >
                            See availability
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-line pt-5 first-of-type:border-0">
      <p className="gf-caption text-iron">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Check({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[15px] text-graphite hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-emerald"
      />
      <span className="min-w-0 flex-1">{label}</span>
      {typeof count === "number" ? <span className="gf-caption text-iron">{count}</span> : null}
    </label>
  );
}
