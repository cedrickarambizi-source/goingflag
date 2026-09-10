import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Breadcrumbs, CheckoutLink, GfButtonLink, SectionHead, Stars } from "@/components/gf/ui";
import { getStay } from "@/lib/gf/hotelbeds.functions";
import type { LiveHotel } from "@/lib/gf/hotelbeds.types";
import { cn } from "@/lib/utils";

type StaySearch = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  code?: string;
};

function str(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
function num(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

export const Route = createFileRoute("/hotels/$slug")({
  validateSearch: (search: Record<string, unknown>): StaySearch => ({
    ...(str(search["destination"]) ? { destination: str(search["destination"]) as string } : {}),
    ...(str(search["checkIn"]) ? { checkIn: str(search["checkIn"]) as string } : {}),
    ...(str(search["checkOut"]) ? { checkOut: str(search["checkOut"]) as string } : {}),
    ...(num(search["adults"]) ? { adults: num(search["adults"]) as number } : {}),
    ...(num(search["children"]) !== undefined ? { children: num(search["children"]) as number } : {}),
    ...(num(search["rooms"]) ? { rooms: num(search["rooms"]) as number } : {}),
    ...(str(search["code"]) ? { code: str(search["code"]) as string } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Property availability and rooms — GoingFlag" },
      {
        name: "description",
        content:
          "Live rooms, board basis, cancellation terms and total prices for your dates, straight from our supply partner.",
      },
      { property: "og:title", content: "Property availability and rooms — GoingFlag" },
      {
        property: "og:description",
        content: "Real rooms and real prices for your exact dates and occupancy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotelDetail,
});

function money(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function HotelDetail() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const run = useServerFn(getStay);

  const params = {
    code: search.code ?? slug,
    destination: search.destination ?? "",
    checkIn: search.checkIn ?? "",
    checkOut: search.checkOut ?? "",
    adults: search.adults ?? 2,
    children: search.children ?? 0,
    rooms: search.rooms ?? 1,
  };
  const ready = /^\d+$/.test(params.code) && Boolean(params.checkIn && params.checkOut);

  const query = useQuery({
    queryKey: ["stay", params],
    queryFn: () => run({ data: params }),
    enabled: ready,
    staleTime: 60_000,
    retry: false,
  });

  const backSearch = {
    destination: params.destination,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: params.adults,
    children: params.children,
    rooms: params.rooms,
  };

  if (!ready) {
    return (
      <Shell backSearch={backSearch} name="Property">
        <Notice
          title="This property link is missing search details"
          body="Run a stay search with a destination and your dates, then open the property from the results."
        />
      </Shell>
    );
  }

  if (query.isPending || query.isFetching) {
    return (
      <Shell backSearch={backSearch} name="Checking live availability…">
        <div className="mt-[30px] space-y-[18px]" aria-busy="true">
          <div className="h-[320px] animate-pulse rounded-3xl border border-line bg-sand" />
          <div className="h-[180px] animate-pulse rounded-3xl border border-line bg-sand" />
        </div>
      </Shell>
    );
  }

  if (query.isError || query.data?.status === "error") {
    return (
      <Shell backSearch={backSearch} name="Property">
        <Notice
          title="We couldn’t load live availability"
          body={
            query.data?.status === "error"
              ? query.data.message
              : "Something went wrong on the way to our supply partner. Please try again."
          }
          action={{ label: "Try again", onClick: () => query.refetch() }}
        />
      </Shell>
    );
  }

  const result = query.data;
  const hotel = result && "hotel" in result ? result.hotel : null;
  if (!hotel) {
    return (
      <Shell backSearch={backSearch} name="Property">
        <Notice
          title="That property isn’t available"
          body="We couldn’t load this property for your dates. Try the results list again."
        />
      </Shell>
    );
  }

  const unavailable = result?.status === "unavailable";

  return (
    <Shell backSearch={backSearch} name={hotel.name}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hotel",
            name: hotel.name,
            ...(hotel.description ? { description: hotel.description } : {}),
            ...(hotel.stars ? { starRating: { "@type": "Rating", ratingValue: hotel.stars } } : {}),
            ...(hotel.image ? { image: hotel.image } : {}),
            address: {
              "@type": "PostalAddress",
              ...(hotel.address ? { streetAddress: hotel.address } : {}),
              addressLocality: hotel.destinationName,
              addressCountry: hotel.countryCode,
            },
            priceRange: money(hotel.minRate, hotel.currency),
          }),
        }}
      />

      <header className="mt-[30px] flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-[30px]">
        <div>
          {hotel.stars ? <Stars count={hotel.stars} /> : null}
          <h1 className="gf-heading mt-3">{hotel.name}</h1>
          <p className="gf-body mt-3 text-graphite">
            {[hotel.categoryName, hotel.zoneName, hotel.destinationName, hotel.countryCode]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {hotel.address ? <p className="gf-caption mt-1 text-iron">{hotel.address}</p> : null}
        </div>
        <div className="text-right">
          <p className="gf-nums text-[20px] text-ink">{money(hotel.minRate, hotel.currency)}</p>
          <p className="gf-caption mt-2 text-iron">
            From, {hotel.nights} night{hotel.nights > 1 ? "s" : ""} · {params.adults} adult
            {params.adults > 1 ? "s" : ""}
            {params.children ? ` + ${params.children} children` : ""}, {params.rooms} room
            {params.rooms > 1 ? "s" : ""}
          </p>
        </div>
      </header>

      {unavailable ? (
        <Notice
          title="No rooms available for those dates"
          body={result.message}
          action={undefined}
        />
      ) : null}

      {hotel.images.length ? (
        <div className="mt-[30px] grid gap-[10px] md:grid-cols-4">
          {hotel.images.slice(0, 5).map((src, i) => (
            <div
              key={src}
              className={cn(
                "gf-frame overflow-hidden rounded-2xl",
                i === 0 ? "aspect-[16/10] md:col-span-4" : "aspect-[4/3]",
              )}
            >
              <img
                src={src}
                alt={`${hotel.name} — view ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="gf-section grid gap-[30px] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-[60px]">
        <div>
          {hotel.description ? (
            <p className="text-[17px] leading-[1.5] text-graphite">{hotel.description}</p>
          ) : null}

          <section className="mt-[48px]">
            <SectionHead title="Available rooms" />
            {hotel.rooms.length ? (
              <ul className="divide-y divide-hairline">
                {hotel.rooms.map((room) => (
                  <li key={room.code} className="py-6">
                    <p className="gf-sub">{room.name}</p>
                    <ul className="mt-4 space-y-3">
                      {room.rates.map((rate) => (
                        <li
                          key={rate.rateKey}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4"
                        >
                          <div className="min-w-0">
                            <p className="gf-body text-ink">{rate.boardName}</p>
                            <p
                              className={cn(
                                "gf-caption mt-1",
                                rate.refundable ? "text-emerald" : "text-iron",
                              )}
                            >
                              {rate.cancellationNote}
                            </p>
                            {rate.allotment ? (
                              <p className="gf-caption mt-1 text-iron">
                                {rate.allotment} left at this rate
                              </p>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-5">
                            <div className="text-right">
                              <p className="gf-nums text-[17px] text-ink">
                                {money(rate.net, rate.currency)}
                              </p>
                              <p className="gf-caption text-iron">
                                {hotel.nights} night{hotel.nights > 1 ? "s" : ""} total
                              </p>
                            </div>
                            <CheckoutLink
                              draft={{
                                kind: "stay",
                                slug: `${hotel.code}--${rate.rateKey.slice(0, 24)}`,
                                title: `${hotel.name} — ${rate.roomName}`,
                                location: [hotel.destinationName, hotel.countryCode]
                                  .filter(Boolean)
                                  .join(", "),
                                ...(hotel.image ? { image: hotel.image } : {}),
                                price: Math.round(rate.net),
                                unit: `${hotel.nights} night stay (${rate.currency})`,
                                start: params.checkIn,
                                end: params.checkOut,
                                travellers: params.adults + params.children,
                                quantity: 1,
                              }}
                            >
                              Reserve
                            </CheckoutLink>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="gf-body text-graphite">
                No rooms are on sale here for your dates. Try different dates or fewer guests.
              </p>
            )}
          </section>
        </div>

        <aside className="md:border-l md:border-hairline md:pl-[30px]">
          {hotel.amenities.length ? (
            <>
              <p className="gf-caption text-iron">Facilities</p>
              <ul className="mt-4 space-y-2">
                {hotel.amenities.map((a) => (
                  <li key={a} className="gf-body text-graphite">
                    {a}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="gf-caption mt-[48px] text-iron">Your search</p>
          <dl className="mt-4 space-y-3">
            <Row label="Check in" value={params.checkIn} />
            <Row label="Check out" value={params.checkOut} />
            <Row
              label="Guests"
              value={`${params.adults} adults${params.children ? `, ${params.children} children` : ""}`}
            />
            <Row label="Rooms" value={String(params.rooms)} />
          </dl>

          <div className="mt-[30px]">
            <GfButtonLink to="/hotels" search={backSearch} variant="secondary">
              Change search
            </GfButtonLink>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="gf-body">{label}</dt>
      <dd className="gf-body text-graphite">{value}</dd>
    </div>
  );
}

function Shell({
  name,
  backSearch,
  children,
}: {
  name: string;
  backSearch: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Stays", to: "/hotels" }, { label: name }]}
      />
      {children}
      <div className="mt-[48px]">
        <Link
          to="/hotels"
          search={backSearch as never}
          className="gf-caption rounded-full border border-ink px-5 py-3 transition-colors hover:bg-ink hover:text-white"
        >
          Back to results
        </Link>
      </div>
    </div>
  );
}

type LiveHotelRef = LiveHotel;
