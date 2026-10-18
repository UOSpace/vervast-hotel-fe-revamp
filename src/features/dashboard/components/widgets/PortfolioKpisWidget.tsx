import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../common/components/InfoTooltip';
import {
  PERIOD_DEFS,
  PORTFOLIO_PROPERTY_IDS,
  fmtPct,
  fmtSignedPct,
  fmtSignedPts,
  fmtSignedUsd,
  fmtUsd,
  fmtUsdFull,
  getPortfolioMetrics,
} from '@/data/portfolio';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';

interface KpiData {
  periodLabel: string;
  totalRevenue: {
    value: string;
    vsLy: string;
    vsBudget: string;
    vsForecast: string;
    upLy: boolean;
    upBudget: boolean;
    upForecast: boolean;
    breakdown: Array<{ label: string; val: string; pct: string }>;
  };
  occupancy: {
    value: string;
    vsLy: string;
    vsBudget: string;
    vsForecast: string;
    upLy: boolean;
    upBudget: boolean;
    upForecast: boolean;
    tooltip: string;
  };
  adr: {
    value: string;
    vsLy: string;
    vsBudget: string;
    vsForecast: string;
    upLy: boolean;
    upBudget: boolean;
    upForecast: boolean;
    tooltip: string;
  };
  revPar: {
    value: string;
    vsLy: string;
    vsBudget: string;
    vsForecast: string;
    upLy: boolean;
    upBudget: boolean;
    upForecast: boolean;
    tooltip: string;
  };
  roomRevenue: {
    value: string;
    vsLy: string;
    vsBudget: string;
    vsForecast: string;
    upLy: boolean;
    upBudget: boolean;
    upForecast: boolean;
    tooltip: string;
  };
}

function buildKpiData(horizon: TimeHorizon): KpiData {
  const m = getPortfolioMetrics(PORTFOLIO_PROPERTY_IDS, horizon);
  const tot = m.totalRevenue || 1;
  const pct = (v: number) => fmtPct((v / tot) * 100, 1);

  return {
    periodLabel: PERIOD_DEFS[horizon].periodLabel,
    totalRevenue: {
      value: fmtUsd(m.totalRevenue),
      vsLy: `${fmtSignedPct(m.vsLy.totalRevenuePct)} vs LY`,
      vsBudget: `${fmtSignedPct(m.vsBudget.totalRevenuePct)} vs Budget`,
      vsForecast: `${fmtSignedPct(m.vsForecast.totalRevenuePct)} vs Forecast`,
      upLy: m.vsLy.totalRevenuePct >= 0,
      upBudget: m.vsBudget.totalRevenuePct >= 0,
      upForecast: m.vsForecast.totalRevenuePct >= 0,
      breakdown: [
        { label: 'Rooms', val: fmtUsd(m.roomRevenue), pct: pct(m.roomRevenue) },
        { label: 'F&B', val: fmtUsd(m.fnbRevenue), pct: pct(m.fnbRevenue) },
        { label: 'Spa', val: fmtUsd(m.spaRevenue), pct: pct(m.spaRevenue) },
        { label: 'Activities', val: fmtUsd(m.experienceRevenue), pct: pct(m.experienceRevenue) },
      ],
    },
    occupancy: {
      value: fmtPct(m.occupancyPct, 1),
      vsLy: `${fmtSignedPts(m.vsLy.occupancyPts)} vs LY`,
      vsBudget: `${fmtSignedPts(m.vsBudget.occupancyPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(m.vsForecast.occupancyPts)} vs Forecast`,
      upLy: m.vsLy.occupancyPts >= 0,
      upBudget: m.vsBudget.occupancyPts >= 0,
      upForecast: m.vsForecast.occupancyPts >= 0,
      tooltip: 'Occupancy rate compared with LY, budget, and forecast targets (percentage-point variance).',
    },
    adr: {
      value: fmtUsdFull(m.adr),
      vsLy: `${fmtSignedUsd(m.vsLy.adrAbs)} vs LY (${fmtSignedPct(m.vsLy.adrPct)})`,
      vsBudget: `${fmtSignedUsd(m.vsBudget.adrAbs)} vs Budget (${fmtSignedPct(m.vsBudget.adrPct)})`,
      vsForecast: `${fmtSignedUsd(m.vsForecast.adrAbs)} vs Forecast (${fmtSignedPct(m.vsForecast.adrPct)})`,
      upLy: m.vsLy.adrPct >= 0,
      upBudget: m.vsBudget.adrPct >= 0,
      upForecast: m.vsForecast.adrPct >= 0,
      tooltip: 'Average Daily Rate across luxury properties (Room Revenue / Rooms Sold).',
    },
    revPar: {
      value: fmtUsdFull(m.revpar),
      vsLy: `${fmtSignedUsd(m.vsLy.revparAbs)} vs LY (${fmtSignedPct(m.vsLy.revparPct)})`,
      vsBudget: `${fmtSignedUsd(m.vsBudget.revparAbs)} vs Budget (${fmtSignedPct(m.vsBudget.revparPct)})`,
      vsForecast: `${fmtSignedUsd(m.vsForecast.revparAbs)} vs Forecast (${fmtSignedPct(m.vsForecast.revparPct)})`,
      upLy: m.vsLy.revparPct >= 0,
      upBudget: m.vsBudget.revparPct >= 0,
      upForecast: m.vsForecast.revparPct >= 0,
      tooltip: 'Revenue Per Available Room calculated as Occupancy × ADR.',
    },
    roomRevenue: {
      value: fmtUsd(m.roomRevenue),
      vsLy: `${fmtSignedUsd(m.vsLy.roomRevenueAbs)} vs LY (${fmtSignedPct(m.vsLy.roomRevenuePct)})`,
      vsBudget: `${fmtSignedUsd(m.vsBudget.roomRevenueAbs)} vs Budget (${fmtSignedPct(m.vsBudget.roomRevenuePct)})`,
      vsForecast: `${fmtSignedUsd(m.vsForecast.roomRevenueAbs)} vs Forecast (${fmtSignedPct(m.vsForecast.roomRevenuePct)})`,
      upLy: m.vsLy.roomRevenuePct >= 0,
      upBudget: m.vsBudget.roomRevenuePct >= 0,
      upForecast: m.vsForecast.roomRevenuePct >= 0,
      tooltip: 'Total room revenue recognized across the portfolio.',
    },
  };
}

interface PortfolioKpisWidgetProps {
  horizon?: TimeHorizon;
  onChangeHorizon?: (h: TimeHorizon) => void;
  onOpenMetricDrawer?: (metric: string, value: string, horizon: TimeHorizon) => void;
  onOpenPortfolioPerformance?: (horizon: TimeHorizon) => void;
}

export function PortfolioKpisWidget({
  horizon = 'mtd',
  onChangeHorizon,
  onOpenMetricDrawer,
  onOpenPortfolioPerformance,
}: PortfolioKpisWidgetProps) {
  const data = buildKpiData(horizon);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header: Title + Period Indicator + Horizon Tabs + Details Link */}
      <div className="px-1 flex items-center justify-between gap-2 shrink-0 mb-2 min-h-[32px]">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            Portfolio Performance
          </h3>
          <p className="text-[9.5px] text-zinc-500 font-medium mt-0.5">
            As of: <span className="font-semibold text-zinc-800">{data.periodLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onChangeHorizon && (
            <div className="inline-flex items-center p-0.5 bg-zinc-200/60 rounded-md shrink-0">
              {(['today', 'mtd', 'ytd'] as const).map((h) => {
                const isActive = horizon === h;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => onChangeHorizon(h)}
                    title={PERIOD_DEFS[h].periodLabel}
                    className={`px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    {h === 'today' ? 'Yesterday' : h.toUpperCase()}
                  </button>
                );
              })}
            </div>
          )}

          {onOpenPortfolioPerformance && (
            <button
              type="button"
              onClick={() => onOpenPortfolioPerformance(horizon)}
              className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>See details</span> <RoundAltArrowRight size={10} />
            </button>
          )}
        </div>
      </div>

      {/* 5 KPI Cards Container */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        {/* CARD 1 (Hero): TOTAL REVENUE (HOSPITALITY) */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
          style={{ animationDelay: '0.15s' }}
          onClick={() => onOpenMetricDrawer?.('Total Revenue (Hospitality)', data.totalRevenue.value, horizon)}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <InfoTooltip text="Total Hospitality revenue across all 5 hospitality pillars (Rooms, F&B, Spa, Wellness, Activities).">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-900 cursor-help">
                    TOTAL REVENUE (HOSPITALITY)
                  </span>
                </InfoTooltip>
              </div>
              <div className="text-[22px] font-normal text-zinc-900 leading-tight mt-0.5">
                {data.totalRevenue.value}
              </div>
            </div>

            {/* Comparison Badges: vs LY, vs Budget, vs Forecast */}
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                {data.totalRevenue.vsLy}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                {data.totalRevenue.vsBudget}
              </span>
              <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                {data.totalRevenue.vsForecast}
              </span>
            </div>
          </div>

          {/* 5-Pillar Breakdown summary bar */}
          <div className="mt-2 pt-1.5 border-t border-zinc-200/60 flex items-center justify-between text-[9px] text-zinc-500 flex-wrap gap-x-2.5 gap-y-1">
            <span className="font-semibold text-zinc-700 uppercase tracking-wider text-[8px]">Pillars:</span>
            {data.totalRevenue.breakdown.map((item, idx) => (
              <span key={item.label} className="flex items-center gap-1">
                <span className="text-zinc-500">{item.label} :</span>
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
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
            style={{ animationDelay: '0.2s' }}
            onClick={() => onOpenMetricDrawer?.('Occupancy', data.occupancy.value, horizon)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.occupancy.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  OCCUPANCY
                </span>
              </InfoTooltip>
              <span
                className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  data.occupancy.upLy
                    ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                    : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                }`}
              >
                {data.occupancy.vsLy}
              </span>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.occupancy.value}
            </div>
            {/* Comparison Badges: vs Budget, vs Forecast */}
            <div className="flex items-center gap-1 flex-nowrap">
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.occupancy.vsBudget}
              </span>
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.occupancy.vsForecast}
              </span>
            </div>
          </div>

          {/* Card 3: ADR */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
            style={{ animationDelay: '0.25s' }}
            onClick={() => onOpenMetricDrawer?.('ADR', data.adr.value, horizon)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.adr.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  ADR
                </span>
              </InfoTooltip>
              <span
                className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  data.adr.upLy
                    ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                    : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                }`}
              >
                {data.adr.vsLy}
              </span>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.adr.value}
            </div>
            {/* Comparison Badges: vs Budget, vs Forecast */}
            <div className="flex items-center gap-1 flex-nowrap">
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.adr.vsBudget}
              </span>
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.adr.vsForecast}
              </span>
            </div>
          </div>

          {/* Card 4: REVPAR */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
            style={{ animationDelay: '0.3s' }}
            onClick={() => onOpenMetricDrawer?.('RevPAR', data.revPar.value, horizon)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.revPar.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  REVPAR
                </span>
              </InfoTooltip>
              <span
                className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  data.revPar.upLy
                    ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                    : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                }`}
              >
                {data.revPar.vsLy}
              </span>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.revPar.value}
            </div>
            {/* Comparison Badges: vs Budget, vs Forecast */}
            <div className="flex items-center gap-1 flex-nowrap">
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.revPar.vsBudget}
              </span>
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.revPar.vsForecast}
              </span>
            </div>
          </div>

          {/* Card 5: ROOM REVENUE */}
          <div
            className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
            style={{ animationDelay: '0.35s' }}
            onClick={() => onOpenMetricDrawer?.('Room Revenue', data.roomRevenue.value, horizon)}
          >
            <div className="flex items-center justify-between gap-1">
              <InfoTooltip text={data.roomRevenue.tooltip}>
                <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  ROOM REVENUE
                </span>
              </InfoTooltip>
              <span
                className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  data.roomRevenue.upLy
                    ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                    : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                }`}
              >
                {data.roomRevenue.vsLy}
              </span>
            </div>
            <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
              {data.roomRevenue.value}
            </div>
            {/* Comparison Badges: vs Budget, vs Forecast (Standardized: Amount followed by %) */}
            <div className="flex items-center gap-1 flex-nowrap">
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.roomRevenue.vsBudget}
              </span>
              <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                {data.roomRevenue.vsForecast}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
