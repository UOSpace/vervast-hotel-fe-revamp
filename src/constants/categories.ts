import alpineImg from '@/assets/property_types/alpine-thumb.jpg';
import oceanImg from '@/assets/property_types/ocean_hills.jpg';
import cityImg from '@/assets/property_types/city-thumb.jpg';
import forestImg from '@/assets/property_types/forest_rindang.jpg';
import desertImg from '@/assets/property_types/desert.png';
import wellnessImg from '@/assets/portal/sanctuary.png';
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
 * Single Source of Truth for all 5 Luxury Collections across the application (14 Properties across 5 Continents):
 * 1. SOSEI Ski (SOSEI Courchevel - France, SOSEI Niseko - Japan, SOSEI Aspen - United States)
 * 2. SOSEI Beach Resort (SOSEI Amalfi - Italy, SOSEI Sumba - Indonesia, SOSEI Los Cabos - Mexico, SOSEI Muscat - Oman, SOSEI Seychelles - Seychelles)
 * 3. SOSEI Urban (SOSEI Geneva - Switzerland, SOSEI Marrakech - Morocco)
 * 4. SOSEI Nature (SOSEI Patagonia - Chile, SOSEI Serengeti - Tanzania)
 * 5. SOSEI Wellness (SOSEI Kyoto - Japan, SOSEI AlUla - Saudi Arabia)
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
    propertyIds: ['sosei-courchevel', 'sosei-niseko', 'sosei-aspen'],
    totalRooms: 240,
  },
  {
    id: 'beach-resort',
    name: 'SOSEI Beach Resort',
    displayName: 'SOSEI Beach Resort',
    shortName: 'BEACH RESORT',
    collectionName: 'Beach Resort Collection',
    description: 'Private island sanctums, Mediterranean coastal retreats, and oceanic cliffs & lagoons',
    img: oceanImg,
    propertyIds: ['sosei-amalfi', 'sosei-sumba', 'sosei-los-cabos', 'sosei-muscat', 'sosei-seychelles'],
    totalRooms: 325,
  },
  {
    id: 'urban',
    name: 'SOSEI Urban',
    displayName: 'SOSEI Urban',
    shortName: 'URBAN',
    collectionName: 'Urban Collection',
    description: 'Metropolitan luxury landmark residences and royal riads in global cultural capitals',
    img: cityImg,
    propertyIds: ['sosei-geneva', 'sosei-marrakech'],
    totalRooms: 190,
  },
  {
    id: 'nature',
    name: 'SOSEI Nature',
    displayName: 'SOSEI Nature',
    shortName: 'NATURE',
    collectionName: 'Nature Collection',
    description: 'Untamed Patagonian wilderness, savanna ecosystems, and pristine biodiversity retreats',
    img: forestImg,
    propertyIds: ['sosei-patagonia', 'sosei-serengeti'],
    totalRooms: 130,
  },
  {
    id: 'wellness',
    name: 'SOSEI Wellness',
    displayName: 'SOSEI Wellness',
    shortName: 'WELLNESS',
    collectionName: 'Wellness Collection',
    description: 'Holistic restorative sanctuaries, ancient canyon healing rituals, and longevity retreats',
    img: wellnessImg || desertImg,
    propertyIds: ['sosei-kyoto', 'sosei-alula'],
    totalRooms: 175,
  },
];

/**
 * MASTER HOTEL PROPERTIES
 * 100% Synchronized with PMS and Global Portfolio Overview (Total 1,060 Rooms across 14 Properties in 5 Continents)
 */
const RAW_MASTER_PROPERTIES: MasterHotelProperty[] = [
  // ── SOSEI Ski (240 Rooms) ────────────────────────────────────────────────
  {
    id: 'sosei-courchevel',
    name: 'SOSEI Courchevel',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    location: 'Courchevel, France',
    country: 'France',
    region: 'Europe',
    rooms: 85,
    baseOcc: 78.5,
    baseAdr: 2780,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-courchevel',
    img: alpineImg,
  },
  {
    id: 'sosei-niseko',
    name: 'SOSEI Niseko',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    location: 'Niseko, Japan',
    country: 'Japan',
    region: 'Asia Pacific',
    rooms: 75,
    baseOcc: 76.2,
    baseAdr: 2480,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-niseko',
    img: alpineImg,
  },
  {
    id: 'sosei-aspen',
    name: 'SOSEI Aspen',
    categoryId: 'ski',
    categoryName: 'SOSEI Ski',
    location: 'Aspen, United States',
    country: 'United States',
    region: 'Americas',
    rooms: 80,
    baseOcc: 77.4,
    baseAdr: 2690,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-aspen',
    img: alpineImg,
  },

  // ── SOSEI Beach Resort (325 Rooms) ───────────────────────────────────────
  {
    id: 'sosei-amalfi',
    name: 'SOSEI Amalfi',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Amalfi, Italy',
    country: 'Italy',
    region: 'Europe',
    rooms: 60,
    baseOcc: 71.8,
    baseAdr: 2190,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=sosei-amalfi',
    img: oceanImg,
  },
  {
    id: 'sosei-sumba',
    name: 'SOSEI Sumba',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Sumba, Indonesia',
    country: 'Indonesia',
    region: 'Asia Pacific',
    rooms: 65,
    baseOcc: 75.8,
    baseAdr: 2320,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-sumba',
    img: oceanImg,
  },
  {
    id: 'sosei-los-cabos',
    name: 'SOSEI Los Cabos',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Los Cabos, Mexico',
    country: 'Mexico',
    region: 'Americas',
    rooms: 65,
    baseOcc: 75.2,
    baseAdr: 2280,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-los-cabos',
    img: oceanImg,
  },
  {
    id: 'sosei-muscat',
    name: 'SOSEI Muscat',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Muscat, Oman',
    country: 'Oman',
    region: 'Middle East & Africa',
    rooms: 65,
    baseOcc: 76.4,
    baseAdr: 2420,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-muscat',
    img: oceanImg,
  },
  {
    id: 'sosei-seychelles',
    name: 'SOSEI Seychelles',
    categoryId: 'beach-resort',
    categoryName: 'SOSEI Beach Resort',
    location: 'Mahé, Seychelles',
    country: 'Seychelles',
    region: 'Middle East & Africa',
    rooms: 70,
    baseOcc: 74.6,
    baseAdr: 2560,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-seychelles',
    img: oceanImg,
  },

  // ── SOSEI Urban (190 Rooms) ──────────────────────────────────────────────
  {
    id: 'sosei-geneva',
    name: 'SOSEI Geneva',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    location: 'Geneva, Switzerland',
    country: 'Switzerland',
    region: 'Europe',
    rooms: 110,
    baseOcc: 72.4,
    baseAdr: 2540,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-geneva',
    img: cityImg,
  },
  {
    id: 'sosei-marrakech',
    name: 'SOSEI Marrakech',
    categoryId: 'urban',
    categoryName: 'SOSEI Urban',
    location: 'Marrakech, Morocco',
    country: 'Morocco',
    region: 'Middle East & Africa',
    rooms: 80,
    baseOcc: 64.5,
    baseAdr: 1890,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=sosei-marrakech',
    img: cityImg,
  },

  // ── SOSEI Nature (130 Rooms) ─────────────────────────────────────────────
  {
    id: 'sosei-patagonia',
    name: 'SOSEI Patagonia',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    location: 'Torres del Paine, Chile',
    country: 'Chile',
    region: 'Americas',
    rooms: 70,
    baseOcc: 73.2,
    baseAdr: 2050,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-patagonia',
    img: forestImg,
  },
  {
    id: 'sosei-serengeti',
    name: 'SOSEI Serengeti',
    categoryId: 'nature',
    categoryName: 'SOSEI Nature',
    location: 'Serengeti, Tanzania',
    country: 'Tanzania',
    region: 'Middle East & Africa',
    rooms: 60,
    baseOcc: 71.5,
    baseAdr: 2210,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=sosei-serengeti',
    img: forestImg,
  },

  // ── SOSEI Wellness (175 Rooms) ───────────────────────────────────────────
  {
    id: 'sosei-kyoto',
    name: 'SOSEI Kyoto',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    location: 'Kyoto, Japan',
    country: 'Japan',
    region: 'Asia Pacific',
    rooms: 90,
    baseOcc: 74.0,
    baseAdr: 2250,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=sosei-kyoto',
    img: wellnessImg || desertImg,
  },
  {
    id: 'sosei-alula',
    name: 'SOSEI AlUla',
    categoryId: 'wellness',
    categoryName: 'SOSEI Wellness',
    location: 'AlUla, Saudi Arabia',
    country: 'Saudi Arabia',
    region: 'Middle East & Africa',
    rooms: 85,
    baseOcc: 73.5,
    baseAdr: 2340,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=sosei-alula',
    img: desertImg || wellnessImg,
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
  // Previous 9 property IDs mapped to new canonical IDs
  'sosei-andermatt': 'sosei-courchevel',
  'sosei-el-gouna': 'sosei-marrakech',
  'sosei-auh': 'sosei-alula',
  'sosei-melides': 'sosei-los-cabos',
  'sosei-umbria': 'sosei-amalfi',
  'sosei-tinos': 'sosei-muscat',
  'sosei-barcelona': 'sosei-geneva',
  'sosei-osa': 'sosei-patagonia',
  'sosei-bali': 'sosei-kyoto',
  // Earlier legacy IDs
  'sosei-nocturne': 'sosei-courchevel',
  'sosei-aurora': 'sosei-courchevel',
  'sosei-switzerland': 'sosei-courchevel',
  'sosei-canada': 'sosei-aspen',
  'sosei-marea': 'sosei-muscat',
  'sosei-maldives': 'sosei-seychelles',
  'sosei-pelagia': 'sosei-kyoto',
  'sosei-verper': 'sosei-geneva',
  'sosei-elan': 'sosei-geneva',
  'sosei-tokyo': 'sosei-niseko',
  'sosei-hearth': 'sosei-patagonia',
  'sosei-pastoral': 'sosei-patagonia',
  'sosei-costa-rica': 'sosei-patagonia',
  'sosei-sylvan': 'sosei-serengeti',
  'sosei-japan': 'sosei-kyoto',
  'sosei-verdant': 'sosei-alula',
  'sosei-oman': 'sosei-muscat',
  'sosei-mirage': 'sosei-marrakech',
  'sosei-egypt': 'sosei-marrakech',
  'sosei-solstice': 'sosei-alula',
  // Category IDs passed to ?id= on property route
  ski: 'sosei-courchevel',
  'beach-resort': 'sosei-amalfi',
  urban: 'sosei-geneva',
  nature: 'sosei-patagonia',
  wellness: 'sosei-kyoto',
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
  if (!rawId) return 'sosei-geneva';
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
