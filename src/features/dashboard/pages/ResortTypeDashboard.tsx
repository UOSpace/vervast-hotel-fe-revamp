import { useState, useMemo } from 'react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { ResortKPIWidget } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortGeoMarketWidget } from '../components/widgets/resort-type/ResortGeoMarketWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';
import { getDashboardComputedData } from '../../../data/pms';

// Room counts per category across all 12 properties (total 789 rooms)
const categoryRooms: Record<string, number> = {
  alpine: 116,
  ocean: 130,
  city: 198,
  forest: 94,
  countryside: 114,
  desert: 137,
};

// Static breakdown configurations
const geoConfigs = [
  { region: 'Asia Pacific', share: 35, adrFactor: 0.95 },
  { region: 'Europe', share: 25, adrFactor: 1.09 },
  { region: 'America', share: 20, adrFactor: 0.86 },
  { region: 'Middle East', share: 12, adrFactor: 0.77 },
  { region: 'Africa', share: 8, adrFactor: 0.68 },
];

const segmentConfigs = [
  { segment: 'Leisure', share: 55, adrFactor: 0.92, color: '#1F1D1C' },
  { segment: 'Business', share: 25, adrFactor: 1.09, color: '#3D3A38' },
  { segment: 'Social', share: 10, adrFactor: 0.68, color: '#5E5A56' },
  { segment: 'MICE', share: 7, adrFactor: 0.97, color: '#857E78' },
  { segment: 'Others', share: 3, adrFactor: 0.61, color: '#B2A9A0' },
];

const channelConfigs = [
  { channel: 'Direct', share: 33, adrFactor: 1.11, color: '#1F1D1C' },
  { channel: 'OTA', share: 28, adrFactor: 0.81, color: '#3D3A38' },
  { channel: 'Consortia', share: 15, adrFactor: 0.87, color: '#5E5A56' },
  { channel: 'Own Web', share: 11, adrFactor: 1.06, color: '#857E78' },
  { channel: 'Others', share: 13, adrFactor: 0.71, color: '#B2A9A0' },
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

  // Single PMS computed data engine source
  const pmsData = useMemo(() => getDashboardComputedData(), []);

  // Map each category to PMS performance
  const resortProfiles = useMemo(() => {
    const map: Record<string, {
      name: string;
      capacity: number;
      occupancy: number;
      adr: number;
      revpar: number;
      ytdRevenue: number;
      mtdRevenue: number;
    }> = {};

    pmsData.portfolioPerformance.forEach(perf => {
      const cat = perf.category;
      const occ = parseFloat(perf.occupancy.replace('%', '')) || 70;
      const adr = parseFloat(perf.adr.replace(/[^0-9.]/g, '')) || 2000;
      const revpar = parseFloat(perf.revpar.replace(/[^0-9.]/g, '')) || ((occ / 100) * adr);
      const ytdRev = (parseFloat(perf.ytdRevenue.replace(/[^0-9.]/g, '')) || 0) * 1000000;
      const mtdRev = (parseFloat(perf.mtdRevenue.replace(/[^0-9.]/g, '')) || 0) * 1000000;
      const rooms = categoryRooms[cat] || 100;

      map[cat] = {
        name: perf.label,
        capacity: rooms,
        occupancy: occ,
        adr: adr,
        revpar: revpar,
        ytdRevenue: ytdRev,
        mtdRevenue: mtdRev,
      };
    });

    return map;
  }, [pmsData]);

  // Calculate days in the current date range
  const days = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [startDate, endDate]);

  // Calculate days in the comparison date range
  const compDays = useMemo(() => {
    if (!compStartDate || !compEndDate) return 1;
    const diffTime = Math.abs(compEndDate.getTime() - compStartDate.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [compStartDate, compEndDate]);

  // Calculate primary metrics for selected active resorts and days connected directly to PMS
  const { totalOccupiedNights, totalRevenue, avgOcc, avgAdr, avgRevpar } = useMemo(() => {
    const activeList = activeResorts.length > 0 ? activeResorts : ['city'];

    // When all 6 categories are selected, bind directly to PMS portfolio totals
    if (activeList.length === 6) {
      const isYtd = days >= 180;
      if (isYtd) {
        const scaleFactor = days / 243;
        const rev = pmsData.kpis.revenue.rawNumber * scaleFactor;
        const occ = pmsData.kpis.occupancy.rawPct; // 74.2%
        const adr = pmsData.kpis.adr.rawNumber; // 2180
        const revpar = pmsData.kpis.revPar.rawNumber; // 1617.56
        const nights = Math.round((789 * (occ / 100)) * days);

        return {
          totalOccupiedNights: nights,
          totalRevenue: rev,
          avgOcc: occ,
          avgAdr: Math.round(adr),
          avgRevpar: Math.round(revpar),
        };
      } else {
        const scaleFactor = days / 31;
        const mtdRev = (parseFloat(pmsData.kpis.revenue.mtdValue.replace(/[^0-9.]/g, '')) || 14.8) * 1000000;
        const rev = mtdRev * scaleFactor;
        const occ = 78.4;
        const adr = 2450;
        const revpar = 1920.80;
        const nights = Math.round((789 * (occ / 100)) * days);

        return {
          totalOccupiedNights: nights,
          totalRevenue: rev,
          avgOcc: occ,
          avgAdr: Math.round(adr),
          avgRevpar: Math.round(revpar),
        };
      }
    }

    // Subset of categories selected: aggregate directly from individual PMS profiles
    let totalAvail = 0;
    let totalOccNights = 0;
    let totalRev = 0;

    activeList.forEach(r => {
      const profile = resortProfiles[r] || resortProfiles['city'];
      if (!profile) return;
      const avail = profile.capacity * days;
      const occ = avail * (profile.occupancy / 100);
      const rev = occ * profile.adr;

      totalAvail += avail;
      totalOccNights += occ;
      totalRev += rev;
    });

    const occPct = totalAvail > 0 ? (totalOccNights / totalAvail) * 100 : 0;
    const adr = totalOccNights > 0 ? totalRev / totalOccNights : 0;
    const revpar = totalAvail > 0 ? totalRev / totalAvail : 0;

    return {
      totalOccupiedNights: Math.round(totalOccNights),
      totalRevenue: totalRev,
      avgOcc: Number(occPct.toFixed(1)),
      avgAdr: Math.round(adr),
      avgRevpar: Math.round(revpar),
    };
  }, [activeResorts, days, pmsData, resortProfiles]);

  // Calculate comparison metrics to derive realistic and consistent trends matching PMS
  const compMetrics = useMemo(() => {
    const activeList = activeResorts.length > 0 ? activeResorts : ['city'];

    if (activeList.length === 6) {
      const isYtd = compDays >= 180;
      if (isYtd) {
        const scaleFactor = compDays / 243;
        const rev = (pmsData.kpis.revenue.rawNumber / 1.14) * scaleFactor;
        const occ = 68.0;
        const adr = 2018;
        const revpar = 1372;
        const nights = Math.round((789 * (occ / 100)) * compDays);

        return {
          totalOccupiedNights: nights,
          totalRevenue: rev,
          avgOcc: occ,
          avgAdr: adr,
          avgRevpar: revpar,
        };
      } else {
        const scaleFactor = compDays / 31;
        const mtdRev = (parseFloat(pmsData.kpis.revenue.mtdValue.replace(/[^0-9.]/g, '')) || 14.8) * 1000000;
        const rev = (mtdRev / 1.09) * scaleFactor;
        const occ = 73.2;
        const adr = 2300;
        const revpar = 1683;
        const nights = Math.round((789 * (occ / 100)) * compDays);

        return {
          totalOccupiedNights: nights,
          totalRevenue: rev,
          avgOcc: occ,
          avgAdr: adr,
          avgRevpar: revpar,
        };
      }
    }

    let totalAvail = 0;
    let totalOccNights = 0;
    let totalRev = 0;

    activeList.forEach(r => {
      const profile = resortProfiles[r] || resortProfiles['city'];
      if (!profile) return;
      const compOcc = profile.occupancy * 0.95;
      const compAdr = profile.adr * 0.97;

      const avail = profile.capacity * compDays;
      const occ = avail * (compOcc / 100);
      const rev = occ * compAdr;

      totalAvail += avail;
      totalOccNights += occ;
      totalRev += rev;
    });

    const occPct = totalAvail > 0 ? (totalOccNights / totalAvail) * 100 : 0;
    const adr = totalOccNights > 0 ? totalRev / totalOccNights : 0;
    const revpar = totalAvail > 0 ? totalRev / totalAvail : 0;

    return {
      totalOccupiedNights: Math.round(totalOccNights),
      totalRevenue: totalRev,
      avgOcc: Number(occPct.toFixed(1)),
      avgAdr: Math.round(adr),
      avgRevpar: Math.round(revpar),
    };
  }, [activeResorts, compDays, pmsData, resortProfiles]);

  const dynamicTotal = useMemo(() => {
    return totalOccupiedNights.toLocaleString();
  }, [totalOccupiedNights]);

  const dynamicKpis = useMemo(() => {
    const formatPctChange = (current: number, previous: number) => {
      if (previous === 0) return '↑ 0.0%';
      const diff = ((current - previous) / previous) * 100;
      const arrow = diff >= 0 ? '↑' : '↓';
      return `${arrow} ${Math.abs(diff).toFixed(1)}%`;
    };

    const formatPpChange = (current: number, previous: number) => {
      const diff = current - previous;
      const arrow = diff >= 0 ? '↑' : '↓';
      return `${arrow} ${Math.abs(diff).toFixed(1)}pp`;
    };

    const occDiff = avgOcc - compMetrics.avgOcc;
    const revDiff = totalRevenue - compMetrics.totalRevenue;
    const revparDiff = avgRevpar - compMetrics.avgRevpar;
    const adrDiff = avgAdr - compMetrics.avgAdr;
    const nightsDiff = totalOccupiedNights - compMetrics.totalOccupiedNights;

    return [
      { label: 'OCCUPANCY', value: `${avgOcc}%`, trend: formatPpChange(avgOcc, compMetrics.avgOcc), up: occDiff >= 0, color: '#947b66' },
      { label: 'Room Revenue (USD)', value: `$${(totalRevenue / 1000000).toFixed(2)}M`, trend: formatPctChange(totalRevenue, compMetrics.totalRevenue), up: revDiff >= 0, color: '#586981' },
      { label: 'RevPAR (USD)', value: `$${avgRevpar.toLocaleString()}`, trend: formatPctChange(avgRevpar, compMetrics.avgRevpar), up: revparDiff >= 0, color: '#657454' },
      { label: 'ADR (USD)', value: `$${avgAdr.toLocaleString()}`, trend: formatPctChange(avgAdr, compMetrics.avgAdr), up: adrDiff >= 0, color: '#8b6b7a' },
      { label: 'TOTAL ROOM NIGHTS', value: totalOccupiedNights.toLocaleString(), trend: formatPctChange(totalOccupiedNights, compMetrics.totalOccupiedNights), up: nightsDiff >= 0, color: '#a67138' },
    ];
  }, [avgOcc, totalRevenue, avgRevpar, avgAdr, totalOccupiedNights, compMetrics]);

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

      {/* KPI Cards Row (Full Width) */}
      <ResortKPIWidget kpis={dynamicKpis} />

      {/* Analytics Breakdown Grid (Matches gap-4 & card height of view=all) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <ResortGeoMarketWidget geoData={dynamicGeoData} />
        <ResortMarketSegmentWidget segmentData={dynamicSegmentData} segmentTable={dynamicSegmentTable} totalRnights={dynamicTotal} />
        <ResortChannelStatsWidget channelData={dynamicChannelData} channelTable={dynamicChannelTable} totalRnights={dynamicTotal} />
      </div>
    </div>
  );
}

