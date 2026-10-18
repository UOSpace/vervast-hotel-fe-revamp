import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { getCategoryPerformance } from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtPct,
  fmtSignedPts,
  fmtSignedPct,
  type PeriodId,
} from '@/data/portfolio';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';

interface PortfolioPerformanceDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function PortfolioPerformanceDrawerContent({ config }: PortfolioPerformanceDrawerContentProps) {
  const initialHorizon: TimeHorizon =
    config?.data?.horizon || config?.data?.period || 'mtd';
  const [horizon, setHorizon] = useState<TimeHorizon>(initialHorizon);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nextHorizon = config?.data?.horizon || config?.data?.period;
    if (nextHorizon === 'today' || nextHorizon === 'mtd' || nextHorizon === 'ytd') {
      setHorizon(nextHorizon);
    }
  }, [config?.data?.horizon, config?.data?.period]);

  const periodId: PeriodId = horizon;
  const activePeriodLabel = PERIOD_DEFS[periodId].periodLabel;
  const currentCategories = getCategoryPerformance(periodId);
  const m = getPortfolioMetrics(undefined, periodId);

  const summaryCards = [
    {
      label: 'Total Revenue (Hospitality)',
      value: fmtUsd(m.totalRevenue),
      vsBudget: `${fmtSignedPct(m.vsBudget.totalRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.totalRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.totalRevenuePct)} vs LY`,
    },
    {
      label: 'Occupancy',
      value: fmtPct(m.occupancyPct, 1),
      vsBudget: `${fmtSignedPts(m.vsBudget.occupancyPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(m.vsForecast.occupancyPts)} vs Forecast`,
      vsLy: `${fmtSignedPts(m.vsLy.occupancyPts)} vs LY`,
    },
    {
      label: 'Average Daily Rate (ADR)',
      value: fmtUsd(m.adr),
      vsBudget: `${fmtSignedPct(m.vsBudget.adrPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.adrPct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.adrPct)} vs LY`,
    },
    {
      label: 'RevPAR',
      value: fmtUsd(m.revpar),
      vsBudget: `${fmtSignedPct(m.vsBudget.revparPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.revparPct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.revparPct)} vs LY`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Filter Bar: Subtitle & Period + Horizon Filter Tabs (Yesterday | MTD | YTD) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-[10px] text-zinc-900 font-medium mt-0.5">
            As of: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{activePeriodLabel}</span>
          </p>
        </div>

        {/* Tab View Filter: Yesterday | MTD | YTD */}
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

      {/* 4 Executive Horizon KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium truncate">
                {card.label}
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                ↑ {card.vsLy}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 my-1.5">
              {card.value}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-zinc-600 font-medium bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60 whitespace-nowrap">
                {card.vsBudget}
              </span>
              <span className="text-[9px] text-zinc-600 font-medium bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60 whitespace-nowrap">
                {card.vsForecast}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Collection League Table */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Property Categories Performance ({horizon === 'today' ? 'Today' : horizon.toUpperCase()} Breakdown)
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            Click categories row to expand individual properties
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 shadow-2xs backdrop-blur-sm">
              <tr className="text-left text-zinc-400">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Categories</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                  Revenue ({horizon === 'today' ? 'Yesterday' : horizon.toUpperCase()})
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((prop) => {
                const isExpanded = !!expandedRows[prop.id];
                return (
                  <React.Fragment key={prop.id}>
                    <tr
                      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                      onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                    >
                      <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                        {isExpanded ? (
                          <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                        ) : (
                          <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                        )}
                        {prop.name}
                      </td>
                      <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                      <td className="py-3 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                    </tr>
                    {isExpanded && prop.children.map((child, cIdx) => (
                      <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                        <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                        <td className="py-2.5 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">{m.propertyCount} Properties Worldwide</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">{fmtPct(m.occupancyPct, 1)}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{fmtUsd(m.adr)}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{fmtUsd(m.totalRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{fmtUsd(m.revpar)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
