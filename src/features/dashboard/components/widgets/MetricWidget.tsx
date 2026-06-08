import { InfoTooltip } from '../../../common/components/InfoTooltip';
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

function getTooltipText(title: string) {
  const l = title.toUpperCase();
  if (l.includes('GUEST') || l.includes('CUSTOMER')) return "Average daily number of guests checked in YTD.";
  if (l.includes('OCCUPANCY')) return "Average occupancy rate YTD.";
  if (l.includes('REVENUE')) return "Average daily revenue YTD.";
  if (l.includes('REVPAR')) return "Average revenue per available room YTD.";
  if (l.includes('ADR')) return "Average Daily Rate YTD.";
  return "Key performance indicator metric.";
}

export function MetricWidget({ title, value, trendText, trendUp, icon, data, color }: MetricWidgetProps) {
  const chartData = data.map((val, i) => ({ name: i, value: val }));

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#947b66]">{icon}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-sans text-[#947b66]/70 tracking-widest font-semibold uppercase bg-[#e5d8cb]/30 px-1.5 py-0.5 rounded border border-[#d4c4b7]/50">YTD</span>
          <InfoTooltip text={getTooltipText(title)} />
        </div>
      </div>
      <div className="mb-1">
        <p className="text-[10px] font-bold tracking-wider uppercase text-[#4a3c31]">{title}</p>
      </div>
      <h3 className="text-2xl font-bold text-[#4a3c31]">{value}</h3>
      <div className="flex items-center text-[10px] mt-1">
        <span className={trendUp ? 'text-[#15803d]' : 'text-[#b91c1c]'}>
          {trendUp ? '↑' : '↓'} {trendText}
        </span>
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
