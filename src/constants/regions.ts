import asiaPacificImg from '@/assets/regions/asia_pacific.jpg';
import europeImg from '@/assets/regions/europe.jpg';
import americaImg from '@/assets/regions/america.jpg';
import middleEastImg from '@/assets/regions/middle_east.jpg';
import africaImg from '@/assets/regions/africa.jpg';
import {
  getPortfolioMetrics,
  getPropertyIdsByRegion,
  fmtUsd,
} from '@/data/portfolio';

export type RegionId = 'asia-pacific' | 'europe' | 'america' | 'middle-east' | 'africa';

export interface GlobalRegion {
  id: RegionId;
  name: string;           // e.g. "Asia Pacific", "Europe"
  displayName: string;    // e.g. "Asia Pacific"
  shortName: string;      // e.g. "APAC", "EUROPE"
  description: string;
  img: string;
  share: number;          // % share of portfolio room nights (MTD)
  adr: number;            // Average Daily Rate (USD, MTD)
  revenue: number;        // Room Revenue in Millions (e.g. 5.18 = $5.18M, MTD)
  revenueDisplay: string; // Formatted revenue string (MTD)
  roomNights: number;     // Occupied room nights (MTD)
  baseOcc: number;        // Occupancy % (MTD)
  countries: string[];
}

interface RegionSeed {
  id: RegionId;
  name: string;
  displayName: string;
  shortName: string;
  description: string;
  img: string;
  countries: string[];
}

const REGION_SEEDS: RegionSeed[] = [
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    displayName: 'Asia Pacific Region',
    shortName: 'ASIA PACIFIC',
    img: asiaPacificImg,
    description: 'Sacred Kyoto sanctuaries, Hokkaido powder peaks, and untouched Sumba island coastlines.',
    countries: ['Japan', 'Indonesia', 'Singapore', 'Australia'],
  },
  {
    id: 'europe',
    name: 'Europe',
    displayName: 'Europe & Mediterranean',
    shortName: 'EUROPE',
    img: europeImg,
    description: 'French Alps glacier chalets, Lake Geneva landmarks, and Tyrrhenian cliffside palazzos.',
  countries: ['France', 'Italy', 'Switzerland', 'United Kingdom'],
  },
  {
    id: 'america',
    name: 'America',
    displayName: 'The Americas',
    shortName: 'AMERICA',
    img: americaImg,
    description: 'Colorado Rocky Mountain summits, Baja California desert shores, and Patagonian granite peaks.',
    countries: ['United States', 'Chile', 'Mexico', 'Brazil'],
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    displayName: 'Middle East & Arabian Gulf',
    shortName: 'MIDDLE EAST',
    img: middleEastImg,
    description: 'Ancient Nabataean sandstone canyons in AlUla and dramatic Gulf of Oman cliffside coves.',
    countries: ['Saudi Arabia', 'Oman', 'United Arab Emirates', 'Qatar'],
  },
  {
    id: 'africa',
    name: 'Africa',
    displayName: 'African Continent',
    shortName: 'AFRICA',
    img: africaImg,
    description: 'Royal Marrakech palmeraie riads, Serengeti migration plains, and Seychelles granite islands.',
    countries: ['Morocco', 'Tanzania', 'Seychelles', 'South Africa'],
  },
];

const portfolioMtd = getPortfolioMetrics(undefined, 'mtd');
const totalPortfolioRn = portfolioMtd.roomsSold || 1;

/**
 * MASTER GLOBAL REGIONS
 * Derived 100% from the unified portfolio engine (MTD)
 */
export const MASTER_REGIONS: GlobalRegion[] = REGION_SEEDS.map((seed) => {
  const propIds = getPropertyIdsByRegion([seed.id]);
  const m = getPortfolioMetrics(propIds, 'mtd');
  const sharePct = Math.round((m.roomsSold / totalPortfolioRn) * 100);
  const revMillions = Number((m.roomRevenue / 1_000_000).toFixed(2));
  return {
    ...seed,
    share: sharePct,
    adr: Math.round(m.adr),
    revenue: revMillions,
    revenueDisplay: fmtUsd(m.roomRevenue),
    roomNights: m.roomsSold,
    baseOcc: Number(m.occupancyPct.toFixed(1)),
  };
});

/**
 * Backward compatibility alias map for legacy or varied region names
 */
export const LEGACY_REGION_MAP: Record<string, RegionId> = {
  'asia-pacific': 'asia-pacific',
  'asia pacific': 'asia-pacific',
  apac: 'asia-pacific',
  asia: 'asia-pacific',
  europe: 'europe',
  eu: 'europe',
  america: 'america',
  americas: 'america',
  us: 'america',
  'north-america': 'america',
  'middle-east': 'middle-east',
  'middle east': 'middle-east',
  mea: 'middle-east',
  'middle east & africa': 'middle-east',
  africa: 'africa',
};

/**
 * Region lookup map indexed by RegionId
 */
export const REGION_MAP: Record<RegionId, GlobalRegion> = MASTER_REGIONS.reduce(
  (acc, reg) => {
    acc[reg.id] = reg;
    return acc;
  },
  {} as Record<RegionId, GlobalRegion>
);

/**
 * Resolves any region string/ID to a canonical RegionId
 */
export function resolveRegionId(rawId?: string): RegionId {
  if (!rawId) return 'europe';
  const clean = rawId.toLowerCase().trim();
  return LEGACY_REGION_MAP[clean] || 'europe';
}

/**
 * Gets region details by ID
 */
export function getRegionById(id?: string): GlobalRegion {
  const canonicalId = resolveRegionId(id);
  return REGION_MAP[canonicalId] || MASTER_REGIONS[0];
}

/**
 * Formats display title when 1 or multiple regions are selected
 */
export function formatRegionSelectionTitle(activeRegionIds: string[]): string {
  if (!activeRegionIds || activeRegionIds.length === 0) return 'All Global Regions';
  const canonicalIds = Array.from(new Set(activeRegionIds.map(resolveRegionId)));
  if (canonicalIds.length === MASTER_REGIONS.length) return 'All Global Regions';
  if (canonicalIds.length === 1) {
    const reg = REGION_MAP[canonicalIds[0]];
    return reg ? reg.name : 'Selected Region';
  }
  return `${canonicalIds.length} Regions Selected`;
}

/**
 * Global portfolio totals across all 5 regions (derived from engine MTD)
 */
export const REGIONAL_TOTALS = {
  share: 100,
  totalRoomNights: portfolioMtd.roomsSold,
  totalRevenue: Number((portfolioMtd.roomRevenue / 1_000_000).toFixed(2)),
  totalRevenueDisplay: fmtUsd(portfolioMtd.roomRevenue),
  weightedAdr: Math.round(portfolioMtd.adr),
  weightedOcc: Number(portfolioMtd.occupancyPct.toFixed(1)),
};
