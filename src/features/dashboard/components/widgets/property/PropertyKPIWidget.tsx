import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

function SemiCircleGauge({ value }: { value: number }) {
  const radius = 32;
  const strokeWidth = 5;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex justify-center mt-3 mb-2 h-[45px]">
      <svg width="84" height="45" viewBox="0 0 84 45" className="overflow-visible">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8A050" />
            <stop offset="50%" stopColor="#657454" />
            <stop offset="100%" stopColor="#586981" />
          </linearGradient>
        </defs>
        <path d="M 10 40 A 32 32 0 0 1 74 40" fill="none" stroke="#e5d8cb" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path
          d="M 10 40 A 32 32 0 0 1 74 40"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute bottom-0 text-xl font-serif text-[#4a3c31] font-bold">{value}%</div>
    </div>
  );
}

const sparkData = [60, 63, 66, 69, 72, 75, 78, 81, 84, 88];

function Sparkline({ color }: { color: string }) {
  const data = sparkData.map((v, i) => ({ v: v + (Math.random() * 4 - 2), i }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

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
      occ: '68', rev: '$78,460',  revpar: '$742',  adr: '$1,091', los: '4.2',
      arrivals: 24, deps: 18, inhouse: 186, vip: 14
    },
    'sosei-aurora': {
      occ: '61', rev: '$72,100',  revpar: '$680',  adr: '$1,115', los: '4.8',
      arrivals: 20, deps: 15, inhouse: 162, vip: 11
    },
    'sosei-hearth': {
      occ: '74', rev: '$88,200',  revpar: '$610',  adr: '$824',   los: '3.9',
      arrivals: 28, deps: 22, inhouse: 204, vip: 9
    },
    'sosei-pastoral': {
      occ: '70', rev: '$81,400',  revpar: '$570',  adr: '$814',   los: '3.6',
      arrivals: 26, deps: 20, inhouse: 188, vip: 7
    },
    // ── Americas ────────────────────────────────────────────────────────
    'sosei-verper': {
      occ: '88', rev: '$198,000', revpar: '$620',  adr: '$704',   los: '2.3',
      arrivals: 110, deps: 98, inhouse: 418, vip: 36
    },
    'sosei-elan': {
      occ: '91', rev: '$215,000', revpar: '$660',  adr: '$725',   los: '2.1',
      arrivals: 118, deps: 104, inhouse: 442, vip: 40
    },
    // ── Asia Pacific ────────────────────────────────────────────────────
    'sosei-marea': {
      occ: '82', rev: '$118,600', revpar: '$940',  adr: '$1,146', los: '6.2',
      arrivals: 42, deps: 28, inhouse: 298, vip: 25
    },
    'sosei-pelagia': {
      occ: '79', rev: '$104,200', revpar: '$870',  adr: '$1,101', los: '5.8',
      arrivals: 38, deps: 26, inhouse: 272, vip: 22
    },
    'sosei-sylvan': {
      occ: '57', rev: '$51,800',  revpar: '$480',  adr: '$842',   los: '3.6',
      arrivals: 18, deps: 14, inhouse: 112, vip: 6
    },
    'sosei-verdant': {
      occ: '53', rev: '$44,600',  revpar: '$440',  adr: '$830',   los: '3.3',
      arrivals: 15, deps: 12, inhouse: 96, vip: 5
    },
    // ── Middle East & Africa ─────────────────────────────────────────────
    'sosei-mirage': {
      occ: '42', rev: '$65,300',  revpar: '$630',  adr: '$1,500', los: '5.2',
      arrivals: 9, deps: 7, inhouse: 76, vip: 13
    },
    'sosei-solstice': {
      occ: '38', rev: '$58,800',  revpar: '$590',  adr: '$1,553', los: '4.9',
      arrivals: 7, deps: 6, inhouse: 68, vip: 10
    },
  };

  const data = kpiDataMap[propertyId] ?? kpiDataMap['sosei-nocturne'];

  const kpis = [
    { label: 'OCCUPANCY', value: data.occ, trend: '↑ 6%', up: true, color: '#657454' },
    { label: 'Room Revenue (USD)', value: data.rev, trend: '↑ 8%', up: true, color: '#586981' },
    { label: 'RevPAR (USD)', value: data.revpar, trend: '↑ 8%', up: true, color: '#C8A050' },
    { label: 'ADR (USD)', value: data.adr, trend: '↑ 4%', up: true, color: '#9d7c67' },
    { label: 'AVG LENGTH OF STAY', value: data.los, trend: '↑ 5%', up: true, color: '#586981' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Today at a glance */}
      <div
        className="relative border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all cursor-pointer animate-card-enter min-h-[140px]"
        onClick={() => openDrawer({ type: 'LIVE_OVERVIEW', title: 'Today at a Glance' })}
      >
        <div className="uppercase tracking-widest text-[10px] font-bold text-[#7d6b5e] mb-3 flex items-center justify-between">
          <span>TODAY AT A GLANCE</span>
          <InfoTooltip text="Real-time summary of today's key guest arrivals, departures, occupancy, and in-house count." />
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center"><span className="text-[#6A5848]">Arrivals</span><span className="font-bold text-[#4a3c31]">{data.arrivals}</span></div>
          <div className="flex justify-between items-center"><span className="text-[#6A5848]">Departures</span><span className="font-bold text-[#4a3c31]">{data.deps}</span></div>
          <div className="flex justify-between items-center"><span className="text-[#6A5848]">In-House Guests</span><span className="font-bold text-[#4a3c31]">{data.inhouse}</span></div>
          <div className="flex justify-between items-center"><span className="text-[#6A5848]">VIP Guests</span><span className="font-bold text-[#4a3c31]">{data.vip}</span></div>
          <div className="flex justify-between items-center"><span className="text-[#6A5848]">Occupancy</span><span className="font-bold text-[#4a3c31]">{data.occ}%</span></div>
        </div>
      </div>

      {kpis.map((kpi, idx) => (
        <div
          key={kpi.label}
          className="relative border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all cursor-pointer animate-card-enter min-h-[140px]"
          style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
          onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
        >
          <div className="uppercase tracking-widest text-[10px] font-bold text-[#7d6b5e] flex items-center justify-between">
            <span>{kpi.label}</span>
            <InfoTooltip text={getTooltipText(kpi.label)} />
          </div>

          {kpi.label === 'OCCUPANCY' ? (
            <SemiCircleGauge value={parseInt(kpi.value)} />
          ) : (
            <div className="flex-1 flex items-center justify-center mt-2 mb-1">
              <div className="text-2xl font-serif text-[#4a3c31] leading-none">{kpi.value}</div>
            </div>
          )}

          <div className="flex flex-col items-center mt-auto">
            <div className={`text-[8.5px] font-bold tracking-wide ${kpi.up ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>
              {kpi.trend}
            </div>
          </div>

          <div className="mt-2 relative">
            <Sparkline color={kpi.color} />
            <div className="absolute -bottom-1 left-0 text-[7px] text-[#947b66]">Last 7 Days</div>
          </div>
        </div>
      ))}
    </div>
  );
}
