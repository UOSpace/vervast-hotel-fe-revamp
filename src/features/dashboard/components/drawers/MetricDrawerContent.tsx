import React, { useState } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export interface PropertyPerformanceItem {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  occupiedRooms: number;
  occ: string;
  occNum: number;
  targetOcc: number;
  adr: string;
  adrNum: number;
  targetAdr: number;
  revenue: string;
  revenueNum: number;
  targetRev: number;
  revpar: string;
  revparNum: number;
  targetRevpar: number;
  status: string;
  localTime: string;
  children: Array<{
    name: string;
    location: string;
    totalRooms: number;
    occupiedRooms: number;
    occ: string;
    adr: string;
    revenue: string;
    revpar: string;
  }>;
}

export const accuratePropertiesData: PropertyPerformanceItem[] = [
  {
    id: 'alpine',
    name: 'Sosei Alpine',
    location: 'Switzerland & Finland',
    totalRooms: 240,
    occupiedRooms: 195,
    occ: '81.20%',
    occNum: 81.2,
    targetOcc: 78.0,
    adr: '$2,780.00',
    adrNum: 2780,
    targetAdr: 2600,
    revenue: '$4.20M',
    revenueNum: 4.20,
    targetRev: 3.85,
    revpar: '$2,257.36',
    revparNum: 2257.36,
    targetRevpar: 2028.00,
    status: 'High Demand',
    localTime: '14:30 CET',
    children: [
      { name: 'Sosei Nocturne', location: 'St. Moritz, Switzerland', totalRooms: 130, occupiedRooms: 108, occ: '83.00%', adr: '$2,860.00', revenue: '$2.25M', revpar: '$2,373.80' },
      { name: 'Sosei Aurora', location: 'Lapland, Finland', totalRooms: 110, occupiedRooms: 87, occ: '79.40%', adr: '$2,700.00', revenue: '$1.95M', revpar: '$2,143.80' }
    ]
  },
  {
    id: 'ocean',
    name: 'Sosei Ocean',
    location: 'Maldives & Bali',
    totalRooms: 210,
    occupiedRooms: 165,
    occ: '78.50%',
    occNum: 78.5,
    targetOcc: 76.0,
    adr: '$2,540.00',
    adrNum: 2540,
    targetAdr: 2400,
    revenue: '$3.40M',
    revenueNum: 3.40,
    targetRev: 3.10,
    revpar: '$1,993.90',
    revparNum: 1993.90,
    targetRevpar: 1824.00,
    status: 'Optimal Flow',
    localTime: '18:30 MVT',
    children: [
      { name: 'Sosei Maréa', location: 'Baa Atoll, Maldives', totalRooms: 110, occupiedRooms: 88, occ: '80.20%', adr: '$2,620.00', revenue: '$1.85M', revpar: '$2,101.24' },
      { name: 'Sosei Pelagia', location: 'Uluwatu, Bali', totalRooms: 100, occupiedRooms: 77, occ: '76.80%', adr: '$2,460.00', revenue: '$1.55M', revpar: '$1,889.28' }
    ]
  },
  {
    id: 'city',
    name: 'Sosei City',
    location: 'New York & Los Angeles',
    totalRooms: 260,
    occupiedRooms: 197,
    occ: '75.60%',
    occNum: 75.6,
    targetOcc: 74.0,
    adr: '$2,420.00',
    adrNum: 2420,
    targetAdr: 2350,
    revenue: '$2.60M',
    revenueNum: 2.60,
    targetRev: 2.45,
    revpar: '$1,829.52',
    revparNum: 1829.52,
    targetRevpar: 1739.00,
    status: 'Corporate Peak',
    localTime: '08:30 EDT',
    children: [
      { name: 'Sosei Verper', location: 'Manhattan, New York', totalRooms: 140, occupiedRooms: 108, occ: '77.20%', adr: '$2,500.00', revenue: '$1.45M', revpar: '$1,930.00' },
      { name: 'Sosei Élan', location: 'Beverly Hills, Los Angeles', totalRooms: 120, occupiedRooms: 89, occ: '74.00%', adr: '$2,340.00', revenue: '$1.15M', revpar: '$1,731.60' }
    ]
  },
  {
    id: 'countryside',
    name: 'Sosei Countryside',
    location: 'Tuscany & Provence',
    totalRooms: 200,
    occupiedRooms: 156,
    occ: '77.80%',
    occNum: 77.8,
    targetOcc: 75.0,
    adr: '$2,180.00',
    adrNum: 2180,
    targetAdr: 2100,
    revenue: '$1.95M',
    revenueNum: 1.95,
    targetRev: 1.80,
    revpar: '$1,696.04',
    revparNum: 1696.04,
    targetRevpar: 1575.00,
    status: 'Leisure Stable',
    localTime: '14:30 CET',
    children: [
      { name: 'Sosei Hearth', location: 'Val d\'Orcia, Tuscany', totalRooms: 105, occupiedRooms: 83, occ: '79.50%', adr: '$2,250.00', revenue: '$1.08M', revpar: '$1,788.75' },
      { name: 'Sosei Pastoral', location: 'Luberon, Provence', totalRooms: 95, occupiedRooms: 72, occ: '76.10%', adr: '$2,110.00', revenue: '$0.87M', revpar: '$1,605.71' }
    ]
  },
  {
    id: 'forest',
    name: 'Sosei Forest',
    location: 'Kyoto & Chiang Mai',
    totalRooms: 180,
    occupiedRooms: 143,
    occ: '79.40%',
    occNum: 79.4,
    targetOcc: 76.0,
    adr: '$2,050.00',
    adrNum: 2050,
    targetAdr: 1950,
    revenue: '$1.45M',
    revenueNum: 1.45,
    targetRev: 1.35,
    revpar: '$1,627.70',
    revparNum: 1627.70,
    targetRevpar: 1482.00,
    status: 'High Demand',
    localTime: '22:30 JST',
    children: [
      { name: 'Sosei Sylvan', location: 'Arashiyama, Kyoto', totalRooms: 95, occupiedRooms: 77, occ: '81.00%', adr: '$2,120.00', revenue: '$0.82M', revpar: '$1,717.20' },
      { name: 'Sosei Verdant', location: 'Chiang Mai, Thailand', totalRooms: 85, occupiedRooms: 66, occ: '77.80%', adr: '$1,980.00', revenue: '$0.63M', revpar: '$1,540.44' }
    ]
  },
  {
    id: 'desert',
    name: 'Sosei Desert',
    location: 'Siwa & Al Hajar',
    totalRooms: 150,
    occupiedRooms: 111,
    occ: '74.20%',
    occNum: 74.2,
    targetOcc: 72.0,
    adr: '$1,980.00',
    adrNum: 1980,
    targetAdr: 1900,
    revenue: '$1.20M',
    revenueNum: 1.20,
    targetRev: 1.15,
    revpar: '$1,469.16',
    revparNum: 1469.16,
    targetRevpar: 1368.00,
    status: 'Optimal Flow',
    localTime: '17:30 GST',
    children: [
      { name: 'Sosei Mirage', location: 'Siwa Oasis, Egypt', totalRooms: 80, occupiedRooms: 61, occ: '75.80%', adr: '$2,040.00', revenue: '$0.68M', revpar: '$1,546.32' },
      { name: 'Sosei Solstice', location: 'Al Hajar, Oman', totalRooms: 70, occupiedRooms: 51, occ: '72.60%', adr: '$1,920.00', revenue: '$0.52M', revpar: '$1,393.92' }
    ]
  }
];

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
  const isRev = t.includes('REVENUE');
  const isRevPar = t.includes('REVPAR');

  const getMetricConfig = () => {
    if (isOcc) {
      return {
        title: 'Occupancy Rate Performance',
        subtitle: 'Daily realized occupancy vs budget target (75.0%) across all 12 sanctuaries (MTD)',
        heroValue: '78.4%',
        heroTrend: '+6.0% YoY',
        heroTrendUp: true,
        targetValue: '75.0%',
        varianceText: '+3.4% pts Above Budget Target',
        contextLabel: 'Rooms Occupied',
        contextValue: '967 / 1,240 Rooms',
        yAxisSuffix: '%',
        chartData: [
          { date: 'Sep 23', value: 75.8, target: 75 },
          { date: 'Sep 24', value: 76.4, target: 75 },
          { date: 'Sep 25', value: 77.1, target: 75 },
          { date: 'Sep 26', value: 78.5, target: 75 },
          { date: 'Sep 27', value: 82.4, target: 75 },
          { date: 'Sep 28', value: 84.8, target: 75 },
          { date: 'Sep 29', value: 81.2, target: 75 },
          { date: 'Sep 30', value: 76.5, target: 75 },
          { date: 'Oct 01', value: 75.9, target: 75 },
          { date: 'Oct 02', value: 76.8, target: 75 },
          { date: 'Oct 03', value: 77.9, target: 75 },
          { date: 'Oct 04', value: 83.1, target: 75 },
          { date: 'Oct 05', value: 85.0, target: 75 },
          { date: 'Oct 06', value: 78.4, target: 75 },
        ],
        targetLine: 75,
        drivers: [
          'High weekend leisure demand at Sosei Alpine (81.2%) & Ocean (78.5%) driving sustained peaks.',
          'Corporate retreat buyouts in Sosei Verper NY (77.2%) boosted midweek room nights by 14%.',
          'Direct bookings via Sosei Privilege Concierge accounted for 42% of total room nights with minimal cancellations.',
          'Seasonal wellness packages at Kyoto Sylvan and Lapland Aurora expanded average length of stay to 4.2 nights.'
        ]
      };
    } else if (isAdr) {
      return {
        title: 'Average Daily Rate (ADR) Performance',
        subtitle: 'Realized daily rate yield vs budget target ($2,300) across luxury room tiers',
        heroValue: '$2,450',
        heroTrend: '+8.0% YoY',
        heroTrendUp: true,
        targetValue: '$2,300',
        varianceText: '+$150 Rate Premium vs Budget',
        contextLabel: 'Top Performing',
        contextValue: 'Sosei Alpine ($2,780)',
        yAxisSuffix: '',
        chartData: [
          { date: 'Sep 23', value: 2380, target: 2300 },
          { date: 'Sep 24', value: 2410, target: 2300 },
          { date: 'Sep 25', value: 2435, target: 2300 },
          { date: 'Sep 26', value: 2460, target: 2300 },
          { date: 'Sep 27', value: 2540, target: 2300 },
          { date: 'Sep 28', value: 2590, target: 2300 },
          { date: 'Sep 29', value: 2510, target: 2300 },
          { date: 'Sep 30', value: 2420, target: 2300 },
          { date: 'Oct 01', value: 2400, target: 2300 },
          { date: 'Oct 02', value: 2430, target: 2300 },
          { date: 'Oct 03', value: 2470, target: 2300 },
          { date: 'Oct 04', value: 2550, target: 2300 },
          { date: 'Oct 05', value: 2580, target: 2300 },
          { date: 'Oct 06', value: 2450, target: 2300 },
        ],
        targetLine: 2300,
        drivers: [
          'Presidential and Royal Villa upgrades maintained an average nightly rate of $3,450 with 92% occupancy.',
          'Dynamic rate yield algorithm captured +12% weekend pricing surge across Alpine and Maldives.',
          'Direct booking rate integrity ensured zero OTA discounting across luxury master suites.',
          'Exclusive autumn harvest culinary inclusions elevated Countryside ADR to $2,180.'
        ]
      };
    } else if (isRev) {
      return {
        title: 'Room & Portfolio Revenue Performance',
        subtitle: 'Realized gross revenue generation (MTD actuals $14.80M vs $13.50M budget target)',
        heroValue: '$14.80M MTD',
        heroTrend: '+14.0% YoY',
        heroTrendUp: true,
        targetValue: '$13.50M Target',
        varianceText: '+$1.30M (+9.6%) Ahead of Budget',
        contextLabel: 'YTD Total Portfolio',
        contextValue: '$118.0M Gross Revenue',
        yAxisSuffix: 'M',
        chartData: [
          { date: 'Sep 23', value: 1.85, target: 1.70 },
          { date: 'Sep 24', value: 1.92, target: 1.70 },
          { date: 'Sep 25', value: 2.05, target: 1.70 },
          { date: 'Sep 26', value: 2.15, target: 1.70 },
          { date: 'Sep 27', value: 2.48, target: 1.70 },
          { date: 'Sep 28', value: 2.62, target: 1.70 },
          { date: 'Sep 29', value: 2.30, target: 1.70 },
          { date: 'Sep 30', value: 1.90, target: 1.70 },
          { date: 'Oct 01', value: 1.95, target: 1.70 },
          { date: 'Oct 02', value: 2.08, target: 1.70 },
          { date: 'Oct 03', value: 2.18, target: 1.70 },
          { date: 'Oct 04', value: 2.52, target: 1.70 },
          { date: 'Oct 05', value: 2.58, target: 1.70 },
          { date: 'Oct 06', value: 2.24, target: 1.70 },
        ],
        targetLine: 1.70,
        drivers: [
          'Strong room revenue contribution representing 68% of total portfolio gross intake.',
          'F&B banquet buyouts and private chef experiences generated $3.2M ancillary income.',
          'Holistic thermal spa therapies and retail memberships contributed $2.4M across sanctuaries.',
          'Advance booking pace for the upcoming winter holiday season is pacing 18% higher than prior year.'
        ]
      };
    } else if (isRevPar) {
      return {
        title: 'Revenue Per Available Room (RevPAR) Performance',
        subtitle: 'Yield efficiency benchmark combining occupancy volume and ADR pricing power',
        heroValue: '$1,921',
        heroTrend: '+14.0% YoY',
        heroTrendUp: true,
        targetValue: '$1,725',
        varianceText: '+$196 (+11.4%) Yield Efficiency',
        contextLabel: 'Total Portfolio TrevPAR',
        contextValue: '$2,640 (Total Rev/Room)',
        yAxisSuffix: '',
        chartData: [
          { date: 'Sep 23', value: 1804, target: 1725 },
          { date: 'Sep 24', value: 1841, target: 1725 },
          { date: 'Sep 25', value: 1877, target: 1725 },
          { date: 'Sep 26', value: 1931, target: 1725 },
          { date: 'Sep 27', value: 2092, target: 1725 },
          { date: 'Sep 28', value: 2196, target: 1725 },
          { date: 'Sep 29', value: 2038, target: 1725 },
          { date: 'Sep 30', value: 1851, target: 1725 },
          { date: 'Oct 01', value: 1821, target: 1725 },
          { date: 'Oct 02', value: 1866, target: 1725 },
          { date: 'Oct 03', value: 1924, target: 1725 },
          { date: 'Oct 04', value: 2119, target: 1725 },
          { date: 'Oct 05', value: 2193, target: 1725 },
          { date: 'Oct 06', value: 1921, target: 1725 },
        ],
        targetLine: 1725,
        drivers: [
          'RevPAR expansion driven primarily by simultaneous increases in ADR (+8%) and occupancy (+6%).',
          'Sosei Alpine led yield with $2,257 RevPAR, representing an exceptional 111% index vs luxury compset.',
          'Minimum stay restrictions on weekends preserved ADR integrity and eliminated single-night vacancy drag.',
          'Strong mid-week corporate yields at Sosei Verper NY lifted urban RevPAR to $1,829.'
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
                  <stop offset="5%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={theme === 'dark' ? '#fafafa' : '#18181b'} stopOpacity={0.0}/>
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
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">78.40%</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">$2,450.00</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$14.80M</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$1,920.80</td>
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
