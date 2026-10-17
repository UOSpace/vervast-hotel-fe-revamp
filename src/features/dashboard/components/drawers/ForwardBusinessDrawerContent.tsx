import { Fragment, useMemo, useState, useEffect } from 'react';
import { RoundAltArrowDown, RoundAltArrowRight } from '@solar-icons/react';
import {
  getForwardBusinessData,
  getSimulatedPropertiesData,
  FORWARD_WINDOW_DAYS,
  type ForwardBusinessWindow,
} from '../../services/propertySimulation';
import { MASTER_CATEGORIES } from '@/constants/categories';
import { getForwardBusiness } from '@/data/portfolio/hospitalityMix';
import {
  fmtUsd,
  fmtPct,
} from '@/data/portfolio';

interface ForwardBusinessDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function ForwardBusinessDrawerContent({ config }: ForwardBusinessDrawerContentProps) {
  const initialWindow: ForwardBusinessWindow =
    (config?.data?.window as ForwardBusinessWindow) || '90D';
  const [selectedWindow, setSelectedWindow] = useState<ForwardBusinessWindow>(initialWindow);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const w = config?.data?.window as ForwardBusinessWindow;
    if (w === '30D' || w === '90D' || w === '180D' || w === '365D') {
      setSelectedWindow(w);
    }
  }, [config?.data?.window]);

  const data = getForwardBusinessData(selectedWindow);
  const windowDays = FORWARD_WINDOW_DAYS[selectedWindow];
  const propertiesMap = getSimulatedPropertiesData('mtd');

  const statusMeta = (status: 'above_plan' | 'on_plan' | 'attention') =>
    status === 'above_plan'
      ? { label: 'Above Plan', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' }
      : status === 'on_plan'
      ? { label: 'On Plan', cls: 'bg-zinc-100 text-zinc-700 border border-zinc-200' }
      : { label: 'Attention', cls: 'bg-rose-50 text-rose-600 border border-rose-100' };

  const categoryGroups = useMemo(() => {
    return MASTER_CATEGORIES.map((cat) => {
      const catPropIds = cat.propertyIds;
      const catFb = getForwardBusiness(catPropIds, windowDays);
      const props = propertiesMap.filter((p) => catPropIds.includes(p.id));
      const rows = props.map((p) => {
        const pFb = getForwardBusiness([p.id], windowDays);
        return {
          prop: p,
          revUsd: pFb.otbRevenue,
          rn: pFb.window.otbRoomsSold,
          occPct: pFb.window.otbOccupancyPct,
          adrUsd: pFb.window.adr,
          riskUsd: pFb.cancellationExposure,
        };
      });
      const status: 'above_plan' | 'on_plan' | 'attention' = props.some(
        (p) => p.status === 'attention'
      )
        ? 'attention'
        : props.every((p) => p.status === 'above_plan')
        ? 'above_plan'
        : 'on_plan';

      return {
        id: cat.id,
        name: cat.name,
        rows,
        revUsd: catFb.otbRevenue,
        rn: catFb.window.otbRoomsSold,
        occPct: catFb.window.otbOccupancyPct,
        adrUsd: catFb.window.adr,
        riskUsd: catFb.cancellationExposure,
        status,
      };
    });
  }, [windowDays, propertiesMap]);

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header & Window Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Committed Horizon
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live PMS Books
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Forward Business — {data.timeframe}
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Committed reservations and contracted revenue already on the books (not vague forecast or pipeline).
          </p>
        </div>

        {/* Time Selector */}
        <div className="inline-flex items-center p-1 rounded-lg bg-zinc-100 border border-zinc-200 shadow-2xs self-start sm:self-auto">
          {(['30D', '90D', '180D', '365D'] as ForwardBusinessWindow[]).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedWindow(period)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                selectedWindow === period
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Top 6 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB Revenue
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{data.revenueOtb}</div>
          <div className="text-[9px] text-zinc-600 font-medium mt-1 flex items-center gap-1">
            <span className="text-zinc-900 font-bold">Def: {data.definiteRevenue}</span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-600">Tent: {data.tentativeRevenue}</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB Room Nights
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{data.roomNightsOtb}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            ↑ {data.roomNightsTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB Occupancy
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{data.occupancyOtb}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            {data.occupancyTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB ADR
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{data.adrOtb}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            ↑ {data.adrTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Leads Pipeline
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">{data.leadsPipeline}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            ↑ {data.leadsPipelineTrend} ({data.leadsCount} leads)
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Cancellation Exposure
          </span>
          <div className="text-xl font-bold text-rose-600 mt-1">{data.cancellationExposure}</div>
          <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
            ↑ {data.cancellationTrend}
          </span>
        </div>
      </div>

      {/* Strategic CEO Takeaways Panel */}
      <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/90 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-zinc-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Demand Rhythm &amp; Strategic Pacing
          </div>
          <div className="text-xs text-zinc-600">
            <strong>Strongest demand period:</strong> {data.strongestDemandPeriod} ·{' '}
            <strong>Weakest demand shoulder:</strong> {data.weakestDemandPeriod}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-medium">
              Forecast Total
            </div>
            <div className="text-base font-bold text-zinc-900">{data.forecastRevenue}</div>
          </div>
        </div>
      </div>

      {/* Period Buckets Breakdown: Definite, Tentative & Pipeline Cadence */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-2">
          Definite, Tentative &amp; Pipeline Cadence ({data.timeframe})
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.buckets.map((b) => (
            <div
              key={b.label}
              className="p-3.5 rounded-xl border transition-all bg-white text-zinc-900 border-zinc-200"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {b.label}
                </span>
                <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {fmtPct(b.occupancyPct, 1)} Occ OTB
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">{b.revenueFormatted}</div>
              <div className="text-[10px] mt-0.5 text-zinc-500">
                {b.roomNights.toLocaleString()} Room Nights OTB
              </div>

              {/* Explicit status breakdown badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-zinc-100 text-[8.5px]">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 text-white font-medium">
                  <span className="w-1 h-1 rounded-full bg-white inline-block" />
                  Definite: {fmtUsd(b.definiteRevenueUsd)}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
                  <span className="w-1 h-1 rounded-full bg-zinc-400 inline-block" />
                  Tentative: {fmtUsd(b.tentativeRevenueUsd)}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-500 font-medium border border-zinc-200/80">
                  <span className="w-1 h-1 rounded-full bg-zinc-300 inline-block" />
                  Pipeline: {fmtUsd(b.pipelineRevenueUsd)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property-Level OTB Breakdown (All 10 Sanctuaries - 100% SSOT Data) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Property On-The-Books Status Across All 10 Sanctuaries ({selectedWindow})
          </h5>
          <span className="text-[10px] text-zinc-400">
            100% Single Source of Truth
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Sanctuary Property
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Collection &amp; City
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  OTB Revenue
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Room Nights
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  OTB Occ %
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  OTB ADR
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  At-Risk
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryGroups.map((g) => {
                const collapsed = !!collapsedCategories[g.id];
                const gs = statusMeta(g.status);
                return (
                  <Fragment key={g.id}>
                    <tr
                      className="bg-zinc-50/70 hover:bg-zinc-100/60 cursor-pointer transition-colors"
                      onClick={() =>
                        setCollapsedCategories((prev) => ({
                          ...prev,
                          [g.id]: !prev[g.id],
                        }))
                      }
                    >
                      <td className="py-2.5 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                        <span className="flex items-center gap-1.5">
                          {collapsed ? (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          )}
                          {g.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 text-[10px] border-b border-zinc-100">
                        {g.rows.length} {g.rows.length === 1 ? 'property' : 'properties'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                        {fmtUsd(g.revUsd)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100">
                        {g.rn.toLocaleString()} RN
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100">
                        {fmtPct(g.occPct, 1)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100">
                        {fmtUsd(g.adrUsd)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-medium border-b border-zinc-100">
                        {fmtUsd(g.riskUsd)}
                      </td>
                      <td className="py-2.5 px-3 text-right border-b border-zinc-100">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${gs.cls}`}
                        >
                          {gs.label}
                        </span>
                      </td>
                    </tr>
                    {!collapsed &&
                      g.rows.map(({ prop, revUsd, rn, occPct, adrUsd, riskUsd }) => {
                        const ps = statusMeta(prop.status);
                        return (
                          <tr key={prop.id} className="bg-white hover:bg-zinc-50 transition-colors">
                            <td className="py-2 px-3 pl-9 font-medium text-zinc-800 border-b border-zinc-100">
                              {prop.name}
                            </td>
                            <td className="py-2 px-3 text-zinc-400 text-[10px] border-b border-zinc-100">
                              {prop.city}
                            </td>
                            <td className="py-2 px-3 text-right font-medium text-zinc-900 border-b border-zinc-100">
                              {fmtUsd(revUsd)}
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">
                              {rn.toLocaleString()} RN
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-700 border-b border-zinc-100">
                              {fmtPct(occPct, 1)}
                            </td>
                            <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">
                              {fmtUsd(adrUsd)}
                            </td>
                            <td className="py-2 px-3 text-right text-rose-600 border-b border-zinc-100">
                              {fmtUsd(riskUsd)}
                            </td>
                            <td className="py-2 px-3 text-right border-b border-zinc-100">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${ps.cls}`}
                              >
                                {ps.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
                <td className="py-2.5 px-3 text-zinc-900">Total Portfolio ({selectedWindow})</td>
                <td className="py-2.5 px-3 text-zinc-500">10 Sanctuaries · 5 Collections</td>
                <td className="py-2.5 px-3 text-right text-zinc-900">{data.revenueOtb}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900">{data.roomNightsOtb} RN</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">{data.occupancyOtb}</td>
                <td className="py-2.5 px-3 text-right text-zinc-900">{data.adrOtb}</td>
                <td className="py-2.5 px-3 text-right text-rose-600">{data.cancellationExposure}</td>
                <td className="py-2.5 px-3 text-right text-emerald-700">Above Plan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
