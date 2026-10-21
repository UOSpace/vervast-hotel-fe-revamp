import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

function getTooltipText(label: string) {
  const l = label.toUpperCase();
  if (l.includes('OCCUPANCY')) return "Percentage of occupied rooms relative to total available rooms.";
  if (l.includes('REVENUE')) return "Total generated revenue from rooms, food and beverage, and other departments today.";
  if (l.includes('REVPAR')) return "Revenue Per Available Room, calculated as Occupancy rate multiplied by Average Daily Rate.";
  if (l.includes('ADR')) return "Average Daily Rate, representing the average rental income per occupied room today.";
  if (l.includes('NIGHTS')) return "Total number of room nights booked during the selected period.";
  if (l.includes('STAY') || l.includes('LOS')) return "The average number of nights guests stay at the property.";
  return "Key performance indicator metrics.";
}

import { resolvePropertyId } from '@/constants/categories';
import {
  getPropertyMetrics,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  fmtSignedPct,
  fmtSignedPts,
  type PeriodId,
} from '@/data/portfolio';
import { getPropertyGuestActivity, getPropertyLosNights } from '@/data/portfolio/hospitalitySubMix';

export function PropertyKPIWidget({ 
  propertyId = 'sosei-geneva',
  propertyName,
  period = 'mtd',
}: { 
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const { openDrawer } = useDashboardDrawer();

  const canonicalId = resolvePropertyId(propertyId);
  const m = getPropertyMetrics(canonicalId, period);
  const activity = getPropertyGuestActivity(canonicalId);
  const losNights = getPropertyLosNights(canonicalId);

  const data = {
    name: m.name,
    location: m.location,
    category: m.categoryName,
    occ: m.occupancyPct.toFixed(1),
    rev: fmtUsd(m.totalRevenue),
    roomRev: fmtUsd(m.roomRevenue),
    revpar: fmtUsdFull(m.revpar),
    adr: fmtUsdFull(m.adr),
    los: losNights.toFixed(1),
    arrivals: activity.arrivals,
    deps: activity.departures,
    inhouse: activity.inHouse,
    vip: activity.vip,
    occVsLy: `${fmtSignedPts(m.vsLy.occupancyPts)} vs LY`,
    occVsBudget: `${fmtSignedPts(m.vsBudget.occupancyPts)} vs Budget`,
    occVsForecast: `${fmtSignedPts(m.vsForecast.occupancyPts)} vs Forecast`,
    revVsLy: `${fmtSignedPct(m.vsLy.totalRevenuePct)} vs LY`,
    revVsBudget: `${fmtSignedPct(m.vsBudget.totalRevenuePct)} vs Budget`,
    revVsForecast: `${fmtSignedPct(m.vsForecast.totalRevenuePct)} vs Forecast`,
    revparVsLy: `${fmtSignedPct(m.vsLy.revparPct)} vs LY`,
    revparVsBudget: `${fmtSignedPct(m.vsBudget.revparPct)} vs Budget`,
    revparVsForecast: `${fmtSignedPct(m.vsForecast.revparPct)} vs Forecast`,
    adrVsLy: `${fmtSignedPct(m.vsLy.adrPct)} vs LY`,
    adrVsBudget: `${fmtSignedPct(m.vsBudget.adrPct)} vs Budget`,
    adrVsForecast: `${fmtSignedPct(m.vsForecast.adrPct)} vs Forecast`,
    losVsLy: '+0.2N vs LY',
    losVsBudget: '+0.1N vs Budget',
    losVsForecast: '+0.1N vs Forecast',
  };

  const activePropName = propertyName || data.name;

  // Compact badge text derived from real data (e.g. '+1.1 pts vs Forecast' -> '+1.1 pts Fcst')
  const shortBadge = (s: string) => s.replace(' vs Budget', ' Bud').replace(' vs Forecast', ' Fcst');

  // Standardized triple comparisons (vs LY, vs Budget, vs Forecast) matching Corporate and Regional levels
  const kpis = [
    { 
      label: 'Occupancy', 
      value: fmtPct(m.occupancyPct, 1), 
      vsLy: data.occVsLy,
      vsBudget: data.occVsBudget,
      vsBudgetShort: shortBadge(data.occVsBudget),
      vsForecast: data.occVsForecast,
      vsForecastShort: shortBadge(data.occVsForecast),
      upLy: m.vsLy.occupancyPts >= 0,
      change: data.occVsLy,
    },
    { 
      label: 'Total Revenue', 
      value: data.rev, 
      vsLy: data.revVsLy,
      vsBudget: data.revVsBudget,
      vsBudgetShort: shortBadge(data.revVsBudget),
      vsForecast: data.revVsForecast,
      vsForecastShort: shortBadge(data.revVsForecast),
      upLy: m.vsLy.totalRevenuePct >= 0,
      change: data.revVsLy,
    },
    { 
      label: 'RevPAR', 
      value: data.revpar, 
      vsLy: data.revparVsLy,
      vsBudget: data.revparVsBudget,
      vsBudgetShort: shortBadge(data.revparVsBudget),
      vsForecast: data.revparVsForecast,
      vsForecastShort: shortBadge(data.revparVsForecast),
      upLy: m.vsLy.revparPct >= 0,
      change: data.revparVsLy,
    },
    { 
      label: 'ADR', 
      value: data.adr, 
      vsLy: data.adrVsLy,
      vsBudget: data.adrVsBudget,
      vsBudgetShort: shortBadge(data.adrVsBudget),
      vsForecast: data.adrVsForecast,
      vsForecastShort: shortBadge(data.adrVsForecast),
      upLy: m.vsLy.adrPct >= 0,
      change: data.adrVsLy,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
      {/* Today's Activity / Operational Summary (3 cols) */}
      <div 
        className="col-span-12 lg:col-span-3 rounded-[12px] p-3.5 sm:p-4 flex flex-col justify-between transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
        onClick={() => openDrawer({ 
          type: 'PROPERTY_ACTIVITY', 
          title: `Today's Activity — ${activePropName}`, 
          data: {
            propertyId: canonicalId,
            propertyName: activePropName,
            period,
            location: data.location,
            category: data.category,
            arrivals: data.arrivals,
            deps: data.deps,
            inhouse: data.inhouse,
            vip: data.vip,
          }
        })}
      >
        <div className="flex justify-between items-center mb-3 h-4">
          <InfoTooltip text="Real-time summary of today's operational guest counts.">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
              Today's Activity
            </h3>
          </InfoTooltip>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'PROPERTY_ACTIVITY',
                title: `Today's Activity — ${activePropName}`,
                data: {
                  propertyId: canonicalId,
                  propertyName: activePropName,
                  period,
                  location: data.location,
                  category: data.category,
                  arrivals: data.arrivals,
                  deps: data.deps,
                  inhouse: data.inhouse,
                  vip: data.vip,
                },
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 text-xs text-zinc-900 flex-1 justify-between py-0.5">
          <div className="flex justify-between items-baseline pb-1.5 border-b border-zinc-100">
            <span className="text-zinc-500 text-[10px] font-medium">Arrivals</span>
            <span className="text-xs font-bold text-zinc-900">{data.arrivals}</span>
          </div>
          <div className="flex justify-between items-baseline pb-1.5 border-b border-zinc-100">
            <span className="text-zinc-500 text-[10px] font-medium">Departures</span>
            <span className="text-xs font-bold text-zinc-900">{data.deps}</span>
          </div>
          <div className="flex justify-between items-baseline pb-1.5 border-b border-zinc-100">
            <span className="text-zinc-500 text-[10px] font-medium">In-House Guests</span>
            <span className="text-xs font-bold text-zinc-900">{data.inhouse}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-zinc-500 text-[10px] font-medium">VIP Guests</span>
            <span className="text-xs font-bold text-zinc-900">{data.vip}</span>
          </div>
        </div>
      </div>

      {/* 4 Financial & Performance KPI Cards (9 cols, 4 equal sub-columns) */}
      <div className="col-span-12 lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative rounded-[12px] p-3 sm:p-3.5 flex flex-col justify-between transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
            style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            onClick={() => openDrawer({ 
              type: 'METRIC', 
              title: `${kpi.label} — ${activePropName}`, 
              data: {
                label: kpi.label,
                value: kpi.value,
                change: kpi.change,
                propertyName: activePropName,
                propertyId: canonicalId,
                period,
                occ: data.occ,
                rev: data.rev,
                roomRev: data.roomRev,
                revpar: data.revpar,
                adr: data.adr,
                los: data.los,
              }
            })}
          >
            <div className="flex flex-col justify-between h-full py-0.5">
              <div className="flex items-center justify-between gap-1 mb-1">
                <InfoTooltip text={getTooltipText(kpi.label)}>
                  <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                    {kpi.label}
                  </span>
                </InfoTooltip>
                <span
                  className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                    kpi.upLy
                      ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                      : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
                  }`}
                >
                  {kpi.vsLy}
                </span>
              </div>
              <div className="text-[20px] sm:text-[22px] font-normal text-zinc-900 leading-tight my-1 sm:my-1.5">
                {kpi.value}
              </div>
              {/* Comparison Badges: vs Budget, vs Forecast (Strictly 1 horizontal line) */}
              <div className="grid grid-cols-2 gap-1 w-full">
                <span 
                  title={kpi.vsBudget}
                  className="inline-flex items-center justify-center min-w-0 text-[8px] 2xl:text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap"
                >
                  <span className="truncate">{kpi.vsBudget}</span>
                </span>
                <span 
                  title={kpi.vsForecast}
                  className="inline-flex items-center justify-center min-w-0 text-[8px] 2xl:text-[8.5px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap"
                >
                  <span className="truncate">{kpi.vsForecast}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


