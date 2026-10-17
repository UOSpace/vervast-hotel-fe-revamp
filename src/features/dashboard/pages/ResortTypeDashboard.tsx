import { useState, useMemo, useEffect } from 'react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { PeriodTabsWidget } from '../components/widgets/resort-type/PeriodTabsWidget';
import { ResortKPIWidget, type CategoryKpiData } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortGeoMarketWidget } from '../components/widgets/resort-type/ResortGeoMarketWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';
import {
  MASTER_PROPERTIES,
  CATEGORY_ROOM_COUNTS,
  formatCategorySelectionTitle,
  resolveCategoryId,
  type MasterHotelProperty,
} from '@/constants/categories';
import {
  PERIOD_IDS,
  fmtInt,
  fmtPct,
  fmtSignedPct,
  fmtSignedPts,
  fmtSignedUsd,
  fmtUsd,
  fmtUsdFull,
  getPortfolioMetrics,
  type PeriodId,
  type PortfolioMetrics,
} from '@/data/portfolio';

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

// Room counts per category across all 10 properties (total 780 rooms from Master Data)
export const categoryRooms: Record<string, number> = CATEGORY_ROOM_COUNTS;

// Master category-level hotel properties configuration (100% synchronized with Master Data)
export type CategoryPropertyDefinition = MasterHotelProperty;
export const CATEGORY_HOTEL_PROPERTIES: MasterHotelProperty[] = MASTER_PROPERTIES;

// Static breakdown configurations
const geoConfigs = [
  { region: 'Asia Pacific', share: 35, adrFactor: 0.95 },
  { region: 'Europe', share: 25, adrFactor: 1.09 },
  { region: 'America', share: 20, adrFactor: 0.86 },
  { region: 'Middle East', share: 12, adrFactor: 0.77 },
  { region: 'Africa', share: 8, adrFactor: 0.68 },
];

export const segmentConfigs = [
  { segment: 'Leisure', share: 55, adrFactor: 0.92, color: '#0f172a' },
  { segment: 'Business', share: 25, adrFactor: 1.09, color: '#334155' },
  { segment: 'Social', share: 10, adrFactor: 0.68, color: '#64748b' },
  { segment: 'MICE', share: 7, adrFactor: 0.97, color: '#94a3b8' },
  { segment: 'Others', share: 3, adrFactor: 0.61, color: '#cbd5e1' },
];

export const channelConfigs = [
  { channel: 'Direct', share: 33, adrFactor: 1.11, color: '#0f172a' },
  { channel: 'OTA', share: 28, adrFactor: 0.81, color: '#334155' },
  { channel: 'Consortia', share: 15, adrFactor: 0.87, color: '#64748b' },
  { channel: 'Own Web', share: 11, adrFactor: 1.06, color: '#94a3b8' },
  { channel: 'Others', share: 13, adrFactor: 0.71, color: '#cbd5e1' },
];

// Helper to distribute metrics to categories consistently
export interface DistributionItem {
  name: string;
  share: number;
  nights: number;
  adr: number;
  revenue: number;
}

export function distributeMetrics(
  categories: { name: string; share: number; adrFactor: number }[],
  totalNights: number,
  totalRevenue: number,
  avgAdr: number
): DistributionItem[] {
  if (totalNights <= 0) {
    return categories.map((cat) => ({
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
  const listWithRev = list.map((item) => {
    const itemAdr = avgAdr * item.adrFactor;
    const itemRev = item.nights * itemAdr;
    revenueSum += itemRev;
    return { ...item, rawRevenue: itemRev };
  });

  let finalRevSum = 0;
  const factor = revenueSum > 0 ? totalRevenue / revenueSum : 1;

  return listWithRev.map((item, idx) => {
    let rev = Math.round(item.rawRevenue * factor);
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
      revenue: rev,
    };
  });
}

export function getPeriodDateRange(period: PeriodId): [Date, Date] {
  const sysToday = new Date(2026, 9, 17);
  if (period === 'today') return [sysToday, sysToday];
  if (period === 'mtd') return [new Date(2026, 9, 1), sysToday];
  if (period === 'ytd') return [new Date(2026, 0, 1), sysToday];
  return [new Date(2026, 9, 18), new Date(2027, 0, 15)];
}

export function inferPeriodFromDates(start: Date | null, end: Date | null): PeriodId {
  if (!start || !end) return 'mtd';
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  if (diffDays <= 1) return 'today';
  if (diffDays <= 31) return 'mtd';
  return 'ytd';
}

export function buildScopeKpiData(m: PortfolioMetrics, scopeName: string): CategoryKpiData {
  const tot = m.totalRevenue || 1;
  return {
    categoryName: scopeName,
    totalRevenue: {
      value: fmtUsd(m.totalRevenue),
      vsLy: `${fmtSignedPct(m.vsLy.totalRevenuePct)} vs LY`,
      vsBudget: `${fmtSignedPct(m.vsBudget.totalRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.totalRevenuePct)} vs Forecast`,
      upLy: m.vsLy.totalRevenuePct >= 0,
      upBudget: m.vsBudget.totalRevenuePct >= 0,
      upForecast: m.vsForecast.totalRevenuePct >= 0,
      breakdown: [
        { label: 'Rooms', val: fmtUsd(m.roomRevenue), pct: fmtPct((m.roomRevenue / tot) * 100) },
        { label: 'F&B', val: fmtUsd(m.fnbRevenue), pct: fmtPct((m.fnbRevenue / tot) * 100) },
        { label: 'Spa', val: fmtUsd(m.spaRevenue), pct: fmtPct((m.spaRevenue / tot) * 100) },
        { label: 'Activities', val: fmtUsd(m.experienceRevenue), pct: fmtPct((m.experienceRevenue / tot) * 100) },
      ],
    },
    occupancy: {
      value: fmtPct(m.occupancyPct),
      vsLy: `${fmtSignedPts(m.vsLy.occupancyPts)} vs LY`,
      vsBudget: `${fmtSignedPts(m.vsBudget.occupancyPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(m.vsForecast.occupancyPts)} vs Forecast`,
      upLy: m.vsLy.occupancyPts >= 0,
      upBudget: m.vsBudget.occupancyPts >= 0,
      upForecast: m.vsForecast.occupancyPts >= 0,
      tooltip: 'Occupancy rate for the active selection compared with LY, budget, and forecast targets (percentage-point variance).',
    },
    adr: {
      value: fmtUsdFull(m.adr),
      vsLy: `${fmtSignedUsd(m.vsLy.adrAbs)} vs LY (${fmtSignedPct(m.vsLy.adrPct)})`,
      vsBudget: `${fmtSignedUsd(m.vsBudget.adrAbs)} vs Budget (${fmtSignedPct(m.vsBudget.adrPct)})`,
      vsForecast: `${fmtSignedUsd(m.vsForecast.adrAbs)} vs Forecast (${fmtSignedPct(m.vsForecast.adrPct)})`,
      upLy: m.vsLy.adrPct >= 0,
      upBudget: m.vsBudget.adrPct >= 0,
      upForecast: m.vsForecast.adrPct >= 0,
      tooltip: 'Average Daily Rate across the active selection (Room Revenue / Rooms Sold).',
    },
    revPar: {
      value: fmtUsdFull(m.revpar),
      vsLy: `${fmtSignedUsd(m.vsLy.revparAbs)} vs LY (${fmtSignedPct(m.vsLy.revparPct)})`,
      vsBudget: `${fmtSignedUsd(m.vsBudget.revparAbs)} vs Budget (${fmtSignedPct(m.vsBudget.revparPct)})`,
      vsForecast: `${fmtSignedUsd(m.vsForecast.revparAbs)} vs Forecast (${fmtSignedPct(m.vsForecast.revparPct)})`,
      upLy: m.vsLy.revparPct >= 0,
      upBudget: m.vsBudget.revparPct >= 0,
      upForecast: m.vsForecast.revparPct >= 0,
      tooltip: 'Revenue Per Available Room, calculated as Occupancy multiplied by ADR.',
    },
    roomRevenue: {
      value: fmtUsd(m.roomRevenue),
      vsLy: `${fmtSignedUsd(m.vsLy.roomRevenueAbs)} vs LY (${fmtSignedPct(m.vsLy.roomRevenuePct)})`,
      vsBudget: `${fmtSignedUsd(m.vsBudget.roomRevenueAbs)} vs Budget (${fmtSignedPct(m.vsBudget.roomRevenuePct)})`,
      vsForecast: `${fmtSignedUsd(m.vsForecast.roomRevenueAbs)} vs Forecast (${fmtSignedPct(m.vsForecast.roomRevenuePct)})`,
      upLy: m.vsLy.roomRevenuePct >= 0,
      upBudget: m.vsBudget.roomRevenuePct >= 0,
      upForecast: m.vsForecast.roomRevenuePct >= 0,
      tooltip: 'Room Revenue generated by the active selection during the selected period.',
    },
  };
}

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Ohayō Alfonso!';
  if (hour >= 12 && hour < 18) return 'Konnichiwa Alfonso!';
  return 'Konbanwa Alfonso!';
};

export const getFormattedDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { date, time, tz };
};

export function ResortTypeDashboard() {
  const [activeResorts, setActiveResorts] = useState<string[]>(['urban']);
  const [period, setPeriod] = useState<PeriodId>('mtd');
  const { date, time, tz } = getFormattedDateTime();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [initialStart, initialEnd] = getPeriodDateRange('mtd');
  const [startDate, setStartDateState] = useState<Date | null>(initialStart);
  const [endDate, setEndDateState] = useState<Date | null>(initialEnd);

  const handleSelectPeriod = (nextPeriod: PeriodId) => {
    setPeriod(nextPeriod);
    const [s, e] = getPeriodDateRange(nextPeriod);
    setStartDateState(s);
    setEndDateState(e);
  };

  const handleSetStartDate = (nextStart: Date | null) => {
    setStartDateState(nextStart);
    if (nextStart && endDate) {
      setPeriod(inferPeriodFromDates(nextStart, endDate));
    }
  };

  const handleSetEndDate = (nextEnd: Date | null) => {
    setEndDateState(nextEnd);
    if (startDate && nextEnd) {
      setPeriod(inferPeriodFromDates(startDate, nextEnd));
    }
  };

  const activeList = useMemo(() => {
    return activeResorts.length > 0 ? activeResorts.map(resolveCategoryId) : ['urban'];
  }, [activeResorts]);

  // Active category display name derived directly from Master Data helper
  const categoryDisplayName = useMemo(() => {
    return formatCategorySelectionTitle(activeList);
  }, [activeList]);

  // Filter properties belonging to active selected categories
  const activeProperties = useMemo(() => {
    return MASTER_PROPERTIES.filter((p) => activeList.includes(p.categoryId));
  }, [activeList]);

  const m = useMemo(() => {
    return getPortfolioMetrics(
      activeProperties.map((p) => p.id),
      period
    );
  }, [activeProperties, period]);

  // Calculate unified totals directly from engine metrics
  const propertyTotals: PropertyTableTotals = useMemo(() => {
    return {
      totalRooms: m.rooms,
      totalAvailableNights: m.availableRoomNights,
      totalOccupiedNights: m.roomsSold,
      avgOccupancyPct: Number(m.occupancyPct.toFixed(1)),
      avgAdr: Math.round(m.adr),
      avgRevpar: Math.round(m.revpar),
      totalRevenue: Math.round(m.roomRevenue),
    };
  }, [m]);

  const { totalOccupiedNights, totalRevenue, avgAdr } = useMemo(() => {
    return {
      totalOccupiedNights: propertyTotals.totalOccupiedNights,
      totalRevenue: propertyTotals.totalRevenue,
      avgAdr: propertyTotals.avgAdr,
    };
  }, [propertyTotals]);

  const dynamicTotal = useMemo(() => {
    return fmtInt(totalOccupiedNights);
  }, [totalOccupiedNights]);

  const categoryKpiData = useMemo(() => {
    return buildScopeKpiData(m, categoryDisplayName);
  }, [m, categoryDisplayName]);

  // Compute synchronized breakdown data
  const geoDistribution = useMemo(() => {
    return distributeMetrics(
      geoConfigs.map((c) => ({ name: c.region, share: c.share, adrFactor: c.adrFactor })),
      totalOccupiedNights,
      totalRevenue,
      avgAdr
    );
  }, [totalOccupiedNights, totalRevenue, avgAdr]);

  const segmentDistribution = useMemo(() => {
    return distributeMetrics(
      segmentConfigs.map((c) => ({ name: c.segment, share: c.share, adrFactor: c.adrFactor })),
      totalOccupiedNights,
      totalRevenue,
      avgAdr
    );
  }, [totalOccupiedNights, totalRevenue, avgAdr]);

  const channelDistribution = useMemo(() => {
    return distributeMetrics(
      channelConfigs.map((c) => ({ name: c.channel, share: c.share, adrFactor: c.adrFactor })),
      totalOccupiedNights,
      totalRevenue,
      avgAdr
    );
  }, [totalOccupiedNights, totalRevenue, avgAdr]);

  const dynamicGeoData = useMemo(() => {
    const tableData: any[] = geoDistribution.map((item) => ({
      region: item.name,
      rnights: totalOccupiedNights > 0 ? fmtPct((item.nights / totalOccupiedNights) * 100) : '0.0%',
      adr: fmtUsdFull(item.adr),
      revenue: fmtUsd(item.revenue),
    }));

    tableData.push({
      region: 'Total',
      rnights: '100%',
      adr: fmtUsdFull(avgAdr),
      revenue: fmtUsd(totalRevenue),
      isTotal: true,
    });

    return tableData;
  }, [geoDistribution, totalOccupiedNights, totalRevenue, avgAdr]);

  const dynamicSegmentData = useMemo(() => {
    return segmentConfigs.map((cfg) => {
      const finalItem = segmentDistribution.find((item) => item.name === cfg.segment);
      const val =
        finalItem && totalOccupiedNights > 0
          ? Number(((finalItem.nights / totalOccupiedNights) * 100).toFixed(1))
          : 0;
      return {
        name: cfg.segment,
        value: val,
        color: cfg.color,
      };
    });
  }, [segmentDistribution, totalOccupiedNights]);

  const dynamicSegmentTable = useMemo(() => {
    const tableData: any[] = segmentDistribution.map((item) => ({
      segment: item.name,
      rnights: totalOccupiedNights > 0 ? fmtPct((item.nights / totalOccupiedNights) * 100) : '0.0%',
      adr: fmtUsdFull(item.adr),
      revenue: fmtUsd(item.revenue),
    }));

    tableData.push({
      segment: 'Total',
      rnights: '100%',
      adr: fmtUsdFull(avgAdr),
      revenue: fmtUsd(totalRevenue),
      isTotal: true,
    });

    return tableData;
  }, [segmentDistribution, totalOccupiedNights, totalRevenue, avgAdr]);

  const dynamicChannelData = useMemo(() => {
    return channelConfigs.map((cfg) => {
      const finalItem = channelDistribution.find((item) => item.name === cfg.channel);
      const val =
        finalItem && totalOccupiedNights > 0
          ? Number(((finalItem.nights / totalOccupiedNights) * 100).toFixed(1))
          : 0;
      return {
        name: cfg.channel,
        value: val,
        color: cfg.color,
      };
    });
  }, [channelDistribution, totalOccupiedNights]);

  const dynamicChannelTable = useMemo(() => {
    const tableData: any[] = channelDistribution.map((item) => ({
      channel: item.name,
      rnights: totalOccupiedNights > 0 ? fmtPct((item.nights / totalOccupiedNights) * 100) : '0.0%',
      adr: fmtUsdFull(item.adr),
      revenue: fmtUsd(item.revenue),
    }));

    tableData.push({
      channel: 'Total',
      rnights: '100%',
      adr: fmtUsdFull(avgAdr),
      revenue: fmtUsd(totalRevenue),
      isTotal: true,
    });

    return tableData;
  }, [channelDistribution, totalOccupiedNights, totalRevenue, avgAdr]);

  return (
    <div className="w-full px-4 lg:px-6 pb-6 text-[10px] flex flex-col gap-4">
      {/* Title, Date Filter, and Time (Full-Width Header at the very top) */}
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 animate-fade-in">
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Resort & Destination Analytics (Hotel Type Level)
          </h2>
        </div>
        <div className="flex flex-wrap items-center sm:items-end gap-3 shrink-0">
          <PeriodTabsWidget
            period={period}
            setPeriod={handleSelectPeriod}
            periods={PERIOD_IDS}
          />
          <DateRangeWidget
            startDate={startDate}
            setStartDate={handleSetStartDate}
            endDate={endDate}
            setEndDate={handleSetEndDate}
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


