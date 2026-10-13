import { Fragment, useMemo, useState } from 'react';
import { RoundAltArrowDown, RoundAltArrowRight } from '@solar-icons/react';
import {
  simulatedForwardBusinessData,
  simulatedPropertiesData,
  type ForwardBusinessWindow,
} from '../../services/propertySimulation';

export function ForwardBusinessDrawerContent() {
  const [selectedWindow, setSelectedWindow] = useState<ForwardBusinessWindow>('90D');
  const data = simulatedForwardBusinessData[selectedWindow];
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const statusMeta = (status: 'above_plan' | 'on_plan' | 'attention') =>
    status === 'above_plan'
      ? { label: 'Above Plan', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' }
      : status === 'on_plan'
        ? { label: 'On Plan', cls: 'bg-zinc-100 text-zinc-700 border border-zinc-200' }
        : { label: 'Attention', cls: 'bg-rose-50 text-rose-600 border border-rose-100' };

  const categoryGroups = useMemo(() => {
    const map = new Map<string, typeof simulatedPropertiesData>();
    simulatedPropertiesData.forEach((p) => {
      map.set(p.grouping, [...(map.get(p.grouping) ?? []), p]);
    });
    return Array.from(map.entries()).map(([grouping, props]) => {
      const rows = props.map((p) => {
        const rev = (p.monthlyRevenueUsd * 2.8) / 1000000;
        return { prop: p, rev, rn: Math.round(p.occupiedRooms * 84), risk: rev * 0.054 };
      });
      const totalRooms = props.reduce((s, p) => s + p.totalRooms, 0);
      const occupied = props.reduce((s, p) => s + p.occupiedRooms, 0);
      const status: 'above_plan' | 'on_plan' | 'attention' = props.some((p) => p.status === 'attention')
        ? 'attention'
        : props.every((p) => p.status === 'above_plan')
          ? 'above_plan'
          : 'on_plan';
      return {
        grouping,
        rows,
        rev: rows.reduce((s, r) => s + r.rev, 0),
        rn: rows.reduce((s, r) => s + r.rn, 0),
        risk: rows.reduce((s, r) => s + r.risk, 0),
        occ: totalRooms ? (occupied / totalRooms) * 100 : 0,
        adr: occupied ? props.reduce((s, p) => s + p.adrUsd * p.occupiedRooms, 0) / occupied : 0,
        status,
      };
    });
  }, []);

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
            Forward Business (On-The-Books Intelligence)
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
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${selectedWindow === period
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Top 5 Hero KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB Revenue
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {data.revenueOtb}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            ↑ {data.revenueTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB Room Nights
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {data.roomNightsOtb}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            ↑ {data.roomNightsTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB Occupancy
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {data.occupancyOtb}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            {data.occupancyTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            OTB ADR
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {data.adrOtb}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">
            ↑ {data.adrTrend}
          </span>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Cancellation Exposure
          </span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            {data.cancellationExposure}
          </div>
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

      {/* Period Buckets Breakdown */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 mb-2">
          Tentative & Definite Revenue Cadence ({data.timeframe})
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
                  {b.occupancyPct}% Occ OTB
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">{b.revenueFormatted}</div>
              <div className="text-[10px] mt-1 text-zinc-500">
                {b.roomNights.toLocaleString()} Room Nights (Definite: ${b.committedRevenueUsd}M · Tentative: ${b.tentativeRevenueUsd}M)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property-Level OTB Breakdown (All 10 Sanctuaries - 100% SSOT Data) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Property On-The-Books Status Across All 10 Sanctuaries
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
                const collapsed = !!collapsedCategories[g.grouping];
                const gs = statusMeta(g.status);
                return (
                  <Fragment key={g.grouping}>
                    <tr
                      className="bg-zinc-50/70 hover:bg-zinc-100/60 cursor-pointer transition-colors"
                      onClick={() => setCollapsedCategories((prev) => ({ ...prev, [g.grouping]: !prev[g.grouping] }))}
                    >
                      <td className="py-2.5 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                        <span className="flex items-center gap-1.5">
                          {collapsed ? (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          )}
                          Sosei {g.grouping}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 text-[10px] border-b border-zinc-100">
                        {g.rows.length} {g.rows.length === 1 ? 'property' : 'properties'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">${g.rev.toFixed(2)}M</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100">{g.rn.toLocaleString()} RN</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100">{g.occ.toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100">${Math.round(g.adr).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-600 font-medium border-b border-zinc-100">${g.risk.toFixed(2)}M</td>
                      <td className="py-2.5 px-3 text-right border-b border-zinc-100">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${gs.cls}`}>{gs.label}</span>
                      </td>
                    </tr>
                    {!collapsed &&
                      g.rows.map(({ prop, rev, rn, risk }) => {
                        const ps = statusMeta(prop.status);
                        return (
                          <tr key={prop.id} className="bg-white hover:bg-zinc-50 transition-colors">
                            <td className="py-2 px-3 pl-9 font-medium text-zinc-800 border-b border-zinc-100">{prop.name}</td>
                            <td className="py-2 px-3 text-zinc-400 text-[10px] border-b border-zinc-100">{prop.city}</td>
                            <td className="py-2 px-3 text-right font-medium text-zinc-900 border-b border-zinc-100">${rev.toFixed(2)}M</td>
                            <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">{rn.toLocaleString()} RN</td>
                            <td className="py-2 px-3 text-right text-zinc-700 border-b border-zinc-100">{prop.occupancyFormatted}</td>
                            <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">{prop.adrFormatted}</td>
                            <td className="py-2 px-3 text-right text-rose-600 border-b border-zinc-100">${risk.toFixed(2)}M</td>
                            <td className="py-2 px-3 text-right border-b border-zinc-100">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${ps.cls}`}>{ps.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
