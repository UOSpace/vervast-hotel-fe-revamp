import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function MarketSegmentMixWidget() {
  const { openDrawer } = useDashboardDrawer();
  const data = [
    { name: 'Direct', value: 45, color: '#0f172a' },
    { name: 'Leisure', value: 28, color: '#334155' },
    { name: 'Corporate', value: 12, color: '#64748b' },
    { name: 'Group', value: 10, color: '#94a3b8' },
    { name: 'Other', value: 5, color: '#cbd5e1' },
  ];

  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.3s' }}
      onClick={() => openDrawer({ type: 'MARKET_SEGMENT', title: 'Market Segment Mix', data })}
    >
      <div className="flex justify-between items-center mb-3 h-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Market Segment Mix</h3>
        <InfoTooltip text="Visual breakdown of guest reservations grouped by key customer categories." />
      </div>

      <div className="flex-1 flex items-center justify-between py-1 gap-3">
        {/* Crisp Pure SVG Donut Chart */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {data.map((item, index) => {
              const strokeLength = (item.value / 100) * circumference;
              const strokeOffset = -(accumulated / 100) * circumference;
              accumulated += item.value;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${Math.max(0, strokeLength - 1.5)} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-[9.5px] font-bold text-zinc-900 leading-tight">% Room</span>
            <span className="text-[9.5px] font-bold text-zinc-900 leading-tight">Revenue</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-500 font-medium truncate">{item.name}</span>
              </div>
              <span className="font-bold text-zinc-900 ml-2">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


