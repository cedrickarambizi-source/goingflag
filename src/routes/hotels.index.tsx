import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Breadcrumbs, Price, SectionHead, Stars } from "@/components/gf/ui";
import { hotels, money } from "@/lib/gf/data";
import { photo } from "@/lib/gf/photos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hotels/")({
  head: () => ({
    meta: [
      { title: "Hotels — GoingFlag" },
      {
        name: "description",
        content:
          "Hand-picked stays in Kigali, Zanzibar, Nairobi and Lisbon. Nightly rates, cancellation terms and room detail up front.",
      },
      { property: "og:title", content: "Hotels — GoingFlag" },
      {
        property: "og:description",
        content: "Hand-picked stays with nightly rates and cancellation terms up front.",
      },
    ],
  }),
  component: HotelsIndex,
});

function HotelsIndex() {
  const [city, setCity] = useState("All");
  const cities = useMemo(() => ["All", ...Array.from(new Set(hotels.map((h) => h.destination)))], []);
  const list = city === "All" ? hotels : hotels.filter((h) => h.destination === city);

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Hotels" }]} />
      <div className="mt-[30px]">
        <SectionHead
          index={`${hotels.length} properties`}
          title="Hotels"
          intro="Rates are per night for two adults, taxes included."
        />
      </div>

      <div className="mt-[30px] flex flex-wrap gap-[10px]">
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={city === c}
            onClick={() => setCity(c)}
            className={cn(
              "gf-caption rounded-full border px-4 py-[9px] transition-colors",
              city === c
                ? "border-black bg-black text-white"
                : "border-concrete text-graphite hover:border-black hover:text-black",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-[30px] divide-y divide-hairline border-t border-hairline">
        {list.map((h) => (
          <li key={h.slug}>
            <Link
              to="/hotels/$slug"
              params={{ slug: h.slug }}
              className="grid gap-6 py-[30px] md:grid-cols-[minmax(0,320px)_minmax(0,1fr)_auto] md:items-center md:gap-8"
            >
              <div className="gf-frame aspect-[3/2]">
                <img src={photo(h.photoId, 700, 1.5)} alt={h.name} loading="lazy" />
              </div>
              <div>
                <Stars count={h.stars} />
                <p className="gf-sub mt-2">{h.name}</p>
                <p className="gf-body mt-1 text-graphite">
                  {h.descriptor} · {h.destination}, {h.country}
                </p>
                <p className="gf-body mt-3 max-w-xl text-graphite">{h.intro}</p>
              </div>
              <div className="md:text-right">
                <Price value={money(h.nightly)} className="text-[20px]" />
                <p className="gf-caption mt-2 text-iron">Per night</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
