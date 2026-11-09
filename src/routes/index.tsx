import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroSearch } from "@/components/gf/HeroSearch";
import { ArrowLink, GfButtonLink, SectionHead } from "@/components/gf/ui";
import { HomeStays } from "@/components/gf/HomeStays";
import kigaliPhoto from "@/assets/kigali.jpg.asset.json";
import { HOME_BASE } from "@/lib/gf/data";
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
          "Explore Kigali and search hotel supplier rooms, prices and cancellation terms with GoingFlag.",
      },
      { property: "og:title", content: "GoingFlag — Travel booked properly" },
      {
        property: "og:description",
        content: "Explore Kigali and compare hotel supplier rooms, prices and cancellation terms.",
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
          <h1 className="gf-display mt-5 max-w-3xl text-white">GoingFlag Travel</h1>
          <p className="mt-5 max-w-xl text-[20px] leading-[1.35] text-white/80">
            Find your next stay. Explore hotel rooms, supplier prices and cancellation terms for your travel dates.
          </p>
          <div className="mt-8 md:mt-10">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Featured stays */}
      <section className="bg-sand">
        <div className="gf-shell gf-section">
          <SectionHead
            index="Stays"
            title="Find your stay in Kigali"
            intro="Rooms, prices and property photos from our hotel supplier."
            action={<ArrowLink to="/hotels">All stays</ArrowLink>}
          />
          <HomeStays />
        </div>
      </section>

      <section className="gf-shell gf-section">
        <SectionHead index="Rwanda" title="Explore Kigali" action={<ArrowLink to="/hotels" search={{ destination: "Kigali" }}>Find stays</ArrowLink>} />
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
          <figure className="min-w-0">
            <img src={kigaliPhoto.url} alt="Kigali city street and skyline photographed by Emmanuel Kwizera" loading="lazy" className="aspect-[3/2] w-full rounded-lg object-cover" />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              <a href="https://commons.wikimedia.org/wiki/File:High_Angle_View_Of_Kigali_City_Street_on_November_29,_2018._Emmanuel_Kwizera.jpg" target="_blank" rel="noreferrer" className="underline">Emmanuel Kwizera · Wikimedia Commons</a>
              {" · "}<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline">CC BY-SA 4.0</a>{" · Cropped for display"}
            </figcaption>
          </figure>
          <div><p className="gf-caption text-emerald">Kigali · Rwanda</p><h3 className="gf-heading mt-4">A city in the hills</h3><p className="mt-5 text-lg leading-relaxed text-muted-foreground">Rwanda’s capital brings together hilltop neighbourhoods, local markets and the Kigali Convention Centre. Discover stays across the city for your next visit.</p><GfButtonLink to="/hotels" search={{ destination: "Kigali" }} className="mt-6">Explore Kigali stays</GfButtonLink></div>
        </div>
      </section>

      {/* Account */}
      <section className="gf-shell gf-section">
        <SectionHead index="Account" title="Your account, your travel" />
        <div className="mt-[30px] flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-sand p-6">
          <div>
            <p className="gf-sub text-[22px]">All your trip details in one place</p>
            <p className="gf-body mt-2 text-graphite">
              Keep your GoingFlag reservation details together and manage your account.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <GfButtonLink to="/signin" className="px-5 py-[10px]">
                Sign in
              </GfButtonLink>
              <ArrowLink to="/trips">View my trips</ArrowLink>
            </div>
          </div>
          <div className="gf-frame h-[120px] w-[180px] rounded-xl">
            <img src={kigaliPhoto.url} alt="Kigali city street" loading="lazy" />
          </div>
        </div>
      </section>




    </>
  );
}
