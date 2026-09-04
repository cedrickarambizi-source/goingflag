import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { POPULAR_PLACES, SEARCH_TABS, type SearchTab } from "@/lib/gf/catalog";
import { cn } from "@/lib/utils";

const DESTINATIONS: Record<SearchTab, { to: "/hotels" | "/flights" | "/experiences" | "/destinations" }> = {
  stays: { to: "/hotels" },
  flights: { to: "/flights" },
  cars: { to: "/destinations" },
  experiences: { to: "/experiences" },
  transfers: { to: "/experiences" },
};

export function HeroSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<SearchTab>("stays");
  const [place, setPlace] = useState("Zanzibar, Tanzania");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [travellers, setTravellers] = useState(2);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const to = DESTINATIONS[tab].to;
        const term = place.split(",")[0]?.trim() ?? "";
        if (to === "/hotels" && term) {
          navigate({ to, search: { q: term } });
          return;
        }
        navigate({ to });
      }}
      className="gf-glass gf-shadow-lift rounded-3xl border border-white/40 p-4 md:p-5"
    >
      <div className="gf-scroll-x -mx-1 px-1 pb-1" role="tablist" aria-label="Search type">
        {SEARCH_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "gf-caption rounded-full border px-4 py-[9px] transition-colors",
              tab === t.id
                ? "border-ink bg-ink text-white"
                : "border-line bg-white/70 text-graphite hover:border-ink hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-line bg-white p-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <label className="block">
          <span className="gf-caption text-iron">Where to</span>
          <input
            list="gf-places"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="City, region or property"
            className="mt-2 w-full rounded-xl border border-line bg-sand px-3 py-3 text-[15px] text-ink placeholder:text-smoke focus:outline-none focus-visible:border-emerald"
          />
          <datalist id="gf-places">
            {POPULAR_PLACES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="gf-caption text-iron">{tab === "flights" ? "Depart" : "Check in"}</span>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="gf-nums mt-2 w-full rounded-xl border border-line bg-sand px-3 py-3 text-[15px] text-ink focus:outline-none focus-visible:border-emerald"
          />
        </label>

        <label className="block">
          <span className="gf-caption text-iron">{tab === "flights" ? "Return" : "Check out"}</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="gf-nums mt-2 w-full rounded-xl border border-line bg-sand px-3 py-3 text-[15px] text-ink focus:outline-none focus-visible:border-emerald"
          />
        </label>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 md:grid-cols-1">
          <label className="block md:hidden">
            <span className="gf-caption text-iron">Travellers</span>
            <input
              type="number"
              min={1}
              max={20}
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value))}
              className="gf-nums mt-2 w-full rounded-xl border border-line bg-sand px-3 py-3 text-[15px] text-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-emerald px-6 py-[14px] text-[15px] font-medium text-white transition-colors hover:bg-ink"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-3 hidden items-center gap-3 md:flex">
        <span className="gf-caption text-iron">Travellers</span>
        <input
          type="number"
          min={1}
          max={20}
          value={travellers}
          onChange={(e) => setTravellers(Number(e.target.value))}
          className="gf-nums w-20 rounded-full border border-line bg-white px-3 py-2 text-[15px] text-ink focus:outline-none"
        />
        <span className="gf-body text-graphite">Free cancellation on most stays · one total, taxes included</span>
      </div>
    </form>
  );
}
