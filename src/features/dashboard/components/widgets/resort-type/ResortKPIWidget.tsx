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
        {/* Background track */}
        <path d="M 10 40 A 32 32 0 0 1 74 40" fill="none" stroke="#e5d8cb" strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Value track */}
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

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 hover:text-[#C8A050] transition-colors text-[9px] border border-[#7d6b5e]/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#4a3c31] text-[#fdfaf7] text-[9.5px] rounded p-2 shadow-xl z-[90] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#4a3c31]" />
      </div>
    </div>
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

export function ResortKPIWidget({ kpis }: { kpis: any[] }) {
  const { openDrawer } = useDashboardDrawer();
  return (
    <div className="grid grid-cols-5 gap-3">
      {kpis.map((kpi, idx) => (
        <div
          key={kpi.label}
          className="relative border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between bg-[#f3eae1]/0 hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all cursor-pointer animate-card-enter min-h-[140px]"
          style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
          onClick={() => openDrawer({ type: 'METRIC', title: kpi.label, data: kpi.value })}
        >
          <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] flex items-center justify-between">
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
            <div className={`text-[8.5px] font-bold tracking-wide ${kpi.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>
              {kpi.trend}
            </div>
          </div>

          <div className="mt-2 relative">
            <Sparkline color={kpi.color} />
            <div className="absolute -bottom-1 left-0 text-[7px] text-[#947b66]">Trend</div>
          </div>
        </div>
      ))}
    </div>
  );
}
