import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs, GfButtonLink, Price, SectionHead } from "@/components/gf/ui";
import { experiences, money } from "@/lib/gf/data";
import { photo } from "@/lib/gf/photos";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: [
      { title: "Experiences — GoingFlag" },
      {
        name: "description",
        content:
          "Guided walks, dawn game drives, dhow days and gorilla permits — bookable alongside your flight and stay.",
      },
      { property: "og:title", content: "Experiences — GoingFlag" },
      {
        property: "og:description",
        content: "Guided days and permits, bookable alongside your flight and stay.",
      },
    ],
  }),
  component: Experiences,
});

function Experiences() {
  return (
    <div className="gf-shell gf-section">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Experiences" }]} />
      <div className="mt-[30px]">
        <SectionHead
          index={`${experiences.length} experiences`}
          title="Experiences"
          intro="Prices are per person. Permits, guides and transfers included where stated."
        />
      </div>

      <div className="mt-[30px] grid gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((e) => (
          <article key={e.slug}>
            <div className="gf-frame aspect-[4/3]">
              <img src={photo(e.photoId, 800, 1.33)} alt={e.name} loading="lazy" />
            </div>
            <div className="mt-4 border-t border-hairline pt-4">
              <p className="gf-caption text-iron">
                {e.place}, {e.country}
              </p>
              <h2 className="gf-sub mt-2">{e.name}</h2>
              <p className="gf-body mt-1 text-graphite">
                {e.descriptor} · {e.duration}
              </p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <Price value={money(e.price)} suffix="per person" />
                <GfButtonLink
                  to="/checkout"
                  variant="secondary"
                  search={{
                    kind: "experience",
                    slug: e.slug,
                    title: e.name,
                    location: `${e.place}, ${e.country}`,
                    image: photo(e.photoId, 800, 1.33),
                    price: e.price,
                    unit: "person",
                    travellers: 2,
                    quantity: 2,
                  }}
                >
                  Book
                </GfButtonLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
