import { useState } from 'react';
import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import {
  fmtInt,
  fmtSignedPct,
  getPortfolioMetrics,
  type PeriodId,
} from '@/data/portfolio';
import { getRevenueDemandMixData } from '../../../services/propertySimulation';

const Y_TICKS = [100, 75, 50, 25, 0];

export function ResortRevenueDemandMixWidget({
  period = 'mtd',
  propertyIds,
}: {
  period?: PeriodId;
  propertyIds?: string[];
}) {
  const { openDrawer } = useDashboardDrawer();
  const [mode, setMode] = useState<'revenue' | 'demand'>('revenue');

  const mixData = getRevenueDemandMixData(period, propertyIds);
  const m = getPortfolioMetrics(propertyIds, period);
  const isRevenue = mode === 'revenue';

  // Weighted total demand growth vs LY across the 4 pillars
  const totalDemandGrowthPct =
    mixData.totalDemandNum > 0
      ? mixData.items.reduce((acc, item) => {
          const itemGrowth = parseFloat(item.demandTrend.replace(/[^0-9.-]/g, '')) || 0;
          return acc + itemGrowth * (item.demandValue / mixData.totalDemandNum);
        }, 0)
      : 0;
  const totalTrendStr = isRevenue
    ? fmtSignedPct(m.vsLy.totalRevenuePct)
    : fmtSignedPct(totalDemandGrowthPct);
  const totalTrendUp = isRevenue ? m.vsLy.totalRevenuePct >= 0 : totalDemandGrowthPct >= 0;

  const handleOpenDetails = () => {
    openDrawer({
      type: 'REVENUE_DEMAND_MIX',
      title: 'Revenue & Demand Mix',
      data: { horizon: period, propertyIds },
    });
  };

  return (
    <div
      className="rounded-[12px] p-4 flex flex-col justify-between gap-3 bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter h-full"
      style={{ animationDelay: '0.4s' }}
      onClick={handleOpenDetails}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-0.5 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <InfoTooltip text="Hospitality revenue and operational demand breakdown across Rooms, F&B, Spa, and Activities.">
            <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900 truncate cursor-help">
              Revenue &amp; Demand Mix
            </span>
          </InfoTooltip>
        </div>

        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode('revenue')}
              className={`px-2 py-0.5 text-[9px] rounded-full transition-all duration-200 cursor-pointer ${
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
              className={`px-2 py-0.5 text-[9px] rounded-full transition-all duration-200 cursor-pointer ${
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
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Top Vertical Bar Chart with Y-Axis Legend & Gridlines */}
      <div className="w-full h-[132px] flex flex-col pt-2 px-0.5">
        <div className="relative flex-1 flex items-stretch gap-2">
          {/* Y-Axis Legend */}
          <div className="flex flex-col justify-between text-right pr-1 shrink-0 select-none">
            {Y_TICKS.map((tick) => (
              <span
                key={tick}
                className="text-[8.5px] font-medium text-zinc-400 leading-none tabular-nums"
              >
                {tick}%
              </span>
            ))}
          </div>

          {/* Plot Area: Gridlines + Bars */}
          <div className="relative flex-1 flex flex-col justify-end">
            {/* Horizontal Gridlines matching Y_TICKS */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {Y_TICKS.map((tick, idx) => (
                <div
                  key={tick}
                  className={`w-full border-b ${
                    idx === Y_TICKS.length - 1
                      ? 'border-zinc-300/90'
                      : 'border-dashed border-zinc-200/80'
                  }`}
                />
              ))}
            </div>

            {/* 4 Vertical Bars */}
            <div className="relative z-10 grid grid-cols-4 gap-3 items-end h-full px-2">
              {mixData.items.map((item) => {
                const pct = isRevenue ? item.revenuePct : item.demandPct;
                const valStr = isRevenue ? item.revenueFormatted : item.demandFormatted;
                const heightPct = Math.min(100, Math.max(4, pct));

                return (
                  <div key={item.id} className="flex flex-col items-center justify-end h-full">
                    <div
                      className="relative w-full max-w-[38px] rounded-t-[4px] transition-all duration-300"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: item.color,
                      }}
                    >
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] font-bold text-zinc-900 tabular-nums whitespace-nowrap leading-none">
                        {valStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels aligned with the 4 bars */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="w-[26px] shrink-0" />
          <div className="flex-1 grid grid-cols-4 gap-3 px-2">
            {mixData.items.map((item) => (
              <span
                key={item.id}
                className="text-[9.5px] font-medium text-zinc-700 truncate text-center"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Table — dynamically switches between Revenue Lens and Demand Lens */}
      <div className="mt-auto pt-1">
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
              <th className="text-left pb-2 pt-1 pr-1.5 w-[26%] truncate font-medium">Pillar</th>
              <th className="text-right pb-2 pt-1 px-1.5 w-[18%] truncate font-medium">% Share</th>
              <th className="text-right pb-2 pt-1 px-1.5 w-[32%] truncate font-medium">
                {isRevenue ? 'Revenue (USD)' : 'Demand Volume'}
              </th>
              <th className="text-right pb-2 pt-1 pl-1.5 w-[24%] truncate font-medium">vs LY</th>
            </tr>
          </thead>
          <tbody>
            {mixData.items.map((item) => {
              const shareStr = isRevenue ? item.revenuePctFormatted : item.demandPctFormatted;
              const primaryVal = isRevenue ? item.revenueFormatted : item.demandFormattedFull;
              const trendStr = isRevenue ? item.revenueTrend : item.demandTrend;
              const trendUp = isRevenue ? item.revenueTrendUp : item.demandTrendUp;

              return (
                <tr key={item.id} className="text-[10px] border-b border-zinc-100 text-zinc-700">
                  <td className="py-2 pr-1.5 truncate">{item.name}</td>
                  <td className="text-right py-2 px-1.5 truncate text-zinc-900 font-medium tabular-nums">
                    {shareStr}
                  </td>
                  <td className="text-right py-2 px-1.5 truncate text-zinc-900 font-medium tabular-nums">
                    {primaryVal}
                  </td>
                  <td
                    className={`text-right py-2 pl-1.5 truncate font-medium tabular-nums ${
                      trendUp ? 'text-[#14532d]' : 'text-[#800020]'
                    }`}
                  >
                    {trendUp ? '↑ ' : '↓ '}
                    {trendStr}
                  </td>
                </tr>
              );
            })}
            <tr className="text-[10px] font-bold text-zinc-900 border-b-0 pt-2">
              <td className="py-2 pr-1.5 truncate">Total</td>
              <td className="text-right py-2 px-1.5 truncate text-zinc-900 font-bold tabular-nums">
                100%
              </td>
              <td className="text-right py-2 px-1.5 truncate text-zinc-900 font-bold tabular-nums">
                {isRevenue ? mixData.totalRevenueFormatted : `${fmtInt(mixData.totalDemandNum)} Units`}
              </td>
              <td
                className={`text-right py-2 pl-1.5 truncate font-bold tabular-nums ${
                  totalTrendUp ? 'text-[#14532d]' : 'text-[#800020]'
                }`}
              >
                {totalTrendUp ? '↑ ' : '↓ '}
                {totalTrendStr}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
