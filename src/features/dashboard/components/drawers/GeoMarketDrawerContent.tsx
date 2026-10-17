import { useState, useEffect } from 'react';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import {
  getGeoMarketData,
  getSimulatedPropertiesData,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtSignedPct,
  type PeriodId,
} from '@/data/portfolio';

const regionalMeta: Record<string, { feederCountries: string[]; keyHubs: string; vsLy: string }> = {
  'Asia Pacific': {
    feederCountries: ['Japan', 'Singapore', 'Australia', 'China'],
    keyHubs: 'HND, NRT, SIN, SYD',
    vsLy: '↑ +16%',
  },
  Europe: {
    feederCountries: ['United Kingdom', 'Switzerland', 'Germany', 'France'],
    keyHubs: 'LHR, ZRH, CDG, FRA',
    vsLy: '↑ +12%',
  },
  America: {
    feederCountries: ['United States', 'Canada', 'Brazil', 'Mexico'],
    keyHubs: 'JFK, SFO, LAX, MIA',
    vsLy: '↑ +8%',
  },
  'Middle East': {
    feederCountries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
    keyHubs: 'DXB, DOH, RUH',
    vsLy: '↑ +9%',
  },
  Africa: {
    feederCountries: ['South Africa', 'Nigeria', 'Kenya', 'Morocco'],
    keyHubs: 'JNB, CPT, NBO',
    vsLy: '↑ +5%',
  },
};

interface GeoMarketDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function GeoMarketDrawerContent(props: GeoMarketDrawerContentProps) {
  const drawerCtx = useDashboardDrawer();
  const config = props.config ?? drawerCtx.config;

  const initialPeriod: PeriodId =
    (config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon)) ||
    'mtd';
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);

  useEffect(() => {
    const nextPeriod =
      config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon);
    if (nextPeriod === 'today' || nextPeriod === 'mtd' || nextPeriod === 'ytd') {
      setPeriod(nextPeriod);
    }
  }, [config?.data]);

  const periodDef = PERIOD_DEFS[period];
  const data = getGeoMarketData(period);
  const propertiesData = getSimulatedPropertiesData(period);
  const pm = getPortfolioMetrics(undefined, period);

  const customData: any[] | null =
    Array.isArray(config?.data) && config.data.length > 0 ? config.data : null;

  const totalRow = customData
    ? customData.find((r: any) => r.isTotal || r.region === 'Total') ||
      customData[customData.length - 1]
    : null;
  const activeItems = customData
    ? customData.filter((r: any) => !r.isTotal && r.region !== 'Total')
    : null;

  const totalRevenueDisplay = totalRow?.revenue || data.totalRevenue;

  // Derive dynamic hero metrics from either customData or portfolio engine items
  const defaultTopVol = data.items[0];
  const defaultHighAdr = [...data.items].sort((a, b) => b.adrUsd - a.adrUsd)[0] || data.items[0];
  const defaultRevAnchor =
    [...data.items].sort((a, b) => b.revenueUsdMillions - a.revenueUsdMillions)[0] || data.items[0];
  const defaultEmerging = data.items[data.items.length - 1] || data.items[0];

  const volumeLeader = activeItems ? activeItems[0] : null;
  const highestAdr = activeItems
    ? [...activeItems].sort((a, b) => {
        const valA = parseFloat(a.adr.replace(/[^0-9.]/g, '')) || 0;
        const valB = parseFloat(b.adr.replace(/[^0-9.]/g, '')) || 0;
        return valB - valA;
      })[0]
    : null;

  const revenueAnchor = activeItems
    ? [...activeItems].sort((a, b) => {
        const valA = parseFloat(a.revenue.replace(/[^0-9.]/g, '')) || 0;
        const valB = parseFloat(b.revenue.replace(/[^0-9.]/g, '')) || 0;
        return valB - valA;
      })[0]
    : null;

  const emergingMarket = activeItems ? activeItems[activeItems.length - 1] : null;

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Demand Origin Intelligence
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Feeder Analytics
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Geo Market Distribution ({periodDef.label})
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cross-continental guest origin breakdown across all luxury destinations ·{' '}
            <span className="font-semibold text-zinc-700">{periodDef.periodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {!customData && (
            <div className="inline-flex items-center p-0.5 bg-zinc-200/70 rounded-lg shrink-0">
              {(['today', 'mtd', 'ytd'] as const).map((h) => {
                const isActive = period === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setPeriod(h)}
                    className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    {h === 'today' ? 'Today' : h.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Total Room Revenue ({periodDef.label})
            </div>
            <div className="text-lg font-bold text-zinc-900">{totalRevenueDisplay}</div>
          </div>
        </div>
      </div>

      {/* Top 4 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Volume Leader
          </span>
          <div>
            <div className="text-xl font-bold text-zinc-900 leading-tight">
              {volumeLeader ? volumeLeader.rnights : defaultTopVol.roomNightsFormatted}
            </div>
            <div className="text-[11px] font-normal text-zinc-600 mt-0.5">
              {volumeLeader ? volumeLeader.region : defaultTopVol.market}
            </div>
            <div className="text-[10px] font-medium text-emerald-700 mt-1">
              {volumeLeader
                ? `${volumeLeader.revenue} · Rank 1 Share`
                : `${defaultTopVol.revenueFormatted} · ${defaultTopVol.vsLyFormatted}`}
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Highest Yield ADR
          </span>
          <div>
            <div className="text-xl font-bold text-zinc-900 leading-tight">
              {highestAdr ? highestAdr.adr : defaultHighAdr.adrFormatted}
            </div>
            <div className="text-[11px] font-normal text-zinc-600 mt-0.5">
              {highestAdr ? highestAdr.region : defaultHighAdr.market}
            </div>
            <div className="text-[10px] font-medium text-zinc-500 mt-1">Peak Rate</div>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Revenue Anchor
          </span>
          <div>
            <div className="text-xl font-bold text-zinc-900 leading-tight">
              {revenueAnchor ? revenueAnchor.revenue : defaultRevAnchor.revenueFormatted}
            </div>
            <div className="text-[11px] font-normal text-zinc-600 mt-0.5">
              {revenueAnchor ? revenueAnchor.region : defaultRevAnchor.market}
            </div>
            <div className="text-[10px] font-medium text-emerald-700 mt-1">
              {revenueAnchor
                ? `${revenueAnchor.rnights} Room Nights`
                : `${defaultRevAnchor.roomNightsFormatted} Room Nights`}
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Emerging Feeder
          </span>
          <div>
            <div className="text-xl font-bold text-zinc-900 leading-tight">
              {emergingMarket ? emergingMarket.revenue : defaultEmerging.revenueFormatted}
            </div>
            <div className="text-[11px] font-normal text-zinc-600 mt-0.5">
              {emergingMarket ? emergingMarket.region : defaultEmerging.market}
            </div>
            <div className="text-[10px] font-medium text-emerald-700 mt-1">
              {emergingMarket
                ? `${emergingMarket.rnights} Feeder Share`
                : `${defaultEmerging.roomNightsFormatted} Feeder Share`}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Feeder Breakdown Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Continental Feeder Performance ({periodDef.label})
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Room nights share, pricing yield, and total room revenue by geographic source
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Market</th>
                <th className="py-2.5 px-4 text-right">Room Nights Share</th>
                <th className="py-2.5 px-4 text-right">ADR (USD)</th>
                <th className="py-2.5 px-4 text-right">Revenue (USD)</th>
                <th className="py-2.5 px-4 text-right">YoY Pace</th>
                <th className="py-2.5 px-4">Primary Feeder Countries</th>
                <th className="py-2.5 px-4">Key Aviation Gateways</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {activeItems
                ? activeItems.map((item: any) => {
                    const meta = regionalMeta[item.region] || {
                      feederCountries: ['International feeders'],
                      keyHubs: 'Global aviation hubs',
                      vsLy: '↑ +10%',
                    };
                    return (
                      <tr key={item.region} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-900">{item.region}</td>
                        <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.rnights}</td>
                        <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.adr}</td>
                        <td className="py-3 px-4 text-right font-bold text-zinc-900">{item.revenue}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-700">{meta.vsLy}</td>
                        <td className="py-3 px-4 text-zinc-600">{meta.feederCountries.join(', ')}</td>
                        <td className="py-3 px-4 text-zinc-500 text-[11px]">{meta.keyHubs}</td>
                      </tr>
                    );
                  })
                : data.items.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-900">{item.market}</td>
                      <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.roomNightsFormatted}</td>
                      <td className="py-3 px-4 text-right font-medium text-zinc-700">{item.adrFormatted}</td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-900">{item.revenueFormatted}</td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-700">{item.vsLyFormatted}</td>
                      <td className="py-3 px-4 text-zinc-600">{item.feederCountries.join(', ')}</td>
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">{item.keyHubs}</td>
                    </tr>
                  ))}

              {/* Total Row */}
              <tr className="bg-zinc-50 font-bold border-t border-zinc-200">
                <td className="py-3 px-4 text-zinc-900">Total Portfolio</td>
                <td className="py-3 px-4 text-right text-zinc-900">
                  {totalRow ? totalRow.rnights : '100%'}
                </td>
                <td className="py-3 px-4 text-right text-zinc-900">
                  {totalRow ? totalRow.adr : fmtUsd(pm.adr)}
                </td>
                <td className="py-3 px-4 text-right text-zinc-900">{totalRevenueDisplay}</td>
                <td className="py-3 px-4 text-right text-emerald-700">
                  ↑ {fmtSignedPct(pm.vsLy.roomRevenuePct)}
                </td>
                <td className="py-3 px-4 text-zinc-600 text-[11px]" colSpan={2}>
                  Realized Geographical Contribution
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Property-Level Feeder Market Contribution Matrix */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/70">
          <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Property-Level Feeder Distribution (10 Sanctuaries — {periodDef.label})
          </h5>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Single Source of Truth cross-referenced with live PMS property records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Property</th>
                <th className="py-2.5 px-4">Cluster</th>
                <th className="py-2.5 px-4 text-right">Occupancy</th>
                <th className="py-2.5 px-4 text-right">ADR</th>
                <th className="py-2.5 px-4 text-right">Top Feeder Region</th>
                <th className="py-2.5 px-4 text-right">Feeder Share</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {propertiesData.map((prop) => {
                const topFeeder =
                  prop.grouping === 'Alpine' || prop.grouping === 'Countryside'
                    ? { name: 'Europe', share: '46%' }
                    : prop.grouping === 'Ocean' || prop.grouping === 'City'
                    ? { name: 'Asia Pacific', share: '52%' }
                    : prop.grouping === 'Desert'
                    ? { name: 'Middle East', share: '44%' }
                    : { name: 'America', share: '38%' };

                return (
                  <tr key={prop.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-zinc-900">{prop.name}</td>
                    <td className="py-2.5 px-4 text-zinc-500">{prop.grouping}</td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-700">
                      {prop.occupancyFormatted}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-700">
                      {prop.adrFormatted}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-zinc-900">
                      {topFeeder.name}
                    </td>
                    <td className="py-2.5 px-4 text-right text-zinc-600">{topFeeder.share}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                          prop.status === 'above_plan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prop.status === 'attention'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {prop.status === 'above_plan'
                          ? 'Above Plan'
                          : prop.status === 'attention'
                          ? 'Attention'
                          : 'On Plan'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
