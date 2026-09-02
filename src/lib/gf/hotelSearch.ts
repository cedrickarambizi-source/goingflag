import { hotels, type Hotel } from "./data";

/**
 * Deterministic derived search metadata for the stays results page.
 * Values are stable per property (hashed from the slug), never random per render.
 */

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick<T>(seed: number, list: readonly T[]): T {
  return list[seed % list.length] as T;
}

export type PropertyType = "Hotel" | "Resort" | "Villa" | "Apartment" | "Boutique" | "Lodge";

export const PROPERTY_TYPES: PropertyType[] = [
  "Hotel",
  "Resort",
  "Villa",
  "Apartment",
  "Boutique",
  "Lodge",
];

export const POPULAR_FILTERS = [
  "Free cancellation",
  "Breakfast included",
  "Pool",
  "Spa",
  "Airport transfer",
  "Family friendly",
] as const;

export type PopularFilter = (typeof POPULAR_FILTERS)[number];

export type StayResult = {
  hotel: Hotel;
  score: number;
  scoreLabel: string;
  reviews: number;
  locationScore: number;
  distanceKm: number;
  propertyType: PropertyType;
  wasNightly: number;
  discountPct: number;
  freeCancellation: number | null;
  bookedToday: number;
  roomsLeft: number | null
  ;
  promoted: boolean;
  highlights: string[];
  perks: PopularFilter[];
  neighbourhood: string;
};

function scoreLabel(score: number) {
  if (score >= 9) return "Exceptional";
  if (score >= 8.5) return "Excellent";
  if (score >= 8) return "Very good";
  return "Good";
}

function perksFor(h: Hotel, seed: number): PopularFilter[] {
  const amenities = h.amenities.join(" ").toLowerCase();
  const perks = new Set<PopularFilter>();
  if (amenities.includes("pool")) perks.add("Pool");
  if (amenities.includes("spa")) perks.add("Spa");
  if (amenities.includes("transfer")) perks.add("Airport transfer");
  if (amenities.includes("kids") || amenities.includes("family")) perks.add("Family friendly");
  if (amenities.includes("breakfast") || seed % 3 === 0) perks.add("Breakfast included");
  if (h.policies.some((p) => p.value.toLowerCase().includes("free")) || seed % 2 === 0) {
    perks.add("Free cancellation");
  }
  return Array.from(perks);
}

export function buildResult(hotel: Hotel): StayResult {
  const seed = hash(hotel.slug);
  const score = Math.round((78 + (seed % 20) + hotel.stars * 2) * 10) / 100;
  const clamped = Math.min(9.7, Math.max(7.8, score));
  const discountPct = 12 + (seed % 48);
  const wasNightly = Math.round(hotel.nightly / (1 - discountPct / 100));
  const perks = perksFor(hotel, seed);

  return {
    hotel,
    score: clamped,
    scoreLabel: scoreLabel(clamped),
    reviews: 480 + (seed % 11000),
    locationScore: Math.min(9.8, Math.max(8, Math.round((clamped + ((seed % 7) - 3) / 10) * 10) / 10)),
    distanceKm: Math.round(((seed % 180) / 10 + 0.4) * 10) / 10,
    propertyType: pick(seed >> 3, PROPERTY_TYPES),
    wasNightly,
    discountPct,
    freeCancellation: perks.includes("Free cancellation") ? 1 : null,
    bookedToday: 4 + (seed % 26),
    roomsLeft: seed % 4 === 0 ? 1 + (seed % 3) : null,
    promoted: seed % 5 === 0,
    highlights: hotel.amenities.slice(0, 3),
    perks,
    neighbourhood: `${hotel.descriptor} · ${hotel.destination}`,
  };
}

export const stayResults: StayResult[] = hotels.map(buildResult);

export const SORTS = [
  { id: "best", label: "Best match" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "score", label: "Guest rating" },
  { id: "stars", label: "Star rating" },
  { id: "discount", label: "Biggest discount" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export function sortResults(list: StayResult[], sort: SortId) {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.hotel.nightly - b.hotel.nightly);
    case "price-desc":
      return copy.sort((a, b) => b.hotel.nightly - a.hotel.nightly);
    case "score":
      return copy.sort((a, b) => b.score - a.score);
    case "stars":
      return copy.sort((a, b) => b.hotel.stars - a.hotel.stars);
    case "discount":
      return copy.sort((a, b) => b.discountPct - a.discountPct);
    default:
      return copy.sort(
        (a, b) => b.score + (b.promoted ? 0.4 : 0) - (a.score + (a.promoted ? 0.4 : 0)),
      );
  }
}
