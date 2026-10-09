import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { simulatedBookingPaceData } from '../../services/propertySimulation';
import { RoundAltArrowRight } from '@solar-icons/react';

interface BookingPaceWidgetProps {
  onOpenDetails?: () => void;
}

export function BookingPaceWidget({ onOpenDetails }: BookingPaceWidgetProps) {
  const { timeframe, series, summary } = simulatedBookingPaceData;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <InfoTooltip text="Measures booking velocity and demand acceleration. Room nights & revenue on-the-books (OTB) for the next 90 days vs same time last year.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
              BOOKING PACE
            </h3>
            <p className="text-[9px] text-zinc-500 font-medium tracking-wider uppercase mt-0.5">
              {timeframe}
            </p>
          </div>
        </InfoTooltip>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails?.();
          }}
          className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
        >
          See details <RoundAltArrowRight size={10} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[9px] text-zinc-600 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-900" />
          <span className="font-medium text-zinc-800">This year</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-400" />
          <span className="font-normal text-zinc-500">Last year</span>
        </div>
      </div>

      {/* Main Body: Chart (Left) + Summary KPIs (Right) */}
      <div className="flex-1 flex flex-col sm:flex-row items-stretch gap-2.5 min-h-[140px]">
        {/* Left: Next 90 Days Line Chart */}
        <div className="flex-1 h-[140px] sm:h-auto min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bookingPaceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#18181b" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#18181b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#71717a' }}
                dy={4}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8.5, fill: '#a1a1aa' }}
                ticks={[0, 5000, 10000, 15000, 20000]}
                tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)}
                domain={[0, 22000]}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  padding: '6px 10px',
                }}
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString()} room nights`,
                  name === 'thisYear' ? 'This Year' : 'Last Year',
                ]}
              />
              {/* This year area + solid line */}
              <Area
                type="monotone"
                dataKey="thisYear"
                stroke="#18181b"
                strokeWidth={2}
                fill="url(#bookingPaceGradient)"
                dot={{ r: 3, fill: '#18181b', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 4.5, fill: '#18181b' }}
                isAnimationActive={false}
              />
              {/* Last year dashed line */}
              <Line
                type="monotone"
                dataKey="lastYear"
                stroke="#a1a1aa"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#a1a1aa' }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Summary Metric Panel */}
        <div className="w-full sm:w-[130px] shrink-0 rounded-lg p-2.5 bg-zinc-50/70 border border-zinc-200/60 flex flex-col justify-between text-left">
          {/* Top Primary Metric */}
          <div>
            <div className="text-[17px] font-bold text-[#14532d] leading-none">
              {summary.paceVsLy}
            </div>
            <div className="text-[9px] font-medium text-zinc-600 mt-0.5">
              Pace vs LY
            </div>
          </div>

          <div className="border-t border-zinc-200/60 my-1 pt-1 space-y-1">
            {/* Room Nights OTB */}
            <div>
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-zinc-900 leading-none">{summary.roomNightsOtb}</span>
                <span className="text-[8.5px] font-semibold text-[#14532d] leading-none">↑ {summary.roomNightsTrend}</span>
              </div>
              <div className="text-[8.5px] text-zinc-500 font-normal">Room Nights OTB</div>
            </div>

            {/* Revenue OTB */}
            <div>
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-zinc-900 leading-none">{summary.revenueOtb}</span>
                <span className="text-[8.5px] font-semibold text-[#14532d] leading-none">↑ {summary.revenueTrend}</span>
              </div>
              <div className="text-[8.5px] text-zinc-500 font-normal">Revenue OTB</div>
            </div>

            {/* Pickups */}
            <div className="pt-0.5 border-t border-zinc-200/40 flex justify-between text-[8.5px] text-zinc-500">
              <span>Pickup 7d: <strong className="text-zinc-800 font-semibold">{summary.pickup7d}</strong></span>
              <span>30d: <strong className="text-zinc-800 font-semibold">{summary.pickup30d}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
