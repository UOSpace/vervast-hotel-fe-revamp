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

export function PropertyKPIWidget({ 
  propertyId = 'sosei-barcelona',
  propertyName,
}: { 
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();
  
  // Real PMS-aligned metrics synchronized with Dashboard All (MTD & YTD portfolioPerformance)
  const kpiDataMap: Record<string, any> = {
    // ── SOSEI Urban (Barcelona, Tokyo) ──────────────────────────────────
    'sosei-barcelona': {
      name: 'SOSEI Barcelona', location: 'Barcelona, Spain', category: 'SOSEI Urban',
      occ: '68', rev: '$1,750,000', revpar: '$1,732', adr: '$2,540', los: '3.4',
      arrivals: 22, deps: 18, inhouse: 132, vip: 16,
      occVsLy: '+5.1 pts vs LY', occVsBudget: '+2.4 pts vs Budget', occVsForecast: '+1.4 pts vs Forecast',
      revVsLy: '+14.5% vs LY', revVsBudget: '+4.8% vs Budget', revVsForecast: '+2.1% vs Forecast',
      revparVsLy: '+14.6% vs LY', revparVsBudget: '+4.6% vs Budget', revparVsForecast: '+2.0% vs Forecast',
      adrVsLy: '+7.8% vs LY', adrVsBudget: '+3.2% vs Budget', adrVsForecast: '+1.4% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-tokyo': {
      name: 'SOSEI Tokyo', location: 'Tokyo, Japan', category: 'SOSEI Urban',
      occ: '71', rev: '$1,280,000', revpar: '$1,742', adr: '$2,450', los: '3.2',
      arrivals: 18, deps: 15, inhouse: 118, vip: 14,
      occVsLy: '+4.9 pts vs LY', occVsBudget: '+2.2 pts vs Budget', occVsForecast: '+1.3 pts vs Forecast',
      revVsLy: '+14.2% vs LY', revVsBudget: '+4.6% vs Budget', revVsForecast: '+2.0% vs Forecast',
      revparVsLy: '+14.4% vs LY', revparVsBudget: '+4.4% vs Budget', revparVsForecast: '+1.9% vs Forecast',
      adrVsLy: '+7.5% vs LY', adrVsBudget: '+3.0% vs Budget', adrVsForecast: '+1.3% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },

    // ── SOSEI Beach Resort (Bali, Maldives) ─────────────────────────────
    'sosei-bali': {
      name: 'SOSEI Bali', location: 'Uluwatu, Bali, Indonesia', category: 'SOSEI Beach Resort',
      occ: '71', rev: '$1,220,000', revpar: '$1,520', adr: '$2,150', los: '5.2',
      arrivals: 15, deps: 12, inhouse: 104, vip: 12,
      occVsLy: '+4.5 pts vs LY', occVsBudget: '+2.1 pts vs Budget', occVsForecast: '+1.2 pts vs Forecast',
      revVsLy: '+13.8% vs LY', revVsBudget: '+4.4% vs Budget', revVsForecast: '+1.9% vs Forecast',
      revparVsLy: '+14.0% vs LY', revparVsBudget: '+4.2% vs Budget', revparVsForecast: '+1.8% vs Forecast',
      adrVsLy: '+7.2% vs LY', adrVsBudget: '+2.9% vs Budget', adrVsForecast: '+1.3% vs Forecast',
      losVsLy: '+0.3N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-maldives': {
      name: 'SOSEI Maldives', location: 'North Malé Atoll, Maldives', category: 'SOSEI Beach Resort',
      occ: '77', rev: '$1,380,000', revpar: '$1,861', adr: '$2,420', los: '6.4',
      arrivals: 14, deps: 10, inhouse: 98, vip: 16,
      occVsLy: '+5.6 pts vs LY', occVsBudget: '+2.6 pts vs Budget', occVsForecast: '+1.5 pts vs Forecast',
      revVsLy: '+15.8% vs LY', revVsBudget: '+5.2% vs Budget', revVsForecast: '+2.3% vs Forecast',
      revparVsLy: '+16.0% vs LY', revparVsBudget: '+4.9% vs Budget', revparVsForecast: '+2.2% vs Forecast',
      adrVsLy: '+8.6% vs LY', adrVsBudget: '+3.7% vs Budget', adrVsForecast: '+1.7% vs Forecast',
      losVsLy: '+0.4N vs LY', losVsBudget: '+0.2N vs Budget', losVsForecast: '+0.2N vs Forecast',
    },

    // ── SOSEI Ski (Switzerland, Canada) ─────────────────────────────────
    'sosei-switzerland': {
      name: 'SOSEI Switzerland', location: 'Zermatt, Switzerland', category: 'SOSEI Ski',
      occ: '79', rev: '$2,180,000', revpar: '$2,185', adr: '$2,780', los: '4.8',
      arrivals: 18, deps: 14, inhouse: 125, vip: 18,
      occVsLy: '+5.4 pts vs LY', occVsBudget: '+2.5 pts vs Budget', occVsForecast: '+1.4 pts vs Forecast',
      revVsLy: '+16.2% vs LY', revVsBudget: '+5.4% vs Budget', revVsForecast: '+2.4% vs Forecast',
      revparVsLy: '+16.4% vs LY', revparVsBudget: '+5.1% vs Budget', revparVsForecast: '+2.3% vs Forecast',
      adrVsLy: '+8.9% vs LY', adrVsBudget: '+3.9% vs Budget', adrVsForecast: '+1.8% vs Forecast',
      losVsLy: '+0.3N vs LY', losVsBudget: '+0.2N vs Budget', losVsForecast: '+0.2N vs Forecast',
    },
    'sosei-canada': {
      name: 'SOSEI Canada', location: 'Whistler, Canada', category: 'SOSEI Ski',
      occ: '73', rev: '$2,020,000', revpar: '$1,921', adr: '$2,620', los: '4.5',
      arrivals: 12, deps: 9, inhouse: 92, vip: 12,
      occVsLy: '+4.6 pts vs LY', occVsBudget: '+2.0 pts vs Budget', occVsForecast: '+1.1 pts vs Forecast',
      revVsLy: '+14.4% vs LY', revVsBudget: '+4.5% vs Budget', revVsForecast: '+2.0% vs Forecast',
      revparVsLy: '+14.6% vs LY', revparVsBudget: '+4.3% vs Budget', revparVsForecast: '+1.9% vs Forecast',
      adrVsLy: '+7.8% vs LY', adrVsBudget: '+3.2% vs Budget', adrVsForecast: '+1.5% vs Forecast',
      losVsLy: '+0.3N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },

    // ── SOSEI Nature (Costa Rica, Japan) ────────────────────────────────
    'sosei-costa-rica': {
      name: 'SOSEI Costa Rica', location: 'Papagayo, Costa Rica', category: 'SOSEI Nature',
      occ: '73', rev: '$1,550,000', revpar: '$1,421', adr: '$1,950', los: '4.6',
      arrivals: 12, deps: 10, inhouse: 88, vip: 10,
      occVsLy: '+4.4 pts vs LY', occVsBudget: '+1.9 pts vs Budget', occVsForecast: '+1.0 pts vs Forecast',
      revVsLy: '+13.2% vs LY', revVsBudget: '+4.1% vs Budget', revVsForecast: '+1.8% vs Forecast',
      revparVsLy: '+13.4% vs LY', revparVsBudget: '+3.9% vs Budget', revparVsForecast: '+1.7% vs Forecast',
      adrVsLy: '+7.1% vs LY', adrVsBudget: '+2.9% vs Budget', adrVsForecast: '+1.3% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-japan': {
      name: 'SOSEI Japan', location: 'Kyoto, Japan', category: 'SOSEI Nature',
      occ: '69', rev: '$1,250,000', revpar: '$1,234', adr: '$1,780', los: '3.8',
      arrivals: 11, deps: 9, inhouse: 85, vip: 9,
      occVsLy: '+4.0 pts vs LY', occVsBudget: '+1.7 pts vs Budget', occVsForecast: '+0.9 pts vs Forecast',
      revVsLy: '+12.1% vs LY', revVsBudget: '+3.8% vs Budget', revVsForecast: '+1.6% vs Forecast',
      revparVsLy: '+12.3% vs LY', revparVsBudget: '+3.6% vs Budget', revparVsForecast: '+1.5% vs Forecast',
      adrVsLy: '+6.6% vs LY', adrVsBudget: '+2.7% vs Budget', adrVsForecast: '+1.2% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },

    // ── SOSEI Wellness (Oman, Egypt) ────────────────────────────────────
    'sosei-oman': {
      name: 'SOSEI Oman', location: 'Jebel Akhdar, Oman', category: 'SOSEI Wellness',
      occ: '66', rev: '$1,420,000', revpar: '$1,225', adr: '$1,860', los: '4.4',
      arrivals: 10, deps: 8, inhouse: 94, vip: 10,
      occVsLy: '+3.9 pts vs LY', occVsBudget: '+1.6 pts vs Budget', occVsForecast: '+0.9 pts vs Forecast',
      revVsLy: '+11.8% vs LY', revVsBudget: '+3.7% vs Budget', revVsForecast: '+1.6% vs Forecast',
      revparVsLy: '+12.0% vs LY', revparVsBudget: '+3.5% vs Budget', revparVsForecast: '+1.5% vs Forecast',
      adrVsLy: '+6.5% vs LY', adrVsBudget: '+2.6% vs Budget', adrVsForecast: '+1.2% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-egypt': {
      name: 'SOSEI Egypt', location: 'Siwa Oasis, Egypt', category: 'SOSEI Wellness',
      occ: '59', rev: '$1,180,000', revpar: '$1,022', adr: '$1,740', los: '3.6',
      arrivals: 8, deps: 6, inhouse: 74, vip: 7,
      occVsLy: '+3.1 pts vs LY', occVsBudget: '+1.2 pts vs Budget', occVsForecast: '+0.6 pts vs Forecast',
      revVsLy: '+10.2% vs LY', revVsBudget: '+3.1% vs Budget', revVsForecast: '+1.3% vs Forecast',
      revparVsLy: '+10.4% vs LY', revparVsBudget: '+2.9% vs Budget', revparVsForecast: '+1.2% vs Forecast',
      adrVsLy: '+5.8% vs LY', adrVsBudget: '+2.1% vs Budget', adrVsForecast: '+0.9% vs Forecast',
      losVsLy: '+0.1N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
  };

  const canonicalId = resolvePropertyId(propertyId);
  const data = kpiDataMap[propertyId] ?? kpiDataMap[canonicalId] ?? kpiDataMap['sosei-barcelona'];
  const activePropName = propertyName || data.name;

  // Compact badge text derived from real data (e.g. '+1.1 pts vs Forecast' -> '+1.1 pts Fcst')
  const shortBadge = (s: string) => s.replace(' vs Budget', ' Bud').replace(' vs Forecast', ' Fcst');

  // Standardized triple comparisons (vs LY, vs Budget, vs Forecast) matching Corporate and Regional levels
  const kpis = [
    { 
      label: 'Occupancy', 
      value: `${data.occ}%`, 
      vsLy: data.occVsLy || '+4.8 pts vs LY',
      vsBudget: data.occVsBudget || '+2.1 pts vs Budget',
      vsBudgetShort: '+2.1 pts vs Bud',
      vsForecast: data.occVsForecast || '+1.2 pts vs Forecast',
      vsForecastShort: '+1.2 pts vs Fcst',
      upLy: !data.occVsLy?.includes('-'),
      change: data.occVsLy || '+4.8 pts vs LY',
    },
    { 
      label: 'Room Revenue', 
      value: data.rev, 
      vsLy: data.revVsLy || '+14.0% vs LY',
      vsBudget: data.revVsBudget || '+4.8% vs Budget',
      vsBudgetShort: '+4.8% vs Bud',
      vsForecast: data.revVsForecast || '+2.1% vs Forecast',
      vsForecastShort: '+2.1% vs Fcst',
      upLy: !data.revVsLy?.includes('-'),
      change: data.revVsLy || '+14.0% vs LY',
    },
    { 
      label: 'RevPAR', 
      value: data.revpar, 
      vsLy: data.revparVsLy || '+14.2% vs LY',
      vsBudget: data.revparVsBudget || '+4.5% vs Budget',
      vsBudgetShort: '+4.5% vs Bud',
      vsForecast: data.revparVsForecast || '+2.0% vs Forecast',
      vsForecastShort: '+2.0% vs Fcst',
      upLy: !data.revparVsLy?.includes('-'),
      change: data.revparVsLy || '+14.2% vs LY',
    },
    { 
      label: 'ADR', 
      value: data.adr, 
      vsLy: data.adrVsLy || '+8.0% vs LY',
      vsBudget: data.adrVsBudget || '+3.4% vs Budget',
      vsBudgetShort: '+3.4% vs Bud',
      vsForecast: data.adrVsForecast || '+1.5% vs Forecast',
      vsForecastShort: '+1.5% vs Fcst',
      upLy: !data.adrVsLy?.includes('-'),
      change: data.adrVsLy || '+8.0% vs LY',
    },
    { 
      label: 'Av. Length of Stay', 
      value: `${data.los} Nights`, 
      vsLy: data.losVsLy || '+0.3N vs LY',
      vsBudget: data.losVsBudget || '+0.1N vs Budget',
      vsBudgetShort: '+0.1N vs Bud',
      vsForecast: data.losVsForecast || '+0.2N vs Forecast',
      vsForecastShort: '+0.2N vs Fcst',
      upLy: true,
      change: data.losVsLy || '+0.3N vs LY',
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-4 items-stretch">
      {/* Today's Activity / Operational Summary (3 cols) */}
      <div 
        className="col-span-12 lg:col-span-3 rounded-[12px] p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
        onClick={() => openDrawer({ 
          type: 'PROPERTY_ACTIVITY', 
          title: `Today's Activity — ${activePropName}`, 
          data: {
            propertyId,
            propertyName: activePropName,
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

      {/* Occupancy KPI Card (2 cols) — Aligns with Today's Activity to total 5 cols */}
      <div 
        className="col-span-12 lg:col-span-2 relative rounded-[12px] p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
        style={{ animationDelay: '0.1s' }}
        onClick={() => openDrawer({ 
          type: 'METRIC', 
          title: `${kpis[0].label} — ${activePropName}`, 
          data: {
            label: kpis[0].label,
            value: kpis[0].value,
            change: kpis[0].change,
            propertyName: activePropName,
            propertyId,
            occ: data.occ,
            rev: data.rev,
            revpar: data.revpar,
            adr: data.adr,
            los: data.los,
          }
        })}
      >
        <div className="flex flex-col justify-between h-full py-0.5">
          <div className="flex items-center justify-between gap-1 mb-1">
            <InfoTooltip text={getTooltipText(kpis[0].label)}>
              <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate cursor-help">
                {kpis[0].label}
              </span>
            </InfoTooltip>
            <span
              className={`inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                kpis[0].upLy
                  ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
                  : 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80'
              }`}
            >
              {kpis[0].vsLy}
            </span>
          </div>
          <div className="text-[20px] sm:text-[22px] font-normal text-zinc-900 leading-tight my-1 sm:my-1.5">
            {kpis[0].value}
          </div>
          {/* Comparison Badges: vs Budget, vs Forecast (Strictly 1 horizontal line) */}
          <div className="grid grid-cols-2 gap-1 w-full">
            <span 
              title={kpis[0].vsBudget}
              className="inline-flex items-center justify-center min-w-0 text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap"
            >
              <span className="hidden 2xl:inline truncate">{kpis[0].vsBudget}</span>
              <span className="2xl:hidden truncate">{shortBadge(kpis[0].vsBudget)}</span>
            </span>
            <span 
              title={kpis[0].vsForecast}
              className="inline-flex items-center justify-center min-w-0 text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap"
            >
              <span className="hidden 2xl:inline truncate">{kpis[0].vsForecast}</span>
              <span className="2xl:hidden truncate">{shortBadge(kpis[0].vsForecast)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Remaining 4 Financial & Performance KPI Cards (7 cols, 4 sub-columns) */}
      <div className="col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {kpis.slice(1).map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative rounded-[12px] p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
            style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
            onClick={() => openDrawer({ 
              type: 'METRIC', 
              title: `${kpi.label} — ${activePropName}`, 
              data: {
                label: kpi.label,
                value: kpi.value,
                change: kpi.change,
                propertyName: activePropName,
                propertyId,
                occ: data.occ,
                rev: data.rev,
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
                  className="inline-flex items-center justify-center min-w-0 text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap"
                >
                  <span className="hidden 2xl:inline truncate">{kpi.vsBudget}</span>
                  <span className="2xl:hidden truncate">{shortBadge(kpi.vsBudget)}</span>
                </span>
                <span 
                  title={kpi.vsForecast}
                  className="inline-flex items-center justify-center min-w-0 text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap"
                >
                  <span className="hidden 2xl:inline truncate">{kpi.vsForecast}</span>
                  <span className="2xl:hidden truncate">{shortBadge(kpi.vsForecast)}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


