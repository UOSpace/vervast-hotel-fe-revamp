import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { InfoTooltip } from '@/features/common/components/InfoTooltip';

export interface SpendDataPoint {
  name: string;
  value: number;
}

export interface SpendOverTimeWidgetProps {
  data: SpendDataPoint[];
  onOpenDetails?: () => void;
}

export const SpendOverTimeWidget: React.FC<SpendOverTimeWidgetProps> = ({
  data,
  onOpenDetails,
}) => {
  return (
    <div
      className="relative rounded-[12px] p-3.5 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
      onClick={onOpenDetails}
    >
      <div className="flex justify-between items-baseline mb-4">
        <InfoTooltip text="Annual guest expenditure trends compared side-by-side (YTD).">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
              Spend Over Time
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium">ANNUAL EXPENDITURE (USD)</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 min-h-[90px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: -5 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#18181b" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#71717a' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={38}
              tick={{ fontSize: 8, fill: '#71717a' }}
              tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e4e4e7',
                borderRadius: '8px',
                fontSize: '10px',
                color: '#18181b',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '4px 8px',
              }}
              formatter={(value: unknown) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Spend']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#18181b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#spendGradient)"
              dot={{ r: 3, fill: '#18181b', stroke: '#ffffff', strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: '#15803d' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
