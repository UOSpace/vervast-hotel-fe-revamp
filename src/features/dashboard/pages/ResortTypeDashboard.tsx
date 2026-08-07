import { useState, useMemo } from 'react';
import { ResortPickerWidget } from '../components/widgets/resort-type/ResortPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { ResortKPIWidget } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortGeoMarketWidget } from '../components/widgets/resort-type/ResortGeoMarketWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';

// Property type configurations with capacity, baseline occupancy, and baseline ADR
const resortProfiles: Record<string, { capacity: number; occupancy: number; adr: number }> = {
  desert: { capacity: 3, occupancy: 65, adr: 33000 },
  ocean: { capacity: 5, occupancy: 75, adr: 39000 },
  city: { capacity: 9, occupancy: 68, adr: 53000 },
  alpine: { capacity: 4, occupancy: 70, adr: 41500 },
  countryside: { capacity: 3, occupancy: 61, adr: 32000 },
  forest: { capacity: 2, occupancy: 58, adr: 26500 },
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

  // 1. Calculate room nights per category with rounding
  let nightsSum = 0;
  const list = categories.map((cat, idx) => {
    let nights = Math.round(totalNights * (cat.share / 100));
    if (idx === categories.length - 1) {
      nights = Math.max(0, totalNights - nightsSum);
    }
    nightsSum += nights;
    return { ...cat, nights };
  });

  // 2. Calculate initial revenues
  let revenueSum = 0;
  const listWithRev = list.map(item => {
    const itemAdr = avgAdr * item.adrFactor;
    const itemRev = item.nights * itemAdr;
    revenueSum += itemRev;
    return { ...item, rawRevenue: itemRev };
  });

  // 3. Normalize revenues to match totalRevenue exactly and calculate final ADRs
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

  // Calculate primary metrics for selected active resorts and days
  const { totalOccupiedNights, totalRevenue, avgOcc, avgAdr, avgRevpar } = useMemo(() => {
    const activeList = activeResorts.length > 0 ? activeResorts : ['city'];

    if (activeList.length === 6) {
      // 160 days represents the calculated difference for YTD range (Jan 1, 2026 to Jun 10, 2026)
      const scaleFactor = days / 160;
      return {
        totalOccupiedNights: Math.round(2810 * scaleFactor),
        totalRevenue: 118000000 * scaleFactor,
        avgOcc: 68,
        avgAdr: 42000,
        avgRevpar: 28560
      };
    }

    let totalAvail = 0;
    let totalOcc = 0;
    let totalRev = 0;

    activeList.forEach(r => {
      const profile = resortProfiles[r] || resortProfiles['city'];
      const avail = profile.capacity * days;
      const occ = avail * (profile.occupancy / 100);
      const rev = occ * profile.adr;

      totalAvail += avail;
      totalOcc += occ;
      totalRev += rev;
    });

    const occPct = totalAvail > 0 ? (totalOcc / totalAvail) * 100 : 0;
    const adr = totalOcc > 0 ? totalRev / totalOcc : 0;
    const revpar = totalAvail > 0 ? totalRev / totalAvail : 0;

    return {
      totalOccupiedNights: Math.round(totalOcc),
      totalRevenue: totalRev,
      avgOcc: Math.round(occPct),
      avgAdr: Math.round(adr),
      avgRevpar: Math.round(revpar)
    };
  }, [activeResorts, days]);

  // Calculate comparison metrics to derive realistic and consistent trends
  const compMetrics = useMemo(() => {
    const activeList = activeResorts.length > 0 ? activeResorts : ['city'];

    if (activeList.length === 6) {
      const scaleFactor = compDays / 160;
      return {
        totalOccupiedNights: Math.round(2646 * scaleFactor),
        totalRevenue: 103508772 * scaleFactor,
        avgOcc: 65,
        avgAdr: 38889,
        avgRevpar: 26692
      };
    }

    let totalAvail = 0;
    let totalOcc = 0;
    let totalRev = 0;

    activeList.forEach(r => {
      const profile = resortProfiles[r] || resortProfiles['city'];
      // Assume slightly lower baseline for the comparison period (e.g. 5% lower occupancy, 3% lower ADR)
      const compOcc = profile.occupancy * 0.95;
      const compAdr = profile.adr * 0.97;

      const avail = profile.capacity * compDays;
      const occ = avail * (compOcc / 100);
      const rev = occ * compAdr;

      totalAvail += avail;
      totalOcc += occ;
      totalRev += rev;
    });

    const occPct = totalAvail > 0 ? (totalOcc / totalAvail) * 100 : 0;
    const adr = totalOcc > 0 ? totalRev / totalOcc : 0;
    const revpar = totalAvail > 0 ? totalRev / totalAvail : 0;

    return {
      totalOccupiedNights: Math.round(totalOcc),
      totalRevenue: totalRev,
      avgOcc: Math.round(occPct),
      avgAdr: Math.round(adr),
      avgRevpar: Math.round(revpar)
    };
  }, [activeResorts, compDays]);

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
    <div className="w-full px-4 lg:px-6 pb-4 text-[10px] flex flex-col gap-2">
      {/* Title, Date Filter, and Time (Full-Width Header at the very top) */}
      <div className="w-full border-b border-[#d4c4b7]/40 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 -mt-2">
        <div>
          <p className="text-[10px] font-sans text-[#a65e52] tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
          <h2 className="text-2xl font-serif text-[#4a3c31] tracking-wide">
            Resort & Destination Analytics
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 shrink-0">
          <DateRangeWidget
            startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
          />
          <div className="text-right shrink-0 pb-0.5">
            <p className="text-[10px] text-[#4a3c31] font-semibold">{date}</p>
            <p className="text-[9px] text-[#947b66]">{time} · {tz}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Resort Picker Gallery (Wabi-Sabi Horizontal Row) */}
      <ResortPickerWidget activeResorts={activeResorts} setActiveResorts={setActiveResorts} />

      <hr className="border-t border-[#d4c4b7]/20" />

      {/* KPI Cards Row (Full Width) */}
      <ResortKPIWidget kpis={dynamicKpis} />

      {/* Subtle wabi-sabi dividing line */}
      <hr className="border-t border-[#d4c4b7]/20" />

      {/* Analytics Breakdown Grid (Full Width, asymmetrical heights and wider gap) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <ResortGeoMarketWidget geoData={dynamicGeoData} />
        <ResortMarketSegmentWidget segmentData={dynamicSegmentData} segmentTable={dynamicSegmentTable} totalRnights={dynamicTotal} />
        <ResortChannelStatsWidget channelData={dynamicChannelData} channelTable={dynamicChannelTable} totalRnights={dynamicTotal} />
      </div>
    </div>
  );
}
