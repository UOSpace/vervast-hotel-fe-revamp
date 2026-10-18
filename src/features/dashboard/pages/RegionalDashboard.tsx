import { useState, useMemo, useEffect } from 'react';
import { RegionalPickerWidget } from '../components/widgets/regional/RegionalPickerWidget';
import { PeriodTabsWidget } from '../components/widgets/resort-type/PeriodTabsWidget';
import { ResortKPIWidget, type CategoryKpiData } from '../components/widgets/resort-type/ResortKPIWidget';
import { ResortRevenueDemandMixWidget } from '../components/widgets/resort-type/ResortRevenueDemandMixWidget';
import { ResortMarketSegmentWidget } from '../components/widgets/resort-type/ResortMarketSegmentWidget';
import { ResortChannelStatsWidget } from '../components/widgets/resort-type/ResortChannelStatsWidget';
import {
  distributeMetrics,
  segmentConfigs,
  channelConfigs,
  getGreeting,
  getFormattedDateTime,
  buildScopeKpiData,
} from './ResortTypeDashboard';
import {
  MASTER_REGIONS,
  resolveRegionId,
  formatRegionSelectionTitle,
} from '@/constants/regions';
import {
  PERIOD_DEFS,
  fmtInt,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  getPortfolioMetrics,
  getPropertyIdsByRegion,
  type PeriodId,
} from '@/data/portfolio';

export function RegionalDashboard() {
  const [activeRegions, setActiveRegions] = useState<string[]>(MASTER_REGIONS.map((r) => r.id));
  const [period, setPeriod] = useState<PeriodId>('mtd');
  const { date, time, tz } = getFormattedDateTime();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selected = useMemo(() => {
    const ids = activeRegions.map(resolveRegionId);
    const list = MASTER_REGIONS.filter((r) => ids.includes(r.id));
    return list.length > 0 ? list : MASTER_REGIONS;
  }, [activeRegions]);

  const regionTitle = useMemo(() => formatRegionSelectionTitle(selected.map((r) => r.id)), [selected]);

  const propIds = useMemo(() => getPropertyIdsByRegion(selected.map((r) => r.id)), [selected]);
  const m = useMemo(() => getPortfolioMetrics(propIds, period), [propIds, period]);

  const totalNights = m.roomsSold;
  const totalRevenue = m.roomRevenue;
  const avgAdr = Math.round(m.adr);

  const kpiData: CategoryKpiData = useMemo(() => {
    return buildScopeKpiData(m, regionTitle);
  }, [m, regionTitle]);

  const segmentDistribution = useMemo(
    () =>
      distributeMetrics(
        segmentConfigs.map((c) => ({ name: c.segment, share: c.share, adrFactor: c.adrFactor })),
        totalNights,
        totalRevenue,
        avgAdr
      ),
    [totalNights, totalRevenue, avgAdr]
  );
  const channelDistribution = useMemo(
    () =>
      distributeMetrics(
        channelConfigs.map((c) => ({ name: c.channel, share: c.share, adrFactor: c.adrFactor })),
        totalNights,
        totalRevenue,
        avgAdr
      ),
    [totalNights, totalRevenue, avgAdr]
  );

  const buildTable = (dist: typeof segmentDistribution, key: 'segment' | 'channel') => {
    const configs = key === 'segment' ? segmentConfigs : channelConfigs;
    const rows: any[] = dist.map((item) => {
      const cfg = configs.find((c: any) => (c.segment || c.channel) === item.name);
      const occPct = Math.min(98, Math.max(40, m.occupancyPct + (cfg?.occOffset ?? 0)));
      const revparUsd = Math.round(item.adr * (occPct / 100));
      return {
        [key]: item.name,
        rnights: totalNights > 0 ? fmtPct((item.nights / totalNights) * 100) : '0.0%',
        occupancy: fmtPct(occPct, 1),
        adr: fmtUsdFull(item.adr),
        revpar: fmtUsdFull(revparUsd),
        revenue: fmtUsd(item.revenue),
      };
    });
    rows.push({
      [key]: 'Total',
      rnights: '100%',
      occupancy: fmtPct(m.occupancyPct, 1),
      adr: fmtUsdFull(m.adr),
      revpar: fmtUsdFull(m.revpar),
      revenue: fmtUsd(m.roomRevenue),
      isTotal: true,
    });
    return rows;
  };

  const segmentData = segmentConfigs.map((c) => ({ name: c.segment, value: c.share, color: c.color }));
  const channelData = channelConfigs.map((c) => ({ name: c.channel, value: c.share, color: c.color }));
  const dynamicTotal = fmtInt(totalNights);

  return (
    <div className="w-full px-4 lg:px-6 pb-6 text-[10px] flex flex-col gap-4">
      <div className="w-full border-b border-zinc-200/80 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 animate-fade-in">
        <div>
          <p className="text-[10px] font-sans text-zinc-500 tracking-widest uppercase mb-0.5 font-semibold">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-wide">
            Regional Market Analytics (Regional Level)
          </h2>
        </div>
        <div className="text-right shrink-0 pb-0.5">
          <p className="text-[10px] text-zinc-900 font-semibold">{date}</p>
          <p className="text-[9px] text-zinc-500">{time} · {tz}</p>
        </div>
      </div>

      <div className="w-full pb-3 pt-1 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-zinc-900 font-medium">
            As of: <span className="font-semibold text-zinc-900">{PERIOD_DEFS[period].periodLabel}</span>
          </span>
          <PeriodTabsWidget
            period={period}
            setPeriod={setPeriod}
            showLabel={false}
          />
        </div>
        <RegionalPickerWidget activeRegions={activeRegions} setActiveRegions={setActiveRegions} />
      </div>

      <ResortKPIWidget data={kpiData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <ResortRevenueDemandMixWidget period={period} propertyIds={propIds} />
        <ResortMarketSegmentWidget segmentData={segmentData} segmentTable={buildTable(segmentDistribution, 'segment')} totalRnights={dynamicTotal} />
        <ResortChannelStatsWidget channelData={channelData} channelTable={buildTable(channelDistribution, 'channel')} totalRnights={dynamicTotal} />
      </div>
    </div>
  );
}

