import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLink, GfButtonLink, Price, SectionHead, Stars } from "@/components/gf/ui";
import {
  destinations,
  experiences,
  flightDeals,
  hotels,
  money,
  stories,
  testimonials,
  HOME_BASE,
} from "@/lib/gf/data";
import { photo, PHOTO_IDS } from "@/lib/gf/photos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoingFlag — Flights, stays and experiences from Kigali" },
      {
        name: "description",
        content:
          "Real fares, real rooms, one total. Browse flights, hotels and experiences from Kigali with no invented urgency.",
      },
      { property: "og:title", content: "GoingFlag — A gallery for travel" },
      {
        property: "og:description",
        content: "Flights, hotels and experiences from Kigali, priced in full and booked in one pass.",
      },
      { property: "og:image", content: photo(PHOTO_IDS.zanzibarBeach, 1600, 1.9) },
      { name: "twitter:image", content: photo(PHOTO_IDS.zanzibarBeach, 1600, 1.9) },
    ],
  }),
  component: Home,
});

function Home() {
  const feature = destinations[0];

  return (
    <>
      {/* Hero */}
      <section className="gf-shell pb-[30px] pt-[30px] md:pb-[72px] md:pt-[56px]">
        <p className="gf-caption text-iron">
          {HOME_BASE.airport} · {HOME_BASE.city}, {HOME_BASE.country}
        </p>
        <h1 className="gf-display mt-[30px] max-w-4xl">Departures, edited.</h1>
        <div className="mt-[30px] grid gap-[30px] border-t border-hairline pt-[30px] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-[72px]">
          <div className="gf-frame aspect-[16/10]">
            <img
              src={photo(PHOTO_IDS.aerialCoast, 1600, 1.6)}
              alt="Aerial view of an East African coastline"
              loading="eager"
            />
          </div>
          <div className="flex flex-col justify-between gap-[30px]">
            <p className="text-[20px] leading-[1.3] tracking-[-0.01em] text-black">
              Flights, stays and experiences on one page. The first total you see is the total you pay.
            </p>
            <div className="flex flex-wrap gap-[10px]">
              <GfButtonLink to="/flights">Search flights</GfButtonLink>
              <GfButtonLink to="/destinations" variant="secondary">
                Explore destinations
              </GfButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="gf-band">
        <div className="gf-shell gf-section">
          <SectionHead
            index="01 — This week"
            title="Fares out of Kigali"
            intro="Round trip, taxes included, refreshed weekly."
            action={<ArrowLink to="/deals">All deals</ArrowLink>}
          />
          <ul className="mt-[30px] grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {flightDeals.map((d) => (
              <li key={d.id} className="bg-white">
                <Link to="/flights" className="flex h-full flex-col justify-between gap-6 p-[30px] hover:bg-band">
                  <div>
                    <p className="gf-caption text-iron">{d.tag}</p>
                    <p className="gf-sub mt-4">
                      {d.from} → {d.to}
                    </p>
                    <p className="gf-nums gf-body mt-2 text-graphite">
                      {d.fromCode} — {d.toCode} · {d.dates}
                    </p>
                  </div>
                  <Price value={money(d.price)} suffix="round trip" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Destinations */}
      <section className="gf-shell gf-section">
        <SectionHead
          index="02 — Destinations"
          title="Where people go from here"
          action={<ArrowLink to="/destinations">All destinations</ArrowLink>}
        />
        <div className="mt-[30px] grid gap-[30px] md:grid-cols-3">
          {destinations.slice(0, 3).map((d, i) => (
            <Link
              key={d.slug}
              to="/destinations/$slug"
              params={{ slug: d.slug }}
              className="group block"
            >
              <div className={`gf-frame ${i === 0 ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
                <img src={photo(d.photoId, 900, 0.8)} alt={`${d.name}, ${d.country}`} loading="lazy" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
                <div>
                  <p className="gf-sub">{d.name}</p>
                  <p className="gf-body mt-1 text-graphite">{d.descriptor}</p>
                </div>
                <Price value={money(d.fromPrice)} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature */}
      <section className="border-y border-hairline bg-white">
        <div className="gf-shell gf-section grid gap-[30px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-[72px]">
          <div>
            <p className="gf-caption text-iron">03 — In focus</p>
            <h2 className="gf-heading mt-3">{feature.name}</h2>
            <p className="gf-body mt-4 max-w-md text-graphite">{feature.intro}</p>
            <dl className="mt-[30px] space-y-3 border-t border-hairline pt-[30px]">
              <div className="flex justify-between gap-4">
                <dt className="gf-caption text-iron">Nights</dt>
                <dd className="gf-body">{feature.nights}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="gf-caption text-iron">Best time</dt>
                <dd className="gf-body">{feature.bestTime}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="gf-caption text-iron">From</dt>
                <dd>
                  <Price value={money(feature.fromPrice)} />
                </dd>
              </div>
            </dl>
            <div className="mt-[30px]">
              <GfButtonLink to="/destinations/$slug" params={{ slug: feature.slug }}>
                Open {feature.name}
              </GfButtonLink>
            </div>
          </div>
          <div className="gf-frame aspect-[3/2]">
            <img src={photo(feature.photoId, 1400, 1.5)} alt={`${feature.name} coastline`} loading="lazy" />
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section className="gf-shell gf-section">
        <SectionHead
          index="04 — Stays"
          title="Places worth the night"
          action={<ArrowLink to="/hotels">All hotels</ArrowLink>}
        />
        <div className="mt-[30px] grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <Link key={h.slug} to="/hotels/$slug" params={{ slug: h.slug }} className="group block">
              <div className="gf-frame aspect-[3/2]">
                <img src={photo(h.photoId, 800, 1.5)} alt={h.name} loading="lazy" />
              </div>
              <div className="mt-4 border-t border-hairline pt-4">
                <Stars count={h.stars} />
                <p className="gf-sub mt-2">{h.name}</p>
                <p className="gf-body mt-1 text-graphite">
                  {h.destination}, {h.country}
                </p>
                <Price className="mt-3 block" value={money(h.nightly)} suffix="per night" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="gf-band">
        <div className="gf-shell gf-section">
          <SectionHead
            index="05 — Experiences"
            title="Days you book in advance"
            action={<ArrowLink to="/experiences">All experiences</ArrowLink>}
          />
          <div className="mt-[30px] grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
            {experiences.slice(0, 3).map((e) => (
              <Link key={e.slug} to="/experiences" className="group block">
                <div className="gf-frame aspect-[3/2]">
                  <img src={photo(e.photoId, 800, 1.5)} alt={e.name} loading="lazy" />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
                  <div>
                    <p className="gf-sub">{e.name}</p>
                    <p className="gf-body mt-1 text-graphite">
                      {e.place} · {e.duration}
                    </p>
                  </div>
                  <Price value={money(e.price)} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="gf-shell gf-section">
        <SectionHead index="06 — Reading" title="Notes from the route" />
        <ul className="mt-[30px] divide-y divide-hairline border-t border-hairline">
          {stories.map((s) => (
            <li key={s.slug}>
              <div className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-6 py-6">
                <div className="gf-frame aspect-square">
                  <img src={photo(s.photoId, 200, 1)} alt={s.title} loading="lazy" />
                </div>
                <div className="min-w-0">
                  <p className="gf-caption text-iron">{s.kicker}</p>
                  <p className="gf-sub mt-2 truncate">{s.title}</p>
                </div>
                <p className="gf-caption text-iron">{s.readTime}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials */}
      <section className="border-t border-hairline">
        <div className="gf-shell gf-section">
          <SectionHead index="07 — In their words" title="Why people come back" />
          <div className="mt-[30px] grid gap-[30px] md:grid-cols-3 md:gap-[72px]">
            {testimonials.map((t) => (
              <figure key={t.author}>
                <blockquote className="text-[20px] leading-[1.3] tracking-[-0.01em]">“{t.quote}”</blockquote>
                <figcaption className="gf-caption mt-6 text-iron">
                  {t.author} — {t.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
