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
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const w = config?.data?.window as ForwardBusinessWindow;
    if (w === '30D' || w === '90D' || w === '180D' || w === '365D') {
      setSelectedWindow(w);
    }
  }, [config?.data?.window]);

  const data = getForwardBusinessData(selectedWindow);
  const windowDays = FORWARD_WINDOW_DAYS[selectedWindow];
  const propertiesMap = getSimulatedPropertiesData('mtd');

  const categoryGroups = useMemo(() => {
    return MASTER_CATEGORIES.map((cat) => {
      const catPropIds = cat.propertyIds;
      const catFb = getForwardBusiness(catPropIds, windowDays);
      const props = propertiesMap.filter((p) => catPropIds.includes(p.id));
      const rows = props.map((p) => {
        const pFb = getForwardBusiness([p.id], windowDays);
        return {
          prop: p,
          definiteUsd: pFb.definiteRevenue,
          verbalDefiniteUsd: pFb.verbalDefiniteRevenue,
          tentativeUsd: pFb.tentativeRevenue,
          prospectUsd: pFb.prospectRevenue,
          postponedUsd: pFb.postponedRevenue,
          cancelledUsd: pFb.cancelledRevenue,
          turnedDownUsd: pFb.turnedDownRevenue,
        };
      });

      return {
        id: cat.id,
        name: cat.name,
        location: props.map((p) => p.city).join(' · '),
        rows,
        definiteUsd: catFb.definiteRevenue,
        verbalDefiniteUsd: catFb.verbalDefiniteRevenue,
        tentativeUsd: catFb.tentativeRevenue,
        prospectUsd: catFb.prospectRevenue,
        postponedUsd: catFb.postponedRevenue,
        cancelledUsd: catFb.cancelledRevenue,
        turnedDownUsd: catFb.turnedDownRevenue,
      };
    });
  }, [windowDays, propertiesMap]);

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header & Window Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Horizon: <span className="font-semibold text-zinc-800">{data.timeframe}</span>
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

      {/* Primary Row: 4 Active Book & Pipeline Statuses */}
      <div>
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
          Active Book &amp; Pipeline Status ({selectedWindow})
        </h5>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-900 inline-block" />
                Definite
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                ↑ {data.definiteTrend}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1.5">{data.definiteRevenue}</div>
            <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {data.definiteRoomNights} · Signed &amp; Guaranteed
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                Verbal Definite
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                ↑ {data.verbalDefiniteTrend}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1.5">{data.verbalDefiniteRevenue}</div>
            <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {data.verbalDefiniteRoomNights} · Awaiting Signature
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />
                Tentative
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                ↑ {data.tentativeTrend}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1.5">{data.tentativeRevenue}</div>
            <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {data.tentativeRoomNights} · Space Hold Option
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-200 border border-zinc-400 inline-block" />
                Prospect
              </span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                ↑ {data.prospectTrend}
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1.5">{data.prospectRevenue}</div>
            <div className="text-[10px] text-zinc-500 font-medium mt-0.5">
              {data.prospectRoomNights} · {data.leadsCount} Active Inquiries
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: 3 Attrition / Deferred Statuses (Postponed, Cancelled, Turned Down) */}
      <div>
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
          Deferred &amp; Fallout Status ({selectedWindow})
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Postponed
              </span>
              <div className="text-lg font-bold text-zinc-900 mt-0.5">{data.postponedRevenue}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {data.postponedRoomNights} · Rescheduled to future dates
              </div>
            </div>
            <span className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Deferred
            </span>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Cancelled
              </span>
              <div className="text-lg font-bold text-[#800020] mt-0.5">{data.cancelledRevenue}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {data.cancelledRoomNights} · Released inventory
              </div>
            </div>
            <span className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80">
              Cancelled
            </span>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                Turned Down
              </span>
              <div className="text-lg font-bold text-zinc-800 mt-0.5">{data.turnedDownRevenue}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                {data.turnedDownRoomNights} · Declined (space / rate protection)
              </div>
            </div>
            <span className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Declined
            </span>
          </div>
        </div>
      </div>

      {/* Period Buckets Breakdown: W1-W4 / M1-M3 / M1-2..M5-6 / Q1-Q4 */}
      <div>
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 mb-2">
          Horizon Cadence Breakdown ({selectedWindow})
        </h5>
        <div
          className={`grid grid-cols-1 gap-3 ${
            data.buckets.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'
          }`}
        >
          {data.buckets.map((b) => (
            <div
              key={b.label}
              className="p-3.5 rounded-xl border transition-all bg-white text-zinc-900 border-zinc-200"
            >
              <div className="flex justify-between items-start gap-1">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-900">
                    {b.label}
                  </span>
                  <span className="text-[9.5px] text-zinc-400 block mt-0.5">
                    {b.dateRange}
                  </span>
                </div>
                <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                  {fmtPct(b.occupancyPct, 1)} Occ
                </span>
              </div>
              <div className="text-xl font-bold mt-2">{b.revenueFormatted}</div>
              <div className="text-[10px] mt-0.5 text-zinc-500">
                {b.roomNights.toLocaleString()} Room Nights OTB
              </div>

              {/* Explicit status breakdown badges */}
              <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-zinc-100 text-[8.5px]">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 text-white font-medium">
                  <span className="w-1 h-1 rounded-full bg-white inline-block shrink-0" />
                  Def: {fmtUsd(b.definiteRevenueUsd)}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-700 text-white font-medium">
                  <span className="w-1 h-1 rounded-full bg-zinc-200 inline-block shrink-0" />
                  Verbal: {fmtUsd(b.verbalDefiniteRevenueUsd)}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium border border-zinc-200">
                  <span className="w-1 h-1 rounded-full bg-zinc-400 inline-block shrink-0" />
                  Tent: {fmtUsd(b.tentativeRevenueUsd)}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-50 text-zinc-500 font-medium border border-zinc-200/80">
                  <span className="w-1 h-1 rounded-full bg-zinc-300 inline-block shrink-0" />
                  Prosp: {fmtUsd(b.prospectRevenueUsd)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property Categories Status Breakdown (5 Categories expandable to 10 Properties) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
            Property Categories Forward Status Breakdown ({selectedWindow})
          </h5>
          <span className="text-[9.5px] text-zinc-400">
            Click category row to expand individual properties
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[780px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-400 bg-zinc-50/90">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                  Property Categories
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 whitespace-nowrap">
                  Location
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Definite
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Verbal Definite
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Tentative
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Prospect
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Postponed
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Cancelled
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 whitespace-nowrap">
                  Turned Down
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryGroups.map((g) => {
                const isExpanded = !!expandedRows[g.id];
                return (
                  <Fragment key={g.id}>
                    <tr
                      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [g.id]: !prev[g.id],
                        }))
                      }
                    >
                      <td className="py-3 px-3 font-semibold text-zinc-900 border-b border-zinc-100 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          {isExpanded ? (
                            <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                          ) : (
                            <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                          )}
                          {g.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-500 border-b border-zinc-100 whitespace-nowrap">
                        {g.location}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.definiteUsd)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-zinc-800 border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.verbalDefiniteUsd)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.tentativeUsd)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-700 border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.prospectUsd)}
                      </td>
                      <td className="py-3 px-3 text-right text-zinc-600 border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.postponedUsd)}
                      </td>
                      <td className="py-3 px-3 text-right text-[#800020] font-medium border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.cancelledUsd)}
                      </td>
                      <td className="py-3 px-3 text-right text-zinc-600 border-b border-zinc-100 whitespace-nowrap">
                        {fmtUsd(g.turnedDownUsd)}
                      </td>
                    </tr>
                    {isExpanded &&
                      g.rows.map((r) => (
                        <tr key={r.prop.id} className="border-b border-zinc-100/60 bg-zinc-50/40 text-zinc-600">
                          <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 border-b border-zinc-100/60 whitespace-nowrap">
                            <span className="text-zinc-300 mr-1.5">└</span>
                            {r.prop.name}
                          </td>
                          <td className="py-2.5 px-3 text-[10px] text-zinc-400 border-b border-zinc-100/60 whitespace-nowrap">
                            {r.prop.city}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] font-semibold text-zinc-800 border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.definiteUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-zinc-700 border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.verbalDefiniteUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-zinc-600 border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.tentativeUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-zinc-600 border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.prospectUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-zinc-500 border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.postponedUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-[#800020] border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.cancelledUsd)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[10.5px] text-zinc-500 border-b border-zinc-100/60 whitespace-nowrap">
                            {fmtUsd(r.turnedDownUsd)}
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 bg-zinc-50/80">
                <td className="py-3 px-3 text-zinc-900">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">9 Properties · 5 Categories</td>
                <td className="py-3 px-3 text-right text-zinc-900">{data.definiteRevenue}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{data.verbalDefiniteRevenue}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{data.tentativeRevenue}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{data.prospectRevenue}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{data.postponedRevenue}</td>
                <td className="py-3 px-3 text-right text-[#800020]">{data.cancelledRevenue}</td>
                <td className="py-3 px-3 text-right text-zinc-900">{data.turnedDownRevenue}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
