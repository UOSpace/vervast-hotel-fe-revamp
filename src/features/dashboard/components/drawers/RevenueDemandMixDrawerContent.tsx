import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { getCategoryPerformance } from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
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
  config,
}: RevenueDemandMixDrawerContentProps) {
  const initialPeriod: PeriodId =
    config?.data?.period || config?.data?.horizon || 'mtd';
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nextPeriod = config?.data?.period || config?.data?.horizon;
    if (nextPeriod) setPeriod(nextPeriod);
  }, [config?.data?.period, config?.data?.horizon]);

  const m = getPortfolioMetrics(undefined, period);
  const categories = getCategoryPerformance(period);
  const periodDef = PERIOD_DEFS[period];

  const summaryCards = [
    {
      label: 'Total Revenue',
      value: fmtUsd(m.totalRevenue),
      vsBudget: `${fmtSignedPct(m.vsBudget.totalRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.totalRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.totalRevenuePct)} vs LY`,
    },
    {
      label: 'Room Revenue',
      value: fmtUsd(m.roomRevenue),
      vsBudget: `${fmtSignedPct(m.vsBudget.roomRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.roomRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.roomRevenuePct)} vs LY`,
    },
    {
      label: 'F&B',
      value: fmtUsd(m.fnbRevenue),
      vsBudget: `${fmtSignedPct(m.vsBudget.fnbRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.fnbRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.fnbRevenuePct)} vs LY`,
    },
    {
      label: 'Spa',
      value: fmtUsd(m.spaRevenue),
      vsBudget: `${fmtSignedPct(m.vsBudget.spaRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.spaRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.spaRevenuePct)} vs LY`,
    },
    {
      label: 'Activities',
      value: fmtUsd(m.experienceRevenue),
      vsBudget: `${fmtSignedPct(m.vsBudget.experienceRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.experienceRevenuePct)} vs Forecast`,
      vsLy: `${fmtSignedPct(m.vsLy.experienceRevenuePct)} vs LY`,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            As of: <span className="font-semibold text-zinc-800">{periodDef.periodLabel}</span>
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
                  {h === 'today' ? 'Yesterday' : h.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5 Summary Cards: Total Revenue, Room Revenue, F&B, Spa, Activities */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium truncate">
                {card.label}
              </span>
              <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                ↑ {card.vsLy}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 my-1.5">
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

      {/* Property Categories Breakdown (5 Categories expandable to 10 Sanctuaries) */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            Property Categories Breakdown ({periodDef.label} Actuals)
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            Click categories row to expand individual property
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-xs text-zinc-800 border-separate border-spacing-0">
            <thead className="sticky -top-6 z-20 bg-zinc-50/90 backdrop-blur-sm">
              <tr className="text-left text-zinc-400">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                  Property Categories
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                  Location
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Rooms
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  F&amp;B
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Spa
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Activities
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Total Revenue ({periodDef.label})
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isExpanded = !!expandedRows[cat.id];
                return (
                  <React.Fragment key={cat.id}>
                    <tr
                      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [cat.id]: !prev[cat.id],
                        }))
                      }
                    >
                      <td className="py-2.5 px-3 font-semibold text-zinc-900 flex items-center gap-1.5 whitespace-nowrap">
                        {isExpanded ? (
                          <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                        ) : (
                          <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                        )}
                        {cat.name}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">
                        {cat.location}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">
                        {fmtUsd(cat.metrics.roomRevenue)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">
                        {fmtUsd(cat.metrics.fnbRevenue)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">
                        {fmtUsd(cat.metrics.spaRevenue)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">
                        {fmtUsd(cat.metrics.experienceRevenue)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-zinc-900 whitespace-nowrap">
                        {fmtUsd(cat.metrics.totalRevenue)}
                      </td>
                    </tr>
                    {isExpanded &&
                      cat.children.map((child, cIdx) => (
                        <tr
                          key={`${cat.id}-child-${cIdx}`}
                          className="border-b border-zinc-100/60 bg-zinc-50/40 text-zinc-600"
                        >
                          <td className="py-2 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 whitespace-nowrap">
                            {child.name}
                          </td>
                          <td className="py-2 px-3 text-[10px] text-zinc-400 whitespace-nowrap">
                            {child.location}
                          </td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {fmtUsd(child.metrics.roomRevenue)}
                          </td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {fmtUsd(child.metrics.fnbRevenue)}
                          </td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {fmtUsd(child.metrics.spaRevenue)}
                          </td>
                          <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">
                            {fmtUsd(child.metrics.experienceRevenue)}
                          </td>
                          <td className="py-2 px-3 text-right text-[10.5px] font-semibold text-zinc-800 whitespace-nowrap">
                            {fmtUsd(child.metrics.totalRevenue)}
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
                <td className="py-3 px-3 text-zinc-900">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">Global Portfolio (9 Properties)</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(m.roomRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(m.fnbRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(m.spaRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(m.experienceRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(m.totalRevenue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
