/**
 * MOCK DATA — development inventory only.
 *
 * This module is the single mock provider surface. It intentionally mirrors the
 * shape a real FlightProvider / HotelProvider / ExperienceProvider adapter would
 * return, so production suppliers can be swapped in without touching the UI.
 * Nothing here should be presented to users as live availability.
 */

import { PHOTO_IDS } from "./photos";

export const HOME_BASE = {
  city: "Kigali",
  country: "Rwanda",
  district: "Remera, Gisimenti",
  airport: "KGL",
};

export type Region = "Africa" | "Europe" | "Asia" | "Middle East" | "Americas";

export type Destination = {
  slug: string;
  name: string;
  country: string;
  region: Region;
  photoId: string;
  fromPrice: number;
  window: string;
  descriptor: string;
  intro: string;
  nights: string;
  bestTime: string;
};

export const destinations: Destination[] = [
  {
    slug: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    region: "Africa",
    photoId: PHOTO_IDS.zanzibarBeach,
    fromPrice: 320,
    window: "NOV 20 — NOV 27",
    descriptor: "Indian Ocean archipelago",
    intro:
      "Reef water, spice roads and a stone city that keeps its own time. Two hours from Kigali, a different century.",
    nights: "5 — 9 nights",
    bestTime: "June — October, December — February",
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    photoId: PHOTO_IDS.lisbonTram,
    fromPrice: 389,
    window: "NOV 04 — NOV 11",
    descriptor: "Atlantic capital",
    intro:
      "Tiled facades, cold Atlantic light and a food culture that rewards walking. The most forgiving European city to arrive in tired.",
    nights: "4 — 7 nights",
    bestTime: "March — June, September — October",
  },
  {
    slug: "nairobi",
    name: "Nairobi",
    country: "Kenya",
    region: "Africa",
    photoId: PHOTO_IDS.nairobiSkyline,
    fromPrice: 112,
    window: "OCT 12 — OCT 15",
    descriptor: "Weekend distance",
    intro:
      "A capital with a national park at its shoulder. Close enough to leave on Friday evening and be back for Monday.",
    nights: "2 — 4 nights",
    bestTime: "Year round",
  },
  {
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    photoId: PHOTO_IDS.capeTown,
    fromPrice: 465,
    window: "DEC 02 — DEC 12",
    descriptor: "Mountain and sea",
    intro:
      "A city pinned between a table of rock and two oceans. Wine country an hour inland, cold water beaches at the edge.",
    nights: "6 — 10 nights",
    bestTime: "November — March",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    photoId: PHOTO_IDS.marrakech,
    fromPrice: 512,
    window: "MAR 08 — MAR 15",
    descriptor: "Medina and Atlas",
    intro:
      "Courtyards behind unmarked doors, the Atlas on the horizon, and the most concentrated craft economy on the continent.",
    nights: "4 — 7 nights",
    bestTime: "March — May, September — November",
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    photoId: PHOTO_IDS.dubai,
    fromPrice: 398,
    window: "JAN 15 — JAN 21",
    descriptor: "Transit and stay",
    intro:
      "The easiest long connection out of Kigali, and a city worth the stopover if you give it three nights.",
    nights: "3 — 5 nights",
    bestTime: "November — March",
  },
];

export type FlightDeal = {
  id: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  dates: string;
  price: number;
  tag: string;
};

export const flightDeals: FlightDeal[] = [
  {
    id: "d1",
    from: "Kigali",
    to: "Lisbon",
    fromCode: "KGL",
    toCode: "LIS",
    dates: "04 NOV — 11 NOV",
    price: 389,
    tag: "1 stop",
  },
  {
    id: "d2",
    from: "Kigali",
    to: "Nairobi",
    fromCode: "KGL",
    toCode: "NBO",
    dates: "12 OCT — 15 OCT",
    price: 112,
    tag: "Nonstop",
  },
  {
    id: "d3",
    from: "Kigali",
    to: "Zanzibar",
    fromCode: "KGL",
    toCode: "ZNZ",
    dates: "20 NOV — 27 NOV",
    price: 320,
    tag: "1 stop",
  },
  {
    id: "d4",
    from: "Kigali",
    to: "Dubai",
    fromCode: "KGL",
    toCode: "DXB",
    dates: "15 JAN — 21 JAN",
    price: 398,
    tag: "Nonstop",
  },
  {
    id: "d5",
    from: "Kigali",
    to: "Cape Town",
    fromCode: "KGL",
    toCode: "CPT",
    dates: "02 DEC — 12 DEC",
    price: 465,
    tag: "1 stop",
  },
  {
    id: "d6",
    from: "Kigali",
    to: "Johannesburg",
    fromCode: "KGL",
    toCode: "JNB",
    dates: "08 DEC — 14 DEC",
    price: 341,
    tag: "Nonstop",
  },
];

export type FlightOffer = {
  id: string;
  airline: string;
  fromCode: string;
  toCode: string;
  date: string;
  depart: string;
  arrive: string;
  duration: string;
  durationMins: number;
  stops: number;
  price: number;
  cabin: string;
  baggage: string;
  refundable: boolean;
};

export const flightOffers: FlightOffer[] = [
  {
    id: "f1",
    airline: "RwandAir",
    fromCode: "KGL",
    toCode: "ZNZ",
    date: "20 NOV",
    depart: "07:20",
    arrive: "11:05",
    duration: "3h 45m",
    durationMins: 225,
    stops: 1,
    price: 320,
    cabin: "Economy",
    baggage: "23kg checked",
    refundable: false,
  },
  {
    id: "f2",
    airline: "Kenya Airways",
    fromCode: "KGL",
    toCode: "ZNZ",
    date: "20 NOV",
    depart: "10:40",
    arrive: "16:25",
    duration: "5h 45m",
    durationMins: 345,
    stops: 1,
    price: 298,
    cabin: "Economy",
    baggage: "23kg checked",
    refundable: true,
  },
  {
    id: "f3",
    airline: "Ethiopian Airlines",
    fromCode: "KGL",
    toCode: "LIS",
    date: "04 NOV",
    depart: "08:30",
    arrive: "18:40",
    duration: "12h 10m",
    durationMins: 730,
    stops: 1,
    price: 389,
    cabin: "Economy",
    baggage: "2 × 23kg checked",
    refundable: false,
  },
  {
    id: "f4",
    airline: "RwandAir",
    fromCode: "KGL",
    toCode: "LIS",
    date: "04 NOV",
    depart: "09:10",
    arrive: "19:15",
    duration: "12h 05m",
    durationMins: 725,
    stops: 1,
    price: 421,
    cabin: "Economy",
    baggage: "23kg checked",
    refundable: true,
  },
  {
    id: "f5",
    airline: "Qatar Airways",
    fromCode: "KGL",
    toCode: "LIS",
    date: "04 NOV",
    depart: "14:05",
    arrive: "09:50",
    duration: "17h 45m",
    durationMins: 1065,
    stops: 1,
    price: 604,
    cabin: "Economy",
    baggage: "2 × 25kg checked",
    refundable: true,
  },
  {
    id: "f6",
    airline: "RwandAir",
    fromCode: "KGL",
    toCode: "NBO",
    date: "12 OCT",
    depart: "06:45",
    arrive: "08:35",
    duration: "1h 50m",
    durationMins: 110,
    stops: 0,
    price: 112,
    cabin: "Economy",
    baggage: "Cabin only",
    refundable: false,
  },
  {
    id: "f7",
    airline: "Kenya Airways",
    fromCode: "KGL",
    toCode: "NBO",
    date: "12 OCT",
    depart: "13:15",
    arrive: "15:05",
    duration: "1h 50m",
    durationMins: 110,
    stops: 0,
    price: 148,
    cabin: "Economy",
    baggage: "23kg checked",
    refundable: true,
  },
  {
    id: "f8",
    airline: "Emirates",
    fromCode: "KGL",
    toCode: "DXB",
    date: "15 JAN",
    depart: "16:30",
    arrive: "23:55",
    duration: "6h 25m",
    durationMins: 385,
    stops: 0,
    price: 398,
    cabin: "Economy",
    baggage: "30kg checked",
    refundable: false,
  },
  {
    id: "f9",
    airline: "Turkish Airlines",
    fromCode: "KGL",
    toCode: "DXB",
    date: "15 JAN",
    depart: "22:10",
    arrive: "14:40",
    duration: "13h 30m",
    durationMins: 810,
    stops: 1,
    price: 512,
    cabin: "Economy",
    baggage: "23kg checked",
    refundable: true,
  },
  {
    id: "f10",
    airline: "South African Airways",
    fromCode: "KGL",
    toCode: "CPT",
    date: "02 DEC",
    depart: "11:20",
    arrive: "20:05",
    duration: "8h 45m",
    durationMins: 525,
    stops: 1,
    price: 465,
    cabin: "Economy",
    baggage: "23kg checked",
    refundable: false,
  },
];

export type Hotel = {
  slug: string;
  name: string;
  destination: string;
  destinationSlug: string;
  country: string;
  stars: number;
  nightly: number;
  descriptor: string;
  photoId: string;
  gallery: string[];
  intro: string;
  amenities: string[];
  policies: { label: string; value: string }[];
  rooms: { name: string; size: string; occupancy: string; price: number }[];
  reviews: { author: string; date: string; body: string; score: number }[];
};

export const hotels: Hotel[] = [
  {
    slug: "the-residence-zanzibar",
    name: "The Residence Zanzibar",
    destination: "Zanzibar",
    destinationSlug: "zanzibar",
    country: "Tanzania",
    stars: 5,
    nightly: 210,
    descriptor: "Beachfront",
    photoId: PHOTO_IDS.hotelPool,
    gallery: [PHOTO_IDS.hotelPool, PHOTO_IDS.hotelRoom, PHOTO_IDS.hotelTerrace, PHOTO_IDS.zanzibarDhow],
    intro:
      "Thirty-two hectares on the south-west coast, a private stretch of reef water, and villas spaced far enough apart that you never hear the next one.",
    amenities: [
      "Private beach",
      "Two restaurants",
      "Spa",
      "Dive centre",
      "Airport transfer",
      "Pool villa option",
      "Kids club",
      "Wi-Fi throughout",
    ],
    policies: [
      { label: "Check in", value: "14:00" },
      { label: "Check out", value: "11:00" },
      { label: "Cancellation", value: "Free until 14 days before arrival" },
      { label: "Children", value: "Under 12 stay free with two adults" },
    ],
    rooms: [
      { name: "Garden Pool Villa", size: "150 m²", occupancy: "2 guests", price: 210 },
      { name: "Ocean Front Villa", size: "180 m²", occupancy: "2 guests", price: 340 },
      { name: "Two Bedroom Villa", size: "260 m²", occupancy: "4 guests", price: 520 },
    ],
    reviews: [
      {
        author: "Aline M.",
        date: "MAR 2026",
        body: "Quiet in the way you hope for and rarely get. The transfer from ZNZ was already arranged when we landed.",
        score: 5,
      },
      {
        author: "Daniel K.",
        date: "FEB 2026",
        body: "Villa was enormous. Reef swimming depends on the tide — ask for the tide table at reception.",
        score: 4,
      },
    ],
  },
  {
    slug: "emin-pasha-kigali",
    name: "Emin Pasha Kigali",
    destination: "Kigali",
    destinationSlug: "kigali",
    country: "Rwanda",
    stars: 4,
    nightly: 165,
    descriptor: "City garden",
    photoId: PHOTO_IDS.hotelLobby,
    gallery: [PHOTO_IDS.hotelLobby, PHOTO_IDS.hotelRoom, PHOTO_IDS.kigaliHills],
    intro:
      "A walled garden ten minutes from Remera, built for people who arrive late and leave early.",
    amenities: ["Garden restaurant", "Pool", "Airport transfer", "Workspace", "Laundry", "Wi-Fi"],
    policies: [
      { label: "Check in", value: "13:00" },
      { label: "Check out", value: "11:00" },
      { label: "Cancellation", value: "Free until 48 hours before arrival" },
      { label: "Children", value: "All ages welcome" },
    ],
    rooms: [
      { name: "Garden Room", size: "38 m²", occupancy: "2 guests", price: 165 },
      { name: "Terrace Suite", size: "56 m²", occupancy: "3 guests", price: 245 },
    ],
    reviews: [
      {
        author: "Sandrine U.",
        date: "APR 2026",
        body: "Fifteen minutes from Gisimenti by car. Breakfast starts at six, which matters for early flights.",
        score: 5,
      },
    ],
  },
  {
    slug: "santa-clara-lisbon",
    name: "Santa Clara 1728",
    destination: "Lisbon",
    destinationSlug: "lisbon",
    country: "Portugal",
    stars: 5,
    nightly: 295,
    descriptor: "Historic house",
    photoId: PHOTO_IDS.hotelSuite,
    gallery: [PHOTO_IDS.hotelSuite, PHOTO_IDS.lisbonRooftops, PHOTO_IDS.hotelRoom],
    intro:
      "Six rooms in an eighteenth-century house above the river, limestone floors and shuttered light.",
    amenities: ["Breakfast included", "Honesty bar", "River views", "Concierge", "Wi-Fi"],
    policies: [
      { label: "Check in", value: "15:00" },
      { label: "Check out", value: "12:00" },
      { label: "Cancellation", value: "Free until 7 days before arrival" },
      { label: "Children", value: "Over 12 only" },
    ],
    rooms: [
      { name: "Interior Room", size: "32 m²", occupancy: "2 guests", price: 295 },
      { name: "River Room", size: "45 m²", occupancy: "2 guests", price: 420 },
    ],
    reviews: [
      {
        author: "Théo R.",
        date: "MAY 2026",
        body: "Small, exact, and the breakfast is the reason to book. Steep walk up from the tram.",
        score: 5,
      },
    ],
  },
  {
    slug: "hemingways-nairobi",
    name: "Hemingways Nairobi",
    destination: "Nairobi",
    destinationSlug: "nairobi",
    country: "Kenya",
    stars: 5,
    nightly: 240,
    descriptor: "Karen district",
    photoId: PHOTO_IDS.hotelTerrace,
    gallery: [PHOTO_IDS.hotelTerrace, PHOTO_IDS.hotelRoom, PHOTO_IDS.savannah],
    intro:
      "Suites facing the Ngong Hills, twenty minutes from the national park gate and far from the traffic.",
    amenities: ["Butler service", "Spa", "Two restaurants", "Pool", "Park transfers", "Wi-Fi"],
    policies: [
      { label: "Check in", value: "14:00" },
      { label: "Check out", value: "11:00" },
      { label: "Cancellation", value: "Free until 7 days before arrival" },
      { label: "Children", value: "All ages welcome" },
    ],
    rooms: [
      { name: "Deluxe Suite", size: "60 m²", occupancy: "2 guests", price: 240 },
      { name: "Hemingways Suite", size: "95 m²", occupancy: "3 guests", price: 430 },
    ],
    reviews: [
      {
        author: "Grace W.",
        date: "JAN 2026",
        body: "Booked two nights around a weekend flight. Worth it for the hills at breakfast.",
        score: 5,
      },
    ],
  },
];

export type Experience = {
  slug: string;
  name: string;
  place: string;
  country: string;
  price: number;
  duration: string;
  photoId: string;
  descriptor: string;
};

export const experiences: Experience[] = [
  {
    slug: "stone-town-walk",
    name: "Stone Town Walk",
    place: "Zanzibar",
    country: "Tanzania",
    price: 35,
    duration: "3 hours",
    photoId: PHOTO_IDS.zanzibarDhow,
    descriptor: "Guided, small group",
  },
  {
    slug: "safari-blue",
    name: "Safari Blue",
    place: "Zanzibar",
    country: "Tanzania",
    price: 80,
    duration: "Full day",
    photoId: PHOTO_IDS.aerialCoast,
    descriptor: "Dhow, sandbank, lunch",
  },
  {
    slug: "gorilla-trekking",
    name: "Gorilla Trekking",
    place: "Volcanoes National Park",
    country: "Rwanda",
    price: 1500,
    duration: "Full day",
    photoId: PHOTO_IDS.gorilla,
    descriptor: "Permit included",
  },
  {
    slug: "nairobi-park-morning",
    name: "Nairobi Park Morning",
    place: "Nairobi",
    country: "Kenya",
    price: 120,
    duration: "5 hours",
    photoId: PHOTO_IDS.savannah,
    descriptor: "Dawn game drive",
  },
  {
    slug: "kigali-city-ride",
    name: "Kigali City Ride",
    place: "Kigali",
    country: "Rwanda",
    price: 45,
    duration: "4 hours",
    photoId: PHOTO_IDS.kigaliHills,
    descriptor: "Hills, markets, coffee",
  },
  {
    slug: "atlas-day-trip",
    name: "Atlas Day Trip",
    place: "Marrakech",
    country: "Morocco",
    price: 95,
    duration: "Full day",
    photoId: PHOTO_IDS.marrakech,
    descriptor: "Private driver",
  },
];

export type Story = {
  slug: string;
  kicker: string;
  title: string;
  readTime: string;
  photoId: string;
};

export const stories: Story[] = [
  {
    slug: "kigali-to-zanzibar",
    kicker: "The weekend guide",
    title: "Kigali to Zanzibar",
    readTime: "6 min",
    photoId: PHOTO_IDS.zanzibarBeach,
  },
  {
    slug: "48-hours-in-nairobi",
    kicker: "Short stay",
    title: "48 hours in Nairobi",
    readTime: "5 min",
    photoId: PHOTO_IDS.nairobiSkyline,
  },
  {
    slug: "a-quiet-week-in-lisbon",
    kicker: "Slow travel",
    title: "A quiet week in Lisbon",
    readTime: "8 min",
    photoId: PHOTO_IDS.lisbonRooftops,
  },
  {
    slug: "best-beaches-east-africa",
    kicker: "Coastline",
    title: "The best beaches in East Africa",
    readTime: "7 min",
    photoId: PHOTO_IDS.aerialCoast,
  },
];

export const testimonials = [
  {
    quote:
      "I booked a flight, a stay and the airport transfer in one pass. The total I saw first was the total I paid.",
    author: "Aline Mukamana",
    place: "Kigali",
  },
  {
    quote: "The flight list is the fastest I have used. No pop-ups, no countdown timers, no invented urgency.",
    author: "Jonas Weber",
    place: "Berlin",
  },
  {
    quote: "Cancellation terms were on the room, not buried three screens deep. That is the whole reason I came back.",
    author: "Priya Nair",
    place: "Nairobi",
  },
];

export const regions: Region[] = ["Africa", "Europe", "Asia", "Middle East", "Americas"];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function getHotel(slug: string) {
  return hotels.find((h) => h.slug === slug);
}

export function hotelsForDestination(slug: string) {
  return hotels.filter((h) => h.destinationSlug === slug);
}

export function experiencesForDestination(name: string) {
  return experiences.filter((e) => e.place.toLowerCase().includes(name.toLowerCase()));
}

export function money(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}
