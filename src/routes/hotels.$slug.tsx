import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs, GfButtonLink, Price, SectionHead, Stars } from "@/components/gf/ui";
import { getHotel, money } from "@/lib/gf/data";
import { photo } from "@/lib/gf/photos";

export const Route = createFileRoute("/hotels/$slug")({
  loader: ({ params }) => {
    const hotel = getHotel(params.slug);
    if (!hotel) throw notFound();
    return { hotel };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Hotel not found — GoingFlag" }, { name: "robots", content: "noindex" }] };
    }
    const h = loaderData.hotel;
    const title = `${h.name}, ${h.destination} — GoingFlag`;
    const description = h.intro;
    const image = photo(h.photoId, 1600, 1.9);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
      ],
    };
  },
  notFoundComponent: HotelNotFound,
  component: HotelDetail,
});

function HotelNotFound() {
  return (
    <div className="gf-shell gf-section">
      <h1 className="gf-heading">That property isn’t listed</h1>
      <p className="gf-body mt-4 text-graphite">It may have left the collection.</p>
      <div className="mt-[30px]">
        <GfButtonLink to="/hotels">All hotels</GfButtonLink>
      </div>
    </div>
  );
}

function HotelDetail() {
  const { hotel: h } = Route.useLoaderData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Hotel",
            name: h.name,
            description: h.intro,
            starRating: { "@type": "Rating", ratingValue: h.stars },
            image: photo(h.photoId, 1600, 1.9),
            address: {
              "@type": "PostalAddress",
              addressLocality: h.destination,
              addressCountry: h.country,
            },
            priceRange: money(h.nightly),
          }),
        }}
      />

      <div className="gf-shell pt-[30px]">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Hotels", to: "/hotels" }, { label: h.name }]}
        />
        <div className="mt-[30px] flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-[30px]">
          <div>
            <Stars count={h.stars} />
            <h1 className="gf-heading mt-3">{h.name}</h1>
            <p className="gf-body mt-3 text-graphite">
              {h.descriptor} · {h.destination}, {h.country}
            </p>
          </div>
          <div className="text-right">
            <Price value={money(h.nightly)} className="text-[20px]" />
            <p className="gf-caption mt-2 text-iron">From, per night</p>
          </div>
        </div>
      </div>

      <div className="gf-shell mt-[30px] grid gap-[10px] md:grid-cols-4">
        {h.gallery.map((id, i) => (
          <div
            key={id}
            className={`gf-frame ${i === 0 ? "aspect-[16/10] md:col-span-4" : "aspect-[4/3]"}`}
          >
            <img
              src={photo(id, i === 0 ? 1800 : 700, i === 0 ? 1.6 : 1.33)}
              alt={`${h.name} — view ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <div className="gf-shell gf-section grid gap-[30px] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-[72px]">
        <div>
          <p className="text-[20px] leading-[1.3] tracking-[-0.01em]">{h.intro}</p>

          <section className="mt-[72px]">
            <SectionHead title="Rooms" />
            <ul className="divide-y divide-hairline">
              {h.rooms.map((r) => (
                <li key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 py-6">
                  <div>
                    <p className="gf-sub">{r.name}</p>
                    <p className="gf-body mt-1 text-graphite">
                      {r.size} · {r.occupancy}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <Price value={money(r.price)} />
                    <GfButtonLink
                      to="/checkout"
                      search={{
                        kind: "stay",
                        slug: `${h.slug}--${r.name.toLowerCase().replace(/\s+/g, "-")}`,
                        title: `${h.name} — ${r.name}`,
                        location: `${h.destination}, ${h.country}`,
                        image: photo(h.photoId, 800, 1.33),
                        price: r.price,
                        unit: "night",
                        travellers: 2,
                        quantity: 2,
                      }}
                    >
                      Reserve
                    </GfButtonLink>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-[72px]">
            <SectionHead title="Guest notes" />
            <ul className="divide-y divide-hairline">
              {h.reviews.map((r) => (
                <li key={r.author} className="py-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="gf-sub">{r.author}</p>
                    <p className="gf-caption text-iron">{r.date}</p>
                  </div>
                  <Stars count={r.score} />
                  <p className="gf-body mt-3 text-graphite">{r.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="md:border-l md:border-hairline md:pl-[30px]">
          <p className="gf-caption text-iron">Amenities</p>
          <ul className="mt-4 space-y-2">
            {h.amenities.map((a) => (
              <li key={a} className="gf-body text-graphite">
                {a}
              </li>
            ))}
          </ul>

          <p className="gf-caption mt-[72px] text-iron">Policies</p>
          <dl className="mt-4 space-y-3">
            {h.policies.map((p) => (
              <div key={p.label}>
                <dt className="gf-body">{p.label}</dt>
                <dd className="gf-body text-graphite">{p.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </>
  );
}
