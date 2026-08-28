import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Breadcrumbs, GfButtonLink, SectionHead } from "@/components/gf/ui";
import { getReservation } from "@/lib/gf/reservations.functions";
import { money } from "@/lib/gf/booking";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/booking/$reference")({
  head: () => ({
    meta: [
      { title: "Booking confirmation — GoingFlag" },
      { name: "description", content: "Your GoingFlag reservation details and cancellation terms." },
      { property: "og:title", content: "Booking confirmation — GoingFlag" },
      { property: "og:description", content: "Reservation details and cancellation terms." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const { reference } = Route.useParams();
  const { user, loading } = useAuth();
  const fetchReservation = useServerFn(getReservation);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reservation", reference],
    queryFn: () => fetchReservation({ data: { reference } }),
    enabled: !!user,
  });

  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Trips", to: "/trips" }, { label: reference }]}
      />

      <div className="mt-[30px] max-w-3xl">
        {loading || (user && isLoading) ? (
          <p className="gf-body text-graphite">Loading your reservation…</p>
        ) : !user ? (
          <>
            <SectionHead index="Confirmation" title="Sign in to view this booking" />
            <div className="mt-[30px]">
              <GfButtonLink to="/signin">Sign in</GfButtonLink>
            </div>
          </>
        ) : error || !data ? (
          <>
            <SectionHead
              index="Confirmation"
              title="We couldn't find that reference"
              intro="Check the code, or open your trips to see every reservation on this account."
            />
            <div className="mt-[30px]">
              <GfButtonLink to="/trips">Open my trips</GfButtonLink>
            </div>
          </>
        ) : (
          <>
            <p className="gf-caption text-emerald">
              {data.status === "cancelled" ? "Cancelled" : "Confirmed"}
            </p>
            <h1 className="gf-heading mt-3">{data.title}</h1>
            <p className="gf-body mt-3 text-graphite">
              Reference <span className="gf-nums text-ink">{data.reference}</span>
              {data.location ? ` · ${data.location}` : ""}
            </p>

            <div className="mt-[30px] grid gap-[30px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {data.image_url ? (
                <div className="gf-frame aspect-[3/2] overflow-hidden rounded-3xl">
                  <img src={data.image_url} alt={data.title} loading="eager" />
                </div>
              ) : null}

              <dl className="space-y-3 rounded-3xl border border-line p-[30px]">
                <Row label="Type" value={data.kind} />
                {data.start_date ? <Row label="From" value={data.start_date} /> : null}
                {data.end_date ? <Row label="To" value={data.end_date} /> : null}
                <Row label="Travellers" value={String(data.travellers)} />
                <Row label="Units" value={String(data.quantity)} />
                <Row label="Lead traveller" value={data.lead_name} />
                <Row label="Email" value={data.lead_email} />
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                  <dt className="gf-caption text-iron">Total</dt>
                  <dd className="gf-nums gf-sub">{money(data.total_cents)}</dd>
                </div>
              </dl>
            </div>

            <p className="gf-body mt-[30px] text-graphite">
              A copy of these details sits in your trips. Free cancellation applies until 48 hours
              before the start date; after that the supplier's terms apply.
            </p>

            <div className="mt-[30px] flex flex-wrap gap-[10px]">
              <GfButtonLink to="/trips">Manage my trips</GfButtonLink>
              <GfButtonLink to="/hotels" variant="secondary">
                Add another stay
              </GfButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="gf-caption text-iron">{label}</dt>
      <dd className="gf-body capitalize">{value}</dd>
    </div>
  );
}
