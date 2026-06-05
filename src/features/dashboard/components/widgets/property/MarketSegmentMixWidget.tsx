import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

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

export function MarketSegmentMixWidget() {
  const { openDrawer } = useDashboardDrawer();
  const data = [
    { name: 'Direct', value: 45, color: '#2a564f' },
    { name: 'Leisure', value: 28, color: '#4a8276' },
    { name: 'Corporate', value: 12, color: '#7baaa0' },
    { name: 'Group', value: 10, color: '#b2ccc6' },
    { name: 'Other', value: 5, color: '#e5eee7' },
  ];

  return (
    <div 
      className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer relative hover:z-20 animate-card-enter" 
      style={{ animationDelay: '0.3s' }}
      onClick={() => openDrawer({ type: 'MARKET_SEGMENT', title: 'Market Segment Mix', data })}
    >
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4 flex items-center justify-between">
        <span>MARKET SEGMENT MIX</span>
        <InfoTooltip text="Visual breakdown of guest reservations grouped by key customer categories." />
      </div>

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
