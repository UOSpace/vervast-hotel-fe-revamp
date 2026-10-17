import asiaPacificImg from '@/assets/regions/asia_pacific.jpg';
import europeImg from '@/assets/regions/europe.jpg';
import americaImg from '@/assets/regions/america.jpg';
import middleEastImg from '@/assets/regions/middle_east.jpg';
import africaImg from '@/assets/regions/africa.jpg';
import {
  getPortfolioMetrics,
  getPropertyIdsByRegion,
  fmtUsd,
  fmtPct,
} from '@/data/portfolio';

export type RegionId = 'asia-pacific' | 'europe' | 'america' | 'middle-east' | 'africa';

export interface RegionalMasterItem {
  id: RegionId;
  name: string;
  displayName: string;
  shortName: string;
  img: string;
  share: number;        // in %
  adr: number;          // in USD
  revenue: number;      // raw in USD
  revenueDisplay: string; // e.g. "$1.88M"
  roomNights: number;
  baseOcc: number;      // in %
  description: string;
  countries: string[];
}

type RegionalSeedItem = Omit<
  RegionalMasterItem,
  'share' | 'adr' | 'revenue' | 'revenueDisplay' | 'roomNights' | 'baseOcc'
>;

const REGION_SEEDS: RegionalSeedItem[] = [
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    displayName: 'Asia Pacific Region',
    shortName: 'ASIA PACIFIC',
    img: asiaPacificImg,
    description: 'Premier archipelagos, holistic wellness retreats, and dramatic coastlines across Bali and the Pacific.',
    countries: ['Indonesia', 'Singapore', 'Australia', 'Thailand'],
  },
  {
    id: 'europe',
    name: 'Europe',
    displayName: 'Europe & Mediterranean',
    shortName: 'EUROPE',
    img: europeImg,
    description: 'Iconic continental landmarks, alpine glacier summits, and Mediterranean & Atlantic coastal properties.',
    countries: ['Switzerland', 'Portugal', 'Italy', 'Greece', 'Spain'],
  },
  {
    id: 'america',
    name: 'America',
    displayName: 'The Americas',
    shortName: 'AMERICA',
    img: americaImg,
    description: 'Biodiverse Pacific rainforests, eco-wilderness sanctuaries, and vibrant continental hubs.',
    countries: ['Costa Rica', 'United States', 'Mexico', 'Brazil'],
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    displayName: 'Middle East & Arabian Gulf',
    shortName: 'MIDDLE EAST',
    img: middleEastImg,
    description: 'Private Arabian Gulf island resorts, coastal sanctuaries, and luxury waterfront architecture.',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Oman', 'Qatar'],
  },
  {
    id: 'africa',
    name: 'Africa',
    displayName: 'African Continent',
    shortName: 'AFRICA',
    img: africaImg,
    description: 'Red Sea coral lagoons, coastal desert retreats, and pristine conservation wilderness.',
    countries: ['Egypt', 'Morocco', 'South Africa', 'Kenya', 'Tanzania'],
  },
];

const _mtdPortfolio = getPortfolioMetrics(undefined, 'mtd');

export const MASTER_REGIONS: RegionalMasterItem[] = REGION_SEEDS.map((seed) => {
  const m = getPortfolioMetrics(getPropertyIdsByRegion([seed.id]), 'mtd');
  const share = _mtdPortfolio.roomsSold > 0
    ? Number(((m.roomsSold / _mtdPortfolio.roomsSold) * 100).toFixed(1))
    : 0;
  return {
    ...seed,
    share,
    adr: Math.round(m.adr),
    revenue: m.roomRevenue,
    revenueDisplay: fmtUsd(m.roomRevenue),
    roomNights: m.roomsSold,
    baseOcc: Number(m.occupancyPct.toFixed(1)),
  };
});

const _totHotelRev = _mtdPortfolio.totalRevenue || 1;

export const REGIONAL_TOTALS = {
  totalRevenue: _mtdPortfolio.roomRevenue,
  totalRevenueDisplay: fmtUsd(_mtdPortfolio.roomRevenue),
  totalRoomNights: _mtdPortfolio.roomsSold,
  avgAdr: Math.round(_mtdPortfolio.adr),
  avgOcc: Number(_mtdPortfolio.occupancyPct.toFixed(1)),
  avgRevpar: Math.round(_mtdPortfolio.revpar),
  totalHotelRevenue: _mtdPortfolio.totalRevenue,
  totalHotelRevenueDisplay: fmtUsd(_mtdPortfolio.totalRevenue),
  pillars: {
    rooms: {
      val: fmtUsd(_mtdPortfolio.roomRevenue),
      pct: fmtPct((_mtdPortfolio.roomRevenue / _totHotelRev) * 100),
    },
    fnb: {
      val: fmtUsd(_mtdPortfolio.fnbRevenue),
      pct: fmtPct((_mtdPortfolio.fnbRevenue / _totHotelRev) * 100),
    },
    spa: {
      val: fmtUsd(_mtdPortfolio.spaRevenue),
      pct: fmtPct((_mtdPortfolio.spaRevenue / _totHotelRev) * 100),
    },
    activities: {
      val: fmtUsd(_mtdPortfolio.experienceRevenue),
      pct: fmtPct((_mtdPortfolio.experienceRevenue / _totHotelRev) * 100),
    },
  },
};

export function resolveRegionId(id: string): RegionId {
  const norm = id.toLowerCase().replace(/[\s_]+/g, '-');
  if (norm.includes('asia') || norm.includes('pacific')) return 'asia-pacific';
  if (norm.includes('euro')) return 'europe';
  if (norm.includes('americ')) return 'america';
  if (norm.includes('middle') || norm.includes('east')) return 'middle-east';
  if (norm.includes('afri')) return 'africa';
  return 'asia-pacific';
}

export function formatRegionSelectionTitle(ids: string[]): string {
  if (!ids || ids.length === 0 || ids.length === MASTER_REGIONS.length) {
    return 'All Global Regions Combined';
  }
  const names = ids.map(id => {
    const reg = MASTER_REGIONS.find(r => r.id === resolveRegionId(id));
    return reg ? reg.name : id;
  });
  return names.join(' & ');
}
