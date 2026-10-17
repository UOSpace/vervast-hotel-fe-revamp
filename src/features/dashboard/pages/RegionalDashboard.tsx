import { useState, useMemo, useEffect } from 'react';
import { RegionalPickerWidget } from '../components/widgets/regional/RegionalPickerWidget';
import { DateRangeWidget } from '../components/widgets/resort-type/DateRangeWidget';
import { PeriodTabsWidget } from '../components/widgets/resort-type/PeriodTabsWidget';
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
  getPeriodDateRange,
  inferPeriodFromDates,
  buildScopeKpiData,
} from './ResortTypeDashboard';
import {
  MASTER_REGIONS,
  resolveRegionId,
  formatRegionSelectionTitle,
} from '@/constants/regions';
import {
  PERIOD_IDS,
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

  // Regional table: each selected region computed directly from the engine for the active period
  const geoData = useMemo(() => {
    const rows: any[] = selected.map((r) => {
      const rm = getPortfolioMetrics(getPropertyIdsByRegion([r.id]), period);
      return {
        region: r.name,
        rnights: fmtPct(totalNights > 0 ? (rm.roomsSold / totalNights) * 100 : 0),
        adr: fmtUsdFull(rm.adr),
        revenue: fmtUsd(rm.roomRevenue),
      };
    });
    rows.push({
      region: 'Total',
      rnights: '100%',
      adr: fmtUsdFull(m.adr),
      revenue: fmtUsd(m.roomRevenue),
      isTotal: true,
    });
    return rows;
  }, [selected, period, totalNights, m.adr, m.roomRevenue]);

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
    const rows: any[] = dist.map((item) => ({
      [key]: item.name,
      rnights: totalNights > 0 ? fmtPct((item.nights / totalNights) * 100) : '0.0%',
      adr: fmtUsdFull(item.adr),
      revenue: fmtUsd(item.revenue),
    }));
    rows.push({
      [key]: 'Total',
      rnights: '100%',
      adr: fmtUsdFull(m.adr),
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
            Regional Market Analytics (Region Level)
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

