/**
 * Client-safe types for live Hotelbeds (APItude) hotel search.
 * No credentials, no network code — safe to import from components.
 */

export type StaySearchInput = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};

export type LiveRate = {
  rateKey: string;
  roomName: string;
  boardName: string;
  rateClass: string;
  refundable: boolean;
  cancellationNote: string | null;
  net: number;
  sellingRate: number | null;
  currency: string;
  allotment: number | null;
  adults: number;
  children: number;
};

export type LiveHotel = {
  code: string;
  name: string;
  categoryName: string;
  stars: number;
  destinationName: string;
  zoneName: string;
  address: string;
  countryCode: string;
  image: string | null;
  images: string[];
  description: string | null;
  amenities: string[];
  latitude: number | null;
  longitude: number | null;
  currency: string;
  minRate: number;
  maxRate: number | null;
  nights: number;
  rooms: { code: string; name: string; rates: LiveRate[] }[];
  ratesCount: number;
  freeCancellation: boolean;
};

export type StaySearchResult =
  | { status: "ok"; hotels: LiveHotel[]; total: number; nights: number; destination: { code: string; name: string }; checkIn: string; checkOut: string }
  | { status: "invalid"; message: string }
  | { status: "no-destination"; message: string }
  | { status: "empty"; message: string; destination: { code: string; name: string } }
  | { status: "error"; message: string };

export type HotelDetailResult =
  | { status: "ok"; hotel: LiveHotel }
  | { status: "unavailable"; message: string; hotel: LiveHotel | null }
  | { status: "error"; message: string };
