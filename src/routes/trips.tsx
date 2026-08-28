import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Breadcrumbs, GfButton, GfButtonLink, SectionHead } from "@/components/gf/ui";
import { cancelReservation, listReservations } from "@/lib/gf/reservations.functions";
import { money } from "@/lib/gf/booking";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "Your trips — GoingFlag" },
      {
        name: "description",
        content: "Find a booking, review its terms or cancel a reservation on your GoingFlag account.",
      },
      { property: "og:title", content: "Your trips — GoingFlag" },
      { property: "og:description", content: "Review reservations, terms and cancellations." },
    ],
  }),
  component: Trips,
});

function Trips() {
  const { user, loading } = useAuth();
  const fetchTrips = useServerFn(listReservations);
  const cancelFn = useServerFn(cancelReservation);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: () => fetchTrips(),
    enabled: !!user,
  });

  const cancel = useMutation({
    mutationFn: (id: string) => cancelFn({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reservations"] }),
  });

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Trips" }]} />
      <div className="mt-[30px]">
        <SectionHead
          index="Manage booking"
          title="Your trips"
          intro="Every reservation on this account, with its reference, total and cancellation state."
        />
      </div>

      {loading || (user && isLoading) ? (
        <p className="gf-body mt-[30px] text-graphite">Loading your reservations…</p>
      ) : !user ? (
        <div className="mt-[30px] max-w-xl rounded-3xl border border-line bg-sand p-[30px]">
          <p className="gf-sub">Sign in to see your trips</p>
          <p className="gf-body mt-3 text-graphite">
            Reservations are tied to your account, so signing in brings back every booking, on any device.
          </p>
          <div className="mt-6 flex flex-wrap gap-[10px]">
            <GfButtonLink to="/signin">Sign in</GfButtonLink>
            <GfButtonLink to="/deals" variant="secondary">
              Start with a fare
            </GfButtonLink>
          </div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-[30px] max-w-xl">
          <p className="gf-body text-graphite">
            No reservations yet. Once you book, every flight, room and experience appears here with its
            own change and refund terms.
          </p>
          <div className="mt-[30px] flex flex-wrap gap-[10px]">
            <GfButtonLink to="/hotels">Find a stay</GfButtonLink>
            <GfButtonLink to="/experiences" variant="secondary">
              Browse experiences
            </GfButtonLink>
          </div>
        </div>
      ) : (
        <ul className="mt-[30px] space-y-5">
          {data.map((r) => (
            <li
              key={r.id}
              className="grid gap-5 rounded-3xl border border-line bg-white p-5 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="gf-frame aspect-[3/2] overflow-hidden rounded-2xl">
                {r.image_url ? <img src={r.image_url} alt={r.title} loading="lazy" /> : null}
              </div>
              <div className="min-w-0">
                <p className="gf-caption text-iron">
                  {r.kind} · <span className="gf-nums">{r.reference}</span>
                  {r.status === "cancelled" ? " · cancelled" : ""}
                </p>
                <Link
                  to="/booking/$reference"
                  params={{ reference: r.reference }}
                  className="gf-sub mt-2 block truncate hover:underline"
                >
                  {r.title}
                </Link>
                <p className="gf-body mt-1 text-graphite">
                  {[r.location, r.start_date, r.end_date].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <span className="gf-nums gf-sub">{money(r.total_cents)}</span>
                {r.status === "cancelled" ? null : (
                  <GfButton
                    variant="quiet"
                    disabled={cancel.isPending}
                    onClick={() => cancel.mutate(r.id)}
                  >
                    Cancel
                  </GfButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
