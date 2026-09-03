import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/goingflag-logo.png.asset.json";
import { useAuth } from "@/hooks/useAuth";



const LINKS = [
  { to: "/destinations", label: "Explore" },
  { to: "/flights", label: "Flights" },
  { to: "/hotels", label: "Hotels" },
  { to: "/deals", label: "Deals" },
  { to: "/experiences", label: "Experiences" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!menu) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menu]);

  async function handleSignOut() {
    setMenu(false);
    setOpen(false);
    await signOut();
    navigate({ to: "/" });
  }

  const initial = (user?.email ?? "?").charAt(0).toUpperCase();


  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white">
      <div className="gf-shell grid h-[60px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 md:h-[68px]">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="GoingFlag home">
          <img src={logoAsset.url} alt="GoingFlag Travel & Booking logo" className="h-8 w-8 object-contain" />
          <span className="text-[15px] font-medium tracking-[0.14em]">GOINGFLAG</span>
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
          {loading ? null : user ? (
            <div ref={menuRef} className="relative hidden md:block">
              <button
                type="button"
                aria-expanded={menu}
                aria-haspopup="menu"
                onClick={() => setMenu((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black text-[14px] font-medium"
                title={user.email ?? "Account"}
              >
                {initial}
              </button>
              {menu ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-60 rounded-2xl border border-line bg-white p-2"
                >
                  <p className="gf-caption truncate px-3 py-2 text-iron">{user.email}</p>
                  <Link
                    role="menuitem"
                    to="/trips"
                    onClick={() => setMenu(false)}
                    className="block rounded-xl px-3 py-2 text-[15px] hover:bg-sand"
                  >
                    My trips
                  </Link>
                  <Link
                    role="menuitem"
                    to="/support"
                    onClick={() => setMenu(false)}
                    className="block rounded-xl px-3 py-2 text-[15px] hover:bg-sand"
                  >
                    Help centre
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full rounded-xl px-3 py-2 text-left text-[15px] hover:bg-sand"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/signin" className="hidden text-[15px] text-graphite hover:text-black md:inline">
              Sign in
            </Link>
          )}

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
            {[...LINKS, { to: "/trips", label: "Trips" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-hairline py-4 text-[20px] font-medium last:border-0"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="py-4 text-left text-[20px] font-medium"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="py-4 text-[20px] font-medium"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
