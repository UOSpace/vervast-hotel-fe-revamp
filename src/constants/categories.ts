import alpineImg from '@/assets/property_types/alpine-thumb.jpg';
import oceanImg from '@/assets/property_types/ocean_hills.jpg';
import cityImg from '@/assets/property_types/city-thumb.jpg';
import forestImg from '@/assets/property_types/forest_rindang.jpg';
import countryImg from '@/assets/property_types/country_pedesaan.jpg';
import desertImg from '@/assets/property_types/desert.png';
import wellnessImg from '@/assets/contents/wellness_retreat.png';

export type HotelCategoryId = 'urban' | 'beach-resort' | 'sky' | 'nature' | 'wellness';

export interface HotelCategory {
  id: HotelCategoryId;
  name: string;           // e.g. "SoSei Urban", "Sosei Beach Resort"
  displayName: string;    // e.g. "SoSei Urban"
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
 * 1. SoSei Urban
 * 2. Sosei Beach Resort
 * 3. Sosei Sky
 * 4. Sosei Nature
 * 5. Sosei Wellness
 */
export const MASTER_CATEGORIES: HotelCategory[] = [
  {
    id: 'urban',
    name: 'SoSei Urban',
    displayName: 'SoSei Urban',
    shortName: 'URBAN',
    collectionName: 'Urban Collection',
    description: 'Metropolitan luxury landmark residences in global cultural capitals',
    img: cityImg,
    propertyIds: ['sosei-verper', 'sosei-elan'],
    totalRooms: 198,
  },
  {
    id: 'beach-resort',
    name: 'Sosei Beach Resort',
    displayName: 'Sosei Beach Resort',
    shortName: 'BEACH RESORT',
    collectionName: 'Beach Resort Collection',
    description: 'Private island sanctums, overwater pavilions, and dramatic coastal retreats',
    img: oceanImg,
    propertyIds: ['sosei-marea', 'sosei-pelagia'],
    totalRooms: 130,
  },
  {
    id: 'sky',
    name: 'Sosei Sky',
    displayName: 'Sosei Sky',
    shortName: 'SKY',
    collectionName: 'Sky Collection',
    description: 'High-altitude panoramic mountain peaks, glacier chalets, and northern lights retreats',
    img: alpineImg,
    propertyIds: ['sosei-nocturne', 'sosei-aurora'],
    totalRooms: 116,
  },
  {
    id: 'nature',
    name: 'Sosei Nature',
    displayName: 'Sosei Nature',
    shortName: 'NATURE',
    collectionName: 'Nature Collection',
    description: 'Lush historic forests, ancient bamboo groves, and pastoral rolling hills',
    img: forestImg,
    propertyIds: ['sosei-hearth', 'sosei-pastoral', 'sosei-sylvan'],
    totalRooms: 160,
  },
  {
    id: 'wellness',
    name: 'Sosei Wellness',
    displayName: 'Sosei Wellness',
    shortName: 'WELLNESS',
    collectionName: 'Wellness Collection',
    description: 'Holistic restorative sanctuaries, thermal mineral springs, and desert healing oases',
    img: wellnessImg || desertImg,
    propertyIds: ['sosei-verdant', 'sosei-mirage', 'sosei-solstice'],
    totalRooms: 185,
  },
];

/**
 * MASTER HOTEL PROPERTIES
 * 100% Synchronized with PMS and Global Portfolio Overview (Total 789 Rooms across 12 Properties)
 */
export const MASTER_PROPERTIES: MasterHotelProperty[] = [
  // ── Sosei Sky (116 Rooms) ────────────────────────────────────────────────
  {
    id: 'sosei-nocturne',
    name: 'SOSEI NOCTURNE',
    categoryId: 'sky',
    categoryName: 'Sosei Sky',
    location: 'Zermatt, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    rooms: 72,
    baseOcc: 77.8,
    baseAdr: 2750,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sky',
    img: alpineImg,
  },
  {
    id: 'sosei-aurora',
    name: 'SOSEI AURORA',
    categoryId: 'sky',
    categoryName: 'Sosei Sky',
    location: 'Rovaniemi, Finland',
    country: 'Finland',
    region: 'Europe',
    rooms: 44,
    baseOcc: 73.1,
    baseAdr: 2618,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sky',
    img: alpineImg,
  },

  // ── Sosei Beach Resort (130 Rooms) ───────────────────────────────────────
  {
    id: 'sosei-marea',
    name: 'SOSEI MARÉA',
    categoryId: 'beach-resort',
    categoryName: 'Sosei Beach Resort',
    location: 'North Malé Atoll, Maldives',
    country: 'Maldives',
    region: 'Asia Pacific',
    rooms: 58,
    baseOcc: 75.9,
    baseAdr: 2380,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=beach-resort',
    img: oceanImg,
  },
  {
    id: 'sosei-pelagia',
    name: 'SOSEI PELAGIA',
    categoryId: 'beach-resort',
    categoryName: 'Sosei Beach Resort',
    location: 'Uluwatu, Indonesia',
    country: 'Indonesia',
    region: 'Asia Pacific',
    rooms: 72,
    baseOcc: 68.9,
    baseAdr: 2055,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=beach-resort',
    img: oceanImg,
  },

  // ── SoSei Urban (198 Rooms) ──────────────────────────────────────────────
  {
    id: 'sosei-verper',
    name: 'SOSEI VERPER',
    categoryId: 'urban',
    categoryName: 'SoSei Urban',
    location: 'New York, USA',
    country: 'USA',
    region: 'Americas',
    rooms: 115,
    baseOcc: 66.0,
    baseAdr: 2580,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=urban',
    img: cityImg,
  },
  {
    id: 'sosei-elan',
    name: 'SOSEI ÉLAN',
    categoryId: 'urban',
    categoryName: 'SoSei Urban',
    location: 'Los Angeles, USA',
    country: 'USA',
    region: 'Americas',
    rooms: 83,
    baseOcc: 70.8,
    baseAdr: 2397,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=urban',
    img: cityImg,
  },

  // ── Sosei Nature (160 Rooms) ─────────────────────────────────────────────
  {
    id: 'sosei-hearth',
    name: 'SOSEI HEARTH',
    categoryId: 'nature',
    categoryName: 'Sosei Nature',
    location: 'Tuscany, Italy',
    country: 'Italy',
    region: 'Europe',
    rooms: 62,
    baseOcc: 75.8,
    baseAdr: 1920,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=nature',
    img: countryImg,
  },
  {
    id: 'sosei-pastoral',
    name: 'SOSEI PASTORAL',
    categoryId: 'nature',
    categoryName: 'Sosei Nature',
    location: 'Provence, France',
    country: 'France',
    region: 'Europe',
    rooms: 52,
    baseOcc: 67.4,
    baseAdr: 1657,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=nature',
    img: countryImg,
  },
  {
    id: 'sosei-sylvan',
    name: 'SOSEI SYLVAN',
    categoryId: 'nature',
    categoryName: 'Sosei Nature',
    location: 'Kyoto, Japan',
    country: 'Japan',
    region: 'Asia Pacific',
    rooms: 46,
    baseOcc: 67.4,
    baseAdr: 1750,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=nature',
    img: forestImg,
  },

  // ── Sosei Wellness (185 Rooms) ───────────────────────────────────────────
  {
    id: 'sosei-verdant',
    name: 'SOSEI VERDANT',
    categoryId: 'wellness',
    categoryName: 'Sosei Wellness',
    location: 'Chiang Mai, Thailand',
    country: 'Thailand',
    region: 'Asia Pacific',
    rooms: 48,
    baseOcc: 52.9,
    baseAdr: 1456,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=wellness',
    img: forestImg,
  },
  {
    id: 'sosei-mirage',
    name: 'SOSEI MIRAGE',
    categoryId: 'wellness',
    categoryName: 'Sosei Wellness',
    location: 'Siwa Oasis, Egypt',
    country: 'Egypt',
    region: 'Middle East & Africa',
    rooms: 64,
    baseOcc: 57.8,
    baseAdr: 1720,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=wellness',
    img: desertImg,
  },
  {
    id: 'sosei-solstice',
    name: 'SOSEI SOLSTICE',
    categoryId: 'wellness',
    categoryName: 'Sosei Wellness',
    location: 'Jebel Akhdar, Oman',
    country: 'Oman',
    region: 'Middle East & Africa',
    rooms: 73,
    baseOcc: 65.2,
    baseAdr: 1850,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=wellness',
    img: desertImg,
  },
];

/**
 * Backward compatibility alias map for legacy category IDs
 */
export const LEGACY_CATEGORY_MAP: Record<string, HotelCategoryId> = {
  alpine: 'sky',
  city: 'urban',
  ocean: 'beach-resort',
  countryside: 'nature',
  forest: 'nature',
  desert: 'wellness',
  sky: 'sky',
  urban: 'urban',
  'beach-resort': 'beach-resort',
  beach: 'beach-resort',
  nature: 'nature',
  wellness: 'wellness',
  welness: 'wellness',
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
 * Resolves any category ID (including legacy IDs like 'alpine', 'city') to the canonical ID
 */
export function resolveCategoryId(rawId?: string): HotelCategoryId {
  if (!rawId) return 'urban';
  const clean = rawId.toLowerCase().trim();
  return LEGACY_CATEGORY_MAP[clean] || 'urban';
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
  const prop = MASTER_PROPERTIES.find(p => p.id === propertyId);
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
