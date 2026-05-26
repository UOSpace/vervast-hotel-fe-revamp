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

export function MetricWidget({ title, value, trendText, trendUp, icon, data, color }: MetricWidgetProps) {
  const chartData = data.map((val, i) => ({ name: i, value: val }));

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#947b66]">{icon}</div>
      </div>
      <p className="text-[10px] font-bold tracking-wider uppercase text-[#4a3c31] mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-[#4a3c31]">{value}</h3>
      <div className="flex items-center text-[10px] mt-1 space-x-1">
        <span className={trendUp ? 'text-[#657454]' : 'text-[#a65e52]'}>
          {trendUp ? '↑' : '↓'} {trendText}
        </span>
        <span className="text-[#7d6b5e]">vs yesterday</span>
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
