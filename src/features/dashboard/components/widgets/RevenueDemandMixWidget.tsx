import { useState } from 'react';
import {
  simulatedRevenueDemandMixData,
  type MixItem,
} from '../../services/propertySimulation';

interface RevenueDemandMixWidgetProps {
  onOpenDetails?: () => void;
  onSelectPillar?: (item: MixItem) => void;
}

export function RevenueDemandMixWidget({
  onOpenDetails,
  onSelectPillar,
}: RevenueDemandMixWidgetProps) {
  const [mode, setMode] = useState<'revenue' | 'demand'>('revenue');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const data = simulatedRevenueDemandMixData;
  const isRevenue = mode === 'revenue';

  // SVG Donut geometry
  const radius = 42;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~263.89

  // Calculate cumulative offsets for SVG circle segments
  let cumulativePct = 0;
  const segments = data.items.map((item) => {
    const pct = isRevenue ? item.revenuePct : item.demandPct;
    const strokeDash = (pct / 100) * circumference;
    const strokeOffset = (cumulativePct / 100) * circumference;
    cumulativePct += pct;

    return {
      ...item,
      pct,
      strokeDash,
      strokeOffset,
    };
  });

  return (
    <div
      className="flex flex-col h-full justify-between"
      onClick={() => onOpenDetails && onOpenDetails()}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            REVENUE &amp; DEMAND MIX
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {data.timeframe}
          </p>
        </div>

        {/* Toggle Mode: Revenue | Demand */}
        <div
          className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setMode('revenue')}
            className={`px-2.5 py-0.5 text-[9.5px] rounded-full transition-all duration-200 cursor-pointer ${
              isRevenue
                ? 'bg-zinc-900 text-white font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 font-normal'
            }`}
          >
            Revenue
          </button>
          <button
            type="button"
            onClick={() => setMode('demand')}
            className={`px-2.5 py-0.5 text-[9.5px] rounded-full transition-all duration-200 cursor-pointer ${
              !isRevenue
                ? 'bg-zinc-900 text-white font-medium shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 font-normal'
            }`}
          >
            Demand
          </button>
        </div>
      </div>

      {/* Main Content Area: Donut (Left) + Breakdown List (Right) */}
      <div className="flex items-center gap-4 flex-1">
        {/* Left: Pure SVG Vector Donut Chart (Original Rounded Styling) */}
        <div className="relative w-[116px] h-[116px] shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 110 110"
            className="w-full h-full transform -rotate-90 drop-shadow-xs"
          >
            {/* Background ring */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#f4f4f5"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Slices (Black-to-Gray Palette) */}
            {segments.map((slice) => {
              const isHovered = hoveredId === slice.id;
              const isFaded = hoveredId !== null && !isHovered;

              return (
                <circle
                  key={slice.id}
                  cx="55"
                  cy="55"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 2.5 : strokeWidth}
                  strokeDasharray={`${Math.max(0, slice.strokeDash - 1.5)} ${
                    circumference - Math.max(0, slice.strokeDash - 1.5)
                  }`}
                  strokeDashoffset={-slice.strokeOffset}
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    opacity: isFaded ? 0.35 : 1,
                    transformOrigin: '55px 55px',
                  }}
                  onMouseEnter={() => setHoveredId(slice.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
            <span className="text-[16px] font-bold text-zinc-900 leading-tight tracking-tight">
              {isRevenue ? data.totalRevenueFormatted : data.totalDemandFormatted}
            </span>
            <span className="text-[8.5px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5">
              {isRevenue ? 'Total Revenue' : 'Total Demand'}
            </span>
          </div>
        </div>

        {/* Right: Breakdown Table / Rows */}
        <div className="flex-1 flex flex-col justify-between py-0.5 space-y-0.5 min-w-0">
          {data.items.map((item) => {
            const isHovered = hoveredId === item.id;
            const isFaded = hoveredId !== null && !isHovered;

            const mixPct = isRevenue ? item.revenuePctFormatted : item.demandPctFormatted;
            const valueStr = isRevenue ? item.revenueFormatted : item.demandFormatted;
            const trendStr = isRevenue ? item.revenueTrend : item.demandTrend;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  if (onSelectPillar) {
                    e.stopPropagation();
                    onSelectPillar(item);
                  }
                }}
                className={`flex items-center justify-between py-1 px-1.5 rounded transition-colors duration-150 cursor-pointer ${
                  isHovered ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                }`}
                style={{ opacity: isFaded ? 0.35 : 1 }}
              >
                {/* Dot & Name */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                  <span className="text-[10px] font-medium text-zinc-800 truncate">
                    {item.name}
                  </span>
                </div>

                {/* Values: Mix %, Nominal/Volume, YoY Trend (Strict Tabular Alignment) */}
                <div className="flex items-center gap-2 shrink-0 tabular-nums">
                  <span className="text-[9.5px] font-medium text-zinc-400 w-7 text-right">
                    {mixPct}
                  </span>
                  <span className="text-[9.5px] font-bold text-zinc-900 w-[80px] text-right whitespace-nowrap">
                    {valueStr}
                  </span>
                  <span className="text-[9.5px] font-medium text-[#14532d] w-11 text-right flex items-center justify-end gap-0.5 whitespace-nowrap">
                    <span className="text-[8px] font-bold">↑</span>
                    {trendStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
