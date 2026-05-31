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

export function ResortKPIWidget({ kpis }: { kpis: any[] }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {kpis.map((kpi, idx) => (
        <div 
          key={kpi.label} 
          className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col justify-between backdrop-blur-sm animate-card-enter min-h-[140px]" 
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
