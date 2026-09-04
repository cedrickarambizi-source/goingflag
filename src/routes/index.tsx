import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroSearch } from "@/components/gf/HeroSearch";
import { ArrowLink, GfButtonLink, CheckoutLink, Price, SectionHead, Stars } from "@/components/gf/ui";
import {
  destinations,
  experiences,
  flightDeals,
  getDestination,
  hotels,
  money,
  testimonials,
  HOME_BASE,
} from "@/lib/gf/data";
import { AFRICA, DISCOVERY, OFFERS, PACKAGES, TRANSFER_FEATURES, TRUST } from "@/lib/gf/catalog";
import { photo, PHOTO_IDS } from "@/lib/gf/photos";
import heroVideo from "@/assets/goingflag-hero.mp4.asset.json";

const HERO = photo(PHOTO_IDS.aerialCoast, 1920, 1.6);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoingFlag — Flights, stays, experiences and transfers from Kigali" },
      {
        name: "description",
        content:
          "Search stays, flights, cars, experiences and airport transfers in one place. Real inventory, one honest total, taxes included.",
      },
      { property: "og:title", content: "GoingFlag — Travel booked properly" },
      {
        property: "og:description",
        content: "Stays, flights, experiences and transfers from Kigali, priced in full and booked in one pass.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO}
          aria-label="Aerial travel footage"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={heroVideo.url} type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.72),rgba(11,18,32,0.35)_45%,rgba(11,18,32,0.82))]"
        />
        <div className="gf-shell relative pb-10 pt-16 md:pb-16 md:pt-24">
          <p className="gf-caption text-white/70">
            {HOME_BASE.airport} · {HOME_BASE.city}, {HOME_BASE.country}
          </p>
          <h1 className="gf-display mt-5 max-w-3xl text-white">Travel, booked properly.</h1>
          <p className="mt-5 max-w-xl text-[20px] leading-[1.35] text-white/80">
            Stays, flights, cars, guided days and airport transfers on one page. The first total you see is the
            total you pay.
          </p>
          <div className="mt-8 md:mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="border-b border-line bg-white">
        <div className="gf-shell grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="rounded-2xl bg-sand p-5">
              <p className="gf-sub">{t.title}</p>
              <p className="gf-body mt-2 text-graphite">{t.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discovery */}
      <section className="gf-shell gf-section">
        <SectionHead
          index="Discover"
          title="Where travellers are going"
          intro="Live inventory across Africa, the Gulf and Europe."
          action={<ArrowLink to="/destinations">All destinations</ArrowLink>}
        />
        <div className="mt-[30px] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DISCOVERY.map((d) => {
            const known = getDestination(d.slug);
            const card = (
              <>
                <div className="gf-frame aspect-[4/5] rounded-2xl">
                  <img src={photo(d.photoId, 800, 0.8)} alt={`${d.name}, ${d.country}`} loading="lazy" />
                </div>
                <div className="mt-4">
                  <p className="gf-caption text-iron">{d.country}</p>
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <p className="gf-sub">{d.name}</p>
                    <Price value={money(d.fromPrice)} suffix="/ night" />
                  </div>
                  <p className="gf-body mt-2 text-graphite">{d.blurb}</p>
                  <p className="gf-caption mt-3 text-iron">{d.inventory}</p>
                </div>
              </>
            );
            return known ? (
              <Link key={d.slug} to="/destinations/$slug" params={{ slug: d.slug }} className="group block">
                {card}
              </Link>
            ) : (
              <Link key={d.slug} to="/destinations" className="group block">
                {card}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured stays */}
      <section className="bg-sand">
        <div className="gf-shell gf-section">
          <SectionHead
            index="Stays"
            title="Properties worth the night"
            intro="Verified, photographed as they are, bookable in one pass."
            action={<ArrowLink to="/hotels">All stays</ArrowLink>}
          />
          <div className="mt-[30px] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {hotels.slice(0, 8).map((h) => (
              <article key={h.slug} className="gf-shadow flex flex-col rounded-2xl bg-white p-3">
                <Link to="/hotels/$slug" params={{ slug: h.slug }} className="group block">
                  <div className="gf-frame aspect-[4/3] rounded-xl">
                    <img src={photo(h.photoId, 800, 1.33)} alt={h.name} loading="lazy" />
                  </div>
                </Link>
                <div className="mt-4 flex flex-1 flex-col px-1 pb-1">
                  <Stars count={h.stars} />
                  <Link to="/hotels/$slug" params={{ slug: h.slug }} className="gf-sub mt-2 hover:underline">
                    {h.name}
                  </Link>
                  <p className="gf-body mt-1 text-graphite">
                    {h.destination}, {h.country}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <Price value={money(h.nightly)} suffix="/ night" />
                    <CheckoutLink
                      draft={{
                        kind: "stay",
                        slug: h.slug,
                        title: h.name,
                        location: `${h.destination}, ${h.country}`,
                        image: photo(h.photoId, 800, 1.33),
                        price: h.nightly,
                        unit: "night",
                        travellers: 2,
                        quantity: 2,
                      }}
                      className="px-5 py-[10px]"
                    >
                      Reserve
                    </CheckoutLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="gf-shell gf-section">
        <SectionHead
          index="Packages"
          title="Combine and pay once"
          intro="Bundles built for how trips actually run."
        />
        <div className="gf-scroll-x mt-[30px] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
          {PACKAGES.map((p) => (
            <article
              key={p.slug}
              className="w-[280px] overflow-hidden rounded-2xl border border-line bg-white md:w-auto"
            >
              <div className="gf-frame aspect-[16/10]">
                <img src={photo(p.photoId, 800, 1.6)} alt={p.title} loading="lazy" />
              </div>
              <div className="p-5">
                <p className="gf-caption text-emerald">{p.saving}</p>
                <p className="gf-sub mt-2">{p.title}</p>
                <p className="gf-body mt-2 text-graphite">{p.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Fares */}
      <section className="border-y border-line bg-white">
        <div className="gf-shell gf-section">
          <SectionHead
            index="Flights"
            title="Fares out of Kigali"
            intro="Round trip, taxes included, refreshed weekly."
            action={<ArrowLink to="/deals">All deals</ArrowLink>}
          />
          <ul className="mt-[30px] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flightDeals.slice(0, 6).map((d) => (
              <li key={d.id}>
                <Link
                  to="/flights"
                  className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-sand p-5 transition-colors hover:bg-sand-deep"
                >
                  <div>
                    <p className="gf-caption text-emerald">{d.tag}</p>
                    <p className="gf-sub mt-3">
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

      {/* Experiences */}
      <section className="gf-shell gf-section">
        <SectionHead
          index="Experiences"
          title="Days worth planning around"
          action={<ArrowLink to="/experiences">All experiences</ArrowLink>}
        />
        <div className="mt-[30px] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.slice(0, 6).map((e) => (
            <article key={e.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="gf-frame aspect-[3/2]">
                <img src={photo(e.photoId, 800, 1.5)} alt={e.name} loading="lazy" />
              </div>
              <div className="p-5">
                <p className="gf-caption text-iron">
                  {e.place}, {e.country}
                </p>
                <p className="gf-sub mt-2">{e.name}</p>
                <p className="gf-body mt-1 text-graphite">
                  {e.descriptor} · {e.duration}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <Price value={money(e.price)} suffix="per person" />
                  <CheckoutLink
                    variant="secondary"
                    draft={{
                      kind: "experience",
                      slug: e.slug,
                      title: e.name,
                      location: `${e.place}, ${e.country}`,
                      image: photo(e.photoId, 800, 1.5),
                      price: e.price,
                      unit: "person",
                      travellers: 2,
                      quantity: 2,
                    }}
                    className="px-5 py-[10px]"
                  >
                    Book
                  </CheckoutLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Transfers */}
      <section className="bg-ink">
        <div className="gf-shell gf-section grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-[72px]">
          <div>
            <p className="gf-caption text-white/60">Airport transfers</p>
            <h2 className="gf-heading mt-3 text-white">Met at arrivals, priced before you land</h2>
            <ul className="mt-6 space-y-3">
              {TRANSFER_FEATURES.map((f) => (
                <li key={f} className="gf-body text-white/75">
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CheckoutLink
                draft={{
                  kind: "transfer",
                  slug: "kgl-airport-transfer",
                  title: "Kigali airport transfer",
                  location: "Kigali International Airport",
                  image: photo(PHOTO_IDS.kigaliHills, 800, 1.5),
                  price: 28,
                  unit: "vehicle",
                  travellers: 2,
                  quantity: 1,
                }}
                className="border-white bg-white text-ink hover:bg-sand"
              >
                Book a transfer — from $28
              </CheckoutLink>
            </div>
          </div>
          <div className="gf-frame aspect-[3/2] rounded-3xl">
            <img
              src={photo(PHOTO_IDS.kigaliHills, 1200, 1.5)}
              alt="Road descending through the hills of Kigali"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="gf-shell gf-section">
        <SectionHead index="Offers" title="Current offers" intro="No countdown timers. Terms stated plainly." />
        <div className="mt-[30px] grid gap-5 md:grid-cols-3">
          {OFFERS.map((o) => (
            <Link key={o.slug} to={o.to} className="group block overflow-hidden rounded-2xl bg-sand">
              <div className="gf-frame aspect-[16/10]">
                <img src={photo(o.photoId, 800, 1.6)} alt={o.title} loading="lazy" />
              </div>
              <div className="p-5">
                <p className="gf-sub">{o.title}</p>
                <p className="gf-body mt-2 text-graphite">{o.copy}</p>
                <p className="gf-caption mt-4 text-emerald">{o.cta} →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Africa rail */}
      <section className="border-t border-line bg-white">
        <div className="gf-shell gf-section">
          <SectionHead index="Africa" title="Close to home" action={<ArrowLink to="/destinations">Browse</ArrowLink>} />
          <div className="gf-scroll-x mt-[30px]">
            {AFRICA.map((a) => (
              <Link key={a.name} to="/destinations" className="group w-[200px]">
                <div className="gf-frame aspect-square rounded-2xl">
                  <img src={photo(a.photoId, 500, 1)} alt={a.name} loading="lazy" />
                </div>
                <p className="gf-sub mt-3">{a.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="gf-shell gf-section">
        <SectionHead index="For you" title="Recommended next" />
        <div className="mt-[30px] grid gap-5 md:grid-cols-3">
          {destinations.slice(0, 3).map((d) => (
            <Link
              key={d.slug}
              to="/destinations/$slug"
              params={{ slug: d.slug }}
              className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-line bg-white p-3"
            >
              <div className="gf-frame aspect-square rounded-xl">
                <img src={photo(d.photoId, 300, 1)} alt={d.name} loading="lazy" />
              </div>
              <div className="min-w-0">
                <p className="gf-caption text-iron">{d.region}</p>
                <p className="gf-sub mt-1 truncate">{d.name}</p>
                <Price className="mt-1 block" value={money(d.fromPrice)} suffix="from" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-sand">
        <div className="gf-shell gf-section">
          <SectionHead index="Reviews" title="Why people come back" />
          <div className="mt-[30px] grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.author} className="rounded-2xl bg-white p-6">
                <blockquote className="text-[20px] leading-[1.3] tracking-[-0.01em]">“{t.quote}”</blockquote>
                <figcaption className="gf-caption mt-5 text-iron">
                  {t.author} · {t.place}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
