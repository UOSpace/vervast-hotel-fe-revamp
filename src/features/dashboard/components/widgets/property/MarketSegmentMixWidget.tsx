import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight } from '@solar-icons/react';

export function MarketSegmentMixWidget() {
  const data = [
    { name: 'Direct', value: 45, color: '#2a564f' },
    { name: 'Leisure', value: 28, color: '#4a8276' },
    { name: 'Corporate', value: 12, color: '#7baaa0' },
    { name: 'Group', value: 10, color: '#b2ccc6' },
    { name: 'Other', value: 5, color: '#e5eee7' },
  ];

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 relative animate-card-enter" style={{ animationDelay: '0.3s' }}>
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4">MARKET SEGMENT MIX</div>

      <div className="flex-1 flex items-center justify-between">
        {/* Donut Chart */}
        <div className="w-[140px] h-[140px] relative -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#f3eae1', borderColor: '#d4c4b7', fontSize: '10px', borderRadius: '8px' }}
                itemStyle={{ color: '#4a3c31' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-[10px] font-bold text-[#4a3c31] leading-tight">% of Room</span>
            <span className="text-[10px] font-bold text-[#4a3c31] leading-tight">Revenue</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 mr-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-[10px] text-[#4a3c31]">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="w-16">{item.name}</span>
              <span className="font-bold">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-1 text-[#C8A050] text-[9px] font-bold mt-2 hover:opacity-80 transition-opacity uppercase tracking-wider">
        View market insights <ArrowRight size={10} />
      </button>
    </div>
  );
}
