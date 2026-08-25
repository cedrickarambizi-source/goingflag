import { Link } from "@tanstack/react-router";
import { useState } from "react";

const LINKS = [
  { to: "/destinations", label: "Explore" },
  { to: "/flights", label: "Flights" },
  { to: "/hotels", label: "Hotels" },
  { to: "/deals", label: "Deals" },
  { to: "/experiences", label: "Experiences" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white">
      <div className="gf-shell grid h-[60px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 md:h-[68px]">
        <Link to="/" className="shrink-0 text-[15px] font-medium tracking-[0.14em]">
          GOINGFLAG
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 justify-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[15px] text-graphite transition-colors hover:text-black"
              activeProps={{ className: "text-[15px] text-black" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-5">
          <Link to="/trips" className="hidden text-[15px] text-graphite hover:text-black md:inline">
            Trips
          </Link>
          <Link to="/signin" className="hidden text-[15px] text-graphite hover:text-black md:inline">
            Sign in
          </Link>
          <Link
            to="/destinations"
            className="hidden rounded-full border border-black bg-black px-5 py-[9px] text-[15px] font-medium text-white md:inline-block"
          >
            Book
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="gf-mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="gf-caption md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div id="gf-mobile-nav" className="border-t border-hairline bg-white md:hidden">
          <nav aria-label="Mobile" className="gf-shell flex flex-col py-[10px]">
            {[...LINKS, { to: "/trips", label: "Trips" }, { to: "/signin", label: "Sign in" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-hairline py-4 text-[20px] font-medium last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
