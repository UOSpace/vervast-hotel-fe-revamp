import alpineImg from '@/assets/property_types/alpine-thumb.jpg';
import oceanImg from '@/assets/property_types/ocean_hills.jpg';
import cityImg from '@/assets/property_types/city-thumb.jpg';
import forestImg from '@/assets/property_types/forest_rindang.jpg';
import desertImg from '@/assets/property_types/desert.png';
import wellnessImg from '@/assets/contents/wellness_retreat.png';

export type HotelCategoryId = 'urban' | 'beach-resort' | 'ski' | 'nature' | 'wellness';

export interface HotelCategory {
  id: HotelCategoryId;
  name: string;           // e.g. "SOSEI Urban", "SOSEI Beach Resort"
  displayName: string;    // e.g. "SOSEI Urban"
  shortName: string;      // e.g. "URBAN", "BEACH RESORT"
  collectionName: string; // e.g. "Urban Collection"
  description: string;
  img: string;
  propertyIds: string[];
  totalRooms: number;
}

export interface MasterHotelProperty {
  id: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  location: string;
  country: string;
  region: 'Europe' | 'Americas' | 'Asia Pacific' | 'Middle East & Africa';
  rooms: number;
  baseOcc: number;
  baseAdr: number;
  baseRevpar?: number;
  status: 'above_plan' | 'on_plan' | 'attention';
  statusLabel: string;
  propertyRoute: string;
  img: string;
}

/**
 * MASTER CATEGORY DEFINITIONS
 * Single Source of Truth for all 5 Luxury Collections across the application:
 * 1. SOSEI Urban (Barcelona, Tokyo)
 * 2. SOSEI Beach Resort (Bali, Maldives)
 * 3. SOSEI Ski (Switzerland, Canada)
 * 4. SOSEI Nature (Costa Rica, Japan)
 * 5. SOSEI Wellness (Oman, Egypt)
 */
export const MASTER_CATEGORIES: HotelCategory[] = [
  {
    id: 'urban',
    name: 'SOSEI Urban',
    displayName: 'SOSEI Urban',
    shortName: 'URBAN',
    collectionName: 'Urban Collection',
    description: 'Metropolitan luxury landmark residences in global cultural capitals',
    img: cityImg,
    propertyIds: ['sosei-barcelona', 'sosei-tokyo'],
    totalRooms: 200,
  },
  {
    id: 'beach-resort',
    name: 'SOSEI Beach Resort',
    displayName: 'SOSEI Beach Resort',
    shortName: 'BEACH RESORT',
    collectionName: 'Beach Resort Collection',
    description: 'Private island sanctums, overwater pavilions, and dramatic coastal retreats',
    img: oceanImg,
    propertyIds: ['sosei-bali', 'sosei-maldives'],
    totalRooms: 140,
  },
  {
    id: 'ski',
    name: 'SOSEI Ski',
    displayName: 'SOSEI Ski',
    shortName: 'SKI',
    collectionName: 'Ski Collection',
    description: 'High-altitude panoramic mountain peaks, glacier chalets, and alpine ski retreats',
    img: alpineImg,
    propertyIds: ['sosei-switzerland', 'sosei-canada'],
    totalRooms: 130,
  },
  {
    id: 'nature',
    name: 'SOSEI Nature',
    displayName: 'SOSEI Nature',
    shortName: 'NATURE',
    collectionName: 'Nature Collection',
    description: 'Lush tropical rainforests, pristine coastal sanctuaries, and historic bamboo groves',
    img: forestImg,
    propertyIds: ['sosei-costa-rica', 'sosei-japan'],
    totalRooms: 145,
  },
  {
    id: 'wellness',
    name: 'SOSEI Wellness',
    displayName: 'SOSEI Wellness',
    shortName: 'WELLNESS',
    collectionName: 'Wellness Collection',
    description: 'Holistic restorative sanctuaries, thermal mineral springs, and desert healing oases',
    img: wellnessImg || desertImg,
    propertyIds: ['sosei-oman', 'sosei-egypt'],
    totalRooms: 165,
  },
];

/**
 * MASTER HOTEL PROPERTIES
 * 100% Synchronized with PMS and Global Portfolio Overview (Total 780 Rooms across 10 Properties)
 */
export const MASTER_PROPERTIES: MasterHotelProperty[] = [
  // ── SOSEI Urban (200 Rooms) ──────────────────────────────────────────────
  {
    id: 'sosei-barcelona',
    name: 'SOSEI BARCELONA',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    location: 'Barcelona, Spain',
    country: 'Spain',
    region: 'Europe',
    rooms: 110,
    baseOcc: 68.2,
    baseAdr: 2540,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=urban',
    img: cityImg,
  },
  {
    id: 'sosei-tokyo',
    name: 'SOSEI TOKYO',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    location: 'Tokyo, Japan',
    country: 'Japan',
    region: 'Asia Pacific',
    rooms: 90,
    baseOcc: 71.5,
    baseAdr: 2450,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=urban',
    img: cityImg,
  },

  // ── SOSEI Beach Resort (140 Rooms) ───────────────────────────────────────
  {
    id: 'sosei-bali',
    name: 'SOSEI BALI',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Uluwatu, Bali, Indonesia',
    country: 'Indonesia',
    region: 'Asia Pacific',
    rooms: 75,
    baseOcc: 70.5,
    baseAdr: 2150,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=beach-resort',
    img: oceanImg,
  },
  {
    id: 'sosei-maldives',
    name: 'SOSEI MALDIVES',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'North Malé Atoll, Maldives',
    country: 'Maldives',
    region: 'Asia Pacific',
    rooms: 65,
    baseOcc: 76.5,
    baseAdr: 2420,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=beach-resort',
    img: oceanImg,
  },

  // ── SOSEI Ski (130 Rooms) ────────────────────────────────────────────────
  {
    id: 'sosei-switzerland',
    name: 'SOSEI SWITZERLAND',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    location: 'Zermatt, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    rooms: 70,
    baseOcc: 78.5,
    baseAdr: 2780,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=ski',
    img: alpineImg,
  },
  {
    id: 'sosei-canada',
    name: 'SOSEI CANADA',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    location: 'Whistler, Canada',
    country: 'Canada',
    region: 'Americas',
    rooms: 60,
    baseOcc: 73.0,
    baseAdr: 2620,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=ski',
    img: alpineImg,
  },

  // ── SOSEI Nature (145 Rooms) ─────────────────────────────────────────────
  {
    id: 'sosei-costa-rica',
    name: 'SOSEI COSTA RICA',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    location: 'Papagayo, Costa Rica',
    country: 'Costa Rica',
    region: 'Americas',
    rooms: 70,
    baseOcc: 72.8,
    baseAdr: 1950,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=nature',
    img: forestImg,
  },
  {
    id: 'sosei-japan',
    name: 'SOSEI JAPAN',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    location: 'Kyoto, Japan',
    country: 'Japan',
    region: 'Asia Pacific',
    rooms: 75,
    baseOcc: 69.5,
    baseAdr: 1780,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=nature',
    img: forestImg,
  },

  // ── SOSEI Wellness (165 Rooms) ───────────────────────────────────────────
  {
    id: 'sosei-oman',
    name: 'SOSEI OMAN',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    location: 'Jebel Akhdar, Oman',
    country: 'Oman',
    region: 'Middle East & Africa',
    rooms: 85,
    baseOcc: 65.5,
    baseAdr: 1860,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=wellness',
    img: desertImg,
  },
  {
    id: 'sosei-egypt',
    name: 'SOSEI EGYPT',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    location: 'Siwa Oasis, Egypt',
    country: 'Egypt',
    region: 'Middle East & Africa',
    rooms: 80,
    baseOcc: 58.2,
    baseAdr: 1740,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=wellness',
    img: desertImg,
  },
];

/**
 * Backward compatibility alias map for legacy category IDs
 */
export const LEGACY_CATEGORY_MAP: Record<string, HotelCategoryId> = {
  alpine: 'ski',
  city: 'urban',
  ocean: 'beach-resort',
  countryside: 'nature',
  forest: 'nature',
  desert: 'wellness',
  sky: 'ski',
  ski: 'ski',
  urban: 'urban',
  'beach-resort': 'beach-resort',
  beach: 'beach-resort',
  nature: 'nature',
  wellness: 'wellness',
  welness: 'wellness',
};

/**
 * Backward compatibility alias map for legacy property IDs
 */
export const LEGACY_PROPERTY_ID_MAP: Record<string, string> = {
  'sosei-nocturne': 'sosei-switzerland',
  'sosei-aurora': 'sosei-canada',
  'sosei-marea': 'sosei-maldives',
  'sosei-pelagia': 'sosei-bali',
  'sosei-verper': 'sosei-barcelona',
  'sosei-elan': 'sosei-tokyo',
  'sosei-hearth': 'sosei-costa-rica',
  'sosei-pastoral': 'sosei-costa-rica',
  'sosei-sylvan': 'sosei-japan',
  'sosei-verdant': 'sosei-oman',
  'sosei-mirage': 'sosei-egypt',
  'sosei-solstice': 'sosei-oman',
};

/**
 * Category lookup map indexed by Category ID
 */
export const CATEGORY_MAP: Record<HotelCategoryId, HotelCategory> = MASTER_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<HotelCategoryId, HotelCategory>
);

/**
 * Room counts mapped directly by Category ID
 */
export const CATEGORY_ROOM_COUNTS: Record<string, number> = MASTER_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.totalRooms;
    return acc;
  },
  {} as Record<string, number>
);

/**
 * Category display names mapping
 */
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = MASTER_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Resolves any category ID (including legacy IDs like 'alpine', 'city', 'sky') to the canonical ID
 */
export function resolveCategoryId(rawId?: string): HotelCategoryId {
  if (!rawId) return 'urban';
  const clean = rawId.toLowerCase().trim();
  return LEGACY_CATEGORY_MAP[clean] || 'urban';
}

/**
 * Resolves any property ID (including legacy IDs like 'sosei-nocturne') to the canonical ID
 */
export function resolvePropertyId(rawId?: string): string {
  if (!rawId) return 'sosei-barcelona';
  const clean = rawId.toLowerCase().trim();
  return LEGACY_PROPERTY_ID_MAP[clean] || clean;
}

/**
 * Gets category details by ID with support for legacy IDs
 */
export function getCategoryById(id?: string): HotelCategory {
  const canonicalId = resolveCategoryId(id);
  return CATEGORY_MAP[canonicalId] || MASTER_CATEGORIES[0];
}

/**
 * Gets properties belonging to a category
 */
export function getPropertiesByCategoryId(categoryId?: string): MasterHotelProperty[] {
  const canonicalId = resolveCategoryId(categoryId);
  return MASTER_PROPERTIES.filter(p => p.categoryId === canonicalId);
}

/**
 * Gets category by a specific hotel property ID
 */
export function getCategoryByPropertyId(propertyId: string): HotelCategory | undefined {
  const canonicalPropId = resolvePropertyId(propertyId);
  const prop = MASTER_PROPERTIES.find(p => p.id === canonicalPropId);
  return prop ? CATEGORY_MAP[prop.categoryId] : undefined;
}

/**
 * Formats display name when 1 or multiple categories are active
 */
export function formatCategorySelectionTitle(activeCategoryIds: string[]): string {
  if (!activeCategoryIds || activeCategoryIds.length === 0) return 'All Collections';
  const canonicalIds = Array.from(new Set(activeCategoryIds.map(resolveCategoryId)));
  if (canonicalIds.length === MASTER_CATEGORIES.length) return 'All Collections';
  if (canonicalIds.length === 1) {
    const cat = CATEGORY_MAP[canonicalIds[0]];
    return cat ? cat.name : 'Selected Collection';
  }
  return `${canonicalIds.length} Collections Selected`;
}
