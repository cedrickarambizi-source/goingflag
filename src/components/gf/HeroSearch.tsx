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

const field =
  "w-full bg-transparent text-[15px] font-medium text-ink placeholder:text-smoke focus:outline-none";
const labelText = "gf-caption text-iron";
const cell = "min-w-0 flex-1 rounded-xl bg-white px-4 py-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-emerald";

export function HeroSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<SearchTab>("stays");
  const [place, setPlace] = useState("Kigali, Rwanda");
  const [pickup, setPickup] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [work, setWork] = useState(false);
  const [trip, setTrip] = useState<"one-way" | "return">("one-way");

  const isTransfer = tab === "transfers";

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
      className="w-full"
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
                ? "border-white bg-white text-ink"
                : "border-white/40 text-white/85 hover:border-white hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isTransfer ? (
        <div className="mt-5 flex flex-wrap items-center gap-5">
          {(["one-way", "return"] as const).map((mode) => (
            <label key={mode} className="flex cursor-pointer items-center gap-2 text-[15px] text-white">
              <input
                type="radio"
                name="trip-type"
                checked={trip === mode}
                onChange={() => setTrip(mode)}
                className="h-4 w-4 accent-white"
              />
              {mode === "one-way" ? "One-way" : "Return"}
            </label>
          ))}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl bg-gold p-[3px] shadow-[0_18px_40px_-24px_rgba(11,18,32,0.55)]">
        <div className="flex flex-col gap-[3px] md:flex-row md:items-stretch">
          {isTransfer ? (
            <label className={cell}>
              <span className={labelText}>Pick-up location</span>
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Airport, hotel or address"
                className={cn(field, "mt-1")}
              />
            </label>
          ) : null}

          <label className={cn(cell, !isTransfer && "md:flex-[1.5]")}>
            <span className={labelText}>{isTransfer ? "Destination" : "Where to"}</span>
            <input
              list="gf-places"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="City, region or property"
              className={cn(field, "mt-1")}
            />
            <datalist id="gf-places">
              {POPULAR_PLACES.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </label>

          <label className={cell}>
            <span className={labelText}>
              {tab === "flights" ? "Depart" : isTransfer ? "Pick-up date" : "Check in"}
            </span>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={cn(field, "gf-nums mt-1")}
            />
          </label>

          {!isTransfer || trip === "return" ? (
            <label className={cell}>
              <span className={labelText}>
                {tab === "flights" ? "Return" : isTransfer ? "Return date" : "Check out"}
              </span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={cn(field, "gf-nums mt-1")}
              />
            </label>
          ) : null}

          <div className={cn(cell, "md:max-w-[220px]")}>
            <span className={labelText}>{isTransfer ? "Passengers" : "Travellers"}</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={20}
                value={travellers}
                onChange={(e) => setTravellers(Number(e.target.value))}
                aria-label="Travellers"
                className={cn(field, "gf-nums w-12")}
              />
              <span className="gf-body text-graphite">{isTransfer ? "passengers" : "guests"}</span>
              {!isTransfer && tab === "stays" ? (
                <>
                  <span className="text-iron">·</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    aria-label="Rooms"
                    className={cn(field, "gf-nums w-10")}
                  />
                  <span className="gf-body text-graphite">rooms</span>
                </>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="gf-sub rounded-xl bg-emerald px-8 py-4 text-white transition-colors hover:bg-ink md:min-w-[140px]"
          >
            Search
          </button>
        </div>
      </div>

      {!isTransfer ? (
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-[15px] text-white">
          <input
            type="checkbox"
            checked={work}
            onChange={(e) => setWork(e.target.checked)}
            className="h-4 w-4 accent-emerald"
          />
          I’m travelling for work
        </label>
      ) : null}
    </form>
  );
}
