import React, { useState, useEffect } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';
import { useNavigate } from 'react-router-dom';
import {
  getPortfolioComparisonData,
} from '../../services/propertySimulation';
import {
  getPortfolioMetrics,
  PERIOD_DEFS,
  fmtUsd,
  fmtPct,
  fmtSignedPct,
  type PeriodId,
} from '@/data/portfolio';

interface PortfolioComparisonDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function PortfolioComparisonDrawerContent(
  props: PortfolioComparisonDrawerContentProps
) {
  const navigate = useNavigate();
  const drawerCtx = useDashboardDrawer();
  const config = props.config ?? drawerCtx.config;

  const initialPeriod: PeriodId =
    (config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon)) ||
    'mtd';
  const [period, setPeriod] = useState<PeriodId>(initialPeriod);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const nextPeriod =
      config?.data && !Array.isArray(config.data) && (config.data.period || config.data.horizon);
    if (nextPeriod === 'today' || nextPeriod === 'mtd' || nextPeriod === 'ytd') {
      setPeriod(nextPeriod);
    }
  }, [config?.data]);

  const periodDef = PERIOD_DEFS[period];
  const comparisonData = getPortfolioComparisonData(period);
  const portfolioMetrics = getPortfolioMetrics(undefined, period);
  const customData = Array.isArray(config?.data) ? config.data : null;

  let items: any[] = comparisonData.items;

  if (customData && customData.length > 0) {
    items = customData.map((prop: any, idx: number) => ({
      id: prop.id || `prop-${idx}`,
      property: prop.name,
      location: prop.location,
      occupancy:
        typeof prop.occupancyPct === 'number'
          ? fmtPct(prop.occupancyPct, 1)
          : prop.occupancy || '70.0%',
      occupancyNum: prop.occupancyPct || 70,
      adrFormatted:
        typeof prop.adr === 'number' ? fmtUsd(prop.adr) : prop.adr || '$2,000',
      adrNum: prop.adr || 2000,
      revparFormatted:
        typeof prop.revpar === 'number' ? fmtUsd(prop.revpar) : prop.revpar || '$1,500',
      revparNum: prop.revpar || 1500,
      roomRevenueFormatted:
        typeof prop.roomRevenue === 'number'
          ? fmtUsd(prop.roomRevenue)
          : prop.roomRevenue || '$1.0M',
      roomRevenueNum: prop.roomRevenue || 1000000,
      totalRevenueFormatted:
        typeof prop.totalRevenue === 'number'
          ? fmtUsd(prop.totalRevenue)
          : typeof prop.roomRevenue === 'number'
          ? fmtUsd(prop.roomRevenue * 1.25)
          : '$1.25M',
      totalRevenueNum: prop.totalRevenue || (prop.roomRevenue || 1000000) * 1.25,
      growthVsLy: prop.growthVsLy || '+12.0%',
      growthVsLyNum: prop.growthVsLyNum ?? 12,
      vsBudget: prop.vsBudget || '+4.0%',
      vsBudgetNum: prop.vsBudgetNum ?? 4,
      status: prop.status || 'above_plan',
      propertyRoute: prop.propertyRoute || '/dashboard/property',
    }));
  }

  // Dynamically derive the 4 hero benchmark cards from items
  const topRevItem =
    [...items].sort((a, b) => b.totalRevenueNum - a.totalRevenueNum)[0] || items[0];
  const topOccItem =
    [...items].sort((a, b) => b.occupancyNum - a.occupancyNum)[0] || items[0];
  const topAdrItem =
    [...items].sort((a, b) => b.adrNum - a.adrNum)[0] || items[0];
  const attItem =
    items.find((i: any) => i.status === 'attention') ||
    [...items].sort((a, b) => a.occupancyNum - b.occupancyNum)[0] ||
    items[items.length - 1];

  const heroTopRev = {
    title: customData ? 'Top Revenue Property' : 'Top Revenue Driver',
    val: topRevItem?.property || 'SOSEI Ski',
    tag: `↑ ${topRevItem?.growthVsLy || '+14%'} vs LY`,
    sub: `${topRevItem?.totalRevenueFormatted || '$34.5M'} Total`,
  };
  const heroTopOcc = {
    title: 'Highest Occupancy',
    val: topOccItem?.property || 'SOSEI Ski',
    tag: `${topOccItem?.occupancy || '76.2%'} Occ`,
    sub: `${topOccItem?.revparFormatted || '$1,054'} RevPAR`,
  };
  const heroTopAdr = {
    title: 'Highest ADR Yield',
    val: `${topAdrItem?.adrFormatted || '$2,709'} ADR`,
    sub: topAdrItem?.property || 'SOSEI Ski',
    tag: 'Rate Leader',
  };
  const heroAttention = {
    title: 'Attention / Opportunity',
    val: attItem?.property || 'SOSEI Wellness',
    tag: `${attItem?.occupancy || '62.0%'} Occ`,
    sub: `${attItem?.adrFormatted || '$1,200'} ADR`,
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Executive Benchmarking
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-900 text-white">
              Who is Winning?
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            {config?.title || 'Portfolio Comparison & Collection Benchmarks'} ({periodDef.label})
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Direct comparison of Occupancy, ADR, RevPAR, and revenue pacing across collections and properties ·{' '}
            As of: <span className="font-semibold text-zinc-900">{periodDef.periodLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
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

          <button
            type="button"
            onClick={() => navigate('/dashboard/property')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
          >
            View Full Property Portal →
          </button>
        </div>
      </div>

      {/* 4 Hero Benchmarks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            {heroTopRev.title}
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">{heroTopRev.val}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              {heroTopRev.tag}
            </span>
            <span className="text-[10px] text-zinc-500">{heroTopRev.sub}</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            {heroTopOcc.title}
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">{heroTopOcc.val}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-800 font-semibold">{heroTopOcc.tag}</span>
            <span className="text-[10px] text-zinc-500">{heroTopOcc.sub}</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            {heroTopAdr.title}
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">{heroTopAdr.val}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-600">{heroTopAdr.sub}</span>
            <span className="text-[10px] text-emerald-700 font-medium">{heroTopAdr.tag}</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            {heroAttention.title}
          </span>
          <div className="text-lg font-bold text-zinc-900 mt-1">{heroAttention.val}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-700 font-medium bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
              {heroAttention.tag}
            </span>
            <span className="text-[10px] text-zinc-500">{heroAttention.sub}</span>
          </div>
        </div>
      </div>

      {/* Primary Collection Comparison Table */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Property Categories Performance League ({periodDef.label})
          </h5>
          <span className="text-[9.5px] text-zinc-400">
            Click category row to expand individual properties
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[760px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3 text-left font-semibold text-[10px] border-b border-zinc-200">Property Categories</th>
                <th className="py-2.5 px-3 text-left font-semibold text-[10px] border-b border-zinc-200">Destination</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Occupancy</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">ADR (USD)</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">RevPAR</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Room Revenue</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">Total Revenue</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">vs LY</th>
                <th className="py-2.5 px-3 text-right font-semibold text-[10px] border-b border-zinc-200">vs Budget</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => {
                const isExpanded = !!expandedRows[item.id];
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      onClick={() => {
                        if (hasChildren) {
                          setExpandedRows((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }));
                        } else if (item.propertyRoute) {
                          navigate(item.propertyRoute);
                        }
                      }}
                      className={`hover:bg-zinc-50 transition-colors cursor-pointer group ${
                        isExpanded
                          ? 'bg-zinc-50/80'
                          : idx % 2 === 0
                          ? 'bg-white'
                          : 'bg-zinc-50/30'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-zinc-900 group-hover:text-zinc-700 border-b border-zinc-100 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {hasChildren && (
                            <span className="text-zinc-400">
                              {isExpanded ? (
                                <RoundAltArrowDown size={14} />
                              ) : (
                                <RoundAltArrowRight size={14} />
                              )}
                            </span>
                          )}
                          <span>{item.property}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 border-b border-zinc-100">
                        {item.location}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100">
                        {item.occupancy}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                        {item.adrFormatted}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                        {item.revparFormatted}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                        {item.roomRevenueFormatted}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                        {item.totalRevenueFormatted}
                      </td>
                      <td className="py-3 px-3 text-right border-b border-zinc-100">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                            item.growthVsLyNum > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : item.growthVsLyNum < 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {item.growthVsLyNum > 0 ? '↑' : item.growthVsLyNum < 0 ? '↓' : '—'} {item.growthVsLy}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right border-b border-zinc-100">
                        <span
                          className={`inline-flex items-center gap-0.5 font-medium text-[10px] ${
                            item.vsBudgetNum > 0
                              ? 'text-emerald-700'
                              : item.vsBudgetNum < 0
                              ? 'text-rose-600'
                              : 'text-zinc-500'
                          }`}
                        >
                          {item.vsBudgetNum > 0 ? '↑' : item.vsBudgetNum < 0 ? '↓' : '—'} {item.vsBudget}
                        </span>
                      </td>
                    </tr>

                    {isExpanded &&
                      item.children?.map((child: any) => (
                        <tr
                          key={`${item.id}-${child.id}`}
                          onClick={() => child.propertyRoute && navigate(child.propertyRoute)}
                          className="bg-zinc-50/40 hover:bg-zinc-100/50 transition-colors cursor-pointer text-[11px]"
                        >
                          <td className="py-2 pl-9 pr-3 font-medium text-zinc-700 border-b border-zinc-100/80 whitespace-nowrap">
                            <span className="text-zinc-300 mr-1.5">└</span>
                            {child.property}
                          </td>
                          <td className="py-2 px-3 text-zinc-400 border-b border-zinc-100/80 whitespace-nowrap">
                            {child.location}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100/80 whitespace-nowrap">
                            {child.occupancy}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100/80 whitespace-nowrap">
                            {child.adrFormatted}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100/80 whitespace-nowrap">
                            {child.revparFormatted}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100/80 whitespace-nowrap">
                            {child.roomRevenueFormatted}
                          </td>
                          <td className="py-2 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100/80 whitespace-nowrap">
                            {child.totalRevenueFormatted}
                          </td>
                          <td className="py-2 px-3 text-right border-b border-zinc-100/80 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-0.5 text-[9.5px] font-medium ${
                                child.growthVsLyNum > 0
                                  ? 'text-emerald-700'
                                  : child.growthVsLyNum < 0
                                  ? 'text-rose-600'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {child.growthVsLyNum > 0 ? '↑' : child.growthVsLyNum < 0 ? '↓' : '—'} {child.growthVsLy}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right border-b border-zinc-100/80 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-0.5 text-[9.5px] font-medium ${
                                child.vsBudgetNum > 0
                                  ? 'text-emerald-700'
                                  : child.vsBudgetNum < 0
                                  ? 'text-rose-600'
                                  : 'text-zinc-500'
                              }`}
                            >
                              {child.vsBudgetNum > 0 ? '↑' : child.vsBudgetNum < 0 ? '↓' : '—'} {child.vsBudget}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
                <td className="py-3 px-3 text-zinc-900">Portfolio Total / Average</td>
                <td className="py-3 px-3 text-zinc-500">9 Properties · 5 Collections</td>
                <td className="py-3 px-3 text-right text-emerald-700">{fmtPct(portfolioMetrics.occupancyPct, 1)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(portfolioMetrics.adr)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(portfolioMetrics.revpar)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(portfolioMetrics.roomRevenue)}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{fmtUsd(portfolioMetrics.totalRevenue)}</td>
                <td className="py-3 px-3 text-right text-emerald-700">
                  ↑ {fmtSignedPct(portfolioMetrics.vsLy.totalRevenuePct)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-700">
                  ↑ {fmtSignedPct(portfolioMetrics.vsBudget.totalRevenuePct)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
