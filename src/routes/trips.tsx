import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs, GfButtonLink, SectionHead } from "@/components/gf/ui";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "Your trips — GoingFlag" },
      {
        name: "description",
        content: "Find a booking, change dates or download travel documents for your GoingFlag trips.",
      },
      { property: "og:title", content: "Your trips — GoingFlag" },
      { property: "og:description", content: "Find a booking, change dates or download documents." },
    ],
  }),
  component: Trips,
});

function Trips() {
  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Trips" }]} />
      <div className="mt-[30px] max-w-2xl">
        <SectionHead
          index="Manage booking"
          title="Your trips"
          intro="Sign in to see itineraries, tickets and cancellation windows in one place."
        />
        <p className="gf-body mt-[30px] text-graphite">
          No trips are attached to this browser yet. Once you book, every flight, room and experience
          appears here with its own change and refund terms.
        </p>
        <div className="mt-[30px] flex flex-wrap gap-[10px]">
          <GfButtonLink to="/signin">Sign in</GfButtonLink>
          <GfButtonLink to="/deals" variant="secondary">
            Start with a fare
          </GfButtonLink>
        </div>
      </div>
    </div>
  );
}
