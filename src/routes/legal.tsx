import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs, SectionHead } from "@/components/gf/ui";

const SECTIONS = [
  {
    title: "Privacy",
    body: "We collect the details needed to issue a booking: name, contact, travel dates and payment reference. We do not sell personal data and we do not use third-party advertising trackers on this site.",
  },
  {
    title: "Terms of use",
    body: "Prices shown are indicative until a booking is confirmed by the supplying airline, hotel or operator. Where a supplier's terms differ from ours, the supplier's terms apply to that component of the trip.",
  },
  {
    title: "Cancellations",
    body: "Each fare and room states its own cancellation window. Refunds are returned to the original payment method and settle according to your card issuer's timelines.",
  },
  {
    title: "Cookies",
    body: "We use functional cookies for sessions and saved searches only. No profiling cookies are set.",
  },
];

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal — GoingFlag" },
      {
        name: "description",
        content: "Privacy, terms of use, cancellation policy and cookie practice for GoingFlag bookings.",
      },
      { property: "og:title", content: "Legal — GoingFlag" },
      { property: "og:description", content: "Privacy, terms, cancellations and cookies." },
    ],
  }),
  component: Legal,
});

function Legal() {
  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Legal" }]} />
      <div className="mt-[30px] max-w-2xl">
        <SectionHead index="Last updated August 2026" title="Legal" />
      </div>
      <div className="mt-[30px] max-w-2xl divide-y divide-hairline border-t border-hairline">
        {SECTIONS.map((s) => (
          <section key={s.title} className="py-[30px]">
            <h2 className="gf-sub">{s.title}</h2>
            <p className="gf-body mt-3 text-graphite">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
