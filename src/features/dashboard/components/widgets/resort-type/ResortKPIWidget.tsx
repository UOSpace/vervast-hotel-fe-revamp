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
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 items-stretch w-full">
      {/* CARD 1 (Hero): TOTAL HOTEL REVENUE (Hospitality 5 Pillars per category) */}
      <div
        className="col-span-2 relative rounded-[12px] p-3 flex flex-col justify-between gap-2.5 animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all group"
        style={{ animationDelay: '0.15s' }}
        onClick={() =>
          openDrawer({
            type: 'REVENUE_DEMAND_MIX',
            title: 'Revenue & Demand Mix',
            data: data.totalRevenue.value,
          })
        }
      >
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <InfoTooltip text="Total Hotel Business revenue across all 5 hospitality pillars (Rooms, F&B, Spa, Wellness, Activities) for the active category.">
              <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-900 truncate cursor-help">
                TOTAL HOTEL REVENUE
              </span>
            </InfoTooltip>
            <span className="text-[8.5px] font-semibold px-1.5 py-0.2 rounded-full bg-zinc-200/70 text-zinc-700 shrink-0">
              Hospitality
            </span>
          </div>
          <span
            className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${data.totalRevenue.upLy
              ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
              }`}
          >
            {data.totalRevenue.vsLy}
          </span>
        </div>

        <div>
          <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
            {data.totalRevenue.value}
          </div>
          {/* Comparison Badges: vs Budget, vs Forecast */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.totalRevenue.vsBudget}
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.totalRevenue.vsForecast}
            </span>
          </div>
        </div>

        {/* 5-Pillar breakdown as a horizontal row */}
        <div
          className="grid gap-2 pt-2 border-t border-zinc-200/60"
          style={{ gridTemplateColumns: `repeat(${data.totalRevenue.breakdown.length}, minmax(0, 1fr))` }}
        >
          {data.totalRevenue.breakdown.map((item) => (
            <div key={item.label} className="min-w-0">
              <div className="text-[9px] text-zinc-500 truncate">{item.label}</div>
              <div className="text-[12px] font-medium text-zinc-900 leading-tight">{item.val}</div>
              <div className="text-[8.5px] text-zinc-400">{item.pct}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Room Metrics — share the same row as the hero card */}
      <div className="contents">
        {/* Card 2: OCCUPANCY */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all group"
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
          <div className="flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.occupancy.vsBudget}
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.occupancy.vsForecast}
            </span>
          </div>
        </div>

        {/* Card 3: ADR */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all group"
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
          <div className="flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.adr.vsBudget}
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.adr.vsForecast}
            </span>
          </div>
        </div>

        {/* Card 4: REVPAR */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all group"
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
          <div className="flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.revPar.vsBudget}
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.revPar.vsForecast}
            </span>
          </div>
        </div>

        {/* Card 5: ROOM REVENUE */}
        <div
          className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter backdrop-blur-sm cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all group"
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
          <div className="flex items-center gap-1 flex-wrap">
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.roomRevenue.vsBudget}
            </span>
            <span className="inline-flex items-center text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
              {data.roomRevenue.vsForecast}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
