import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs, Price, SectionHead } from "@/components/gf/ui";
import { destinations, money, regions } from "@/lib/gf/data";
import { photo } from "@/lib/gf/photos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Destinations — GoingFlag" },
      {
        name: "description",
        content:
          "Every destination GoingFlag covers, with indicative fares from Kigali, ideal trip lengths and the best months to travel.",
      },
      { property: "og:title", content: "Destinations — GoingFlag" },
      {
        property: "og:description",
        content: "Indicative fares from Kigali, trip lengths and best months for every destination.",
      },
    ],
  }),
  component: DestinationsIndex,
});

function DestinationsIndex() {
  const [region, setRegion] = useState<string>("All");
  const list = region === "All" ? destinations : destinations.filter((d) => d.region === region);

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations" }]} />
      <div className="mt-[30px]">
        <SectionHead
          index={`${destinations.length} places`}
          title="Destinations"
          intro="Sorted by how far they are from Kigali, not by how much we earn on them."
        />
      </div>

      <div className="mt-[30px] flex flex-wrap gap-[10px]">
        {["All", ...regions].map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={region === r}
            onClick={() => setRegion(r)}
            className={cn(
              "gf-caption rounded-full border px-4 py-[9px] transition-colors",
              region === r
                ? "border-black bg-black text-white"
                : "border-concrete text-graphite hover:border-black hover:text-black",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="gf-body mt-[72px] text-graphite">Nothing scheduled in this region yet.</p>
      ) : (
        <div className="mt-[30px] grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <Link key={d.slug} to="/destinations/$slug" params={{ slug: d.slug }} className="group block">
              <div className="gf-frame aspect-[4/5]">
                <img src={photo(d.photoId, 900, 0.8)} alt={`${d.name}, ${d.country}`} loading="lazy" />
              </div>
              <div className="mt-4 border-t border-hairline pt-4">
                <p className="gf-caption text-iron">{d.region}</p>
                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <p className="gf-sub">{d.name}</p>
                  <Price value={money(d.fromPrice)} />
                </div>
                <p className="gf-body mt-1 text-graphite">{d.descriptor}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
