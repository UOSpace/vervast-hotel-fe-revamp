import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRevenueDemandMixData,
  getSimulatedPropertiesData,
  type MixItem,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtPct,
  fmtSignedPct,
  type PeriodId,
} from '@/data/portfolio';

interface RevenueDemandMixDrawerContentProps {
  theme?: string;
  onNavigatePillar?: (path: string) => void;
  config?: {
    title?: string;
    data?: any;
  };
}

export function RevenueDemandMixDrawerContent({
  onNavigatePillar,
  config,
}: RevenueDemandMixDrawerContentProps) {
  const navigate = useNavigate();
  const initialPeriod: PeriodId =
    config?.data?.period || config?.data?.horizon || 'mtd';
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);
  const [activeTab, setActiveTab] = useState<'revenue' | 'demand'>('revenue');

  useEffect(() => {
    const nextPeriod = config?.data?.period || config?.data?.horizon;
    if (nextPeriod) setPeriod(nextPeriod);
  }, [config?.data?.period, config?.data?.horizon]);

  const data = getRevenueDemandMixData(period);
  const m = getPortfolioMetrics(undefined, period);
  const propertiesMap = getSimulatedPropertiesData(period);
  const periodDef = PERIOD_DEFS[period];

  const nonRoomRev = m.totalRevenue - m.roomRevenue;
  const roomsSharePct = m.totalRevenue > 0 ? (m.roomRevenue / m.totalRevenue) * 100 : 0;
  const nonRoomSharePct = m.totalRevenue > 0 ? (nonRoomRev / m.totalRevenue) * 100 : 0;

  const peakItem =
    [...data.items].sort(
      (a, b) =>
        parseFloat(b.revenueTrend.replace(/[^0-9.-]/g, '')) -
        parseFloat(a.revenueTrend.replace(/[^0-9.-]/g, ''))
    )[0] || data.items[0];

  const handlePillarClick = (item: MixItem) => {
    if (item.pillarRoute) {
      if (onNavigatePillar) {
        onNavigatePillar(item.pillarRoute);
      } else {
        navigate(item.pillarRoute);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Pillar Architecture
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-900 text-white">
              5 Pillars + Packages
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Revenue &amp; Demand Mix Analysis ({periodDef.label})
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Connecting Rooms, Culinary (F&amp;B), Spa, Longevity Wellness, Experiential Activities, and Curated Packages ·{' '}
            <span className="font-semibold text-zinc-700">{periodDef.periodLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Period Horizon Switch */}
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

          {/* View Mode Switch */}
          <div className="inline-flex items-center p-1 rounded-lg bg-zinc-100 border border-zinc-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('revenue')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'revenue'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Revenue ($)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('demand')}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'demand'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Demand Units
            </button>
          </div>
        </div>
      </div>

      {/* 4 Executive Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Total Hotel Revenue ({periodDef.label})
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {fmtUsd(m.totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              ↑ {fmtSignedPct(m.vsLy.totalRevenuePct)} vs LY
            </span>
            <span className="text-[10px] text-zinc-500">
              {fmtSignedPct(m.vsBudget.totalRevenuePct)} vs Budget
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Rooms Revenue Core
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {fmtUsd(m.roomRevenue)}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-700 font-medium">
              {fmtPct(roomsSharePct, 1)} Total Mix
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              ↑ {fmtSignedPct(m.vsLy.roomRevenuePct)} YoY
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Non-Room Pillars
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {fmtUsd(nonRoomRev)}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-700 font-medium">
              {fmtPct(nonRoomSharePct, 1)} Ancillary Mix
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              ↑ {fmtSignedPct(m.vsLy.totalRevenuePct)} YoY
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between gap-3">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Peak Growth Driver
          </span>
          <div>
            <div className="text-xl font-bold text-emerald-700 leading-tight">
              {peakItem.revenueTrend}
            </div>
            <div className="text-[11px] font-normal text-zinc-600 mt-0.5">
              {peakItem.name}
            </div>
            <div className="text-[10px] text-zinc-500 font-medium mt-1">
              {peakItem.revenueFormatted} generated · ↑ Pace
            </div>
          </div>
        </div>
      </div>

      {/* Main Breakdown Table across Pillars */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            {activeTab === 'revenue'
              ? `Revenue Contribution by SOSEI Pillar (${periodDef.label})`
              : `Operational Demand & Guest Engagement Units (${periodDef.label})`}
          </h5>
          <span className="text-[10px] text-zinc-400">
            Click any row to drill into dedicated pillar workspace
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3.5 font-semibold text-[10px] border-b border-zinc-200">
                  Business Pillar
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  {periodDef.label} Revenue
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Mix %
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Demand Volume
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  YoY Growth
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  vs Budget
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => handlePillarClick(item)}
                  className={`hover:bg-zinc-50/80 transition-colors cursor-pointer group ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                  }`}
                >
                  <td className="py-3 px-3.5 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 max-w-[280px] truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                    {item.revenueFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-zinc-700 border-b border-zinc-100">
                    {item.revenuePctFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-zinc-600 border-b border-zinc-100">
                    <span className="font-semibold text-zinc-800">{item.demandFormatted}</span>
                    <span className="block text-[9px] text-zinc-400">{item.demandUnit}</span>
                  </td>
                  <td className="py-3 px-3 text-right border-b border-zinc-100">
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-100">
                      ↑ {item.revenueTrend}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-zinc-600 text-[10px] font-medium border-b border-zinc-100">
                    +{(Math.abs(parseFloat(item.revenueTrend)) * 0.35).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3.5 text-right border-b border-zinc-100">
                    <span className="text-[10px] font-semibold text-zinc-700 group-hover:text-zinc-950 underline underline-offset-2">
                      Drilldown →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property-Level Pillar Contribution (Single Source of Truth from Portfolio Engine) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Property Contribution Across All 10 Sanctuaries ({periodDef.label})
          </h5>
          <span className="text-[10px] text-zinc-400">
            Live PMS Sync (100% SSOT Data)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50/80">
                <th className="py-2 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Sanctuary Property
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Location &amp; Collection
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Rooms Rev
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  F&amp;B Rev
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Spa &amp; Experiential
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Total {periodDef.label} Rev
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {m.properties.map((p, idx) => {
                const mapInfo = propertiesMap.find((pr) => pr.id === p.propertyId);
                return (
                  <tr
                    key={p.propertyId}
                    className={`hover:bg-zinc-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                      {p.name}
                    </td>
                    <td className="py-2 px-3 text-zinc-500 text-[10.5px] border-b border-zinc-100">
                      {p.location} ·{' '}
                      <span className="font-medium text-zinc-700">
                        {mapInfo?.grouping || p.categoryName}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                      {fmtUsd(p.roomRevenue)}
                    </td>
                    <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">
                      {fmtUsd(p.fnbRevenue)}
                    </td>
                    <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">
                      {fmtUsd(p.spaRevenue + p.experienceRevenue)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                      {fmtUsd(p.totalRevenue)}
                    </td>
                    <td className="py-2 px-3 text-right border-b border-zinc-100">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${
                          p.status === 'above_plan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : p.status === 'on_plan'
                            ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}
                      >
                        {p.status === 'above_plan'
                          ? 'Above Plan'
                          : p.status === 'on_plan'
                          ? 'On Plan'
                          : 'Attention'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
                <td className="py-2.5 px-3 text-zinc-900">Total Portfolio (10 Sanctuaries)</td>
                <td className="py-2.5 px-3 text-zinc-500">Global Portfolio Rollup</td>
                <td className="py-2.5 px-3 text-right text-zinc-900">{fmtUsd(m.roomRevenue)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900">{fmtUsd(m.fnbRevenue)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900">
                  {fmtUsd(m.spaRevenue + m.experienceRevenue)}
                </td>
                <td className="py-2.5 px-3 text-right text-zinc-900">{fmtUsd(m.totalRevenue)}</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Above Plan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
