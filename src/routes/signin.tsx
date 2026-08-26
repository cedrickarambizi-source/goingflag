import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GfButton, SectionHead } from "@/components/gf/ui";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — GoingFlag" },
      {
        name: "description",
        content: "Sign in to GoingFlag to manage bookings, saved fares and travel documents.",
      },
      { property: "og:title", content: "Sign in — GoingFlag" },
      { property: "og:description", content: "Manage bookings, saved fares and travel documents." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="gf-shell gf-section">
      <div className="max-w-md">
        <SectionHead index="Account" title="Sign in" intro="We send a one-time link. No passwords to forget." />
        <form
          className="mt-[30px]"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label htmlFor="gf-email" className="gf-caption text-iron">
            Email address
          </label>
          <input
            id="gf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full border-b border-black bg-transparent pb-3 text-[15px] placeholder:text-smoke focus:outline-none"
          />
          <GfButton type="submit" className="mt-[30px] w-full">
            Send link
          </GfButton>
          <p aria-live="polite" className="gf-body mt-4 text-graphite">
            {sent
              ? "Link sent. Accounts are not yet connected, so nothing will arrive in this preview."
              : "Sign-in is not wired to a backend yet."}
          </p>
        </form>
      </div>
    </div>
  );
}
