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

  // Maximum value for proportional bar scaling
  const maxRevenue = Math.max(...currentData.buckets.map((b) => b.revenueUsd), 16);

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

      {/* Main Body: Left Metrics (5 items) + Right Stacked Bars (3 buckets) */}
      <div className="flex items-center gap-4 flex-1">
        {/* Left Side: 5 Metrics */}
        <div className="w-[58%] flex flex-col justify-between py-0.5 space-y-1.5">
          {/* 1. Revenue OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4 h-4 text-zinc-400 flex items-center justify-center shrink-0">
                <Calendar size={13} />
              </span>
              <div>
                <div className="text-[11.5px] font-bold text-zinc-900 leading-none">
                  {currentData.revenueOtb}
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-none mt-0.5">
                  Revenue OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-medium text-[#14532d] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.revenueTrend}
            </span>
          </div>

          {/* 2. Room Nights OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4 h-4 text-zinc-400 flex items-center justify-center shrink-0">
                <Bed size={13} />
              </span>
              <div>
                <div className="text-[11.5px] font-bold text-zinc-900 leading-none">
                  {currentData.roomNightsOtb}
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-none mt-0.5">
                  Room Nights OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-medium text-[#14532d] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.roomNightsTrend}
            </span>
          </div>

          {/* 3. Occupancy OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4 h-4 text-zinc-400 flex items-center justify-center shrink-0">
                <PieChart2 size={13} />
              </span>
              <div>
                <div className="text-[11.5px] font-bold text-zinc-900 leading-none">
                  {currentData.occupancyOtb}
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-none mt-0.5">
                  Occupancy OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-medium text-[#14532d]">
              {currentData.occupancyTrend}
            </span>
          </div>

          {/* 4. ADR OTB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4 h-4 text-zinc-400 flex items-center justify-center shrink-0">
                <TagPrice size={13} />
              </span>
              <div>
                <div className="text-[11.5px] font-bold text-zinc-900 leading-none">
                  {currentData.adrOtb}
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-none mt-0.5">
                  ADR OTB
                </div>
              </div>
            </div>
            <span className="text-[9px] font-medium text-[#14532d] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.adrTrend}
            </span>
          </div>

          {/* 5. Cancellation Exposure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-4 h-4 text-zinc-400 flex items-center justify-center shrink-0">
                <DangerTriangle size={13} />
              </span>
              <div>
                <div className="text-[11.5px] font-bold text-zinc-900 leading-none">
                  {currentData.cancellationExposure}
                </div>
                <div className="text-[8.5px] text-zinc-400 leading-none mt-0.5">
                  Cancellation Exposure
                </div>
              </div>
            </div>
            <span className="text-[9px] font-medium text-[#800020] flex items-center gap-0.5">
              <span className="text-[8px] font-bold">↑</span>
              {currentData.cancellationTrend}
            </span>
          </div>
        </div>

        {/* Right Side: Stacked Vertical Bars */}
        <div className="w-[42%] flex items-end justify-between gap-2.5 h-[118px] pb-1 px-1">
          {currentData.buckets.map((bucket) => {
            // Proportional height up to 86px
            const barMaxHeightPx = 82;
            const totalHeightPx = Math.round((bucket.revenueUsd / maxRevenue) * barMaxHeightPx);
            const committedHeightPx = Math.round(
              (bucket.committedRevenueUsd / bucket.revenueUsd) * totalHeightPx
            );
            const tentativeHeightPx = totalHeightPx - committedHeightPx;

            return (
              <div
                key={bucket.label}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                {/* The Stacked Bar (Monochrome) */}
                <div
                  className="w-full max-w-[32px] rounded-t flex flex-col justify-end overflow-hidden transition-all duration-200 group-hover:scale-[1.03]"
                  style={{ height: `${totalHeightPx}px` }}
                >
                  {/* Top: Tentative (Light Zinc) */}
                  <div
                    className="w-full bg-zinc-200 transition-colors group-hover:bg-zinc-300"
                    style={{ height: `${tentativeHeightPx}px` }}
                  />
                  {/* Bottom: Committed (Black / Zinc-900) */}
                  <div
                    className="w-full bg-zinc-900 transition-colors group-hover:bg-black"
                    style={{ height: `${committedHeightPx}px` }}
                  />
                </div>

                {/* Bucket Period Label */}
                <div className="text-[9px] text-zinc-500 font-medium mt-1.5 whitespace-nowrap text-center">
                  {bucket.label}
                </div>

                {/* Bucket Revenue Value */}
                <div
                  className={`text-[9.5px] leading-tight text-center ${
                    bucket.highlight
                      ? 'font-bold text-zinc-900'
                      : 'font-semibold text-zinc-600'
                  }`}
                >
                  {bucket.revenueFormatted}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
