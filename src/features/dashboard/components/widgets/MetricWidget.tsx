import type { ReactNode } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricWidgetProps {
  title: string;
  value: string;
  trendText: string;
  trendUp: boolean;
  icon: ReactNode;
  data: number[];
  color: string;
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

function getTooltipText(title: string) {
  const l = title.toUpperCase();
  if (l.includes('GUEST') || l.includes('CUSTOMER')) return "The total number of unique guests currently registered MTD.";
  if (l.includes('OCCUPANCY')) return "Percentage of occupied rooms relative to total available rooms.";
  if (l.includes('REVPAR')) return "Revenue Per Available Room, calculated as Occupancy rate multiplied by Average Daily Rate.";
  if (l.includes('ADR')) return "Average Daily Rate, representing the average rental income per occupied room today.";
  if (l.includes('STAY') || l.includes('LOS')) return "The average number of nights guests stay at the property.";
  return "Key performance indicator metric.";
}

export function MetricWidget({ title, value, trendText, trendUp, icon, data, color }: MetricWidgetProps) {
  const chartData = data.map((val, i) => ({ name: i, value: val }));

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#947b66]">{icon}</div>
        <span className="text-[8px] font-sans text-[#947b66]/70 tracking-widest font-semibold uppercase bg-[#e5d8cb]/30 px-1.5 py-0.5 rounded border border-[#d4c4b7]/50">YTD</span>
      </div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-bold tracking-wider uppercase text-[#4a3c31]">{title}</p>
        <InfoTooltip text={getTooltipText(title)} />
      </div>
      <h3 className="text-2xl font-bold text-[#4a3c31]">{value}</h3>
      <div className="flex items-center text-[10px] mt-1 space-x-1">
        <span className={trendUp ? 'text-[#657454]' : 'text-[#a65e52]'}>
          {trendUp ? '↑' : '↓'} {trendText}
        </span>
        <span className="text-[#7d6b5e]">yesterday</span>
      </div>
      <div className="h-10 mt-3 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="natural" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
