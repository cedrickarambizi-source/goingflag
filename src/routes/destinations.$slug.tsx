import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Breadcrumbs,
  GfButtonLink,
  Price,
  SectionHead,
  Stars,
} from "@/components/gf/ui";
import {
  experiencesForDestination,
  getDestination,
  hotelsForDestination,
  money,
} from "@/lib/gf/data";
import { photo } from "@/lib/gf/photos";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => {
    const destination = getDestination(params.slug);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Destination not found — GoingFlag" }, { name: "robots", content: "noindex" }] };
    }
    const d = loaderData.destination;
    const title = `${d.name}, ${d.country} — GoingFlag`;
    const description = d.intro;
    const image = photo(d.photoId, 1600, 1.9);
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
  notFoundComponent: DestinationNotFound,
  component: DestinationDetail,
});

function DestinationNotFound() {
  return (
    <div className="gf-shell gf-section">
      <h1 className="gf-heading">We don’t fly there yet</h1>
      <p className="gf-body mt-4 text-graphite">That destination isn’t in the current edition.</p>
      <div className="mt-[30px]">
        <GfButtonLink to="/destinations">All destinations</GfButtonLink>
      </div>
    </div>
  );
}

function DestinationDetail() {
  const { destination: d } = Route.useLoaderData();
  const stays = hotelsForDestination(d.slug);
  const days = experiencesForDestination(d.name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: d.name,
            description: d.intro,
            image: photo(d.photoId, 1600, 1.9),
            address: { "@type": "PostalAddress", addressCountry: d.country },
          }),
        }}
      />

      <div className="gf-shell pt-[30px]">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: d.name }]}
        />
        <p className="gf-caption mt-[30px] text-iron">{d.region}</p>
        <h1 className="gf-display mt-3">{d.name}</h1>
        <p className="gf-body mt-4 max-w-xl text-graphite">{d.intro}</p>
      </div>

      <div className="gf-shell mt-[30px]">
        <div className="gf-frame aspect-[16/9]">
          <img src={photo(d.photoId, 1800, 1.78)} alt={`${d.name}, ${d.country}`} loading="eager" />
        </div>
      </div>

      <div className="gf-shell gf-section">
        <dl className="grid gap-px border-y border-hairline bg-hairline sm:grid-cols-4">
          {[
            { label: "Country", value: d.country },
            { label: "Fares from", value: money(d.fromPrice) },
            { label: "Stay length", value: d.nights },
            { label: "Best time", value: d.bestTime },
          ].map((row) => (
            <div key={row.label} className="bg-white py-[30px] sm:px-[30px] sm:first:pl-0">
              <dt className="gf-caption text-iron">{row.label}</dt>
              <dd className="gf-sub mt-3">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[30px] flex flex-wrap gap-[10px]">
          <GfButtonLink to="/flights">Flights to {d.name}</GfButtonLink>
          <GfButtonLink to="/hotels" variant="secondary">
            Stays in {d.name}
          </GfButtonLink>
        </div>
      </div>

      {stays.length > 0 ? (
        <section className="gf-band">
          <div className="gf-shell gf-section">
            <SectionHead title={`Where to stay in ${d.name}`} />
            <div className="mt-[30px] grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
              {stays.map((h) => (
                <Link key={h.slug} to="/hotels/$slug" params={{ slug: h.slug }} className="group block">
                  <div className="gf-frame aspect-[3/2]">
                    <img src={photo(h.photoId, 800, 1.5)} alt={h.name} loading="lazy" />
                  </div>
                  <div className="mt-4 border-t border-hairline pt-4">
                    <Stars count={h.stars} />
                    <p className="gf-sub mt-2">{h.name}</p>
                    <Price className="mt-2 block" value={money(h.nightly)} suffix="per night" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {days.length > 0 ? (
        <section className="gf-shell gf-section">
          <SectionHead title={`Things to do in ${d.name}`} />
          <ul className="mt-[30px] divide-y divide-hairline border-t border-hairline">
            {days.map((e) => (
              <li key={e.slug} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-6 py-6">
                <div>
                  <p className="gf-sub">{e.name}</p>
                  <p className="gf-body mt-1 text-graphite">
                    {e.descriptor} · {e.duration}
                  </p>
                </div>
                <Price value={money(e.price)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
