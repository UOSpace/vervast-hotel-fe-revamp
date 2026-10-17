import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';

import {
  getCategoryPerformance,
  simulatedCategoryPerformance,
  type PropertyPerformanceCategory,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  fmtUsd,
  fmtPct,
  type PeriodId,
} from '@/data/portfolio';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';
export type PropertyPerformanceItem = PropertyPerformanceCategory;
export const accuratePropertiesData: PropertyPerformanceCategory[] = simulatedCategoryPerformance;

interface MetricDrawerContentProps {
  config: {
    title: string;
    data?: any;
  };
  theme?: string;
}

const AS_OF_DATE_LABELS: Record<TimeHorizon, string> = {
  today: 'October 16, 2026',
  mtd: 'October 16, 2026',
  ytd: 'October 16, 2026',
};

const PERIOD_SHORT_LABELS: Record<TimeHorizon, string> = {
  today: 'Yesterday',
  mtd: 'MTD',
  ytd: 'YTD',
};

export function MetricDrawerContent({ config }: MetricDrawerContentProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const initialHorizon: TimeHorizon =
    (config.data && typeof config.data === 'object' && (config.data.horizon || config.data.period)) || 'mtd';
  const [horizon, setHorizon] = useState<TimeHorizon>(initialHorizon);

  useEffect(() => {
    const nextH = config.data && typeof config.data === 'object' && (config.data.horizon || config.data.period);
    if (nextH === 'today' || nextH === 'mtd' || nextH === 'ytd') {
      setHorizon(nextH);
    }
  }, [config.data?.horizon, config.data?.period]);

  const t = config.title.toUpperCase();
  const propName = config.data?.propertyName;

  const isTotalHotelRev = t.includes('TOTAL HOTEL REVENUE') || t.includes('TOTAL REVENUE');
  const isRoomRev = t.includes('ROOM REVENUE') || (!isTotalHotelRev && t.includes('REVENUE'));

  const periodId: PeriodId = horizon;
  const periodShort = PERIOD_SHORT_LABELS[horizon];
  const asOfLabel = AS_OF_DATE_LABELS[horizon];
  const pm = getPortfolioMetrics(undefined, periodId);
  const categories = getCategoryPerformance(periodId);

  // Dynamically compute collection table rows from portfolio engine for active horizon
  const dynamicPropertiesData = categories.map((cat) => ({
    ...cat,
    roomsRev: fmtUsd(cat.metrics.roomRevenue),
    fnbRev: fmtUsd(cat.metrics.fnbRevenue),
    spaRev: fmtUsd(cat.metrics.spaRevenue),
    activitiesRev: fmtUsd(cat.metrics.experienceRevenue),
    totalRev: fmtUsd(cat.metrics.totalRevenue),
    revenue:
      isRoomRev && !isTotalHotelRev
        ? fmtUsd(cat.metrics.roomRevenue)
        : fmtUsd(cat.metrics.totalRevenue),
    children: cat.children.map((ch) => ({
      ...ch,
      roomsRev: fmtUsd(ch.metrics.roomRevenue),
      fnbRev: fmtUsd(ch.metrics.fnbRevenue),
      spaRev: fmtUsd(ch.metrics.spaRevenue),
      activitiesRev: fmtUsd(ch.metrics.experienceRevenue),
      totalRev: fmtUsd(ch.metrics.totalRevenue),
      revenue:
        isRoomRev && !isTotalHotelRev
          ? fmtUsd(ch.metrics.roomRevenue)
          : fmtUsd(ch.metrics.totalRevenue),
    })),
  }));

  const footerSummary = {
    occ: fmtPct(pm.occupancyPct, 1),
    adr: fmtUsd(pm.adr),
    roomsRev: fmtUsd(pm.roomRevenue),
    fnbRev: fmtUsd(pm.fnbRevenue),
    spaRev: fmtUsd(pm.spaRevenue),
    activitiesRev: fmtUsd(pm.experienceRevenue),
    totalRev: fmtUsd(pm.totalRevenue),
    revenue:
      isRoomRev && !isTotalHotelRev
        ? fmtUsd(pm.roomRevenue)
        : fmtUsd(pm.totalRevenue),
    revpar: fmtUsd(pm.revpar),
  };

  return (
    <div className="space-y-5 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Filter Bar: Subtitle & As Of Date + Horizon Filter Tabs (Yesterday | MTD | YTD) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            As of: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{asOfLabel}</span>
          </p>
        </div>

        {/* Executive Time Horizon Tabs: Yesterday | MTD | YTD */}
        <div className="inline-flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg shrink-0">
          {(['today', 'mtd', 'ytd'] as const).map((h) => {
            const isActive = horizon === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                {h === 'today' ? 'Yesterday' : h.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Breakdown Table */}
      {isTotalHotelRev ? (
        <div>
          <div className="flex justify-between items-center mb-2 px-0.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
              Property Categories Breakdown ({periodShort} Actuals)
            </h4>
            <span className="text-[9.5px] text-zinc-400">
              Click categories row to expand individual property
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
              <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                <tr className="text-left text-zinc-400">
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Property Categories
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Location
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Rooms
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    F&amp;B
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Spa
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Activities
                  </th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                    Total Revenue ({periodShort})
                  </th>
                </tr>
              </thead>
              <tbody>
                {dynamicPropertiesData.map((prop) => {
                  const isExpanded = !!expandedRows[prop.id];
                  return (
                    <React.Fragment key={prop.id}>
                      <tr
                        className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                        onClick={() => setExpandedRows((prev) => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                      >
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                          {isExpanded ? (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          )}
                          {prop.name}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {prop.roomsRev}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {prop.fnbRev}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {prop.spaRev}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {prop.activitiesRev}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                          {prop.totalRev}
                        </td>
                      </tr>
                      {isExpanded &&
                        prop.children.map((child, cIdx) => (
                          <tr
                            key={`${prop.id}-child-${cIdx}`}
                            className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400"
                          >
                            <td className="py-2 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                              {child.name}
                            </td>
                            <td className="py-2 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.roomsRev}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.fnbRev}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.spaRev}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.activitiesRev}</td>
                            <td className="py-2 px-3 text-right text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                              {child.totalRev}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
                <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                  <td className="py-3 px-3 text-zinc-500">Global Portfolio (9 Properties)</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.roomsRev}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.fnbRev}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.spaRev}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.activitiesRev}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.totalRev}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2 px-0.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
              {propName
                ? `${propName} — Room Tier Inventory & Yield (${periodShort} Actuals)`
                : `Property Categories Breakdown (${periodShort} Actuals)`}
            </h4>
            <span className="text-[9.5px] text-zinc-400">
              {propName ? 'Room categories and realized yields' : 'Click categories row to expand individual properties'}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            {propName ? (
              <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
                <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                  <tr className="text-left text-zinc-400">
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Room Category</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap text-right">Inventory</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                      Revenue ({periodShort})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Presidential / Mountain Chalet', keys: '30 Keys', occ: `${Math.min(95, parseInt(config.data?.occ || '76') + 4)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.18).toLocaleString()}`, rev: horizon === 'today' ? '$3.8K' : horizon === 'ytd' ? '$3.8M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.4) / 1000)}K` },
                    { type: 'Signature Property Suite', keys: '25 Keys', occ: `${config.data?.occ || '76'}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.04).toLocaleString()}`, rev: horizon === 'today' ? '$2.9K' : horizon === 'ytd' ? '$2.9M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.3) / 1000)}K` },
                    { type: 'Panoramic View Suite', keys: '20 Keys', occ: `${Math.max(50, parseInt(config.data?.occ || '76') - 2)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.92).toLocaleString()}`, rev: horizon === 'today' ? '$1.8K' : horizon === 'ytd' ? '$1.8M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.19) / 1000)}K` },
                    { type: 'Glacier / Deluxe Pavilion', keys: '20 Keys', occ: `${Math.max(45, parseInt(config.data?.occ || '76') - 6)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.81).toLocaleString()}`, rev: horizon === 'today' ? '$1.1K' : horizon === 'ytd' ? '$1.1M' : `$${Math.round((parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.11) / 1000)}K` },
                  ].map((tier, idx) => (
                    <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.type}</td>
                      <td className="py-2.5 px-3 text-right text-zinc-500 whitespace-nowrap">{tier.keys}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.occ}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.adr}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.rev}</td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                    <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Property Inventory</td>
                    <td className="py-3 px-3 text-right text-zinc-500">95 Keys</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">{config.data?.occ || '76'}%</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{config.data?.adr || '$2,700'}</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">
                      {horizon === 'today' ? '$9.6K' : horizon === 'ytd' ? '$9.6M' : config.data?.rev || '$1.15M'}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
                <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                  <tr className="text-left text-zinc-400">
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Categories</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                      {isRoomRev && !isTotalHotelRev ? 'Room Revenue' : 'Total Revenue'} ({periodShort})
                    </th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {dynamicPropertiesData.map((prop) => {
                    const isExpanded = !!expandedRows[prop.id];
                    return (
                      <React.Fragment key={prop.id}>
                        <tr
                          className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                          onClick={() => setExpandedRows((prev) => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                        >
                          <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                            {isExpanded ? (
                              <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                            ) : (
                              <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                            )}
                            {prop.name}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                          <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                          <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                        </tr>
                        {isExpanded &&
                          prop.children.map((child, cIdx) => (
                            <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                              <td className="py-2 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                              <td className="py-2 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                              <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                              <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                              <td className="py-2 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                              <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                  <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                    <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                    <td className="py-3 px-3 text-zinc-500">Global Portfolio (9 Properties)</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">{footerSummary.occ}</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.adr}</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.revenue}</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{footerSummary.revpar}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
