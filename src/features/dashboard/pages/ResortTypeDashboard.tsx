import { useState, useMemo } from 'react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { ResortKPIWidget } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortGeoMarketWidget } from '../components/widgets/resort-type/ResortGeoMarketWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';
export interface CalculatedPropertyRow {
  id: string;
  name: string;
  category: string;
  location: string;
  country: string;
  rooms: number;
  availableNights: number;
  occupiedNights: number;
  occupancyPct: number;
  adr: number;
  revpar: number;
  roomRevenue: number;
  status: 'above_plan' | 'on_plan' | 'attention';
  statusLabel: string;
  propertyRoute: string;
}

export interface PropertyTableTotals {
  totalRooms: number;
  totalAvailableNights: number;
  totalOccupiedNights: number;
  avgOccupancyPct: number;
  avgAdr: number;
  avgRevpar: number;
  totalRevenue: number;
}

// Room counts per category across all 12 properties (total 789 rooms)
export const categoryRooms: Record<string, number> = {
  alpine: 116,
  ocean: 130,
  city: 198,
  forest: 94,
  countryside: 114,
  desert: 137,
};

// Master category-level hotel properties configuration (100% synchronized with global overview & PMS)
export interface CategoryPropertyDefinition {
  id: string;
  name: string;
  category: string;
  location: string;
  country: string;
  rooms: number;
  baseOcc: number;
  baseAdr: number;
  status: 'above_plan' | 'on_plan' | 'attention';
  statusLabel: string;
  propertyRoute: string;
}

export const CATEGORY_HOTEL_PROPERTIES: CategoryPropertyDefinition[] = [
  // Alpine (116 rooms total)
  {
    id: 'sosei-nocturne',
    name: 'SOSEI NOCTURNE',
    category: 'alpine',
    location: 'Zermatt, Switzerland',
    country: 'Switzerland',
    rooms: 72,
    baseOcc: 77.8,
    baseAdr: 2750,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=alpine',
  },
  {
    id: 'sosei-aurora',
    name: 'SOSEI AURORA',
    category: 'alpine',
    location: 'Rovaniemi, Finland',
    country: 'Finland',
    rooms: 44,
    baseOcc: 73.1,
    baseAdr: 2618,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=alpine',
  },

  // Ocean (130 rooms total)
  {
    id: 'sosei-marea',
    name: 'SOSEI MARÉA',
    category: 'ocean',
    location: 'North Malé Atoll, Maldives',
    country: 'Maldives',
    rooms: 58,
    baseOcc: 75.9,
    baseAdr: 2380,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=ocean',
  },
  {
    id: 'sosei-pelagia',
    name: 'SOSEI PELAGIA',
    category: 'ocean',
    location: 'Uluwatu, Indonesia',
    country: 'Indonesia',
    rooms: 72,
    baseOcc: 68.9,
    baseAdr: 2055,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=ocean',
  },

  // City (198 rooms total -> exactly yields 68% occ, $2,500 ADR, $1,700 RevPAR, 1,212 RN, $3.03M rev for 9 days)
  {
    id: 'sosei-verper',
    name: 'SOSEI VERPER',
    category: 'city',
    location: 'New York, USA',
    country: 'USA',
    rooms: 115,
    baseOcc: 66.0,
    baseAdr: 2580,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=city',
  },
  {
    id: 'sosei-elan',
    name: 'SOSEI ÉLAN',
    category: 'city',
    location: 'Los Angeles, USA',
    country: 'USA',
    rooms: 83,
    baseOcc: 70.8,
    baseAdr: 2397,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=city',
  },

  // Forest (94 rooms total)
  {
    id: 'sosei-sylvan',
    name: 'SOSEI SYLVAN',
    category: 'forest',
    location: 'Kyoto, Japan',
    country: 'Japan',
    rooms: 46,
    baseOcc: 67.4,
    baseAdr: 1750,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=forest',
  },
  {
    id: 'sosei-verdant',
    name: 'SOSEI VERDANT',
    category: 'forest',
    location: 'Chiang Mai, Thailand',
    country: 'Thailand',
    rooms: 48,
    baseOcc: 52.9,
    baseAdr: 1456,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=forest',
  },

  // Countryside (114 rooms total)
  {
    id: 'sosei-hearth',
    name: 'SOSEI HEARTH',
    category: 'countryside',
    location: 'Tuscany, Italy',
    country: 'Italy',
    rooms: 62,
    baseOcc: 75.8,
    baseAdr: 1920,
    status: 'above_plan',
    statusLabel: 'Above Plan',
    propertyRoute: '/dashboard/property?id=countryside',
  },
  {
    id: 'sosei-pastoral',
    name: 'SOSEI PASTORAL',
    category: 'countryside',
    location: 'Provence, France',
    country: 'France',
    rooms: 52,
    baseOcc: 67.4,
    baseAdr: 1657,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=countryside',
  },

  // Desert (137 rooms total)
  {
    id: 'sosei-mirage',
    name: 'SOSEI MIRAGE',
    category: 'desert',
    location: 'Giza / Siwa, Egypt',
    country: 'Egypt',
    rooms: 64,
    baseOcc: 57.8,
    baseAdr: 1720,
    status: 'attention',
    statusLabel: 'Attention',
    propertyRoute: '/dashboard/property?id=desert',
  },
  {
    id: 'sosei-solstice',
    name: 'SOSEI SOLSTICE',
    category: 'desert',
    location: 'Jebel Akhdar, Oman',
    country: 'Oman',
    rooms: 73,
    baseOcc: 62.0,
    baseAdr: 1870,
    status: 'on_plan',
    statusLabel: 'On Plan',
    propertyRoute: '/dashboard/property?id=desert',
  },
];

// Static breakdown configurations
const geoConfigs = [
  { region: 'Asia Pacific', share: 35, adrFactor: 0.95 },
  { region: 'Europe', share: 25, adrFactor: 1.09 },
  { region: 'America', share: 20, adrFactor: 0.86 },
  { region: 'Middle East', share: 12, adrFactor: 0.77 },
  { region: 'Africa', share: 8, adrFactor: 0.68 },
];

const segmentConfigs = [
  { segment: 'Leisure', share: 55, adrFactor: 0.92, color: '#0f172a' },
  { segment: 'Business', share: 25, adrFactor: 1.09, color: '#334155' },
  { segment: 'Social', share: 10, adrFactor: 0.68, color: '#64748b' },
  { segment: 'MICE', share: 7, adrFactor: 0.97, color: '#94a3b8' },
  { segment: 'Others', share: 3, adrFactor: 0.61, color: '#cbd5e1' },
];

const channelConfigs = [
  { channel: 'Direct', share: 33, adrFactor: 1.11, color: '#0f172a' },
  { channel: 'OTA', share: 28, adrFactor: 0.81, color: '#334155' },
  { channel: 'Consortia', share: 15, adrFactor: 0.87, color: '#64748b' },
  { channel: 'Own Web', share: 11, adrFactor: 1.06, color: '#94a3b8' },
  { channel: 'Others', share: 13, adrFactor: 0.71, color: '#cbd5e1' },
];

// Helper to distribute metrics to categories consistently
interface DistributionItem {
  name: string;
  share: number;
  nights: number;
  adr: number;
  revenue: number;
}

function distributeMetrics(
  categories: { name: string; share: number; adrFactor: number }[],
  totalNights: number,
  totalRevenue: number,
  avgAdr: number
): DistributionItem[] {
  if (totalNights <= 0) {
    return categories.map(cat => ({
      name: cat.name,
      share: cat.share,
      nights: 0,
      adr: 0,
      revenue: 0,
    }));
  }

  let nightsSum = 0;
  const list = categories.map((cat, idx) => {
    let nights = Math.round(totalNights * (cat.share / 100));
    if (idx === categories.length - 1) {
      nights = Math.max(0, totalNights - nightsSum);
    }
    nightsSum += nights;
    return { ...cat, nights };
  });

  let revenueSum = 0;
  const listWithRev = list.map(item => {
    const itemAdr = avgAdr * item.adrFactor;
    const itemRev = item.nights * itemAdr;
    revenueSum += itemRev;
    return { ...item, rawRevenue: itemRev };
  });

  let finalRevSum = 0;
  const factor = revenueSum > 0 ? totalRevenue / revenueSum : 1;

  return listWithRev.map((item, idx) => {
    let rev = item.rawRevenue * factor;
    if (idx === listWithRev.length - 1) {
      rev = Math.max(0, totalRevenue - finalRevSum);
    }
    finalRevSum += rev;

    const adr = item.nights > 0 ? Math.round(rev / item.nights) : 0;

    return {
      name: item.name,
      share: item.share,
      nights: item.nights,
      adr,
      revenue: rev
    };
  });
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Ohayō Alfonso!';
  if (hour >= 12 && hour < 18) return 'Konnichiwa Alfonso!';
  return 'Konbanwa Alfonso!';
};

const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { date, time, tz };
};

export function ResortTypeDashboard() {
  const [activeResorts, setActiveResorts] = useState<string[]>(['city']);
  const { date, time, tz } = getFormattedDateTime();

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const prevMonthToday = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [startDate, setStartDate] = useState<Date | null>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const compStartDate = firstDayOfPrevMonth;
  const compEndDate = prevMonthToday;

  // Calculate days in the current date range (inclusive)
  const days = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }, [startDate, endDate]);

  // Calculate days in the comparison date range (inclusive)
  const compDays = useMemo(() => {
    if (!compStartDate || !compEndDate) return days;
    const start = new Date(compStartDate.getFullYear(), compStartDate.getMonth(), compStartDate.getDate());
    const end = new Date(compEndDate.getFullYear(), compEndDate.getMonth(), compEndDate.getDate());
    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }, [compStartDate, compEndDate, days]);

  const activeList = useMemo(() => {
    return activeResorts.length > 0 ? activeResorts : ['city'];
  }, [activeResorts]);

  // Active category display name
  const categoryDisplayName = useMemo(() => {
    if (activeList.length === 6) return 'All Collections';
    if (activeList.length === 1) {
      const cat = activeList[0];
      const names: Record<string, string> = {
        city: 'City Collection',
        alpine: 'Alpine Collection',
        ocean: 'Ocean Collection',
        forest: 'Forest Collection',
        countryside: 'Countryside Collection',
        desert: 'Desert Collection',
      };
      return names[cat] || 'Category';
    }
    return `${activeList.length} Collections`;
  }, [activeList]);

  // Filter properties belonging to active selected categories
  const activeProperties = useMemo(() => {
    return CATEGORY_HOTEL_PROPERTIES.filter(p => activeList.includes(p.category));
  }, [activeList]);

  // Dynamically calculate individual properties based on selected date range days
  const calculatedProperties: CalculatedPropertyRow[] = useMemo(() => {
    return activeProperties.map(prop => {
      const availableNights = prop.rooms * days;
      const occupiedNights = Math.round(availableNights * (prop.baseOcc / 100));
      const roomRevenue = occupiedNights * prop.baseAdr;
      const revpar = availableNights > 0 ? Math.round(roomRevenue / availableNights) : 0;

      return {
        id: prop.id,
        name: prop.name,
        category: prop.category,
        location: prop.location,
        country: prop.country,
        rooms: prop.rooms,
        availableNights,
        occupiedNights,
        occupancyPct: prop.baseOcc,
        adr: prop.baseAdr,
        revpar,
        roomRevenue,
        status: prop.status,
        statusLabel: prop.statusLabel,
        propertyRoute: prop.propertyRoute,
      };
    });
  }, [activeProperties, days]);

  // Calculate unified totals directly from properties (Ensures 100% mathematical consistency)
  const propertyTotals: PropertyTableTotals = useMemo(() => {
    const totalRooms = calculatedProperties.reduce((sum, p) => sum + p.rooms, 0);
    const totalAvailableNights = calculatedProperties.reduce((sum, p) => sum + p.availableNights, 0);
    const totalOccupiedNights = calculatedProperties.reduce((sum, p) => sum + p.occupiedNights, 0);
    const totalRevenue = calculatedProperties.reduce((sum, p) => sum + p.roomRevenue, 0);
    const avgOccupancyPct = totalAvailableNights > 0 ? Number(((totalOccupiedNights / totalAvailableNights) * 100).toFixed(1)) : 0;
    const avgAdr = totalOccupiedNights > 0 ? Math.round(totalRevenue / totalOccupiedNights) : 0;
    const avgRevpar = totalAvailableNights > 0 ? Math.round(totalRevenue / totalAvailableNights) : 0;

    return {
      totalRooms,
      totalAvailableNights,
      totalOccupiedNights,
      avgOccupancyPct,
      avgAdr,
      avgRevpar,
      totalRevenue,
    };
  }, [calculatedProperties]);

  const { totalOccupiedNights, totalRevenue, avgOcc, avgAdr, avgRevpar } = useMemo(() => {
    return {
      totalOccupiedNights: propertyTotals.totalOccupiedNights,
      totalRevenue: propertyTotals.totalRevenue,
      avgOcc: propertyTotals.avgOccupancyPct,
      avgAdr: propertyTotals.avgAdr,
      avgRevpar: propertyTotals.avgRevpar,
    };
  }, [propertyTotals]);

  // Calculate comparison metrics for selected properties and compDays to derive realistic YoY trends
  const compMetrics = useMemo(() => {
    let totalCompAvail = 0;
    let totalCompOccupied = 0;
    let totalCompRevenue = 0;

    activeProperties.forEach(prop => {
      const compAvail = prop.rooms * compDays;
      const compOcc = prop.baseOcc * 0.95; // Realized comparison benchmark
      const compOccNights = Math.round(compAvail * (compOcc / 100));
      const compAdr = Math.round(prop.baseAdr * 0.97);
      const compRev = compOccNights * compAdr;

      totalCompAvail += compAvail;
      totalCompOccupied += compOccNights;
      totalCompRevenue += compRev;
    });

    const compAvgOcc = totalCompAvail > 0 ? Number(((totalCompOccupied / totalCompAvail) * 100).toFixed(1)) : 0;
    const compAvgAdr = totalCompOccupied > 0 ? Math.round(totalCompRevenue / totalCompOccupied) : 0;
    const compAvgRevpar = totalCompAvail > 0 ? Math.round(totalCompRevenue / totalCompAvail) : 0;

    return {
      totalOccupiedNights: totalCompOccupied,
      totalRevenue: totalCompRevenue,
      avgOcc: compAvgOcc,
      avgAdr: compAvgAdr,
      avgRevpar: compAvgRevpar,
    };
  }, [activeProperties, compDays]);

  const dynamicTotal = useMemo(() => {
    return totalOccupiedNights.toLocaleString();
  }, [totalOccupiedNights]);

  const categoryKpiData = useMemo(() => {
    // 5 Hospitality Pillars calculation (exact proportional match to Global Overview & Hotel Business Heart)
    // Global Overview baseline: Rooms $118M (77.6%), F&B $22M (14.5%), Spa $8M (5.3%), Activities $4M (2.6%) -> Total $152M
    const roomsRev = totalRevenue;
    const fnbRev = roomsRev * (22 / 118);
    const spaRev = roomsRev * (8 / 118);
    const actRev = roomsRev * (4 / 118);
    const totalHotelRev = roomsRev + fnbRev + spaRev + actRev;

    // Comparison period total hotel revenue
    const compRoomsRev = compMetrics.totalRevenue;
    const compTotalHotelRev = compRoomsRev * (152 / 118);

    // Percentage formats
    const formatPctChange = (current: number, previous: number) => {
      if (previous === 0) return '+0.0%';
      const diff = ((current - previous) / previous) * 100;
      const sign = diff >= 0 ? '+' : '';
      return `${sign}${diff.toFixed(1)}%`;
    };

    const formatPpChange = (current: number, previous: number) => {
      const diff = current - previous;
      const sign = diff >= 0 ? '+' : '';
      return `${sign}${diff.toFixed(1)} pts`;
    };

    const formatDiffAmount = (current: number, previous: number) => {
      const diff = current - previous;
      const sign = diff >= 0 ? '+' : '-';
      const abs = Math.abs(diff);
      const str = abs >= 1000000 ? `$${(abs / 1000000).toFixed(2)}M` : `$${Math.round(abs / 1000)}K`;
      const pct = previous > 0 ? ((diff / previous) * 100).toFixed(1) : '0.0';
      return `${sign}${str} vs LY (${sign}${pct}%)`;
    };

    const totalHotelPctChange = formatPctChange(totalHotelRev, compTotalHotelRev);
    const roomRevPctChange = formatDiffAmount(roomsRev, compRoomsRev);
    const occPtsChange = formatPpChange(avgOcc, compMetrics.avgOcc);

    const adrDiff = avgAdr - compMetrics.avgAdr;
    const adrDiffPct = compMetrics.avgAdr > 0 ? ((adrDiff / compMetrics.avgAdr) * 100).toFixed(1) : '0.0';
    const adrDiffStr = `${adrDiff >= 0 ? '+' : '-'}$${Math.abs(adrDiff)} vs LY (${adrDiff >= 0 ? '+' : ''}${adrDiffPct}%)`;

    const revparDiff = avgRevpar - compMetrics.avgRevpar;
    const revparDiffPct = compMetrics.avgRevpar > 0 ? ((revparDiff / compMetrics.avgRevpar) * 100).toFixed(1) : '0.0';
    const revparDiffStr = `${revparDiff >= 0 ? '+' : '-'}$${Math.abs(revparDiff)} vs LY (${revparDiff >= 0 ? '+' : ''}${revparDiffPct}%)`;

    return {
      categoryName: categoryDisplayName,
      totalRevenue: {
        value: `$${(totalHotelRev / 1000000).toFixed(2)}M`,
        vsLy: `${totalHotelPctChange} vs LY`,
        vsBudget: '+4.0% vs Budget',
        vsForecast: '+1.9% vs Forecast',
        upLy: totalHotelRev >= compTotalHotelRev,
        upBudget: true,
        upForecast: true,
        breakdown: [
          { label: 'Rooms', val: `$${(roomsRev / 1000000).toFixed(2)}M`, pct: '77.6%' },
          { label: 'F&B', val: `$${(fnbRev / 1000000).toFixed(2)}M`, pct: '14.5%' },
          { label: 'Spa', val: `$${(spaRev / 1000000).toFixed(2)}M`, pct: '5.3%' },
          { label: 'Activities', val: `$${(actRev / 1000000).toFixed(2)}M`, pct: '2.6%' },
        ],
      },
      occupancy: {
        value: `${avgOcc.toFixed(1)}%`,
        vsLy: `${occPtsChange} vs LY`,
        vsBudget: '+2.1 pts vs Budget',
        vsForecast: '+1.2 pts vs Forecast',
        upLy: avgOcc >= compMetrics.avgOcc,
        upBudget: true,
        upForecast: true,
        tooltip: 'Occupancy rate for active category compared with LY, budget, and forecast targets (percentage-point variance).',
      },
      adr: {
        value: `$${avgAdr.toLocaleString()}`,
        vsLy: adrDiffStr,
        vsBudget: '+$42 vs Budget (+1.7%)',
        vsForecast: '+$18 vs Forecast (+0.7%)',
        upLy: avgAdr >= compMetrics.avgAdr,
        upBudget: true,
        upForecast: true,
        tooltip: 'Average Daily Rate across active category (Room Revenue / Rooms Sold).',
      },
      revPar: {
        value: `$${avgRevpar.toLocaleString()}`,
        vsLy: revparDiffStr,
        vsBudget: '+$48 vs Budget (+2.9%)',
        vsForecast: '+$22 vs Forecast (+1.3%)',
        upLy: avgRevpar >= compMetrics.avgRevpar,
        upBudget: true,
        upForecast: true,
        tooltip: 'Revenue Per Available Room, calculated as Occupancy multiplied by ADR.',
      },
      roomRevenue: {
        value: `$${(roomsRev / 1000000).toFixed(2)}M`,
        vsLy: roomRevPctChange,
        vsBudget: '+$142K vs Budget (+4.9%)',
        vsForecast: '+$62K vs Forecast (+2.1%)',
        upLy: roomsRev >= compRoomsRev,
        upBudget: true,
        upForecast: true,
        tooltip: 'Room Revenue generation for active category during the selected period.',
      },
    };
  }, [totalRevenue, compMetrics, avgOcc, avgAdr, avgRevpar, categoryDisplayName]);

  // Compute synchronized breakdown data
  const geoDistribution = useMemo(() => {
    return distributeMetrics(
      geoConfigs.map(c => ({ name: c.region, share: c.share, adrFactor: c.adrFactor })),
      totalOccupiedNights,
      totalRevenue,
      avgAdr
    );
  }, [totalOccupiedNights, totalRevenue, avgAdr]);

  const segmentDistribution = useMemo(() => {
    return distributeMetrics(
      segmentConfigs.map(c => ({ name: c.segment, share: c.share, adrFactor: c.adrFactor })),
      totalOccupiedNights,
      totalRevenue,
      avgAdr
    );
  }, [totalOccupiedNights, totalRevenue, avgAdr]);

  const channelDistribution = useMemo(() => {
    return distributeMetrics(
      channelConfigs.map(c => ({ name: c.channel, share: c.share, adrFactor: c.adrFactor })),
      totalOccupiedNights,
      totalRevenue,
      avgAdr
    );
  }, [totalOccupiedNights, totalRevenue, avgAdr]);

  const dynamicGeoData = useMemo(() => {
    const tableData = geoDistribution.map(item => ({
      region: item.name,
      rnights: totalOccupiedNights > 0 ? `${((item.nights / totalOccupiedNights) * 100).toFixed(1)}%` : '0.0%',
      adr: `$${item.adr.toLocaleString()}`,
      revenue: `$${(item.revenue / 1000000).toFixed(2)}M`,
    }));

    // Append total row
    tableData.push({
      region: 'Total',
      rnights: '100%',
      adr: `$${avgAdr.toLocaleString()}`,
      revenue: `$${(totalRevenue / 1000000).toFixed(2)}M`,
      isTotal: true
    } as any);

    return tableData;
  }, [geoDistribution, totalOccupiedNights, totalRevenue, avgAdr]);

  const dynamicSegmentData = useMemo(() => {
    return segmentConfigs.map(cfg => {
      const finalItem = segmentDistribution.find(item => item.name === cfg.segment);
      const val = finalItem && totalOccupiedNights > 0 ? Number(((finalItem.nights / totalOccupiedNights) * 100).toFixed(1)) : 0;
      return {
        name: cfg.segment,
        value: val,
        color: cfg.color
      };
    });
  }, [segmentDistribution, totalOccupiedNights]);

  const dynamicSegmentTable = useMemo(() => {
    const tableData = segmentDistribution.map(item => ({
      segment: item.name,
      rnights: totalOccupiedNights > 0 ? `${((item.nights / totalOccupiedNights) * 100).toFixed(1)}%` : '0.0%',
      adr: `$${item.adr.toLocaleString()}`,
      revenue: `$${(item.revenue / 1000000).toFixed(2)}M`
    }));

    tableData.push({
      segment: 'Total',
      rnights: '100%',
      adr: `$${avgAdr.toLocaleString()}`,
      revenue: `$${(totalRevenue / 1000000).toFixed(2)}M`,
      isTotal: true
    } as any);

    return tableData;
  }, [segmentDistribution, totalOccupiedNights, totalRevenue, avgAdr]);

  const dynamicChannelData = useMemo(() => {
    return channelConfigs.map(cfg => {
      const finalItem = channelDistribution.find(item => item.name === cfg.channel);
      const val = finalItem && totalOccupiedNights > 0 ? Number(((finalItem.nights / totalOccupiedNights) * 100).toFixed(1)) : 0;
      return {
        name: cfg.channel,
        value: val,
        color: cfg.color
      };
    });
  }, [channelDistribution, totalOccupiedNights]);

  const dynamicChannelTable = useMemo(() => {
    const tableData = channelDistribution.map(item => ({
      channel: item.name,
      rnights: totalOccupiedNights > 0 ? `${((item.nights / totalOccupiedNights) * 100).toFixed(1)}%` : '0.0%',
      adr: `$${item.adr.toLocaleString()}`,
      revenue: `$${(item.revenue / 1000000).toFixed(2)}M`
    }));

    tableData.push({
      channel: 'Total',
      rnights: '100%',
      adr: `$${avgAdr.toLocaleString()}`,
      revenue: `$${(totalRevenue / 1000000).toFixed(2)}M`,
      isTotal: true
    } as any);

    return tableData;
  }, [channelDistribution, totalOccupiedNights, totalRevenue, avgAdr]);

  return (
    <div className="w-full px-4 lg:px-6 pb-6 text-[10px] flex flex-col gap-4">
      {/* Title, Date Filter, and Time (Full-Width Header at the very top) */}
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 animate-fade-in">
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Resort & Destination Analytics
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 shrink-0">
          <DateRangeWidget
            startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
          />
          <div className="text-right shrink-0 pb-0.5">
            <p className="text-[10px] text-zinc-900 font-semibold">{date}</p>
            <p className="text-[9px] text-zinc-500">{time} · {tz}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Resort Picker Gallery */}
      <div className="w-full pb-3 pt-1">
        <ResortPickerWidget activeResorts={activeResorts} setActiveResorts={setActiveResorts} />
      </div>

      {/* KPI Cards Row (Full Width - Total Hotel Revenue with 5 Pillars + 4 Room KPIs) */}
      <ResortKPIWidget data={categoryKpiData} />

      {/* Analytics Breakdown Grid (Matches gap-4 & card height of view=all) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <ResortGeoMarketWidget geoData={dynamicGeoData} />
        <ResortMarketSegmentWidget segmentData={dynamicSegmentData} segmentTable={dynamicSegmentTable} totalRnights={dynamicTotal} />
        <ResortChannelStatsWidget channelData={dynamicChannelData} channelTable={dynamicChannelTable} totalRnights={dynamicTotal} />
      </div>
    </div>
  );
}

