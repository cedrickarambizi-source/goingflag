/**
 * Homepage catalog — curated presentation data.
 *
 * Development content only. Shapes mirror what a real marketplace API would
 * return so suppliers can be connected later without touching the UI.
 */

import { PHOTO_IDS } from "./photos";

export type SearchTab = "stays" | "flights" | "cars" | "experiences" | "transfers";

export const SEARCH_TABS: { id: SearchTab; label: string }[] = [
  { id: "stays", label: "Stays" },
  { id: "flights", label: "Flights" },
  { id: "cars", label: "Cars" },
  { id: "experiences", label: "Experiences" },
  { id: "transfers", label: "Airport transfers" },
];

export const POPULAR_PLACES = [
  "Kigali, Rwanda",
  "Zanzibar, Tanzania",
  "Nairobi, Kenya",
  "Cape Town, South Africa",
  "Dubai, United Arab Emirates",
  "Lisbon, Portugal",
  "Istanbul, Türkiye",
  "Guangzhou, China",
];

export type DiscoveryCard = {
  slug: string;
  name: string;
  country: string;
  blurb: string;
  fromPrice: number;
  inventory: string;
  photoId: string;
};

export const DISCOVERY: DiscoveryCard[] = [
  {
    slug: "kigali",
    name: "Kigali",
    country: "Rwanda",
    blurb: "Hills, coffee and the calmest capital arrival in the region.",
    fromPrice: 78,
    inventory: "94 stays · 22 experiences",
    photoId: PHOTO_IDS.kigaliHills,
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    blurb: "The easy long connection, and a stopover worth three nights.",
    fromPrice: 132,
    inventory: "310 stays · 48 experiences",
    photoId: PHOTO_IDS.dubai,
  },
  {
    slug: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    blurb: "Reef water, spice roads and a stone city that keeps its own time.",
    fromPrice: 96,
    inventory: "128 stays · 30 experiences",
    photoId: PHOTO_IDS.zanzibarBeach,
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    blurb: "A city pinned between a table of rock and two oceans.",
    fromPrice: 104,
    inventory: "240 stays · 61 experiences",
    photoId: PHOTO_IDS.capeTown,
  },
  {
    slug: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    blurb: "A capital with a national park at its shoulder.",
    fromPrice: 71,
    inventory: "180 stays · 35 experiences",
    photoId: PHOTO_IDS.nairobiSkyline,
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    blurb: "Atlantic light, tiled facades and food that rewards walking.",
    fromPrice: 88,
    inventory: "265 stays · 40 experiences",
    photoId: PHOTO_IDS.lisbonRooftops,
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    blurb: "Courtyards behind unmarked doors, the Atlas on the horizon.",
    fromPrice: 82,
    inventory: "150 stays · 27 experiences",
    photoId: PHOTO_IDS.marrakech,
  },
  {
    slug: "guangzhou",
    name: "Guangzhou",
    country: "China",
    blurb: "Trade city energy, Cantonese kitchens and fast rail everywhere.",
    fromPrice: 69,
    inventory: "210 stays · 18 experiences",
    photoId: PHOTO_IDS.aircraftWing,
  },
];

export type PackageCard = {
  slug: string;
  title: string;
  copy: string;
  saving: string;
  photoId: string;
};

export const PACKAGES: PackageCard[] = [
  {
    slug: "stay-flight",
    title: "Stay + Flight",
    copy: "One itinerary, one total. Room and fare priced together with a single change window.",
    saving: "Typically bundled",
    photoId: PHOTO_IDS.aircraftWing,
  },
  {
    slug: "stay-transfer",
    title: "Stay + Airport transfer",
    copy: "Your driver is scheduled against your arrival time, not your booking time.",
    saving: "Meet & greet included",
    photoId: PHOTO_IDS.hotelLobby,
  },
  {
    slug: "hotel-car",
    title: "Hotel + Car",
    copy: "Keys at the property desk, fuel and insurance terms shown before you pay.",
    saving: "Unlimited mileage options",
    photoId: PHOTO_IDS.savannah,
  },
  {
    slug: "hotel-experience",
    title: "Hotel + Experience",
    copy: "Rooms paired with the guided days worth building the trip around.",
    saving: "Guided by locals",
    photoId: PHOTO_IDS.gorilla,
  },
  {
    slug: "complete-trip",
    title: "Complete trip",
    copy: "Hotel, airport pickup, experiences and ground transport — organised in one place.",
    saving: "Fully coordinated",
    photoId: PHOTO_IDS.aerialCoast,
  },
];

export const TRUST = [
  {
    title: "Verified properties",
    copy: "Every property is reviewed and verified before it appears here.",
  },
  {
    title: "Flexible booking",
    copy: "Flexible options designed around your plans, with terms shown up front.",
  },
  {
    title: "Local expertise",
    copy: "Discover destinations through the people who actually know them.",
  },
  {
    title: "24/7 support",
    copy: "Help whenever and wherever you need it, before and during the trip.",
  },
];

export const OFFERS = [
  {
    slug: "summer-escape",
    title: "Summer escape",
    copy: "Save up to 20% on selected stays when you book flexible dates.",
    photoId: PHOTO_IDS.hotelPool,
    cta: "See stays",
    to: "/hotels" as const,
  },
  {
    slug: "weekend-getaway",
    title: "Weekend getaway",
    copy: "Nearby destinations you can leave for on Friday, from $49 a night.",
    photoId: PHOTO_IDS.nairobiSkyline,
    cta: "Find a weekend",
    to: "/deals" as const,
  },
  {
    slug: "explore-rwanda",
    title: "Explore Rwanda",
    copy: "Trekking permits, lake days and city rides for your next adventure.",
    photoId: PHOTO_IDS.kigaliHills,
    cta: "Browse experiences",
    to: "/experiences" as const,
  },
];

export const AFRICA = [
  { name: "Rwanda", photoId: PHOTO_IDS.kigaliHills },
  { name: "Kenya", photoId: PHOTO_IDS.savannah },
  { name: "Tanzania", photoId: PHOTO_IDS.zanzibarDhow },
  { name: "Uganda", photoId: PHOTO_IDS.gorilla },
  { name: "South Africa", photoId: PHOTO_IDS.capeTown },
  { name: "Zanzibar", photoId: PHOTO_IDS.zanzibarBeach },
  { name: "Ethiopia", photoId: PHOTO_IDS.aerialCoast },
];

export const TRANSFER_FEATURES = [
  "Professional, vetted drivers",
  "Flight tracking on arrival",
  "Meet & greet at the terminal",
  "Fixed pricing, no surge",
  "24/7 support line",
];

export const RECOMMENDATION_GROUPS = [
  { label: "Popular with travellers heading to Kigali", slug: "kigali" },
  { label: "Trending this week", slug: "zanzibar" },
  { label: "Good for a weekend getaway", slug: "nairobi" },
];
