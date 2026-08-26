import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs, SectionHead } from "@/components/gf/ui";
import { HOME_BASE } from "@/lib/gf/data";
import { photo, PHOTO_IDS } from "@/lib/gf/photos";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About GoingFlag — Travel, edited from Kigali" },
      {
        name: "description",
        content:
          "GoingFlag is a travel platform built in Kigali: honest totals, real photography and no manufactured urgency.",
      },
      { property: "og:title", content: "About GoingFlag" },
      {
        property: "og:description",
        content: "A travel platform built in Kigali: honest totals, real photography, no urgency tactics.",
      },
      { property: "og:image", content: photo(PHOTO_IDS.kigaliHills, 1600, 1.9) },
      { name: "twitter:image", content: photo(PHOTO_IDS.kigaliHills, 1600, 1.9) },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About" }]} />
      <div className="mt-[30px] max-w-3xl">
        <SectionHead index={`${HOME_BASE.city}, ${HOME_BASE.country}`} title="About GoingFlag" />
      </div>

      <div className="mt-[30px] grid gap-[30px] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-[72px]">
        <div className="gf-frame aspect-[3/2]">
          <img src={photo(PHOTO_IDS.kigaliHills, 1400, 1.5)} alt="The hills of Kigali, Rwanda" loading="eager" />
        </div>
        <div className="space-y-6">
          <p className="text-[20px] leading-[1.3] tracking-[-0.01em]">
            We built GoingFlag in {HOME_BASE.district} because booking a trip from this side of the map
            was harder than it needed to be.
          </p>
          <p className="gf-body text-graphite">
            Every fare, room and experience shows its full price, baggage allowance and cancellation
            window on the same line you decide from. No countdown timers, no "3 people are viewing",
            no reordering the list for commission.
          </p>
          <p className="gf-body text-graphite">
            The photography is real. The inventory shown in this build is development data while
            supplier connections are finished.
          </p>
        </div>
      </div>

      <dl className="mt-[72px] grid gap-px border-y border-hairline bg-hairline sm:grid-cols-3">
        {[
          { label: "Founded", value: "2026" },
          { label: "Home base", value: `${HOME_BASE.city} (${HOME_BASE.airport})` },
          { label: "Coverage", value: "Africa, Europe, Middle East" },
        ].map((row) => (
          <div key={row.label} className="bg-white py-[30px] sm:px-[30px] sm:first:pl-0">
            <dt className="gf-caption text-iron">{row.label}</dt>
            <dd className="gf-sub mt-3">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
