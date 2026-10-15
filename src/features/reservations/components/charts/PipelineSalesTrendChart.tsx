import { useState, useMemo } from 'react';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import { type LeadRecord } from '../../data/leads';
import { type BookingRecord } from '../../data/bookings';
import { parseMoney } from '../../utils/reservationEvents';

interface TrendColumnData {
  key: string;
  label: string;
  tooltipTitle: string;
  leadValue: number;
  bookingValue: number;
  leadCount: number;
  bookingCount: number;
}

const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const YEAR_LABELS = ['2023', '2024', '2025', '2026', '2027', '2028'];

export function PipelineSalesTrendChart({
  leads,
  bookings,
}: {
  leads: LeadRecord[];
  bookings: BookingRecord[];
  hotel: string;
}) {
  const [periodMode, setPeriodMode] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Compute dataset dynamically based on periodMode
  const chartData = useMemo<TrendColumnData[]>(() => {
    if (periodMode === 'Monthly') {
      return MONTH_LABELS.map((mLabel, mIdx) => {
        const matchingLeads = leads.filter((l) => {
          const d = new Date(l.arrivalDate || l.expectedClose);
          return !isNaN(d.getTime()) && d.getMonth() === mIdx;
        });
        const matchingBookings = bookings.filter((b) => {
          const d = new Date(b.arrivalDate);
          return !isNaN(d.getTime()) && d.getMonth() === mIdx && b.bookingStatus !== 'Cancelled';
        });

        const leadValue = matchingLeads.reduce((s, l) => s + parseMoney(l.totalValue), 0);
        const bookingValue = matchingBookings.reduce((s, b) => s + parseMoney(b.revenue), 0);

        return {
          key: mLabel,
          label: mLabel,
          tooltipTitle: `${mLabel} 2026 / 2027`,
          leadValue,
          bookingValue,
          leadCount: matchingLeads.length,
          bookingCount: matchingBookings.length,
        };
      });
    }

    if (periodMode === 'Yearly') {
      return YEAR_LABELS.map((yLabel) => {
        const yearNum = parseInt(yLabel, 10);
        const matchingLeads = leads.filter((l) => {
          const d = new Date(l.arrivalDate || l.expectedClose);
          return !isNaN(d.getTime()) && d.getFullYear() === yearNum;
        });
        const matchingBookings = bookings.filter((b) => {
          const d = new Date(b.arrivalDate);
          return !isNaN(d.getTime()) && d.getFullYear() === yearNum && b.bookingStatus !== 'Cancelled';
        });

        const leadValue = matchingLeads.reduce((s, l) => s + parseMoney(l.totalValue), 0);
        const bookingValue = matchingBookings.reduce((s, b) => s + parseMoney(b.revenue), 0);

        return {
          key: yLabel,
          label: yLabel,
          tooltipTitle: `Fiscal Year ${yLabel}`,
          leadValue,
          bookingValue,
          leadCount: matchingLeads.length,
          bookingCount: matchingBookings.length,
        };
      });
    }

    // Weekly Mode: 12 Weeks cadence (W38 to W49)
    return Array.from({ length: 12 }, (_, wIdx) => {
      const weekNumber = 38 + wIdx; // Week 38 through Week 49
      const label = `W${weekNumber}`;

      // Distribute leads and bookings by modulo or date match
      const matchingLeads = leads.filter((l, idx) => {
        const d = new Date(l.arrivalDate || l.expectedClose);
        if (!isNaN(d.getTime())) {
          const startOfYear = new Date(d.getFullYear(), 0, 1);
          const pastDaysOfYear = (d.getTime() - startOfYear.getTime()) / 86400000;
          const leadWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
          return leadWeek === weekNumber || idx % 12 === wIdx;
        }
        return idx % 12 === wIdx;
      });

      const matchingBookings = bookings.filter((b, idx) => {
        if (b.bookingStatus === 'Cancelled') return false;
        const d = new Date(b.arrivalDate);
        if (!isNaN(d.getTime())) {
          const startOfYear = new Date(d.getFullYear(), 0, 1);
          const pastDaysOfYear = (d.getTime() - startOfYear.getTime()) / 86400000;
          const bookWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
          return bookWeek === weekNumber || (idx + 3) % 12 === wIdx;
        }
        return (idx + 3) % 12 === wIdx;
      });

      const leadValue = matchingLeads.reduce((s, l) => s + parseMoney(l.totalValue), 0);
      const bookingValue = matchingBookings.reduce((s, b) => s + parseMoney(b.revenue), 0);

      return {
        key: label,
        label,
        tooltipTitle: `Week ${weekNumber} (Q4 2026)`,
        leadValue,
        bookingValue,
        leadCount: matchingLeads.length,
        bookingCount: matchingBookings.length,
      };
    });
  }, [periodMode, leads, bookings]);

  const totalPeriodRevenue = useMemo(() => {
    return chartData.reduce((s, d) => s + d.leadValue + d.bookingValue, 0);
  }, [chartData]);

  // Max value to determine stack of square blocks (max 12 blocks per column)
  const maxCombined = useMemo(() => {
    const maxVal = Math.max(1, ...chartData.map((d) => d.leadValue + d.bookingValue));
    return maxVal;
  }, [chartData]);

  const TOTAL_GRID_ROWS = 12;

  // Y-axis ticks (4 intervals from maxCombined down to 0)
  const yTicks = useMemo(() => {
    const steps = 4;
    const peak = maxCombined > 0 ? maxCombined : 100000;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = Math.round(((steps - i) / steps) * peak);
      return {
        value: val,
        label: formatCompactCurrency(val),
        topPct: (i / steps) * 100,
      };
    });
  }, [maxCombined]);

  return (
    <div className="relative py-2 flex flex-col justify-between h-full animate-card-enter">
      {/* Header bar optimized for 4-col width */}
      <div className="flex flex-col gap-2 mb-3 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Sales Trend</h3>

          {/* Period Toggle with active state */}
          <div className="flex items-center bg-zinc-100 rounded-md p-0.5">
            {(['Weekly', 'Monthly', 'Yearly'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setPeriodMode(mode);
                  setHoveredIdx(null);
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all cursor-pointer ${periodMode === mode
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                  }`}
              >
                {mode === 'Weekly' ? 'Wk' : mode === 'Monthly' ? 'Mo' : 'Yr'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline justify-between mt-0.5">
          <span className="text-[20px] font-normal text-zinc-900 leading-none tracking-tight">
            {formatCompactCurrency(totalPeriodRevenue)}
          </span>

          {/* Legend */}
          <div className="flex items-center gap-2.5 text-[8.5px] font-medium text-zinc-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-[1.5px] bg-zinc-200 border border-zinc-300 inline-block" />
              <span>Leads</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-[1.5px] bg-zinc-900 inline-block" />
              <span>Bookings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas with Y-Axis Legend and Background Grid Lines */}
      <div className="relative flex-1 min-h-[195px] flex items-stretch gap-2 pt-4 pb-1">
        {/* Left Y-Axis Scale / Legend */}
        <div className="relative w-8 shrink-0 flex flex-col justify-between pb-6 pr-1 select-none pointer-events-none">
          {yTicks.map((tick) => (
            <div key={tick.topPct} className="flex items-center justify-end">
              <span className="text-[8.5px] font-mono font-medium text-zinc-400 leading-none text-right">
                {tick.label}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Matrix Area */}
        <div className="relative flex-1 flex flex-col justify-end">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between pointer-events-none z-0">
            {yTicks.map((tick) => (
              <div
                key={tick.topPct}
                className="w-full border-b border-dashed border-zinc-200/90"
              />
            ))}
          </div>

          {/* Vertical Grid Columns (Grid Background) */}
          <div
            className="absolute inset-x-0 top-0 bottom-7 grid gap-2 pointer-events-none z-0"
            style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}
          >
            {chartData.map((d) => (
              <div key={`grid-v-${d.key}`} className="h-full flex justify-center">
                <div className="w-px h-full border-r border-dotted border-zinc-100" />
              </div>
            ))}
          </div>

          {/* Dynamic Columns based on active period */}
          <div
            className="relative grid gap-2 h-[168px] items-end z-10"
            style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}
          >
            {chartData.map((d, idx) => {
              const isHovered = hoveredIdx === idx;
              const combinedVal = d.leadValue + d.bookingValue;

              // Calculate how many blocks out of TOTAL_GRID_ROWS
              const totalBlocks = combinedVal > 0
                ? Math.max(1, Math.round((combinedVal / maxCombined) * TOTAL_GRID_ROWS))
                : 0;

              const bookingRatio = combinedVal > 0 ? d.bookingValue / combinedVal : 0;
              const bookingBlocks = Math.round(totalBlocks * bookingRatio);
              const leadBlocks = totalBlocks - bookingBlocks;

              return (
                <div
                  key={d.key}
                  className="relative flex flex-col items-center justify-end h-full group cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Vertical guide line on hover */}
                  {isHovered && (
                    <div className="absolute inset-y-0 w-px border-l border-dashed border-zinc-900 pointer-events-none -z-0" />
                  )}

                  {/* Floating tooltip popover matching user screenshot */}
                  {isHovered && combinedVal > 0 && (
                    <div className="absolute -top-16 z-30 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-lg p-2 shadow-xl shadow-black/10 min-w-[130px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-900 mb-1 border-b border-zinc-100 pb-1">
                        {d.tooltipTitle}
                      </p>
                      <div className="flex items-center justify-between text-[9px] font-medium text-zinc-600 mb-0.5">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-xs bg-zinc-300" /> Leads ({d.leadCount}):
                        </span>
                        <span className="text-zinc-900 font-semibold">{formatCompactCurrency(d.leadValue)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-medium text-zinc-600">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-xs bg-zinc-900" /> Bookings ({d.bookingCount}):
                        </span>
                        <span className="text-zinc-900 font-semibold">{formatCompactCurrency(d.bookingValue)}</span>
                      </div>
                    </div>
                  )}

                  {/* Dot marker on top of stack when hovered */}
                  {isHovered && totalBlocks > 0 && (
                    <div
                      className="absolute z-20 w-2 h-2 rounded-full bg-zinc-900 border-2 border-white shadow-xs pointer-events-none"
                      style={{ bottom: `${totalBlocks * 11 + 6}px` }}
                    />
                  )}

                  {/* Stack of square waffle blocks */}
                  <div className="flex flex-col-reverse gap-[2px] items-center w-full max-w-[22px] transition-transform duration-200 group-hover:scale-105">
                    {/* Confirmed booking blocks (solid black) */}
                    {Array.from({ length: bookingBlocks }).map((_, bIdx) => (
                      <div
                        key={`b-${bIdx}`}
                        className={`w-full h-[9px] rounded-[1.5px] transition-colors duration-200 ${isHovered ? 'bg-zinc-950 shadow-xs' : 'bg-zinc-900'
                          }`}
                      />
                    ))}
                    {/* Pipeline lead blocks (light gray) */}
                    {Array.from({ length: leadBlocks }).map((_, lIdx) => (
                      <div
                        key={`l-${lIdx}`}
                        className={`w-full h-[9px] rounded-[1.5px] transition-colors duration-200 ${isHovered ? 'bg-zinc-300' : 'bg-zinc-200'
                          }`}
                      />
                    ))}
                    {/* Empty state placeholder when 0 */}
                    {totalBlocks === 0 && (
                      <div className="w-full h-[3px] rounded-full bg-zinc-100" />
                    )}
                  </div>

                  {/* X-axis Label */}
                  <span
                    className={`mt-2 text-[9px] tracking-wider transition-colors duration-200 ${isHovered
                        ? 'font-bold text-zinc-900'
                        : 'font-medium text-zinc-400 group-hover:text-zinc-700'
                      }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
