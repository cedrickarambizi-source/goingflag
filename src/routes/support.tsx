import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs, GfButton, SectionHead } from "@/components/gf/ui";

const FAQS = [
  {
    q: "Is the price I see the price I pay?",
    a: "Yes. Fares include taxes and fees for one adult, and room rates include local taxes for two adults.",
  },
  {
    q: "Can I change a booking?",
    a: "Change and refund terms are printed on each fare and room. Refundable options are labelled before you select them.",
  },
  {
    q: "Do you arrange airport transfers?",
    a: "Where a property offers transfers it is listed in that property's amenities and can be added at checkout.",
  },
  {
    q: "Which currency are prices in?",
    a: "US dollars. Your card issuer sets the conversion rate if you pay in another currency.",
  },
];

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — GoingFlag" },
      {
        name: "description",
        content: "Answers on pricing, changes, transfers and currency, plus a direct line to the Kigali team.",
      },
      { property: "og:title", content: "Support — GoingFlag" },
      { property: "og:description", content: "Answers on pricing, changes and transfers." },
    ],
  }),
  component: Support,
});

function Support() {
  const [sent, setSent] = useState(false);

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Support" }]} />
      <div className="mt-[30px]">
        <SectionHead index="Help" title="Support" intro="Most answers are here. If not, write to us." />
      </div>

      <div className="mt-[30px] grid gap-[30px] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-[72px]">
        <div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }}
          />
          <ul className="divide-y divide-hairline border-t border-hairline">
            {FAQS.map((f) => (
              <li key={f.q} className="py-6">
                <h2 className="gf-sub">{f.q}</h2>
                <p className="gf-body mt-2 max-w-xl text-graphite">{f.a}</p>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="md:border-l md:border-hairline md:pl-[30px]"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <p className="gf-caption text-iron">Contact</p>
          <label htmlFor="gf-support-email" className="gf-body mt-4 block">
            Email
          </label>
          <input
            id="gf-support-email"
            type="email"
            required
            className="mt-2 w-full border-b border-black bg-transparent pb-3 text-[15px] focus:outline-none"
          />
          <label htmlFor="gf-support-msg" className="gf-body mt-6 block">
            Message
          </label>
          <textarea
            id="gf-support-msg"
            required
            rows={5}
            className="mt-2 w-full border-b border-black bg-transparent pb-3 text-[15px] focus:outline-none"
          />
          <GfButton type="submit" className="mt-[30px] w-full">
            Send
          </GfButton>
          <p aria-live="polite" className="gf-body mt-4 text-graphite">
            {sent ? "Received. Messages are not yet delivered in this preview." : "Replies within one business day."}
          </p>
        </form>
      </div>
    </div>
  );
}
