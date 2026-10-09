import { useState } from 'react';
import { InfoTooltip } from '../../../common/components/InfoTooltip';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';

interface KpiData {
  periodLabel: string;
  totalRevenue: {
    value: string;
    vsLy: string;
    vsBudget: string;
    upLy: boolean;
    upBudget: boolean;
    breakdown: Array<{ label: string; val: string; pct: string }>;
  };
  occupancy: {
    value: string;
    vsLy: string;
    vsBudget: string;
    upLy: boolean;
    upBudget: boolean;
    tooltip: string;
  };
  adr: {
    value: string;
    vsLy: string;
    vsBudget: string;
    upLy: boolean;
    upBudget: boolean;
    tooltip: string;
  };
  revPar: {
    value: string;
    vsLy: string;
    vsBudget: string;
    upLy: boolean;
    upBudget: boolean;
    tooltip: string;
  };
  roomRevenue: {
    value: string;
    vsLy: string;
    vsBudget: string;
    upLy: boolean;
    upBudget: boolean;
    tooltip: string;
  };
}

const horizonsData: Record<TimeHorizon, KpiData> = {
  mtd: {
    periodLabel: 'October 1–31, 2026',
    totalRevenue: {
      value: '$152M',
      vsLy: '+11.0% vs LY',
      vsBudget: '+4.0% vs Budget',
      upLy: true,
      upBudget: true,
      breakdown: [
        { label: 'Rooms', val: '$118M', pct: '77.6%' },
        { label: 'F&B', val: '$22M', pct: '14.5%' },
        { label: 'Spa', val: '$8M', pct: '5.3%' },
        { label: 'Activities', val: '$4M', pct: '2.6%' },
      ],
    },
    occupancy: {
      value: '74.2%',
      vsLy: '+4.8 pts vs LY',
      vsBudget: '+2.1 pts vs Budget',
      upLy: true,
      upBudget: true,
      tooltip: 'Occupancy rate MTD compared with LY and budget targets (percentage-point variance).',
    },
    adr: {
      value: '$1,420',
      vsLy: '+$85 vs LY (+6.0%)',
      vsBudget: '+$42 vs Budget (+3.2%)',
      upLy: true,
      upBudget: true,
      tooltip: 'Average Daily Rate MTD across luxury properties (Room Revenue / Rooms Sold).',
    },
    revPar: {
      value: '$1,054',
      vsLy: '+$92 vs LY (+8.5%)',
      vsBudget: '+$48 vs Budget (+4.1%)',
      upLy: true,
      upBudget: true,
      tooltip: 'Revenue Per Available Room MTD calculated as Occupancy × ADR.',
    },
    roomRevenue: {
      value: '$118M',
      vsLy: '+14.0% vs LY',
      vsBudget: '+5.2% vs Budget',
      upLy: true,
      upBudget: true,
      tooltip: 'Total room revenue recognized MTD.',
    },
  },
  today: {
    periodLabel: 'Today, October 8, 2026',
    totalRevenue: {
      value: '$5.1M',
      vsLy: '+9.4% vs LY',
      vsBudget: '+3.2% vs Budget',
      upLy: true,
      upBudget: true,
      breakdown: [
        { label: 'Rooms', val: '$3.9M', pct: '76.5%' },
        { label: 'F&B', val: '$750K', pct: '14.7%' },
        { label: 'Spa', val: '$290K', pct: '5.7%' },
        { label: 'Activities', val: '$160K', pct: '3.1%' },
      ],
    },
    occupancy: {
      value: '76.8%',
      vsLy: '+5.2 pts vs LY',
      vsBudget: '+3.0 pts vs Budget',
      upLy: true,
      upBudget: true,
      tooltip: 'Current checked-in guest occupancy across all properties today.',
    },
    adr: {
      value: '$1,465',
      vsLy: '+$97 vs LY (+7.1%)',
      vsBudget: '+$59 vs Budget (+4.2%)',
      upLy: true,
      upBudget: true,
      tooltip: 'Average Daily Rate for active stays today.',
    },
    revPar: {
      value: '$1,125',
      vsLy: '+$104 vs LY (+10.2%)',
      vsBudget: '+$58 vs Budget (+5.5%)',
      upLy: true,
      upBudget: true,
      tooltip: 'RevPAR calculated based on today’s active room inventory.',
    },
    roomRevenue: {
      value: '$3.9M',
      vsLy: '+12.8% vs LY',
      vsBudget: '+4.8% vs Budget',
      upLy: true,
      upBudget: true,
      tooltip: 'Daily room revenue generated across portfolio today.',
    },
  },
  ytd: {
    periodLabel: 'Jan 1 – Oct 8, 2026',
    totalRevenue: {
      value: '$1.28B',
      vsLy: '+12.4% vs LY',
      vsBudget: '+4.6% vs Budget',
      upLy: true,
      upBudget: true,
      breakdown: [
        { label: 'Rooms', val: '$992M', pct: '77.5%' },
        { label: 'F&B', val: '$186M', pct: '14.5%' },
        { label: 'Spa', val: '$68M', pct: '5.3%' },
        { label: 'Activities', val: '$34M', pct: '2.7%' },
      ],
    },
    occupancy: {
      value: '75.4%',
      vsLy: '+5.6 pts vs LY',
      vsBudget: '+2.8 pts vs Budget',
      upLy: true,
      upBudget: true,
      tooltip: 'Cumulative Year-To-Date Occupancy across full portfolio.',
    },
    adr: {
      value: '$1,440',
      vsLy: '+$106 vs LY (+8.0%)',
      vsBudget: '+$54 vs Budget (+3.9%)',
      upLy: true,
      upBudget: true,
      tooltip: 'Cumulative Year-To-Date ADR.',
    },
    revPar: {
      value: '$1,085',
      vsLy: '+$112 vs LY (+11.5%)',
      vsBudget: '+$52 vs Budget (+5.0%)',
      upLy: true,
      upBudget: true,
      tooltip: 'Cumulative Year-To-Date RevPAR.',
    },
    roomRevenue: {
      value: '$992M',
      vsLy: '+15.2% vs LY',
      vsBudget: '+6.0% vs Budget',
      upLy: true,
      upBudget: true,
      tooltip: 'Cumulative Year-To-Date Room Revenue.',
    },
  },
};

interface PortfolioKpisWidgetProps {
  onOpenMetricDrawer?: (metric: string, value: string) => void;
}

export function PortfolioKpisWidget({ onOpenMetricDrawer }: PortfolioKpisWidgetProps) {
  // Primary default timeframe is MTD as specified in rules
  const [horizon, setHorizon] = useState<TimeHorizon>('mtd');
  const data = horizonsData[horizon];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header: Title + Period Indicator + Timeframe Tabs */}
      <div className="px-1 flex items-center justify-between shrink-0 mb-2 min-h-[32px]">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            Portfolio Performance
          </h3>
          <p className="text-[9.5px] text-zinc-500 font-medium mt-0.5">
            Period: <span className="font-semibold text-zinc-800">{data.periodLabel}</span>
          </p>
        </div>

        {/* Time Horizon Filter Tabs: Today | MTD | YTD */}
        <div className="inline-flex items-center p-0.5 bg-zinc-200/60 rounded-md border border-zinc-200/80">
          {(['today', 'mtd', 'ytd'] as const).map((h) => {
            const isActive = horizon === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                }`}
              >
                {h === 'today' ? 'Today' : h.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 KPI Cards Container */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        {/* CARD 1 (Hero): TOTAL HOTEL REVENUE (Hospitality 5 Pillars) */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all border border-zinc-100/80"
          style={{ animationDelay: '0.15s' }}
          onClick={() => onOpenMetricDrawer?.('Total Hotel Revenue', data.totalRevenue.value)}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <InfoTooltip text="Total Hotel Business revenue across all 5 hospitality pillars (Rooms, F&B, Spa, Wellness, Activities).">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-900 cursor-help">
                    TOTAL HOTEL REVENUE
                  </span>
                </InfoTooltip>
                <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded-full bg-zinc-200/70 text-zinc-700">
                  Hospitality
                </span>
              </div>
              <div className="text-[22px] font-normal text-zinc-900 leading-tight mt-0.5">
                {data.totalRevenue.value}
              </div>
            </div>

            {/* Dual Comparison Badges */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                {data.totalRevenue.vsLy}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                {data.totalRevenue.vsBudget}
              </span>
            </div>
          </div>

          {/* 5-Pillar Breakdown summary bar */}
          <div className="mt-2 pt-1.5 border-t border-zinc-200/60 flex items-center justify-between text-[9px] text-zinc-500 flex-wrap gap-x-2.5 gap-y-1">
            <span className="font-semibold text-zinc-700 uppercase tracking-wider text-[8px]">Pillars:</span>
            {data.totalRevenue.breakdown.map((item, idx) => (
              <span key={item.label} className="flex items-center gap-1">
                <span className="text-zinc-500">{item.label}</span>
                <span className="font-bold text-zinc-900">{item.val}</span>
                {idx < data.totalRevenue.breakdown.length - 1 && (
                  <span className="text-zinc-300 ml-1">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 4 Room Metrics 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          {/* Card 2: OCCUPANCY */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all border border-zinc-100/80"
            style={{ animationDelay: '0.2s' }}
            onClick={() => onOpenMetricDrawer?.('Occupancy', data.occupancy.value)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.occupancy.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  OCCUPANCY
                </span>
              </InfoTooltip>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.occupancy.value}
            </div>
            {/* Dual Comparison Badges with percentage points (pts) */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                {data.occupancy.vsLy}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                {data.occupancy.vsBudget}
              </span>
            </div>
          </div>

          {/* Card 3: ADR */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all border border-zinc-100/80"
            style={{ animationDelay: '0.25s' }}
            onClick={() => onOpenMetricDrawer?.('ADR', data.adr.value)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.adr.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  ADR
                </span>
              </InfoTooltip>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.adr.value}
            </div>
            {/* Dual Comparison Badges */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                {data.adr.vsLy}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                {data.adr.vsBudget}
              </span>
            </div>
          </div>

          {/* Card 4: REVPAR */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all border border-zinc-100/80"
            style={{ animationDelay: '0.3s' }}
            onClick={() => onOpenMetricDrawer?.('RevPAR', data.revPar.value)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.revPar.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  REVPAR
                </span>
              </InfoTooltip>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.revPar.value}
            </div>
            {/* Dual Comparison Badges */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                {data.revPar.vsLy}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                {data.revPar.vsBudget}
              </span>
            </div>
          </div>

          {/* Card 5: ROOM REVENUE */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter bg-zinc-50/50 backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all border border-zinc-100/80"
            style={{ animationDelay: '0.35s' }}
            onClick={() => onOpenMetricDrawer?.('Room Revenue', data.roomRevenue.value)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.roomRevenue.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  ROOM REVENUE
                </span>
              </InfoTooltip>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.roomRevenue.value}
            </div>
            {/* Dual Comparison Badges */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                {data.roomRevenue.vsLy}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">
                {data.roomRevenue.vsBudget}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
