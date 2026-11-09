import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { searchStays } from "@/lib/gf/hotelbeds.functions";
import type { StaySearchInput } from "@/lib/gf/hotelbeds.types";
import { GfButton, Stars } from "./ui";

export function HomeStays() {
  const run = useServerFn(searchStays);
  const [params, setParams] = useState<StaySearchInput | null>(null);
  useEffect(() => {
    const arrival = new Date();
    arrival.setUTCDate(arrival.getUTCDate() + 14);
    const departure = new Date(arrival);
    departure.setUTCDate(departure.getUTCDate() + 2);
    setParams({ destination: "Kigali", checkIn: arrival.toISOString().slice(0, 10), checkOut: departure.toISOString().slice(0, 10), adults: 2, children: 0, rooms: 1 });
  }, []);
  const query = useQuery({
    queryKey: ["homepage-supplier-stays", params],
    queryFn: () => {
      if (!params) throw new Error("Search dates are not ready");
      return run({ data: params });
    },
    enabled: Boolean(params),
    retry: false,
    staleTime: 60_000,
  });
  if (!params || query.isPending) return <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading supplier hotels" aria-busy="true">{[0, 1, 2, 3].map(i => <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />)}</div>;
  const result = query.data;
  if (query.isError || !result || result.status !== "ok") return <div className="py-12" role="status"><p className="gf-sub">{result?.status === "empty" ? "No rooms for these dates" : "Hotel availability is unavailable right now"}</p><p className="mt-3 text-muted-foreground">{result && result.status !== "ok" ? result.message : "We couldn’t reach our hotel supplier. Please try again."}</p><GfButton variant="secondary" className="mt-5" onClick={() => query.refetch()}>Try again</GfButton></div>;
  return <>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <p>Kigali · {params.checkIn} — {params.checkOut} · 2 adults · 1 room</p>
      <p>2-night supplier totals · Booking not yet available</p>
    </div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {result.hotels.slice(0, 8).map(h => <Link key={h.code} to="/hotels/$slug" params={{ slug: h.code }} search={{ ...params, code: h.code }} className="group flex flex-col overflow-hidden rounded-lg border border-line bg-card">
        <div className="aspect-[4/3] overflow-hidden bg-muted">{h.image ? <img src={h.image} alt={h.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" onError={e => { e.currentTarget.style.display = "none"; }} /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"><Building2 size={32} /><span className="text-sm">Photo unavailable</span></div>}</div>
        <div className="flex flex-1 flex-col p-5"><Stars count={h.stars} /><h3 className="gf-sub mt-2">{h.name}</h3><p className="mt-2 text-sm text-muted-foreground">{h.zoneName || h.destinationName}</p><p className="mt-3 text-sm text-muted-foreground">{h.categoryName}{h.freeCancellation ? " · Free cancellation options" : ""}</p><div className="mt-auto pt-5"><p className="gf-nums font-medium">{h.currency} {h.minRate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p><p className="mt-1 text-sm text-muted-foreground">Total for {h.nights} nights</p><span className="mt-4 inline-block text-sm text-emerald group-hover:underline">View rooms →</span></div></div>
      </Link>)}
    </div>
  </>;
}