import { LineChart, Line, ResponsiveContainer } from 'recharts';

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

const sparkData = [60, 65, 58, 72, 68, 75, 80, 78, 82, 88];

function Sparkline({ color }: { color: string }) {
  const data = sparkData.map((v, i) => ({ v: v + (Math.random() * 10 - 5), i }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PropertyKPIWidget({ propertyId = 'alpine' }: { propertyId?: string }) {
  const kpiDataMap: Record<string, any> = {
    'alpine': {
      occ: '68', rev: '$78,460', revpar: '$742', adr: '$1,091', los: '4.2',
      arrivals: 24, deps: 18, inhouse: 186, vip: 14
    },
    'ocean': {
      occ: '85', rev: '$125,300', revpar: '$980', adr: '$1,152', los: '6.5',
      arrivals: 45, deps: 30, inhouse: 310, vip: 28
    },
    'city': {
      occ: '92', rev: '$210,000', revpar: '$680', adr: '$739', los: '2.1',
      arrivals: 120, deps: 105, inhouse: 450, vip: 40
    },
    'forest': {
      occ: '54', rev: '$45,200', revpar: '$450', adr: '$833', los: '3.4',
      arrivals: 15, deps: 12, inhouse: 98, vip: 5
    },
    'desert': {
      occ: '40', rev: '$62,100', revpar: '$620', adr: '$1,550', los: '5.0',
      arrivals: 8, deps: 6, inhouse: 72, vip: 12
    },
    'country': {
      occ: '78', rev: '$95,400', revpar: '$530', adr: '$679', los: '3.8',
      arrivals: 32, deps: 28, inhouse: 150, vip: 8
    }
  };

  const data = kpiDataMap[propertyId] || kpiDataMap['alpine'];
  const kpis = [
    { label: 'OCCUPANCY', value: data.occ, trend: '↑ 6%', up: true, color: '#657454' },
    { label: 'REVENUE (USD)', value: data.rev, trend: '↑ 8%', up: true, color: '#586981' },
    { label: 'RevPAR (USD)', value: data.revpar, trend: '↑ 8%', up: true, color: '#C8A050' },
    { label: 'ADR (USD)', value: data.adr, trend: '↑ 4%', up: true, color: '#9d7c67' },
    { label: 'AVG LENGTH OF STAY', value: data.los, trend: '↑ 5%', up: true, color: '#586981' },
  ];

  return (
    <div className="grid grid-cols-6 gap-3">
      {/* Today at a glance */}
      <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm animate-card-enter min-h-[140px] bg-[#f3eae1]/0">
        <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-3">TODAY AT A GLANCE</div>
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
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between backdrop-blur-sm animate-card-enter min-h-[140px] bg-[#f3eae1]/0"
          style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
        >
          <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e]">{kpi.label}</div>

          {kpi.label === 'OCCUPANCY' ? (
            <SemiCircleGauge value={parseInt(kpi.value)} />
          ) : (
            <div className="flex-1 flex items-center justify-center mt-2 mb-1">
              <div className="text-2xl font-serif text-[#4a3c31] leading-none">{kpi.value}</div>
            </div>
          )}

          <div className="flex flex-col items-center mt-auto">
            <div className={`text-[8.5px] font-bold tracking-wide ${kpi.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>
              <span className="text-[#947b66] font-normal text-[7px] mr-1">vs yesterday</span> {kpi.trend}
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
