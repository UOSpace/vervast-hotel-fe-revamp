import asiaPacificImg from '@/assets/regions/asia_pacific.jpg';
import europeImg from '@/assets/regions/europe.jpg';
import americaImg from '@/assets/regions/america.jpg';
import middleEastImg from '@/assets/regions/middle_east.jpg';
import africaImg from '@/assets/regions/africa.jpg';

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

export const MASTER_REGIONS: RegionalMasterItem[] = [
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    displayName: 'Asia Pacific Region',
    shortName: 'ASIA PACIFIC',
    img: asiaPacificImg,
    share: 35.0,
    adr: 2569,
    revenue: 1880000,
    revenueDisplay: '$1.88M',
    roomNights: 732,
    baseOcc: 73.5,
    description: 'Premier archipelagos, cultural capitals, and dramatic coastlines across East Asia and the Pacific.',
    countries: ['Japan', 'Indonesia', 'Maldives', 'Australia', 'Singapore'],
  },
  {
    id: 'europe',
    name: 'Europe',
    displayName: 'Europe & Mediterranean',
    shortName: 'EUROPE',
    img: europeImg,
    share: 25.0,
    adr: 2947,
    revenue: 1540000,
    revenueDisplay: '$1.54M',
    roomNights: 523,
    baseOcc: 71.0,
    description: 'Iconic continental landmarks, alpine glacier summits, and Mediterranean coastal sanctuaries.',
    countries: ['Spain', 'Switzerland', 'France', 'Italy', 'United Kingdom'],
  },
  {
    id: 'america',
    name: 'America',
    displayName: 'The Americas',
    shortName: 'AMERICA',
    img: americaImg,
    share: 20.0,
    adr: 2325,
    revenue: 970000,
    revenueDisplay: '$0.97M',
    roomNights: 418,
    baseOcc: 67.8,
    description: 'High-altitude mountain chalets, Pacific rainforests, and vibrant metropolitan hubs.',
    countries: ['Canada', 'Costa Rica', 'United States', 'Mexico', 'Brazil'],
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    displayName: 'Middle East & Arabian Gulf',
    shortName: 'MIDDLE EAST',
    img: middleEastImg,
    share: 12.0,
    adr: 2082,
    revenue: 520000,
    revenueDisplay: '$0.52M',
    roomNights: 251,
    baseOcc: 64.5,
    description: 'Oasis healing sanctuaries, dramatic canyon valleys, and desert wellness architecture.',
    countries: ['Oman', 'Saudi Arabia', 'United Arab Emirates', 'Qatar'],
  },
  {
    id: 'africa',
    name: 'Africa',
    displayName: 'African Continent',
    shortName: 'AFRICA',
    img: africaImg,
    share: 7.9,
    adr: 1839,
    revenue: 310000,
    revenueDisplay: '$0.31M',
    roomNights: 166,
    baseOcc: 62.0,
    description: 'Ancient desert springs, Nile river sanctums, and pristine conservation wilderness.',
    countries: ['Egypt', 'Morocco', 'South Africa', 'Kenya', 'Tanzania'],
  },
];

export const REGIONAL_TOTALS = {
  totalRevenue: 5220000,
  totalRevenueDisplay: '$5.22M',
  totalRoomNights: 2090,
  avgAdr: 2498,
  avgOcc: 69.7,
  avgRevpar: 1741,
  totalHotelRevenue: 6730000,
  totalHotelRevenueDisplay: '$6.73M',
  pillars: {
    rooms: { val: '$5.22M', pct: '77.6%' },
    fnb: { val: '$0.97M', pct: '14.5%' },
    spa: { val: '$0.35M', pct: '5.3%' },
    activities: { val: '$0.18M', pct: '2.6%' },
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
