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
  const propName = config.data?.propertyName;

  const isOcc = t.includes('OCCUPANCY');
  const isAdr = t.includes('ADR');
  const isRevPar = t.includes('REVPAR');
  const isTotalHotelRev = t.includes('TOTAL HOTEL REVENUE') || t.includes('TOTAL REVENUE');
  const isRoomRev = t.includes('ROOM REVENUE') || (!isTotalHotelRev && t.includes('REVENUE'));
  const isLos = t.includes('STAY') || t.includes('LOS') || t.includes('LENGTH');
  const isRev = isTotalHotelRev || isRoomRev;

  const customHeroValue = typeof config.data === 'string' ? config.data : config.data?.value;

  const getMetricConfig = () => {
    if (isOcc) {
      return {
        title: 'Occupancy Rate Performance',
        subtitle: 'Daily realized occupancy vs budget and forecast across luxury sanctuaries (MTD)',
        heroValue: customHeroValue || '74.2%',
        heroTrend: '+4.8 pts vs LY',
        heroTrendUp: true,
        targetValue: '72.1%',
        varianceText: '+2.1 pts vs Budget · +1.2 pts vs Forecast',
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
          'Strong leisure demand at Sosei Sky (77.5%) & Beach Resort (75.2%) driving sustained peak performance.',
          'Occupancy outperforming LY by +4.8 pts, budget targets by +2.1 pts, and latest forecast by +1.2 pts.',
          'Direct bookings via SOSEI Privilege Concierge accounted for 42% of total room nights with minimal cancellations.',
          'Corporate retreat buyouts in SOSEI Verper NY (75.0%) lifted urban midweek room occupancy by 12%.'
        ]
      };
    } else if (isAdr) {
      return {
        title: 'Average Daily Rate (ADR) Performance',
        subtitle: 'Realized daily rate yield vs budget and forecast across luxury room tiers (MTD)',
        heroValue: customHeroValue || '$1,420',
        heroTrend: '+$85 vs LY (+6.0%)',
        heroTrendUp: true,
        targetValue: '$1,378',
        varianceText: '+$42 vs Budget (+3.2%) · +$18 vs Forecast (+1.3%)',
        contextLabel: 'Top Performing Collection',
        contextValue: 'Sosei Sky ($2,705)',
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
          'Outperforming budget benchmark by +$42 (+3.2%) and latest forecast by +$18 (+1.3%) driven by suite yields.',
          'Presidential and Royal Villa upgrades maintained an average nightly rate of $3,450 across destinations.',
          'Direct booking rate integrity ensured zero OTA discounting across luxury sanctuaries.'
        ]
      };
    } else if (isRevPar) {
      return {
        title: 'Revenue Per Available Room (RevPAR) Performance',
        subtitle: 'Yield efficiency benchmark combining occupancy volume and ADR pricing power (MTD)',
        heroValue: customHeroValue || '$1,054',
        heroTrend: '+$92 vs LY (+8.5%)',
        heroTrendUp: true,
        targetValue: '$1,006',
        varianceText: '+$48 vs Budget (+4.1%) · +$22 vs Forecast (+2.1%)',
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
          'RevPAR reached $1,054, up +$92 vs LY (+8.5%), +$48 vs Budget (+4.1%), and +$22 vs Forecast (+2.1%).',
          'Balanced yield expansion achieved through healthy occupancy (74.2%) and ADR ($1,420).',
          'Sosei Sky led yield with $2,104 RevPAR, representing top performance across destinations.',
          'Minimum stay restrictions on weekends preserved pricing power and eliminated single-night vacancy drag.'
        ]
      };
    } else if (isTotalHotelRev) {
      return {
        title: 'Total Hotel Revenue (5 Hospitality Pillars)',
        subtitle: 'Total hotel business revenue across all 5 hospitality pillars (MTD actuals)',
        heroValue: customHeroValue || '$152M MTD',
        heroTrend: '+11.0% vs LY',
        heroTrendUp: true,
        targetValue: '$146.2M Target',
        varianceText: '+$5.8M (+4.0%) vs Budget · +$2.9M (+1.9%) vs Forecast',
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
          'Total hotel business revenue generated strong performance MTD, outperforming LY and Budget.',
          'Rooms revenue anchored total business performance with strong rate yields.',
          'Food & Beverage generated steady volume with Michelin-starred dining buyouts and private banqueting.',
          'Spa & Wellness and Activities contributed high-margin experiences across luxury destinations.'
        ]
      };
    } else if (isRoomRev) {
      return {
        title: 'Room Revenue Performance',
        subtitle: 'Realized room revenue generation (MTD actuals)',
        heroValue: customHeroValue || '$118M MTD',
        heroTrend: '+$14.5M vs LY (+14.0%)',
        heroTrendUp: true,
        targetValue: '$112.2M Target',
        varianceText: '+$5.8M (+5.2%) vs Budget · +$2.4M (+2.1%) vs Forecast',
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
          'Room Revenue reached $118M MTD, delivering a +$14.5M (+14.0%) increase vs LY, +$5.8M (+5.2%) above budget, and +$2.4M (+2.1%) ahead of latest forecast.',
          'Average Daily Rate ($1,420) and 74.2% occupancy drove strong top-line room yields across all collections.',
          'Sosei Sky ($34.5M) and Sosei Beach Resort ($29.8M) generated over 54% of portfolio room revenue.',
          'Strong booking pace for remaining dates in October projected to sustain revenue momentum.'
        ]
      };
    } else if (isLos) {
      const losVal = customHeroValue || (config.data?.los ? `${config.data.los} Nights` : '4.2 Nights');
      return {
        title: propName ? `${propName} — Average Length of Stay` : 'Average Length of Stay (ALOS) Performance',
        subtitle: propName ? `Realized guest length of stay across leisure and retreat stays at ${propName}` : 'Average guest duration across destinations and stay portfolios (MTD)',
        heroValue: losVal,
        heroTrend: '+0.3 Nights',
        heroTrendUp: true,
        targetValue: '3.8 Nights',
        varianceText: '+0.4 Nights vs Target Benchmark',
        contextLabel: 'Top Segment by Stay',
        contextValue: 'Leisure & Retreats (5.2 Nights)',
        yAxisSuffix: ' N',
        chartData: [
          { date: 'Sep 23', value: 3.9, target: 3.8 },
          { date: 'Sep 24', value: 4.0, target: 3.8 },
          { date: 'Sep 25', value: 4.1, target: 3.8 },
          { date: 'Sep 26', value: 4.2, target: 3.8 },
          { date: 'Sep 27', value: 4.5, target: 3.8 },
          { date: 'Sep 28', value: 4.6, target: 3.8 },
          { date: 'Sep 29', value: 4.3, target: 3.8 },
          { date: 'Sep 30', value: 4.0, target: 3.8 },
          { date: 'Oct 01', value: 3.9, target: 3.8 },
          { date: 'Oct 02', value: 4.1, target: 3.8 },
          { date: 'Oct 03', value: 4.3, target: 3.8 },
          { date: 'Oct 04', value: 4.4, target: 3.8 },
          { date: 'Oct 05', value: 4.5, target: 3.8 },
          { date: 'Oct 06', value: parseFloat(config.data?.los || '4.2'), target: 3.8 },
        ],
        targetLine: 3.8,
        drivers: [
          'Strong leisure and wellness retreat bookings generating average stay lengths exceeding 4.5 nights.',
          'Direct bookings through private butler concierge yield 5.2 nights average length of stay.',
          'Zero early departures recorded across multi-bedroom villas and private mountain chalets.',
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

      {/* Breakdown Table: If property context, show Property Room Tiers. If global, show Collection League */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            {propName ? `${propName} — Room Tier Inventory & Yield (MTD Actuals)` : 'Property Collection Breakdown (MTD Actuals)'}
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            {propName ? 'Room categories and realized yields' : 'Click collection row to expand individual sanctuaries'}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {propName ? (
            <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
              <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur-sm">
                <tr className="text-left text-zinc-400">
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Room Category</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap text-right">Inventory</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">MTD Revenue</th>
                  <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: 'Presidential / Mountain Chalet', keys: '30 Keys', occ: `${Math.min(95, parseInt(config.data?.occ || '76') + 4)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.18).toLocaleString()}`, rev: `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.40 / 1000)}K`, status: 'Peak Demand' },
                  { type: 'Signature Sanctuary Suite', keys: '25 Keys', occ: `${config.data?.occ || '76'}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 1.04).toLocaleString()}`, rev: `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.30 / 1000)}K`, status: 'High Yield' },
                  { type: 'Panoramic View Suite', keys: '20 Keys', occ: `${Math.max(50, parseInt(config.data?.occ || '76') - 2)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.92).toLocaleString()}`, rev: `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.19 / 1000)}K`, status: 'On Plan' },
                  { type: 'Glacier / Deluxe Pavilion', keys: '20 Keys', occ: `${Math.max(45, parseInt(config.data?.occ || '76') - 6)}%`, adr: `$${Math.round(parseInt(String(config.data?.adr || '2700').replace(/[^0-9]/g, '')) * 0.81).toLocaleString()}`, rev: `$${Math.round(parseInt(String(config.data?.rev || '1150000').replace(/[^0-9]/g, '')) * 0.11 / 1000)}K`, status: 'Stable' },
                ].map((tier, idx) => (
                  <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.type}</td>
                    <td className="py-2.5 px-3 text-right text-zinc-500 whitespace-nowrap">{tier.keys}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.occ}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.adr}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{tier.rev}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {tier.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                  <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total Property Inventory</td>
                  <td className="py-3 px-3 text-right text-zinc-500">95 Keys</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">{config.data?.occ || '76'}%</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{config.data?.adr || '$2,700'}</td>
                  <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{config.data?.rev || '$1.15M'}</td>
                  <td className="py-3 px-3 text-right text-emerald-700 font-bold">Optimal</td>
                </tr>
              </tbody>
            </table>
          ) : (
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
          )}
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
