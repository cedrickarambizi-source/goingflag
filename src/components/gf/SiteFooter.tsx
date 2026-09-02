import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { HOME_BASE } from "@/lib/gf/data";
import logoAsset from "@/assets/goingflag-logo.png.asset.json";


const COLUMNS = [
  {
    title: "Explore",
    links: [
      { to: "/destinations", label: "Destinations" },
      { to: "/flights", label: "Flights" },
      { to: "/hotels", label: "Hotels" },
      { to: "/deals", label: "Deals" },
      { to: "/experiences", label: "Experiences" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/about", label: "Careers" },
      { to: "/about", label: "Press" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/support", label: "Help" },
      { to: "/support", label: "Contact" },
      { to: "/trips", label: "Manage booking" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/legal", label: "Privacy" },
      { to: "/legal", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="border-t border-black bg-white">
      <div className="gf-shell gf-section">
        <div className="grid gap-[30px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] md:gap-[72px]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoAsset.url} alt="GoingFlag Travel & Booking logo" className="h-10 w-10 object-contain" />
              <p className="text-[20px] font-medium tracking-[0.14em]">GOINGFLAG</p>
            </div>

            <p className="gf-body mt-4 max-w-xs text-graphite">
              {HOME_BASE.district}, {HOME_BASE.city}, {HOME_BASE.country}. A gallery for travel, with a
              booking engine behind it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-[30px] sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="gf-caption text-iron">{col.title}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-[15px] text-graphite hover:text-black">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <form
          className="mt-[72px] border-t border-hairline pt-[30px]"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label htmlFor="gf-newsletter" className="gf-caption text-iron">
            Newsletter
          </label>
          <div className="mt-4 flex flex-col gap-[10px] sm:flex-row sm:items-center">
            <input
              id="gf-newsletter"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full max-w-sm border-b border-black bg-transparent pb-3 text-[15px] text-black placeholder:text-smoke focus:outline-none focus-visible:border-black"
            />
            <button
              type="submit"
              className="gf-caption self-start rounded-full border border-black px-5 py-3 transition-colors hover:bg-black hover:text-white sm:self-auto"
            >
              Subscribe →
            </button>
          </div>
          <p aria-live="polite" className="gf-body mt-3 text-graphite">
            {done ? "Thank you. Check your inbox to confirm." : "One edition a month. No urgency tactics."}
          </p>
        </form>

        <div className="mt-[72px] flex flex-col gap-2 border-t border-hairline pt-[30px] sm:flex-row sm:justify-between">
          <p className="gf-caption text-iron">© 2026 GoingFlag Ltd</p>
          <p className="gf-caption text-iron">Kigali · Remera · Gisimenti</p>
        </div>
      </div>
    </footer>
  );
}
