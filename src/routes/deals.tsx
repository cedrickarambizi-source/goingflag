import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs, Price, SectionHead } from "@/components/gf/ui";
import { flightDeals, money } from "@/lib/gf/data";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals — GoingFlag" },
      {
        name: "description",
        content: "This week's lowest round-trip fares out of Kigali. Taxes included, no countdown timers.",
      },
      { property: "og:title", content: "Deals — GoingFlag" },
      {
        property: "og:description",
        content: "This week's lowest round-trip fares out of Kigali, taxes included.",
      },
    ],
  }),
  component: Deals,
});

function Deals() {
  const sorted = [...flightDeals].sort((a, b) => a.price - b.price);

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Deals" }]} />
      <div className="mt-[30px]">
        <SectionHead
          index="Refreshed weekly"
          title="Deals"
          intro="One list, sorted by price. We do not reorder it for commission."
        />
      </div>

      <ul className="divide-y divide-hairline">
        {sorted.map((d) => (
          <li key={d.id}>
            <Link
              to="/flights"
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 py-[30px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <div>
                <p className="gf-sub">
                  {d.from} → {d.to}
                </p>
                <p className="gf-nums gf-body mt-1 text-graphite">
                  {d.fromCode} — {d.toCode}
                </p>
              </div>
              <p className="gf-nums gf-body hidden text-graphite md:block">
                {d.dates} · {d.tag}
              </p>
              <Price value={money(d.price)} className="text-[20px]" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
