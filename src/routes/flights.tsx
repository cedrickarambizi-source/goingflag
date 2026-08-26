import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs, GfButton, Price, SectionHead } from "@/components/gf/ui";
import { flightOffers, money } from "@/lib/gf/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Flights from Kigali — GoingFlag" },
      {
        name: "description",
        content:
          "Compare fares out of Kigali by price, duration or stops. Baggage and refund terms shown on every row.",
      },
      { property: "og:title", content: "Flights from Kigali — GoingFlag" },
      {
        property: "og:description",
        content: "Fares out of Kigali with baggage and refund terms on every row.",
      },
    ],
  }),
  component: Flights,
});

type Sort = "price" | "duration" | "stops";

function Flights() {
  const [destination, setDestination] = useState("All");
  const [sort, setSort] = useState<Sort>("price");
  const [nonstop, setNonstop] = useState(false);

  const codes = useMemo(
    () => ["All", ...Array.from(new Set(flightOffers.map((f) => f.toCode)))],
    [],
  );

  const results = useMemo(() => {
    let list = flightOffers.filter((f) => (destination === "All" ? true : f.toCode === destination));
    if (nonstop) list = list.filter((f) => f.stops === 0);
    return [...list].sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "duration"
          ? a.durationMins - b.durationMins
          : a.stops - b.stops || a.price - b.price,
    );
  }, [destination, nonstop, sort]);

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Flights" }]} />
      <div className="mt-[30px]">
        <SectionHead
          index="Departing KGL"
          title="Flights"
          intro="Prices are round trip per adult, taxes and fees included."
        />
      </div>

      <div className="mt-[30px] flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-hairline pb-[30px]">
        <label className="flex items-center gap-3">
          <span className="gf-caption text-iron">To</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="gf-body border-b border-black bg-transparent pb-2 pr-6 focus:outline-none"
          >
            {codes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3">
          <span className="gf-caption text-iron">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="gf-body border-b border-black bg-transparent pb-2 pr-6 focus:outline-none"
          >
            <option value="price">Lowest price</option>
            <option value="duration">Shortest duration</option>
            <option value="stops">Fewest stops</option>
          </select>
        </label>

        <button
          type="button"
          aria-pressed={nonstop}
          onClick={() => setNonstop((v) => !v)}
          className={cn(
            "gf-caption rounded-full border px-4 py-[9px] transition-colors",
            nonstop
              ? "border-black bg-black text-white"
              : "border-concrete text-graphite hover:border-black hover:text-black",
          )}
        >
          Nonstop only
        </button>

        <p className="gf-caption ml-auto text-iron">{results.length} results</p>
      </div>

      {results.length === 0 ? (
        <p className="gf-body mt-[72px] text-graphite">No fares match those filters.</p>
      ) : (
        <ul className="divide-y divide-hairline">
          {results.map((f) => (
            <li
              key={f.id}
              className="grid gap-4 py-[30px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center md:gap-8"
            >
              <div>
                <p className="gf-sub">{f.airline}</p>
                <p className="gf-body mt-1 text-graphite">
                  {f.cabin} · {f.date}
                </p>
              </div>
              <div className="gf-nums">
                <p className="gf-sub">
                  {f.depart} — {f.arrive}
                </p>
                <p className="gf-body mt-1 text-graphite">
                  {f.fromCode} → {f.toCode} · {f.duration} ·{" "}
                  {f.stops === 0 ? "Nonstop" : `${f.stops} stop`}
                </p>
              </div>
              <div>
                <p className="gf-body text-graphite">{f.baggage}</p>
                <p className="gf-body mt-1 text-graphite">
                  {f.refundable ? "Refundable" : "Non-refundable"}
                </p>
              </div>
              <div className="flex items-center gap-6 md:justify-end">
                <Price value={money(f.price)} className="text-[20px]" />
                <GfButton>Select</GfButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
