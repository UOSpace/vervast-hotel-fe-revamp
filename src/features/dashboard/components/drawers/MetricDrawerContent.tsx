import React, { useState } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

import { simulatedCategoryPerformance, type PropertyPerformanceCategory } from '../../services/propertySimulation';

export type PropertyPerformanceItem = PropertyPerformanceCategory;
export const accuratePropertiesData: PropertyPerformanceCategory[] = simulatedCategoryPerformance;


interface MetricDrawerContentProps {
  config: {
    title: string;
    data?: any;
  };
  theme?: string;
}

export function MetricDrawerContent({ config, theme }: MetricDrawerContentProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const t = config.title.toUpperCase();

  const isOcc = t.includes('OCCUPANCY');
  const isAdr = t.includes('ADR');
  const isRevPar = t.includes('REVPAR');
  const isTotalHotelRev = t.includes('TOTAL HOTEL REVENUE') || t.includes('TOTAL REVENUE');
  const isRoomRev = t.includes('ROOM REVENUE') || (!isTotalHotelRev && t.includes('REVENUE'));
  const isRev = isTotalHotelRev || isRoomRev;

  const getMetricConfig = () => {
    if (isOcc) {
      return {
        title: 'Occupancy Rate Performance',
        subtitle: 'Daily realized occupancy vs budget target (72.1%) across all 12 sanctuaries (MTD)',
        heroValue: '74.2%',
        heroTrend: '+4.8 pts vs LY',
        heroTrendUp: true,
        targetValue: '72.1%',
        varianceText: '+2.1 pts Above Budget Target',
        contextLabel: 'Rooms Occupied',
        contextValue: '920 / 1,240 Rooms',
        yAxisSuffix: '%',
        chartData: [
          { date: 'Sep 23', value: 71.8, target: 72.1 },
          { date: 'Sep 24', value: 72.4, target: 72.1 },
          { date: 'Sep 25', value: 73.1, target: 72.1 },
          { date: 'Sep 26', value: 74.5, target: 72.1 },
          { date: 'Sep 27', value: 77.4, target: 72.1 },
          { date: 'Sep 28', value: 78.8, target: 72.1 },
          { date: 'Sep 29', value: 76.2, target: 72.1 },
          { date: 'Sep 30', value: 73.5, target: 72.1 },
          { date: 'Oct 01', value: 72.9, target: 72.1 },
          { date: 'Oct 02', value: 73.8, target: 72.1 },
          { date: 'Oct 03', value: 74.9, target: 72.1 },
          { date: 'Oct 04', value: 77.1, target: 72.1 },
          { date: 'Oct 05', value: 78.0, target: 72.1 },
          { date: 'Oct 06', value: 74.2, target: 72.1 },
        ],
        targetLine: 72.1,
        drivers: [
          'Strong leisure demand at SOSEI Alpine (77.5%) & Ocean (75.2%) driving sustained peak performance.',
          'Occupancy outperforming LY by +4.8 percentage points and budget targets by +2.1 percentage points.',
          'Direct bookings via SOSEI Privilege Concierge accounted for 42% of total room nights with minimal cancellations.',
          'Corporate retreat buyouts in SOSEI Verper NY (75.0%) lifted urban midweek room occupancy by 12%.'
        ]
      };
    } else if (isAdr) {
      return {
        title: 'Average Daily Rate (ADR) Performance',
        subtitle: 'Realized daily rate yield vs budget target ($1,378) across luxury room tiers (MTD)',
        heroValue: '$1,420',
        heroTrend: '+$85 vs LY (+6.0%)',
        heroTrendUp: true,
        targetValue: '$1,378',
        varianceText: '+$42 vs Budget (+3.2%)',
        contextLabel: 'Top Performing Collection',
        contextValue: 'SOSEI Alpine ($1,680)',
        yAxisSuffix: '',
        chartData: [
          { date: 'Sep 23', value: 1390, target: 1378 },
          { date: 'Sep 24', value: 1405, target: 1378 },
          { date: 'Sep 25', value: 1415, target: 1378 },
          { date: 'Sep 26', value: 1430, target: 1378 },
          { date: 'Sep 27', value: 1475, target: 1378 },
          { date: 'Sep 28', value: 1495, target: 1378 },
          { date: 'Sep 29', value: 1460, target: 1378 },
          { date: 'Sep 30', value: 1410, target: 1378 },
          { date: 'Oct 01', value: 1400, target: 1378 },
          { date: 'Oct 02', value: 1415, target: 1378 },
          { date: 'Oct 03', value: 1435, target: 1378 },
          { date: 'Oct 04', value: 1480, target: 1378 },
          { date: 'Oct 05', value: 1495, target: 1378 },
          { date: 'Oct 06', value: 1420, target: 1378 },
        ],
        targetLine: 1378,
        drivers: [
          'ADR expanded to $1,420 MTD, delivering a +$85 vs LY (+6.0%) rate increase across destinations.',
          'Outperforming budget benchmark by +$42 vs Budget (+3.2%) driven by signature suite yield premiums.',
          'Presidential and Royal Villa upgrades maintained an average nightly rate of $3,450 across destinations.',
          'Direct booking rate integrity ensured zero OTA discounting across luxury sanctuaries.'
        ]
      };
    } else if (isRevPar) {
      return {
        title: 'Revenue Per Available Room (RevPAR) Performance',
        subtitle: 'Yield efficiency benchmark combining occupancy volume and ADR pricing power (MTD)',
        heroValue: '$1,054',
        heroTrend: '+$92 vs LY (+8.5%)',
        heroTrendUp: true,
        targetValue: '$1,006',
        varianceText: '+$48 vs Budget (+4.1%)',
        contextLabel: 'Total Portfolio TrevPAR',
        contextValue: '$1,357 (Total Rev/Room)',
        yAxisSuffix: '',
        chartData: [
          { date: 'Sep 23', value: 998, target: 1006 },
          { date: 'Sep 24', value: 1017, target: 1006 },
          { date: 'Sep 25', value: 1034, target: 1006 },
          { date: 'Sep 26', value: 1065, target: 1006 },
          { date: 'Sep 27', value: 1142, target: 1006 },
          { date: 'Sep 28', value: 1178, target: 1006 },
          { date: 'Sep 29', value: 1113, target: 1006 },
          { date: 'Sep 30', value: 1036, target: 1006 },
          { date: 'Oct 01', value: 1021, target: 1006 },
          { date: 'Oct 02', value: 1044, target: 1006 },
          { date: 'Oct 03', value: 1075, target: 1006 },
          { date: 'Oct 04', value: 1141, target: 1006 },
          { date: 'Oct 05', value: 1166, target: 1006 },
          { date: 'Oct 06', value: 1054, target: 1006 },
        ],
        targetLine: 1006,
        drivers: [
          'RevPAR reached $1,054, up +$92 vs LY (+8.5%) and +$48 vs Budget (+4.1%).',
          'Balanced yield expansion achieved through healthy occupancy (74.2%) and ADR ($1,420).',
          'SOSEI Alpine led yield with $1,302 RevPAR, representing top performance across destinations.',
          'Minimum stay restrictions on weekends preserved pricing power and eliminated single-night vacancy drag.'
        ]
      };
    } else if (isTotalHotelRev) {
      return {
        title: 'Total Hotel Revenue (5 Hospitality Pillars)',
        subtitle: 'Total hotel business revenue across all 5 hospitality pillars (MTD actuals $152M vs $146.2M budget target)',
        heroValue: '$152M MTD',
        heroTrend: '+11.0% vs LY',
        heroTrendUp: true,
        targetValue: '$146.2M Target',
        varianceText: '+$5.8M (+4.0%) vs Budget',
        contextLabel: '5 Hospitality Pillars',
        contextValue: 'Rooms $118M · F&B $22M · Spa $8M · Act $4M',
        yAxisSuffix: 'M',
        chartData: [
          { date: 'Sep 23', value: 4.65, target: 4.71 },
          { date: 'Sep 24', value: 4.72, target: 4.71 },
          { date: 'Sep 25', value: 4.80, target: 4.71 },
          { date: 'Sep 26', value: 4.95, target: 4.71 },
          { date: 'Sep 27', value: 5.35, target: 4.71 },
          { date: 'Sep 28', value: 5.48, target: 4.71 },
          { date: 'Sep 29', value: 5.20, target: 4.71 },
          { date: 'Sep 30', value: 4.82, target: 4.71 },
          { date: 'Oct 01', value: 4.75, target: 4.71 },
          { date: 'Oct 02', value: 4.86, target: 4.71 },
          { date: 'Oct 03', value: 4.98, target: 4.71 },
          { date: 'Oct 04', value: 5.32, target: 4.71 },
          { date: 'Oct 05', value: 5.40, target: 4.71 },
          { date: 'Oct 06', value: 4.90, target: 4.71 },
        ],
        targetLine: 4.71,
        drivers: [
          'Total hotel business revenue generated $152M MTD, up +11.0% vs LY and +4.0% ahead of budget.',
          'Rooms revenue ($118M / 77.6%) anchored total business performance with strong rate yields.',
          'Food & Beverage generated $22M (14.5%) with Michelin-starred dining buyouts and private banqueting.',
          'Spa & Wellness contributed $8M (5.3%) and Activities & Others contributed $4M (2.6%) in high-margin experiences.'
        ]
      };
    } else if (isRoomRev) {
      return {
        title: 'Room Revenue Performance',
        subtitle: 'Realized room revenue generation (MTD actuals $118M vs $112.2M budget target)',
        heroValue: '$118M MTD',
        heroTrend: '+14.0% vs LY',
        heroTrendUp: true,
        targetValue: '$112.2M Target',
        varianceText: '+$5.8M (+5.2%) vs Budget',
        contextLabel: 'Share of Hotel Revenue',
        contextValue: '77.6% of Total Hotel Business',
        yAxisSuffix: 'M',
        chartData: [
          { date: 'Sep 23', value: 3.58, target: 3.62 },
          { date: 'Sep 24', value: 3.65, target: 3.62 },
          { date: 'Sep 25', value: 3.72, target: 3.62 },
          { date: 'Sep 26', value: 3.84, target: 3.62 },
          { date: 'Sep 27', value: 4.15, target: 3.62 },
          { date: 'Sep 28', value: 4.25, target: 3.62 },
          { date: 'Sep 29', value: 4.02, target: 3.62 },
          { date: 'Sep 30', value: 3.74, target: 3.62 },
          { date: 'Oct 01', value: 3.68, target: 3.62 },
          { date: 'Oct 02', value: 3.77, target: 3.62 },
          { date: 'Oct 03', value: 3.86, target: 3.62 },
          { date: 'Oct 04', value: 4.12, target: 3.62 },
          { date: 'Oct 05', value: 4.18, target: 3.62 },
          { date: 'Oct 06', value: 3.80, target: 3.62 },
        ],
        targetLine: 3.62,
        drivers: [
          'Room Revenue reached $118M MTD, delivering a +14.0% vs LY increase and +5.2% above budget.',
          'Average Daily Rate ($1,420) and 74.2% occupancy drove strong top-line room yields across all collections.',
          'SOSEI Alpine ($33.5M) and SOSEI Ocean ($27.2M) generated over 51% of portfolio room revenue.',
          'Strong booking pace for remaining dates in October projected to sustain revenue momentum.'
        ]
      };
    } else {
      return {
        title: 'Total In-House Guests & Activity Volume',
        subtitle: 'Daily guest headcount and volume across active properties',
        heroValue: '2,847 Guests',
        heroTrend: '+12.0% YoY',
        heroTrendUp: true,
        targetValue: '2,600 Budgeted',
        varianceText: '+247 Guests Above Expectation',
        contextLabel: 'Arrivals / Departures',
        contextValue: '480 Arriving · 320 Departing',
        yAxisSuffix: '',
        chartData: [
          { date: 'Sep 23', value: 2680, target: 2600 },
          { date: 'Sep 24', value: 2720, target: 2600 },
          { date: 'Sep 25', value: 2760, target: 2600 },
          { date: 'Sep 26', value: 2810, target: 2600 },
          { date: 'Sep 27', value: 2980, target: 2600 },
          { date: 'Sep 28', value: 3040, target: 2600 },
          { date: 'Sep 29', value: 2910, target: 2600 },
          { date: 'Sep 30', value: 2730, target: 2600 },
          { date: 'Oct 01', value: 2710, target: 2600 },
          { date: 'Oct 02', value: 2750, target: 2600 },
          { date: 'Oct 03', value: 2800, target: 2600 },
          { date: 'Oct 04', value: 2990, target: 2600 },
          { date: 'Oct 05', value: 3020, target: 2600 },
          { date: 'Oct 06', value: 2847, target: 2600 },
        ],
        targetLine: 2600,
        drivers: [
          'High repeat guest ratio (38%) returning for autumn seasonal retreats.',
          'Average length of stay increased to 3.8 nights across all sanctuaries.',
          'Strong multi-generational family bookings during the holiday window.',
          'VIP arrivals scheduled today include 8 high-net-worth delegations.'
        ]
      };
    }
  };

  const m = getMetricConfig();

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Subtitle */}
      <div>
        <p className="text-xs text-zinc-500 font-normal">{m.subtitle}</p>
      </div>

      {/* 3 Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Realized Performance</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{m.heroValue}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
            ↑ {m.heroTrend}
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Budget Benchmark</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{m.targetValue}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">{m.varianceText}</span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{m.contextLabel}</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{m.contextValue}</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Portfolio Operational Status</span>
        </div>
      </div>

      {/* Realized 14-Day Trend Chart with ReferenceLine for Target */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Past 14 Days Realized Daily Trend vs Target
          </span>
          <div className="flex items-center gap-3 text-[9.5px]">
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
              <span className="w-2.5 h-0.5 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
              <span>Actual Realized</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-0.5 border-t border-dashed border-zinc-400" />
              <span>Target ({m.targetValue})</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={m.chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="metricDrawerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#71717a' : '#a1a1aa' }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: theme === 'dark' ? '#71717a' : '#a1a1aa' }}
                tickFormatter={(v: number) => isRev ? `$${v}M` : isOcc ? `${v}%` : `$${v}`}
                width={45}
              />
              <Tooltip
                formatter={(val: any) => [
                  isRev ? `$${Number(val).toFixed(2)}M` : isOcc ? `${val}%` : `$${Number(val).toLocaleString()}`,
                  'Actual'
                ]}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                  border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: theme === 'dark' ? '#fafafa' : '#09090b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <ReferenceLine y={m.targetLine} stroke="#a1a1aa" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme === 'dark' ? '#fafafa' : '#18181b'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#metricDrawerGradient)"
                dot={{ r: 3, fill: theme === 'dark' ? '#fafafa' : '#18181b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Property Collection Breakdown Table */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Property Collection Breakdown (MTD Actuals)
          </h4>
          <span className="text-[9.5px] text-zinc-400">Click collection row to expand individual sanctuaries</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
              <tr className="text-left text-zinc-400">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Collection</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Revenue (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {accuratePropertiesData.map((prop) => {
                const isExpanded = !!expandedRows[prop.id];
                return (
                  <React.Fragment key={prop.id}>
                    <tr
                      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                      onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                    >
                      <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                        {isExpanded ? (
                          <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                        ) : (
                          <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                        )}
                        {prop.name}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                      <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && prop.children.map((child, cIdx) => (
                      <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                        <td className="py-2 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                        <td className="py-2 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                        <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                        <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                        <td className="py-2 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                        <td className="py-2 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                        <td className="py-2 px-3 text-right text-[9.5px] text-zinc-400 whitespace-nowrap">Sanctuary Node</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">Global Portfolio (12 Sanctuaries)</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">74.20%</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$1,420.00</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{isTotalHotelRev ? '$152.00M' : '$118.00M'}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$1,054.00</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">Above Target</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Actionable Key Drivers & Operational Notes */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <div className="font-bold text-[10px] uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-2">Key Operational Drivers</div>
        <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4">
          {m.drivers.map((driver, idx) => (
            <li key={idx} className="leading-relaxed">{driver}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
