/**
 * Real photography, served from the Unsplash CDN.
 * No generated or fabricated imagery is used anywhere in the product.
 */
const BASE = "https://images.unsplash.com/";

export function photo(id: string, width = 1200, ratio = 1.25) {
  const height = Math.round(width / ratio);
  return `${BASE}${id}?auto=format&fit=crop&q=80&w=${width}&h=${height}`;
}

export const PHOTO_IDS = {
  zanzibarBeach: "photo-1516026672322-bc52d61a55d5",
  zanzibarDhow: "photo-1523805009345-7448845a9e53",
  lisbonTram: "photo-1502920917128-1aa500764cbd",
  lisbonRooftops: "photo-1544644181-1484b3fdfc62",
  nairobiSkyline: "photo-1518391846015-55a9cc003b25",
  savannah: "photo-1512100356356-de1b84283e18",
  kigaliHills: "photo-1527631746610-bca00a040d60",
  gorilla: "photo-1547471080-7cc2caa01a7e",
  capeTown: "photo-1516815231560-8f41ec531527",
  marrakech: "photo-1571401835393-8c5f35328320",
  dubai: "photo-1509390144018-eeaf65052242",
  hotelPool: "photo-1580060839134-75a5edca2e99",
  hotelRoom: "photo-1590523278191-995cbcda646b",
  hotelSuite: "photo-1548013146-72479768bada",
  hotelLobby: "photo-1513026705753-bc3fffca8bf4",
  hotelTerrace: "photo-1552832230-c0197dd311b5",
  aerialCoast: "photo-1533104816931-20fa691ff6ca",
  aircraftWing: "photo-1602002418082-a4443e081dd1",
} as const;
