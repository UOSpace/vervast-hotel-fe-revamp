import { useState } from 'react';
import { RoundAltArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import {
  getPropertyMetrics,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import { fmtTrendArrow } from '@/data/portfolio/hospitalitySubMix';
import { getRevenueDemandMixData } from '../../../services/propertySimulation';

export function RevenueByDepartmentWidget({ 
  propertyId: rawPropertyId = 'sosei-geneva',
  propertyName,
  period = 'mtd',
}: { 
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();
  const [mode, setMode] = useState<'revenue' | 'demand'>('revenue');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const m = getPropertyMetrics(propertyId, period);
  const data = getRevenueDemandMixData(period, [propertyId]);
  const isRevenue = mode === 'revenue';
  const activePropName = propertyName || m.name;

  // SVG Donut geometry matching RevenueDemandMixWidget
  const radius = 42;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

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

  // Keep drawer payload compatible with DEPARTMENT_REVENUE drawer
  const roomRev = m.roomRevenue;
  const fnbRev = m.fnbRevenue;
  const spaRev = m.spaRevenue;
  const otherRev = m.experienceRevenue;
  const totalRev = m.totalRevenue;

  const drawerData = [
    { dept: 'Rooms', today: fmtUsdFull(roomRev), rawVal: roomRev, trend: fmtTrendArrow(m.vsLy.roomRevenuePct), up: m.vsLy.roomRevenuePct >= 0 },
    { dept: 'F&B', today: fmtUsdFull(fnbRev), rawVal: fnbRev, trend: fmtTrendArrow(m.vsLy.fnbRevenuePct), up: m.vsLy.fnbRevenuePct >= 0 },
    { dept: 'Spa & Wellness', today: fmtUsdFull(spaRev), rawVal: spaRev, trend: fmtTrendArrow(m.vsLy.spaRevenuePct), up: m.vsLy.spaRevenuePct >= 0 },
    { dept: 'Activities & Experiences', today: fmtUsdFull(otherRev), rawVal: otherRev, trend: fmtTrendArrow(m.vsLy.experienceRevenuePct), up: m.vsLy.experienceRevenuePct >= 0 },
  ];
  const drawerTotals = {
    today: fmtUsdFull(totalRev),
    trend: fmtTrendArrow(m.vsLy.totalRevenuePct),
    up: m.vsLy.totalRevenuePct >= 0,
  };

  const handleOpenDetails = () => {
    openDrawer({
      type: 'DEPARTMENT_REVENUE',
      title: `Revenue & Demand Mix — ${activePropName}`,
      data: {
        propertyId,
        propertyName: activePropName,
        period,
        roomRev,
        fnbRev,
        spaRev,
        otherRev,
        totalRev,
        data: drawerData,
        totals: drawerTotals,
      },
    });
  };

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col justify-between bg-zinc-50/50 transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full" 
      style={{ animationDelay: '0.25s' }}
      onClick={handleOpenDetails}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            REVENUE &amp; DEMAND MIX
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {data.timeframe}
          </p>
        </div>

        <div
          className="flex items-center gap-2.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Toggle Mode: Revenue | Demand */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs">
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

          <button
            type="button"
            onClick={handleOpenDetails}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            See details <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Main Content Area: Donut (Left) + Breakdown List (Right) */}
      <div className="flex items-center gap-4 flex-1">
        {/* Left: Pure SVG Vector Donut Chart */}
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
                  className="transition-all duration-500 cursor-pointer"
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

                {/* Values: Mix %, Nominal/Volume, YoY Trend */}
                <div className="flex items-center gap-2 shrink-0 tabular-nums">
                  <span className="text-[9.5px] font-medium text-zinc-400 w-9 text-right">
                    {mixPct}
                  </span>
                  <span className="text-[9.5px] font-bold text-zinc-900 w-[56px] text-right whitespace-nowrap">
                    {valueStr}
                  </span>
                  <span className="text-[9.5px] font-medium text-[#14532d] min-w-[68px] text-right flex items-center justify-end gap-0.5 whitespace-nowrap">
                    <span className="text-[8px] font-bold">↑</span>
                    {trendStr} vs LY
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

