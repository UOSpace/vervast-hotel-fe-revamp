import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export interface CategoryKpiData {
  categoryName?: string;
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

interface ResortKPIWidgetProps {
  data: CategoryKpiData;
}

export function ResortKPIWidget({ data }: ResortKPIWidgetProps) {
  const { openDrawer } = useDashboardDrawer();

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* ROW 1 (Hero Top): TOTAL REVENUE (HOSPITALITY) */}
      <div
        className="w-full relative rounded-[12px] p-3.5 sm:p-4 flex flex-col justify-between gap-2.5 animate-card-enter cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
        style={{ animationDelay: '0.15s' }}
        onClick={() =>
          openDrawer({
            type: 'REVENUE_DEMAND_MIX',
            title: 'Revenue & Demand Mix',
            data: data.totalRevenue.value,
          })
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 min-w-0">
              <InfoTooltip text="Total Hospitality revenue across all 5 hospitality pillars (Rooms, F&B, Spa, Wellness, Activities) for the active category.">
                <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-900 truncate cursor-help">
                  TOTAL REVENUE (HOSPITALITY)
                </span>
              </InfoTooltip>
            </div>
            <div className="text-[22px] font-normal text-zinc-900 leading-tight mt-1">
              {data.totalRevenue.value}
            </div>
          </div>

          {/* Comparison Badges: vs LY, vs Budget, vs Forecast */}
          <div className="flex items-center gap-1.5 flex-wrap sm:justify-end">
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                data.totalRevenue.upLy
                  ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                  : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
              }`}
            >
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
        <div className="mt-1 pt-1.5 border-t border-zinc-200/60 flex items-center justify-between text-[9px] text-zinc-500 flex-wrap gap-x-2.5 gap-y-1">
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

      {/* ROW 2: 4 Room Metrics below Total Revenue (Hospitality) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 items-stretch w-full">
        {/* Card 2: OCCUPANCY */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
          style={{ animationDelay: '0.2s' }}
          onClick={() =>
            openDrawer({
              type: 'METRIC',
              title: 'Occupancy Rate',
              data: data.occupancy.value,
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text={data.occupancy.tooltip}>
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                OCCUPANCY
              </span>
            </InfoTooltip>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${data.occupancy.upLy
                ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                : 'bg-rose-50 text-rose-700 border border-rose-200/80'
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
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
          style={{ animationDelay: '0.25s' }}
          onClick={() =>
            openDrawer({
              type: 'METRIC',
              title: 'Average Daily Rate (ADR)',
              data: data.adr.value,
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text={data.adr.tooltip}>
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                ADR (USD)
              </span>
            </InfoTooltip>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${data.adr.upLy
                ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                : 'bg-rose-50 text-rose-700 border border-rose-200/80'
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
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
          style={{ animationDelay: '0.3s' }}
          onClick={() =>
            openDrawer({
              type: 'METRIC',
              title: 'Revenue Per Available Room (RevPAR)',
              data: data.revPar.value,
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text={data.revPar.tooltip}>
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                REVPAR (USD)
              </span>
            </InfoTooltip>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${data.revPar.upLy
                ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                : 'bg-rose-50 text-rose-700 border border-rose-200/80'
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
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
          style={{ animationDelay: '0.35s' }}
          onClick={() =>
            openDrawer({
              type: 'METRIC',
              title: 'Room Revenue',
              data: data.roomRevenue.value,
            })
          }
        >
          <div className="flex items-center justify-between gap-1">
            <InfoTooltip text={data.roomRevenue.tooltip}>
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                ROOM REVENUE (USD)
              </span>
            </InfoTooltip>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${data.roomRevenue.upLy
                ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                }`}
            >
              {data.roomRevenue.vsLy}
            </span>
          </div>
          <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
            {data.roomRevenue.value}
          </div>
          {/* Comparison Badges: vs Budget, vs Forecast */}
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
  );
}
