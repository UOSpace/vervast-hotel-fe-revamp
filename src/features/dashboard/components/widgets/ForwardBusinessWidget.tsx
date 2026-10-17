import { useState } from 'react';
import { RoundAltArrowRight } from '@solar-icons/react';
import { fmtUsd } from '@/data/portfolio';
import {
  simulatedForwardBusinessData,
  type ForwardBusinessWindow,
} from '../../services/propertySimulation';

interface ForwardBusinessWidgetProps {
  onOpenDetails?: () => void;
}

export function ForwardBusinessWidget({ onOpenDetails }: ForwardBusinessWidgetProps) {
  const [windowPeriod, setWindowPeriod] = useState<ForwardBusinessWindow>('90D');
  const currentData = simulatedForwardBusinessData[windowPeriod];

  const activeStatuses = [
    {
      label: 'Definite',
      revenue: currentData.definiteRevenue,
      rn: currentData.definiteRoomNights,
      trend: currentData.definiteTrend,
      dotClass: 'bg-zinc-900',
    },
    {
      label: 'Verbal Definite',
      revenue: currentData.verbalDefiniteRevenue,
      rn: currentData.verbalDefiniteRoomNights,
      trend: currentData.verbalDefiniteTrend,
      dotClass: 'bg-zinc-600',
    },
    {
      label: 'Tentative',
      revenue: currentData.tentativeRevenue,
      rn: currentData.tentativeRoomNights,
      trend: currentData.tentativeTrend,
      dotClass: 'bg-zinc-400',
    },
    {
      label: 'Prospect',
      revenue: currentData.prospectRevenue,
      rn: currentData.prospectRoomNights,
      trend: currentData.prospectTrend,
      dotClass: 'bg-zinc-200 border border-zinc-400',
    },
  ];

  const falloutStatuses = [
    {
      label: 'Postponed',
      revenue: currentData.postponedRevenue,
      rn: currentData.postponedRoomNights,
      toneClass: 'text-zinc-700',
    },
    {
      label: 'Cancelled',
      revenue: currentData.cancelledRevenue,
      rn: currentData.cancelledRoomNights,
      toneClass: 'text-[#800020]',
    },
    {
      label: 'Turned Down',
      revenue: currentData.turnedDownRevenue,
      rn: currentData.turnedDownRoomNights,
      toneClass: 'text-zinc-600',
    },
  ];

  return (
    <div
      className="flex flex-col h-full justify-between"
      onClick={() => onOpenDetails && onOpenDetails()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            FORWARD BUSINESS
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {currentData.timeframe}
          </p>
        </div>

        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Timeframe selector: 30D | 90D | 180D | 365D */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs">
            {(['30D', '90D', '180D', '365D'] as ForwardBusinessWindow[]).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setWindowPeriod(period)}
                className={`px-2 py-0.5 text-[9px] rounded-full transition-all duration-200 cursor-pointer ${
                  windowPeriod === period
                    ? 'bg-zinc-900 text-white font-medium shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 font-normal'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails && onOpenDetails()}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            See details <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Main Body: Left 7 Forward Business Statuses + Right Stacked Cadence Bars */}
      <div className="flex items-stretch gap-3.5 flex-1">
        {/* Left Side: Active Commitment Statuses (4) + Fallout/Deferred Statuses (3) */}
        <div className="w-[53%] flex flex-col justify-between py-0.5">
          <div className="space-y-1.5">
            {activeStatuses.map((st) => (
              <div key={st.label} className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${st.dotClass}`} />
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium text-zinc-700 leading-tight truncate">
                      {st.label}
                    </div>
                    <div className="text-[8.5px] text-zinc-400 leading-none mt-0.5">
                      {st.rn}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] font-bold text-zinc-900 leading-tight">
                    {st.revenue}
                  </div>
                  <div className="text-[8.5px] font-medium text-[#14532d] leading-none mt-0.5">
                    ↑ {st.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Strip: Postponed, Cancelled, Turned Down */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 mt-1.5 border-t border-zinc-100">
            {falloutStatuses.map((f) => (
              <div key={f.label} className="bg-zinc-50/80 rounded-md px-1.5 py-1 border border-zinc-100">
                <div className="text-[8px] text-zinc-400 font-medium truncate">
                  {f.label}
                </div>
                <div className={`text-[10px] font-bold leading-tight mt-0.5 ${f.toneClass}`}>
                  {f.revenue}
                </div>
                <div className="text-[7.5px] text-zinc-400 leading-none mt-0.5">
                  {f.rn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Stacked Vertical Bars (W1-W4 / M1-M3 / M1-2..M5-6 / Q1-Q4) */}
        <div className="w-[47%] flex flex-col justify-between h-full pt-0.5">
          {/* Executive Legend: Definite, Verbal Def., Tentative, Prospect */}
          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 text-[8px] font-medium mb-1.5 pr-0.5">
            <span className="flex items-center gap-1 text-zinc-900 font-semibold" title="Definite (Signed & Guaranteed)">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 inline-block" />
              Definite
            </span>
            <span className="flex items-center gap-1 text-zinc-700" title="Verbal Definite (Verbally Confirmed)">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" />
              Verbal Def.
            </span>
            <span className="flex items-center gap-1 text-zinc-500" title="Tentative (Space Hold)">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
              Tentative
            </span>
            <span className="flex items-center gap-1 text-zinc-400" title="Prospect (Active Inquiries)">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 border border-zinc-300 inline-block" />
              Prospect
            </span>
          </div>

          {/* Stacked Bars for Buckets */}
          <div className="flex items-end justify-between gap-2 h-[116px] pb-0.5 px-0.5">
            {currentData.buckets.map((bucket) => {
              const totalCombinedUsd =
                bucket.definiteRevenueUsd +
                bucket.verbalDefiniteRevenueUsd +
                bucket.tentativeRevenueUsd +
                bucket.prospectRevenueUsd;
              const maxCombined = Math.max(
                ...currentData.buckets.map(
                  (b) =>
                    b.definiteRevenueUsd +
                    b.verbalDefiniteRevenueUsd +
                    b.tentativeRevenueUsd +
                    b.prospectRevenueUsd
                ),
                1
              );
              const barMaxHeightPx = 68;
              const totalHeightPx = Math.max(16, Math.round((totalCombinedUsd / maxCombined) * barMaxHeightPx));
              const definiteHeightPx = Math.round((bucket.definiteRevenueUsd / totalCombinedUsd) * totalHeightPx);
              const verbalHeightPx = Math.round((bucket.verbalDefiniteRevenueUsd / totalCombinedUsd) * totalHeightPx);
              const tentativeHeightPx = Math.round((bucket.tentativeRevenueUsd / totalCombinedUsd) * totalHeightPx);
              const prospectHeightPx = Math.max(
                0,
                totalHeightPx - definiteHeightPx - verbalHeightPx - tentativeHeightPx
              );
              const definitePct =
                bucket.revenueUsd > 0 ? Math.round((bucket.definiteRevenueUsd / bucket.revenueUsd) * 100) : 0;

              return (
                <div
                  key={bucket.label}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Floating Micro-Tooltip on Hover with Detailed Status Breakdown */}
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-30 whitespace-nowrap border border-zinc-800">
                    <div className="font-semibold text-zinc-100 flex items-center justify-between gap-3 border-b border-zinc-800 pb-1 mb-1">
                      <span>{bucket.label} ({bucket.dateRange})</span>
                      <span className="text-zinc-300 font-bold">{fmtUsd(totalCombinedUsd)}</span>
                    </div>
                    <div className="space-y-0.5 text-[7.5px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-100 inline-block" />
                          Definite:
                        </span>
                        <span className="font-semibold text-white">{fmtUsd(bucket.definiteRevenueUsd)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                          Verbal Definite:
                        </span>
                        <span className="font-semibold text-zinc-100">{fmtUsd(bucket.verbalDefiniteRevenueUsd)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 inline-block" />
                          Tentative:
                        </span>
                        <span className="font-semibold text-zinc-200">{fmtUsd(bucket.tentativeRevenueUsd)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" />
                          Prospect:
                        </span>
                        <span className="font-semibold text-zinc-300">{fmtUsd(bucket.prospectRevenueUsd)}</span>
                      </div>
                    </div>
                  </div>

                  {/* The 4-Layer Stacked Bar: Definite (bottom), Verbal Definite, Tentative, Prospect (top) */}
                  <div
                    className="w-full max-w-[26px] rounded-t-[4px] flex flex-col justify-end overflow-hidden transition-all duration-200 group-hover:scale-105"
                    style={{ height: `${totalHeightPx}px` }}
                  >
                    {/* Top Layer: Prospect (Light Zinc) */}
                    <div
                      className="w-full bg-zinc-200 transition-colors group-hover:bg-zinc-300 border-t border-x border-zinc-300/40 rounded-t-[4px]"
                      style={{ height: `${prospectHeightPx}px` }}
                    />
                    {/* Third Layer: Tentative (Medium Gray) */}
                    <div
                      className="w-full bg-zinc-400 transition-colors group-hover:bg-zinc-500 border-t border-zinc-500/30"
                      style={{ height: `${tentativeHeightPx}px` }}
                    />
                    {/* Second Layer: Verbal Definite (Dark Slate Gray) */}
                    <div
                      className="w-full bg-zinc-600 transition-colors group-hover:bg-zinc-700 border-t border-zinc-700/30"
                      style={{ height: `${verbalHeightPx}px` }}
                    />
                    {/* Bottom Layer: Definite (Solid Black / Zinc-900) */}
                    <div
                      className="w-full bg-zinc-900 transition-colors group-hover:bg-black"
                      style={{ height: `${definiteHeightPx}px` }}
                    />
                  </div>

                  {/* Bucket Period Label (W1..W4 / M1..M3 / Q1..Q4) */}
                  <div className="text-[9px] text-zinc-500 font-semibold mt-1.5 whitespace-nowrap text-center">
                    {bucket.label}
                  </div>

                  {/* Bucket Total OTB Revenue */}
                  <div
                    className={`text-[9.5px] leading-tight text-center ${
                      bucket.highlight
                        ? 'font-bold text-zinc-900'
                        : 'font-semibold text-zinc-700'
                    }`}
                  >
                    {bucket.revenueFormatted}
                  </div>

                  {/* Clean % Definite Badge */}
                  <div className="mt-0.5">
                    <span className="inline-block px-1.5 py-0.2 rounded-full bg-zinc-100 text-zinc-500 text-[7.5px] font-medium leading-tight">
                      {definitePct}% Def
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

