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

export function PropertyKPIWidget({ propertyId = 'sosei-nocturne' }: { propertyId?: string }) {
  const { openDrawer } = useDashboardDrawer();
  
  // Real PMS-aligned metrics synchronized with Dashboard All (MTD & YTD portfolioPerformance)
  const kpiDataMap: Record<string, any> = {
    // ── Europe (Alpine & Countryside) ────────────────────────────────────
    'sosei-nocturne': {
      occ: '76', rev: '$1,150,000', revpar: '$2,052', adr: '$2,700', los: '4.2',
      arrivals: 24, deps: 18, inhouse: 144, vip: 14,
      occTrend: '↑ 6.2%', revTrend: '↑ 14.0%', revparTrend: '↑ 14.2%', adrTrend: '↑ 8.0%'
    },
    'sosei-aurora': {
      occ: '74', rev: '$950,000', revpar: '$1,961', adr: '$2,650', los: '4.6',
      arrivals: 18, deps: 14, inhouse: 112, vip: 10,
      occTrend: '↑ 5.8%', revTrend: '↑ 13.5%', revparTrend: '↑ 13.8%', adrTrend: '↑ 7.6%'
    },
    'sosei-hearth': {
      occ: '66', rev: '$450,000', revpar: '$1,267', adr: '$1,920', los: '3.8',
      arrivals: 22, deps: 18, inhouse: 88, vip: 7,
      occTrend: '↑ 4.9%', revTrend: '↑ 11.2%', revparTrend: '↑ 11.5%', adrTrend: '↑ 6.1%'
    },
    'sosei-pastoral': {
      occ: '64', rev: '$400,000', revpar: '$1,203', adr: '$1,880', los: '3.6',
      arrivals: 20, deps: 16, inhouse: 76, vip: 6,
      occTrend: '↑ 4.5%', revTrend: '↑ 10.8%', revparTrend: '↑ 11.0%', adrTrend: '↑ 5.9%'
    },
    // ── Americas (City) ──────────────────────────────────────────────────
    'sosei-verper': {
      occ: '73', rev: '$800,000', revpar: '$1,788', adr: '$2,450', los: '2.4',
      arrivals: 65, deps: 58, inhouse: 184, vip: 22,
      occTrend: '↑ 7.1%', revTrend: '↑ 15.2%', revparTrend: '↑ 15.4%', adrTrend: '↑ 8.5%'
    },
    'sosei-elan': {
      occ: '71', rev: '$650,000', revpar: '$1,668', adr: '$2,350', los: '2.2',
      arrivals: 55, deps: 48, inhouse: 152, vip: 18,
      occTrend: '↑ 6.8%', revTrend: '↑ 14.8%', revparTrend: '↑ 15.0%', adrTrend: '↑ 8.1%'
    },
    // ── Asia Pacific (Ocean & Forest) ────────────────────────────────────
    'sosei-marea': {
      occ: '82', rev: '$1,000,000', revpar: '$2,091', adr: '$2,550', los: '6.2',
      arrivals: 28, deps: 20, inhouse: 132, vip: 16,
      occTrend: '↑ 8.0%', revTrend: '↑ 16.5%', revparTrend: '↑ 16.8%', adrTrend: '↑ 9.2%'
    },
    'sosei-pelagia': {
      occ: '80', rev: '$850,000', revpar: '$1,960', adr: '$2,450', los: '5.8',
      arrivals: 26, deps: 19, inhouse: 126, vip: 14,
      occTrend: '↑ 7.6%', revTrend: '↑ 15.9%', revparTrend: '↑ 16.1%', adrTrend: '↑ 8.8%'
    },
    'sosei-sylvan': {
      occ: '70', rev: '$500,000', revpar: '$1,316', adr: '$1,880', los: '3.5',
      arrivals: 16, deps: 12, inhouse: 68, vip: 6,
      occTrend: '↑ 5.2%', revTrend: '↑ 12.0%', revparTrend: '↑ 12.3%', adrTrend: '↑ 6.5%'
    },
    'sosei-verdant': {
      occ: '68', rev: '$450,000', revpar: '$1,238', adr: '$1,820', los: '3.2',
      arrivals: 15, deps: 11, inhouse: 64, vip: 5,
      occTrend: '↑ 4.8%', revTrend: '↑ 11.5%', revparTrend: '↑ 11.8%', adrTrend: '↑ 6.2%'
    },
    // ── Middle East & Africa (Desert) ────────────────────────────────────
    'sosei-mirage': {
      occ: '71', rev: '$380,000', revpar: '$1,505', adr: '$2,120', los: '4.8',
      arrivals: 14, deps: 10, inhouse: 72, vip: 8,
      occTrend: '↑ 5.5%', revTrend: '↑ 12.4%', revparTrend: '↑ 12.6%', adrTrend: '↑ 7.0%'
    },
    'sosei-solstice': {
      occ: '69', rev: '$320,000', revpar: '$1,435', adr: '$2,080', los: '4.6',
      arrivals: 12, deps: 9, inhouse: 68, vip: 7,
      occTrend: '↑ 5.1%', revTrend: '↑ 11.9%', revparTrend: '↑ 12.1%', adrTrend: '↑ 6.7%'
    },
  };

  const data = kpiDataMap[propertyId] ?? kpiDataMap['sosei-nocturne'];

  const kpis = [
    { label: 'Occupancy', value: `${data.occ}%`, change: `${data.occTrend} vs last year` },
    { label: 'Room Revenue', value: data.rev, change: `${data.revTrend} vs last year` },
    { label: 'RevPAR', value: data.revpar, change: `${data.revparTrend} vs last year` },
    { label: 'ADR', value: data.adr, change: `${data.adrTrend} vs last year` },
    { label: 'Av. Length of Stay', value: `${data.los} Nights`, change: '+0.3 vs last year' },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 items-stretch">
      {/* Today's Activity / Operational Summary (3 cols) */}
      <div 
        className="col-span-12 lg:col-span-3 rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
        onClick={() => openDrawer({ type: 'LIVE_OVERVIEW', title: 'Today at a Glance' })}
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
        className="col-span-12 lg:col-span-2 relative rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
        style={{ animationDelay: '0.1s' }}
        onClick={() => openDrawer({ type: 'METRIC', title: kpis[0].label, data: kpis[0].value })}
      >
        <div className="flex flex-col justify-between h-full py-0.5">
          <div className="flex items-center justify-between gap-1 mb-1">
            <InfoTooltip text={getTooltipText(kpis[0].label)}>
              <p className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 whitespace-nowrap truncate cursor-help">
                {kpis[0].label}
              </p>
            </InfoTooltip>
          </div>
          <h3 className="text-[22px] font-normal text-zinc-900 leading-none my-auto">
            {kpis[0].value}
          </h3>
          <span className="text-[9px] text-emerald-700 font-medium">
            {kpis[0].change}
          </span>
        </div>
      </div>

      {/* Remaining 4 Financial & Performance KPI Cards (7 cols, 4 sub-columns) */}
      <div className="col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.slice(1).map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative rounded-[12px] p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter"
            style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
            onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
          >
            <div className="flex flex-col justify-between h-full py-0.5">
              <div className="flex items-center justify-between gap-1 mb-1">
                <InfoTooltip text={getTooltipText(kpi.label)}>
                  <p className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 whitespace-nowrap truncate cursor-help">
                    {kpi.label}
                  </p>
                </InfoTooltip>
              </div>
              <h3 className="text-[22px] font-normal text-zinc-900 leading-none my-auto">
                {kpi.value}
              </h3>
              <span className="text-[9px] text-emerald-700 font-medium">
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


