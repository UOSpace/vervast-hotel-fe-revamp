import { useState } from 'react';
import {
  Calendar,
  Bed,
  PieChart2,
  TagPrice,
  DangerTriangle,
} from '@solar-icons/react';
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

  return (
    <div
      className="flex flex-col h-full justify-between"
      onClick={() => onOpenDetails && onOpenDetails()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            FORWARD BUSINESS
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {currentData.timeframe}
          </p>
        </div>

        {/* Timeframe selector: 30D | 90D | 180D | 365D */}
        <div
          className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs"
          onClick={(e) => e.stopPropagation()}
        >
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
      </div>

      {/* Main Body: Left 5 Symmetrical Metrics + Right Proportional Stacked Bars */}
      <div className="flex items-center gap-4 flex-1">
        {/* Left Side: 5 Evenly-Spaced Symmetrical Metrics */}
        <div className="w-[52%] flex flex-col justify-between py-1 space-y-2.5">
          {/* 1. Revenue OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-md bg-zinc-100/80 text-zinc-500 flex items-center justify-center shrink-0">
                <Calendar size={13} />
              </span>
              <div>
                <div className="text-[12px] font-bold text-zinc-900 leading-none">
                  {currentData.revenueOtb}
                </div>
                <div className="text-[9px] text-zinc-400 leading-none mt-1">
                  Revenue OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-[#14532d] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.revenueTrend}
            </span>
          </div>

          {/* 2. Room Nights OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-md bg-zinc-100/80 text-zinc-500 flex items-center justify-center shrink-0">
                <Bed size={13} />
              </span>
              <div>
                <div className="text-[12px] font-bold text-zinc-900 leading-none">
                  {currentData.roomNightsOtb}
                </div>
                <div className="text-[9px] text-zinc-400 leading-none mt-1">
                  Room Nights OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-[#14532d] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.roomNightsTrend}
            </span>
          </div>

          {/* 3. Occupancy OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-md bg-zinc-100/80 text-zinc-500 flex items-center justify-center shrink-0">
                <PieChart2 size={13} />
              </span>
              <div>
                <div className="text-[12px] font-bold text-zinc-900 leading-none">
                  {currentData.occupancyOtb}
                </div>
                <div className="text-[9px] text-zinc-400 leading-none mt-1">
                  Occupancy OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-[#14532d]">
              {currentData.occupancyTrend}
            </span>
          </div>

          {/* 4. ADR OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-md bg-zinc-100/80 text-zinc-500 flex items-center justify-center shrink-0">
                <TagPrice size={13} />
              </span>
              <div>
                <div className="text-[12px] font-bold text-zinc-900 leading-none">
                  {currentData.adrOtb}
                </div>
                <div className="text-[9px] text-zinc-400 leading-none mt-1">
                  ADR OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-[#14532d] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.adrTrend}
            </span>
          </div>

          {/* 5. Cancellation Exposure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-5 h-5 rounded-md bg-zinc-100/80 text-zinc-500 flex items-center justify-center shrink-0">
                <DangerTriangle size={13} />
              </span>
              <div>
                <div className="text-[12px] font-bold text-zinc-900 leading-none">
                  {currentData.cancellationExposure}
                </div>
                <div className="text-[9px] text-zinc-400 leading-none mt-1">
                  Cancellation Exposure
                </div>
              </div>
            </div>
            <span className="text-[9px] font-semibold text-[#800020] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.cancellationTrend}
            </span>
          </div>
        </div>

        {/* Right Side: Refined Stacked Vertical Bars */}
        <div className="w-[48%] flex flex-col justify-between h-full pt-0.5">
          {/* Executive Legend: Definite, Tentative, Pipeline */}
          <div className="flex items-center justify-end gap-2.5 text-[8.5px] font-medium mb-2 pr-1">
            <span className="flex items-center gap-1.5 text-zinc-900 font-semibold" title="Definite (Signed & Guaranteed OTB)">
              <span className="w-2 h-2 rounded-full bg-zinc-900 inline-block" />
              Definite
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600" title="Tentative (Space Hold / Under Review)">
              <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block" />
              Tentative
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400" title="Pipeline (Active Inquiries & Leads)">
              <span className="w-2 h-2 rounded-full bg-zinc-200 border border-zinc-300 inline-block" />
              Pipeline
            </span>
          </div>

          {/* Stacked Bars for 3 Buckets */}
          <div className="flex items-end justify-between gap-3 h-[112px] pb-0.5 px-1">
            {currentData.buckets.map((bucket) => {
              const totalCombinedUsd = bucket.definiteRevenueUsd + bucket.tentativeRevenueUsd + bucket.pipelineRevenueUsd;
              const maxCombined = Math.max(
                ...currentData.buckets.map(
                  (b) => b.definiteRevenueUsd + b.tentativeRevenueUsd + b.pipelineRevenueUsd
                ),
                20
              );
              const barMaxHeightPx = 68;
              const totalHeightPx = Math.round((totalCombinedUsd / maxCombined) * barMaxHeightPx);
              const definiteHeightPx = Math.round((bucket.definiteRevenueUsd / totalCombinedUsd) * totalHeightPx);
              const tentativeHeightPx = Math.round((bucket.tentativeRevenueUsd / totalCombinedUsd) * totalHeightPx);
              const pipelineHeightPx = Math.max(0, totalHeightPx - definiteHeightPx - tentativeHeightPx);
              const definitePct = Math.round((bucket.definiteRevenueUsd / bucket.revenueUsd) * 100);

              return (
                <div
                  key={bucket.label}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                >
                  {/* Floating Micro-Tooltip on Hover with Detailed Status Breakdown */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] py-1.5 px-2.5 rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 z-30 whitespace-nowrap border border-zinc-800">
                    <div className="font-semibold text-zinc-100 flex items-center justify-between gap-3 border-b border-zinc-800 pb-1 mb-1">
                      <span>{bucket.label} Horizon</span>
                      <span className="text-zinc-300 font-bold">${totalCombinedUsd.toFixed(1)}M Total</span>
                    </div>
                    <div className="space-y-0.5 text-[7.5px]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-100 inline-block" />
                          Definite OTB:
                        </span>
                        <span className="font-semibold text-white">${bucket.definiteRevenueUsd.toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                          Tentative:
                        </span>
                        <span className="font-semibold text-zinc-200">${bucket.tentativeRevenueUsd.toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" />
                          Pipeline Leads:
                        </span>
                        <span className="font-semibold text-zinc-300">${bucket.pipelineRevenueUsd.toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>

                  {/* The 3-Layer Stacked Bar: Definite (bottom), Tentative (middle), Pipeline (top) */}
                  <div
                    className="w-full max-w-[28px] rounded-t-[4px] flex flex-col justify-end overflow-hidden transition-all duration-200 group-hover:scale-105"
                    style={{ height: `${totalHeightPx}px` }}
                  >
                    {/* Top Layer: Pipeline Leads (Light Zinc) */}
                    <div
                      className="w-full bg-zinc-200 transition-colors group-hover:bg-zinc-300 border-t border-x border-zinc-300/40 rounded-t-[4px]"
                      style={{ height: `${pipelineHeightPx}px` }}
                    />
                    {/* Middle Layer: Tentative (Medium Slate Gray) */}
                    <div
                      className="w-full bg-zinc-400 transition-colors group-hover:bg-zinc-500 border-t border-zinc-500/30"
                      style={{ height: `${tentativeHeightPx}px` }}
                    />
                    {/* Bottom Layer: Definite OTB (Solid Black / Zinc-900) */}
                    <div
                      className="w-full bg-zinc-900 transition-colors group-hover:bg-black"
                      style={{ height: `${definiteHeightPx}px` }}
                    />
                  </div>

                  {/* Bucket Period Label */}
                  <div className="text-[9px] text-zinc-400 font-medium mt-1.5 whitespace-nowrap text-center">
                    {bucket.label}
                  </div>

                  {/* Bucket Total OTB Revenue */}
                  <div
                    className={`text-[10px] leading-tight text-center ${
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

