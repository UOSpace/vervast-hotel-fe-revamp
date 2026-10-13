import { AreaChart, Area, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { simulatedBookingPaceData } from '../../services/propertySimulation';

interface BookingPaceDrawerContentProps {
  theme?: string;
}

export function BookingPaceDrawerContent({ theme }: BookingPaceDrawerContentProps) {
  const { timeframe, series, summary } = simulatedBookingPaceData;

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Subtitle */}
      <div>
        <p className="text-xs text-zinc-500 font-normal">
          {timeframe} — On-the-books room nights and revenue pace compared with the same point last year across all 12 luxury sanctuaries.
        </p>
      </div>

      {/* 4 Hero Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Pace vs LY</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.paceVsLy}</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.paceVsBudget}
          </span>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Room Nights OTB</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.roomNightsOtb}</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.roomNightsTrend} vs STLY
          </span>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Revenue OTB</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.revenueOtb}</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.revenueTrend} vs STLY
          </span>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Velocity Pickups</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summary.pickup7d} (7d)</div>
          <span className="text-[10px] text-[#14532d] font-semibold mt-1 inline-flex items-center gap-0.5">
            <span className="text-[8.5px]">↑</span> {summary.pickup30d} past 30 days
          </span>
        </div>
      </div>

      {/* 90-Day Pacing Chart */}
      <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Booking Velocity Curve: This Year vs Last Year
          </span>
          <div className="flex items-center gap-4 text-[9.5px]">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
              <span className="w-2.5 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              <span>This Year ({summary.roomNightsOtb} total)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 whitespace-nowrap">
              <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-400" />
              <span>Same Point Last Year</span>
            </div>
          </div>
        </div>

        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="drawerPaceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9.5, fill: '#71717a' }} dy={6} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#a1a1aa' }}
                tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)}
                width={38}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: theme === 'dark' ? '#fafafa' : '#09090b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                formatter={(val: any, name: any) => [
                  `${Number(val).toLocaleString()} room nights`,
                  name === 'thisYear' ? 'This Year OTB' : 'Last Year Actual',
                ]}
              />
              <Area
                type="monotone"
                dataKey="thisYear"
                stroke={theme === 'dark' ? '#fafafa' : '#18181b'}
                strokeWidth={2}
                fill="url(#drawerPaceGradient)"
                dot={{ r: 3.5, fill: theme === 'dark' ? '#fafafa' : '#18181b', stroke: '#fff', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="lastYear"
                stroke="#a1a1aa"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#a1a1aa' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
