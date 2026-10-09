import { AreaChart, Area, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { simulatedBookingPaceData, simulatedCategoryPerformance } from '../../services/propertySimulation';

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

      {/* Collection Pacing Breakdown */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Pacing Breakdown by Collection (Unified Data Portal)
          </h4>
          <span className="text-[9.5px] text-zinc-400">All 12 sanctuaries</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
              <tr className="text-left text-zinc-400">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Collection</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Destinations</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Total Keys</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Pace vs LY</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Revenue OTB</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Pace Status</th>
              </tr>
            </thead>
            <tbody>
              {simulatedCategoryPerformance.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{c.name}</td>
                  <td className="py-2.5 px-3 text-zinc-500">{c.location}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700 dark:text-zinc-300">{c.totalRooms} keys</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#14532d]">+12%</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{c.revenue}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                      Ahead of LY
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
