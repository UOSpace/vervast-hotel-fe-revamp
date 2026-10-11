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

export function PropertyKPIWidget({ 
  propertyId = 'sosei-nocturne',
  propertyName,
}: { 
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();
  
  // Real PMS-aligned metrics synchronized with Dashboard All (MTD & YTD portfolioPerformance)
  const kpiDataMap: Record<string, any> = {
    // ── Europe (Sky & Nature) ─────────────────────────────────────────
    'sosei-nocturne': {
      name: 'SOSEI Nocturne', location: 'Zermatt, Switzerland', category: 'Sosei Sky',
      occ: '76', rev: '$1,150,000', revpar: '$2,052', adr: '$2,700', los: '4.2',
      arrivals: 24, deps: 18, inhouse: 144, vip: 14,
      occVsLy: '+4.8 pts vs LY', occVsBudget: '+2.1 pts vs Budget', occVsForecast: '+1.2 pts vs Forecast',
      revVsLy: '+14.0% vs LY', revVsBudget: '+4.8% vs Budget', revVsForecast: '+2.1% vs Forecast',
      revparVsLy: '+14.2% vs LY', revparVsBudget: '+4.5% vs Budget', revparVsForecast: '+2.0% vs Forecast',
      adrVsLy: '+8.0% vs LY', adrVsBudget: '+3.4% vs Budget', adrVsForecast: '+1.5% vs Forecast',
      losVsLy: '+0.3N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.2N vs Forecast',
    },
    'sosei-aurora': {
      name: 'SOSEI Aurora', location: 'Rovaniemi, Finland', category: 'Sosei Sky',
      occ: '74', rev: '$950,000', revpar: '$1,961', adr: '$2,650', los: '4.6',
      arrivals: 18, deps: 14, inhouse: 112, vip: 10,
      occVsLy: '+4.2 pts vs LY', occVsBudget: '+1.8 pts vs Budget', occVsForecast: '+1.0 pts vs Forecast',
      revVsLy: '+13.5% vs LY', revVsBudget: '+4.2% vs Budget', revVsForecast: '+1.8% vs Forecast',
      revparVsLy: '+13.8% vs LY', revparVsBudget: '+4.0% vs Budget', revparVsForecast: '+1.7% vs Forecast',
      adrVsLy: '+7.6% vs LY', adrVsBudget: '+3.1% vs Budget', adrVsForecast: '+1.4% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-hearth': {
      name: 'SOSEI Hearth', location: 'Tuscany, Italy', category: 'Sosei Nature',
      occ: '66', rev: '$450,000', revpar: '$1,267', adr: '$1,920', los: '3.8',
      arrivals: 22, deps: 18, inhouse: 88, vip: 7,
      occVsLy: '+3.8 pts vs LY', occVsBudget: '+1.5 pts vs Budget', occVsForecast: '+0.8 pts vs Forecast',
      revVsLy: '+11.2% vs LY', revVsBudget: '+3.5% vs Budget', revVsForecast: '+1.5% vs Forecast',
      revparVsLy: '+11.5% vs LY', revparVsBudget: '+3.2% vs Budget', revparVsForecast: '+1.4% vs Forecast',
      adrVsLy: '+6.1% vs LY', adrVsBudget: '+2.4% vs Budget', adrVsForecast: '+1.1% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-pastoral': {
      name: 'SOSEI Pastoral', location: 'Provence, France', category: 'Sosei Nature',
      occ: '64', rev: '$400,000', revpar: '$1,203', adr: '$1,880', los: '3.6',
      arrivals: 20, deps: 16, inhouse: 76, vip: 6,
      occVsLy: '+3.5 pts vs LY', occVsBudget: '+1.4 pts vs Budget', occVsForecast: '+0.7 pts vs Forecast',
      revVsLy: '+10.8% vs LY', revVsBudget: '+3.2% vs Budget', revVsForecast: '+1.4% vs Forecast',
      revparVsLy: '+11.0% vs LY', revparVsBudget: '+3.0% vs Budget', revparVsForecast: '+1.3% vs Forecast',
      adrVsLy: '+5.9% vs LY', adrVsBudget: '+2.2% vs Budget', adrVsForecast: '+1.0% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    // ── Americas (Urban) ─────────────────────────────────────────────────
    'sosei-verper': {
      name: 'SOSEI Verper', location: 'New York, USA', category: 'SoSei Urban',
      occ: '73', rev: '$800,000', revpar: '$1,788', adr: '$2,450', los: '2.4',
      arrivals: 65, deps: 58, inhouse: 184, vip: 22,
      occVsLy: '+5.1 pts vs LY', occVsBudget: '+2.4 pts vs Budget', occVsForecast: '+1.4 pts vs Forecast',
      revVsLy: '+15.2% vs LY', revVsBudget: '+5.1% vs Budget', revVsForecast: '+2.3% vs Forecast',
      revparVsLy: '+15.4% vs LY', revparVsBudget: '+4.8% vs Budget', revparVsForecast: '+2.2% vs Forecast',
      adrVsLy: '+8.5% vs LY', adrVsBudget: '+3.8% vs Budget', adrVsForecast: '+1.7% vs Forecast',
      losVsLy: '+0.1N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-elan': {
      name: 'SOSEI Élan', location: 'Los Angeles, USA', category: 'SoSei Urban',
      occ: '71', rev: '$650,000', revpar: '$1,668', adr: '$2,350', los: '2.2',
      arrivals: 55, deps: 48, inhouse: 152, vip: 18,
      occVsLy: '+4.9 pts vs LY', occVsBudget: '+2.2 pts vs Budget', occVsForecast: '+1.3 pts vs Forecast',
      revVsLy: '+14.8% vs LY', revVsBudget: '+4.9% vs Budget', revVsForecast: '+2.2% vs Forecast',
      revparVsLy: '+15.0% vs LY', revparVsBudget: '+4.6% vs Budget', revparVsForecast: '+2.1% vs Forecast',
      adrVsLy: '+8.1% vs LY', adrVsBudget: '+3.6% vs Budget', adrVsForecast: '+1.6% vs Forecast',
      losVsLy: '+0.1N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    // ── Asia Pacific (Beach Resort & Nature / Wellness) ───────────────────
    'sosei-marea': {
      name: 'SOSEI Maréa', location: 'North Malé Atoll, Maldives', category: 'Sosei Beach Resort',
      occ: '82', rev: '$1,000,000', revpar: '$2,091', adr: '$2,550', los: '6.2',
      arrivals: 28, deps: 20, inhouse: 132, vip: 16,
      occVsLy: '+5.8 pts vs LY', occVsBudget: '+2.8 pts vs Budget', occVsForecast: '+1.6 pts vs Forecast',
      revVsLy: '+16.5% vs LY', revVsBudget: '+5.6% vs Budget', revVsForecast: '+2.5% vs Forecast',
      revparVsLy: '+16.8% vs LY', revparVsBudget: '+5.2% vs Budget', revparVsForecast: '+2.4% vs Forecast',
      adrVsLy: '+9.2% vs LY', adrVsBudget: '+4.1% vs Budget', adrVsForecast: '+1.9% vs Forecast',
      losVsLy: '+0.4N vs LY', losVsBudget: '+0.2N vs Budget', losVsForecast: '+0.2N vs Forecast',
    },
    'sosei-pelagia': {
      name: 'SOSEI Pelagia', location: 'Uluwatu, Indonesia', category: 'Sosei Beach Resort',
      occ: '80', rev: '$850,000', revpar: '$1,960', adr: '$2,450', los: '5.8',
      arrivals: 26, deps: 19, inhouse: 126, vip: 14,
      occVsLy: '+5.4 pts vs LY', occVsBudget: '+2.6 pts vs Budget', occVsForecast: '+1.5 pts vs Forecast',
      revVsLy: '+15.9% vs LY', revVsBudget: '+5.3% vs Budget', revVsForecast: '+2.4% vs Forecast',
      revparVsLy: '+16.1% vs LY', revparVsBudget: '+5.0% vs Budget', revparVsForecast: '+2.3% vs Forecast',
      adrVsLy: '+8.8% vs LY', adrVsBudget: '+3.9% vs Budget', adrVsForecast: '+1.8% vs Forecast',
      losVsLy: '+0.3N vs LY', losVsBudget: '+0.2N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-sylvan': {
      name: 'SOSEI Sylvan', location: 'Kyoto, Japan', category: 'Sosei Nature',
      occ: '70', rev: '$500,000', revpar: '$1,316', adr: '$1,880', los: '3.5',
      arrivals: 16, deps: 12, inhouse: 68, vip: 6,
      occVsLy: '+4.1 pts vs LY', occVsBudget: '+1.7 pts vs Budget', occVsForecast: '+0.9 pts vs Forecast',
      revVsLy: '+12.0% vs LY', revVsBudget: '+3.8% vs Budget', revVsForecast: '+1.6% vs Forecast',
      revparVsLy: '+12.3% vs LY', revparVsBudget: '+3.5% vs Budget', revparVsForecast: '+1.5% vs Forecast',
      adrVsLy: '+6.5% vs LY', adrVsBudget: '+2.7% vs Budget', adrVsForecast: '+1.2% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    'sosei-verdant': {
      name: 'SOSEI Verdant', location: 'Chiang Mai, Thailand', category: 'Sosei Wellness',
      occ: '68', rev: '$450,000', revpar: '$1,238', adr: '$1,820', los: '3.2',
      arrivals: 15, deps: 11, inhouse: 64, vip: 5,
      occVsLy: '+3.9 pts vs LY', occVsBudget: '+1.6 pts vs Budget', occVsForecast: '+0.8 pts vs Forecast',
      revVsLy: '+11.5% vs LY', revVsBudget: '+3.6% vs Budget', revVsForecast: '+1.5% vs Forecast',
      revparVsLy: '+11.8% vs LY', revparVsBudget: '+3.3% vs Budget', revparVsForecast: '+1.4% vs Forecast',
      adrVsLy: '+6.2% vs LY', adrVsBudget: '+2.5% vs Budget', adrVsForecast: '+1.1% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
    // ── Middle East & Africa (Wellness) ──────────────────────────────────
    'sosei-mirage': {
      name: 'SOSEI Mirage', location: 'Siwa Oasis, Egypt', category: 'Sosei Wellness',
      occ: '71', rev: '$380,000', revpar: '$1,505', adr: '$2,120', los: '4.8',
      arrivals: 14, deps: 10, inhouse: 72, vip: 8,
      occVsLy: '+4.3 pts vs LY', occVsBudget: '+1.9 pts vs Budget', occVsForecast: '+1.1 pts vs Forecast',
      revVsLy: '+12.4% vs LY', revVsBudget: '+4.0% vs Budget', revVsForecast: '+1.8% vs Forecast',
      revparVsLy: '+12.6% vs LY', revparVsBudget: '+3.7% vs Budget', revparVsForecast: '+1.7% vs Forecast',
      adrVsLy: '+7.0% vs LY', adrVsBudget: '+2.9% vs Budget', adrVsForecast: '+1.3% vs Forecast',
      losVsLy: '+0.3N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.2N vs Forecast',
    },
    'sosei-solstice': {
      name: 'SOSEI Solstice', location: 'Al Hajar, Oman', category: 'Sosei Wellness',
      occ: '69', rev: '$320,000', revpar: '$1,435', adr: '$2,080', los: '4.6',
      arrivals: 12, deps: 9, inhouse: 68, vip: 7,
      occVsLy: '+4.0 pts vs LY', occVsBudget: '+1.7 pts vs Budget', occVsForecast: '+1.0 pts vs Forecast',
      revVsLy: '+11.9% vs LY', revVsBudget: '+3.7% vs Budget', revVsForecast: '+1.7% vs Forecast',
      revparVsLy: '+12.1% vs LY', revparVsBudget: '+3.5% vs Budget', revparVsForecast: '+1.6% vs Forecast',
      adrVsLy: '+6.7% vs LY', adrVsBudget: '+2.7% vs Budget', adrVsForecast: '+1.2% vs Forecast',
      losVsLy: '+0.2N vs LY', losVsBudget: '+0.1N vs Budget', losVsForecast: '+0.1N vs Forecast',
    },
  };

  const data = kpiDataMap[propertyId] ?? kpiDataMap['sosei-nocturne'];
  const activePropName = propertyName || data.name;

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
          <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap w-full overflow-hidden">
            <span 
              title={kpis[0].vsBudget}
              className="inline-flex items-center justify-center text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 sm:px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap shrink-0"
            >
              <span className="hidden 2xl:inline">{kpis[0].vsBudget}</span>
              <span className="2xl:hidden">{kpis[0].vsBudgetShort}</span>
            </span>
            <span 
              title={kpis[0].vsForecast}
              className="inline-flex items-center justify-center text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 sm:px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap shrink-0"
            >
              <span className="hidden 2xl:inline">{kpis[0].vsForecast}</span>
              <span className="2xl:hidden">{kpis[0].vsForecastShort}</span>
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
              <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap w-full overflow-hidden">
                <span 
                  title={kpi.vsBudget}
                  className="inline-flex items-center justify-center text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 sm:px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap shrink-0"
                >
                  <span className="hidden 2xl:inline">{kpi.vsBudget}</span>
                  <span className="2xl:hidden">{kpi.vsBudgetShort}</span>
                </span>
                <span 
                  title={kpi.vsForecast}
                  className="inline-flex items-center justify-center text-[7.5px] sm:text-[8px] 2xl:text-[8.5px] font-medium px-1 sm:px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap shrink-0"
                >
                  <span className="hidden 2xl:inline">{kpi.vsForecast}</span>
                  <span className="2xl:hidden">{kpi.vsForecastShort}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


