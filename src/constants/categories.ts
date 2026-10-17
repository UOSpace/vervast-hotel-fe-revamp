import alpineImg from '@/assets/property_types/alpine-thumb.jpg';
import oceanImg from '@/assets/property_types/ocean_hills.jpg';
import cityImg from '@/assets/property_types/city-thumb.jpg';
import forestImg from '@/assets/property_types/forest_rindang.jpg';
import desertImg from '@/assets/property_types/desert.png';
import wellnessImg from '@/assets/contents/wellness_retreat.png';
import { MTD_DAYS } from '@/data/portfolio/periods';

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
 * 1. SOSEI Ski (SOSEI Andermatt - Switzerland)
 * 2. SOSEI Beach Resort (SOSEI El Gouna - Egypt, SOSEI AUH - UAE, SOSEI Melides - Portugal, SOSEI Umbria - Italy, SOSEI Tinos - Greece)
 * 3. SOSEI Urban (SOSEI Barcelona - Spain)
 * 4. SOSEI Nature (SOSEI OSA - Costa Rica)
 * 5. SOSEI Wellness (SOSEI BALI - Bali)
 */
export const MASTER_CATEGORIES: HotelCategory[] = [
  {
    id: 'ski',
    name: 'SOSEI Ski',
    displayName: 'SOSEI Ski',
    shortName: 'SKI',
    collectionName: 'Ski Collection',
    description: 'High-altitude panoramic mountain peaks, glacier chalets, and alpine ski retreats',
    img: alpineImg,
    propertyIds: ['sosei-andermatt'],
    totalRooms: 85,
  },
  {
    id: 'beach-resort',
    name: 'SOSEI Beach Resort',
    displayName: 'SOSEI Beach Resort',
    shortName: 'BEACH RESORT',
    collectionName: 'Beach Resort Collection',
    description: 'Private island sanctums, Mediterranean coastal retreats, and Red Sea & Arabian Gulf shores',
    img: oceanImg,
    propertyIds: ['sosei-el-gouna', 'sosei-auh', 'sosei-melides', 'sosei-umbria', 'sosei-tinos'],
    totalRooms: 355,
  },
  {
    id: 'urban',
    name: 'SOSEI Urban',
    displayName: 'SOSEI Urban',
    shortName: 'URBAN',
    collectionName: 'Urban Collection',
    description: 'Metropolitan luxury landmark residences in global cultural capitals',
    img: cityImg,
    propertyIds: ['sosei-barcelona'],
    totalRooms: 110,
  },
  {
    id: 'nature',
    name: 'SOSEI Nature',
    displayName: 'SOSEI Nature',
    shortName: 'NATURE',
    collectionName: 'Nature Collection',
    description: 'Lush tropical rainforests, pristine coastal biodiversity, and botanical retreats',
    img: forestImg,
    propertyIds: ['sosei-osa'],
    totalRooms: 70,
  },
  {
    id: 'wellness',
    name: 'SOSEI Wellness',
    displayName: 'SOSEI Wellness',
    shortName: 'WELLNESS',
    collectionName: 'Wellness Collection',
    description: 'Holistic restorative properties, sacred healing rituals, and longevity retreats',
    img: wellnessImg || desertImg,
    propertyIds: ['sosei-bali'],
    totalRooms: 90,
  },
];

/**
 * MASTER HOTEL PROPERTIES
 * 100% Synchronized with PMS and Global Portfolio Overview (Total 710 Rooms across 9 Properties)
 */
const RAW_MASTER_PROPERTIES: MasterHotelProperty[] = [
  // ── SOSEI Ski (85 Rooms) ─────────────────────────────────────────────────
  {
    id: 'sosei-andermatt',
    name: 'SOSEI Andermatt',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    location: 'Andermatt, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    rooms: 85,
    baseOcc: 78.5,
    baseAdr: 2780,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-andermatt',
    img: alpineImg,
  },

  // ── SOSEI Beach Resort (355 Rooms) ───────────────────────────────────────
  {
    id: 'sosei-el-gouna',
    name: 'SOSEI El Gouna',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'El Gouna, Egypt',
    country: 'Egypt',
    region: 'Middle East & Africa',
    rooms: 80,
    baseOcc: 64.5,
    baseAdr: 1890,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=sosei-el-gouna',
    img: oceanImg,
  },
  {
    id: 'sosei-auh',
    name: 'SOSEI AUH',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Abu Dhabi, UAE',
    country: 'UAE',
    region: 'Middle East & Africa',
    rooms: 85,
    baseOcc: 73.5,
    baseAdr: 2340,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-auh',
    img: oceanImg,
  },
  {
    id: 'sosei-melides',
    name: 'SOSEI Melides',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Melides, Portugal',
    country: 'Portugal',
    region: 'Europe',
    rooms: 65,
    baseOcc: 75.2,
    baseAdr: 2280,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-melides',
    img: oceanImg,
  },
  {
    id: 'sosei-umbria',
    name: 'SOSEI Umbria',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Umbria, Italy',
    country: 'Italy',
    region: 'Europe',
    rooms: 60,
    baseOcc: 71.8,
    baseAdr: 2190,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=sosei-umbria',
    img: oceanImg,
  },
  {
    id: 'sosei-tinos',
    name: 'SOSEI Tinos',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Tinos, Greece',
    country: 'Greece',
    region: 'Europe',
    rooms: 65,
    baseOcc: 76.4,
    baseAdr: 2420,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-tinos',
    img: oceanImg,
  },

  // ── SOSEI Urban (110 Rooms) ──────────────────────────────────────────────
  {
    id: 'sosei-barcelona',
    name: 'SOSEI Barcelona',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    location: 'Barcelona, Spain',
    country: 'Spain',
    region: 'Europe',
    rooms: 110,
    baseOcc: 72.4,
    baseAdr: 2540,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-barcelona',
    img: cityImg,
  },

  // ── SOSEI Nature (70 Rooms) ──────────────────────────────────────────────
  {
    id: 'sosei-osa',
    name: 'SOSEI OSA',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    location: 'Osa, Costa Rica',
    country: 'Costa Rica',
    region: 'Americas',
    rooms: 70,
    baseOcc: 73.2,
    baseAdr: 2050,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-osa',
    img: forestImg,
  },

  // ── SOSEI Wellness (90 Rooms) ────────────────────────────────────────────
  {
    id: 'sosei-bali',
    name: 'SOSEI BALI',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    location: 'Bali, Indonesia',
    country: 'Indonesia',
    region: 'Asia Pacific',
    rooms: 90,
    baseOcc: 74.0,
    baseAdr: 2250,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=sosei-bali',
    img: wellnessImg || desertImg,
  },
];

export const MASTER_PROPERTIES: MasterHotelProperty[] = RAW_MASTER_PROPERTIES.map((p) => {
  const available = p.rooms * MTD_DAYS;
  const roomsSold = Math.round((available * p.baseOcc) / 100);
  const adr = Math.round(p.baseAdr);
  const roomRevenue = roomsSold * adr;
  return {
    ...p,
    baseOcc: Number(((roomsSold / available) * 100).toFixed(1)),
    baseAdr: adr,
    baseRevpar: Math.round(roomRevenue / available),
  };
});

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
  'sosei-nocturne': 'sosei-andermatt',
  'sosei-aurora': 'sosei-andermatt',
  'sosei-switzerland': 'sosei-andermatt',
  'sosei-canada': 'sosei-andermatt',
  'sosei-marea': 'sosei-tinos',
  'sosei-maldives': 'sosei-tinos',
  'sosei-pelagia': 'sosei-bali',
  'sosei-verper': 'sosei-barcelona',
  'sosei-elan': 'sosei-barcelona',
  'sosei-tokyo': 'sosei-barcelona',
  'sosei-hearth': 'sosei-osa',
  'sosei-pastoral': 'sosei-osa',
  'sosei-costa-rica': 'sosei-osa',
  'sosei-sylvan': 'sosei-osa',
  'sosei-japan': 'sosei-osa',
  'sosei-verdant': 'sosei-auh',
  'sosei-oman': 'sosei-auh',
  'sosei-mirage': 'sosei-el-gouna',
  'sosei-egypt': 'sosei-el-gouna',
  'sosei-solstice': 'sosei-auh',
  // Category IDs passed to ?id= on property route
  ski: 'sosei-andermatt',
  'beach-resort': 'sosei-el-gouna',
  urban: 'sosei-barcelona',
  nature: 'sosei-osa',
  wellness: 'sosei-bali',
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
