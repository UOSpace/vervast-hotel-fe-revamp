import { useState, useMemo, useEffect } from 'react';
import { RegionalPickerWidget } from '../components/widgets/regional/RegionalPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { ResortKPIWidget, type CategoryKpiData } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortGeoMarketWidget } from '../components/widgets/resort-type/ResortGeoMarketWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';
import {
  distributeMetrics,
  segmentConfigs,
  channelConfigs,
  getGreeting,
  getFormattedDateTime,
} from './ResortTypeDashboard';
import {
  MASTER_REGIONS,
  REGIONAL_TOTALS,
  resolveRegionId,
  formatRegionSelectionTitle,
} from '@/constants/regions';

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`;

const pctChange = (cur: number, prev: number) => {
  if (prev === 0) return '+0.0%';
  const d = ((cur - prev) / prev) * 100;
  return `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`;
};

const diffMoney = (cur: number, prev: number) => {
  const d = cur - prev;
  const sign = d >= 0 ? '+' : '-';
  const abs = Math.abs(d);
  const str = abs >= 1_000_000 ? `$${(abs / 1_000_000).toFixed(2)}M` : `$${Math.round(abs / 1000)}K`;
  const pct = prev > 0 ? ((d / prev) * 100).toFixed(1) : '0.0';
  return `${sign}${str} vs LY (${sign}${pct}%)`;
};

const diffUnit = (cur: number, prev: number) => {
  const d = cur - prev;
  const pct = prev > 0 ? ((d / prev) * 100).toFixed(1) : '0.0';
  return `${d >= 0 ? '+' : '-'}$${Math.abs(d).toLocaleString()} vs LY (${d >= 0 ? '+' : ''}${pct}%)`;
};

export function RegionalDashboard() {
  const [activeRegions, setActiveRegions] = useState<string[]>(MASTER_REGIONS.map((r) => r.id));
  const { date, time, tz } = getFormattedDateTime();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | null>(today);

  const selected = useMemo(() => {
    const ids = activeRegions.map(resolveRegionId);
    const list = MASTER_REGIONS.filter((r) => ids.includes(r.id));
    return list.length > 0 ? list : MASTER_REGIONS;
  }, [activeRegions]);

  const isAll = selected.length === MASTER_REGIONS.length;
  const regionTitle = useMemo(() => formatRegionSelectionTitle(selected.map((r) => r.id)), [selected]);

  const { totalNights, totalRevenue, avgOcc, avgAdr, avgRevpar } = useMemo(() => {
    const nights = selected.reduce((s, r) => s + r.roomNights, 0);
    const revenue = selected.reduce((s, r) => s + r.revenue, 0);
    const avail = selected.reduce((s, r) => s + r.roomNights / (r.baseOcc / 100), 0);
    return {
      totalNights: nights,
      totalRevenue: revenue,
      avgOcc: isAll ? REGIONAL_TOTALS.avgOcc : Number(((nights / avail) * 100).toFixed(1)),
      avgAdr: isAll
        ? REGIONAL_TOTALS.avgAdr
        : Math.round(selected.reduce((s, r) => s + r.roomNights * r.adr, 0) / nights),
      avgRevpar: isAll ? REGIONAL_TOTALS.avgRevpar : Math.round(revenue / avail),
    };
  }, [selected, isAll]);

  const kpiData: CategoryKpiData = useMemo(() => {
    const rooms = totalRevenue;
    const fnb = rooms * (22 / 118);
    const spa = rooms * (8 / 118);
    const act = rooms * (4 / 118);
    const totalHotel = rooms + fnb + spa + act;

    // Prior-year benchmark (same realised factors as the category dashboard)
    const compOcc = Number((avgOcc * 0.95).toFixed(1));
    const compAdr = Math.round(avgAdr * 0.97);
    const compRevpar = Math.round(avgRevpar * 0.95 * 0.97);
    const compRooms = rooms * 0.95 * 0.97;
    const compTotalHotel = compRooms * (152 / 118);

    const occDiff = avgOcc - compOcc;

    return {
      categoryName: regionTitle,
      totalRevenue: {
        value: fmtM(totalHotel),
        vsLy: `${pctChange(totalHotel, compTotalHotel)} vs LY`,
        vsBudget: '+4.0% vs Budget',
        vsForecast: '+1.9% vs Forecast',
        upLy: totalHotel >= compTotalHotel,
        upBudget: true,
        upForecast: true,
        breakdown: [
          { label: 'Rooms', val: fmtM(rooms), pct: '77.6%' },
          { label: 'F&B', val: fmtM(fnb), pct: '14.5%' },
          { label: 'Spa', val: fmtM(spa), pct: '5.3%' },
          { label: 'Activities', val: fmtM(act), pct: '2.6%' },
        ],
      },
      occupancy: {
        value: `${avgOcc.toFixed(1)}%`,
        vsLy: `${occDiff >= 0 ? '+' : ''}${occDiff.toFixed(1)} pts vs LY`,
        vsBudget: '+2.1 pts vs Budget',
        vsForecast: '+1.2 pts vs Forecast',
        upLy: occDiff >= 0,
        upBudget: true,
        upForecast: true,
        tooltip: 'Occupancy rate for the selected regions compared with LY, budget, and forecast targets (percentage-point variance).',
      },
      adr: {
        value: `$${avgAdr.toLocaleString()}`,
        vsLy: diffUnit(avgAdr, compAdr),
        vsBudget: '+$42 vs Budget (+1.7%)',
        vsForecast: '+$18 vs Forecast (+0.7%)',
        upLy: avgAdr >= compAdr,
        upBudget: true,
        upForecast: true,
        tooltip: 'Average Daily Rate across the selected regions (Room Revenue / Rooms Sold).',
      },
      revPar: {
        value: `$${avgRevpar.toLocaleString()}`,
        vsLy: diffUnit(avgRevpar, compRevpar),
        vsBudget: '+$48 vs Budget (+2.9%)',
        vsForecast: '+$22 vs Forecast (+1.3%)',
        upLy: avgRevpar >= compRevpar,
        upBudget: true,
        upForecast: true,
        tooltip: 'Revenue Per Available Room, calculated as Occupancy multiplied by ADR.',
      },
      roomRevenue: {
        value: fmtM(rooms),
        vsLy: diffMoney(rooms, compRooms),
        vsBudget: '+$142K vs Budget (+4.9%)',
        vsForecast: '+$62K vs Forecast (+2.1%)',
        upLy: rooms >= compRooms,
        upBudget: true,
        upForecast: true,
        tooltip: 'Room Revenue generated by the selected regions during the selected period.',
      },
    };
  }, [totalRevenue, avgOcc, avgAdr, avgRevpar, regionTitle]);

  // Regional table: shares re-normalised across the selected regions
  const geoData = useMemo(() => {
    const rows: any[] = selected.map((r) => ({
      region: r.name,
      rnights: `${((r.roomNights / totalNights) * 100).toFixed(1)}%`,
      adr: `$${r.adr.toLocaleString()}`,
      revenue: fmtM(r.revenue),
    }));
    rows.push({
      region: 'Total',
      rnights: '100%',
      adr: `$${avgAdr.toLocaleString()}`,
      revenue: fmtM(totalRevenue),
      isTotal: true,
    });
    return rows;
  }, [selected, totalNights, totalRevenue, avgAdr]);

  const segmentDistribution = useMemo(
    () => distributeMetrics(segmentConfigs.map((c) => ({ name: c.segment, share: c.share, adrFactor: c.adrFactor })), totalNights, totalRevenue, avgAdr),
    [totalNights, totalRevenue, avgAdr]
  );
  const channelDistribution = useMemo(
    () => distributeMetrics(channelConfigs.map((c) => ({ name: c.channel, share: c.share, adrFactor: c.adrFactor })), totalNights, totalRevenue, avgAdr),
    [totalNights, totalRevenue, avgAdr]
  );

  const buildTable = (dist: typeof segmentDistribution, key: 'segment' | 'channel') => {
    const rows: any[] = dist.map((item) => ({
      [key]: item.name,
      rnights: `${((item.nights / totalNights) * 100).toFixed(1)}%`,
      adr: `$${item.adr.toLocaleString()}`,
      revenue: fmtM(item.revenue),
    }));
    rows.push({ [key]: 'Total', rnights: '100%', adr: `$${avgAdr.toLocaleString()}`, revenue: fmtM(totalRevenue), isTotal: true });
    return rows;
  };

  const segmentData = segmentConfigs.map((c) => ({ name: c.segment, value: c.share, color: c.color }));
  const channelData = channelConfigs.map((c) => ({ name: c.channel, value: c.share, color: c.color }));
  const dynamicTotal = totalNights.toLocaleString();

  return (
    <div className="w-full px-4 lg:px-6 pb-6 text-[10px] flex flex-col gap-4">
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 animate-fade-in">
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Regional Market Analytics (Region Level)
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 shrink-0">
          <DateRangeWidget startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
          <div className="text-right shrink-0 pb-0.5">
            <p className="text-[10px] text-zinc-900 font-semibold">{date}</p>
            <p className="text-[9px] text-zinc-500">{time} · {tz}</p>
          </div>
        </div>
      </div>

      <div className="w-full pb-3 pt-1">
        <RegionalPickerWidget activeRegions={activeRegions} setActiveRegions={setActiveRegions} />
      </div>

      <ResortKPIWidget data={kpiData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <ResortGeoMarketWidget geoData={geoData} />
        <ResortMarketSegmentWidget segmentData={segmentData} segmentTable={buildTable(segmentDistribution, 'segment')} totalRnights={dynamicTotal} />
        <ResortChannelStatsWidget channelData={channelData} channelTable={buildTable(channelDistribution, 'channel')} totalRnights={dynamicTotal} />
      </div>
    </div>
  );
}
