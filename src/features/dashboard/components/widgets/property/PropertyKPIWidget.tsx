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
    { label: 'OCCUPANCY', value: `${data.occ}%` },
    { label: 'Room Revenue (USD)', value: data.rev },
    { label: 'RevPAR (USD)', value: data.revpar },
    { label: 'ADR (USD)', value: data.adr },
    { label: 'AVG LENGTH OF STAY', value: data.los },
  ];

  return (
    <div className="grid grid-cols-12 gap-5 items-stretch">
      {/* Today's Activity / Operational Summary */}
      <div 
        className="col-span-12 lg:col-span-3 rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all cursor-pointer animate-card-enter"
        onClick={() => openDrawer({ type: 'LIVE_OVERVIEW', title: 'Today at a Glance' })}
      >
        <div>
          <InfoTooltip text="Real-time summary of today's operational guest counts.">
            <h3 className="text-[10px] font-normal tracking-wider uppercase text-[#4a3c31] mb-3 cursor-help">
              TODAY'S ACTIVITY
            </h3>
          </InfoTooltip>
          
          <div className="flex flex-col gap-2.5 text-xs text-[#4a3c31]">
            <div className="flex justify-between items-baseline pb-1 border-b border-[#d4c4b7]/30">
              <span className="text-[#947b66] text-[9.5px] uppercase tracking-wider font-medium">Arrivals</span>
              <span className="text-sm font-bold">{data.arrivals}</span>
            </div>
            <div className="flex justify-between items-baseline pb-1 border-b border-[#d4c4b7]/30">
              <span className="text-[#947b66] text-[9.5px] uppercase tracking-wider font-medium">Departures</span>
              <span className="text-sm font-bold">{data.deps}</span>
            </div>
            <div className="flex justify-between items-baseline pb-1 border-b border-[#d4c4b7]/30">
              <span className="text-[#947b66] text-[9.5px] uppercase tracking-wider font-medium">In-House Guests</span>
              <span className="text-sm font-bold">{data.inhouse}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[#947b66] text-[9.5px] uppercase tracking-wider font-medium">VIP Guests</span>
              <span className="text-sm font-bold">{data.vip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Performance KPI Cards Grid */}
      <div className="col-span-12 lg:col-span-9 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="relative rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 backdrop-blur-sm hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all cursor-pointer animate-card-enter"
            style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
            onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
          >
            <div className="flex flex-col relative w-full h-full justify-between pt-1">
              <div className="flex items-center justify-between gap-1 mb-1">
                <InfoTooltip text={getTooltipText(kpi.label)}>
                  <p className="text-[10px] font-normal tracking-wider uppercase text-[#4a3c31] whitespace-nowrap truncate cursor-help">
                    {kpi.label}
                  </p>
                </InfoTooltip>
              </div>
              <h3 className="text-[22px] font-normal text-[#4a3c31] my-1">
                {kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

