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
  const kpiDataMap: Record<string, any> = {
    // ── Europe ──────────────────────────────────────────────────────────
    'sosei-nocturne': {
      occ: '68', rev: '$1,569,200',  revpar: '$14,840',  adr: '$21,820', los: '4.2',
      arrivals: 24, deps: 18, inhouse: 186, vip: 14
    },
    'sosei-aurora': {
      occ: '61', rev: '$1,442,000',  revpar: '$13,600',  adr: '$22,300', los: '4.8',
      arrivals: 20, deps: 15, inhouse: 162, vip: 11
    },
    'sosei-hearth': {
      occ: '74', rev: '$1,764,000',  revpar: '$12,200',  adr: '$16,480',   los: '3.9',
      arrivals: 28, deps: 22, inhouse: 204, vip: 9
    },
    'sosei-pastoral': {
      occ: '70', rev: '$1,628,000',  revpar: '$11,400',  adr: '$16,280',   los: '3.6',
      arrivals: 26, deps: 20, inhouse: 188, vip: 7
    },
    // ── Americas ────────────────────────────────────────────────────────
    'sosei-verper': {
      occ: '88', rev: '$3,960,000', revpar: '$12,400',  adr: '$14,080',   los: '2.3',
      arrivals: 110, deps: 98, inhouse: 418, vip: 36
    },
    'sosei-elan': {
      occ: '91', rev: '$4,300,000', revpar: '$13,200',  adr: '$14,500',   los: '2.1',
      arrivals: 118, deps: 104, inhouse: 442, vip: 40
    },
    // ── Asia Pacific ────────────────────────────────────────────────────
    'sosei-marea': {
      occ: '82', rev: '$2,372,000', revpar: '$18,800',  adr: '$22,920', los: '6.2',
      arrivals: 42, deps: 28, inhouse: 298, vip: 25
    },
    'sosei-pelagia': {
      occ: '79', rev: '$2,084,000', revpar: '$17,400',  adr: '$22,020', los: '5.8',
      arrivals: 38, deps: 26, inhouse: 272, vip: 22
    },
    'sosei-sylvan': {
      occ: '57', rev: '$1,036,000',  revpar: '$9,600',  adr: '$16,840',   los: '3.6',
      arrivals: 18, deps: 14, inhouse: 112, vip: 6
    },
    'sosei-verdant': {
      occ: '53', rev: '$892,000',  revpar: '$8,800',  adr: '$16,600',   los: '3.3',
      arrivals: 15, deps: 12, inhouse: 96, vip: 5
    },
    // ── Middle East & Africa ─────────────────────────────────────────────
    'sosei-mirage': {
      occ: '42', rev: '$1,306,000',  revpar: '$12,600',  adr: '$30,000', los: '5.2',
      arrivals: 9, deps: 7, inhouse: 76, vip: 13
    },
    'sosei-solstice': {
      occ: '38', rev: '$1,176,000',  revpar: '$11,800',  adr: '$31,060', los: '4.9',
      arrivals: 7, deps: 6, inhouse: 68, vip: 10
    },
  };

  const data = kpiDataMap[propertyId] ?? kpiDataMap['sosei-nocturne'];

  const kpis = [
    { label: 'Occupancy', value: `${data.occ}%`, change: '+3.4% vs last period' },
    { label: 'Room Revenue', value: data.rev, change: '+8.1% vs last period' },
    { label: 'RevPAR', value: data.revpar, change: '+5.2% vs last period' },
    { label: 'ADR', value: data.adr, change: '+2.8% vs last period' },
    { label: 'Av. Length of Stay', value: `${data.los} Nights`, change: '+0.4 vs last period' },
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


