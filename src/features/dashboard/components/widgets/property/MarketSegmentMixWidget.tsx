import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function MarketSegmentMixWidget({
  propertyId = 'sosei-nocturne',
  propertyName = 'SOSEI Nocturne',
}: {
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();

  // Property room revenue & ADR mapping for mathematical consistency
  const propertyBaseMetrics: Record<string, { roomRev: number; adr: number }> = {
    'sosei-nocturne': { roomRev: 1150000, adr: 2700 },
    'sosei-aurora': { roomRev: 950000, adr: 2650 },
    'sosei-hearth': { roomRev: 450000, adr: 1920 },
    'sosei-pastoral': { roomRev: 400000, adr: 1880 },
    'sosei-verper': { roomRev: 800000, adr: 2450 },
    'sosei-elan': { roomRev: 650000, adr: 2350 },
    'sosei-marea': { roomRev: 1000000, adr: 2550 },
    'sosei-pelagia': { roomRev: 850000, adr: 2450 },
    'sosei-sylvan': { roomRev: 500000, adr: 1880 },
    'sosei-verdant': { roomRev: 450000, adr: 1820 },
    'sosei-mirage': { roomRev: 380000, adr: 2120 },
    'sosei-solstice': { roomRev: 320000, adr: 2080 },
  };

  const base = propertyBaseMetrics[propertyId] ?? propertyBaseMetrics['sosei-nocturne'];

  // Standardized 5 market segments matching global overview & category dashboards
  const data = [
    { name: 'Leisure', value: 55, color: '#0f172a', adrFactor: 0.92 },
    { name: 'Business', value: 25, color: '#334155', adrFactor: 1.09 },
    { name: 'Social', value: 10, color: '#64748b', adrFactor: 0.68 },
    { name: 'MICE', value: 7, color: '#94a3b8', adrFactor: 0.97 },
    { name: 'Others', value: 3, color: '#cbd5e1', adrFactor: 0.61 },
  ];

  // Derive structured table rows compatible with MarketSegmentDrawerContent
  const segmentTable = data.map(item => {
    const segRev = Math.round(base.roomRev * (item.value / 100));
    const segAdr = Math.round(base.adr * item.adrFactor);
    const revStr = segRev >= 1000000
      ? `$${(segRev / 1000000).toFixed(2)}M`
      : `$${Math.round(segRev / 1000)}K`;

    return {
      segment: item.name,
      rnights: `${item.value}%`,
      adr: `$${segAdr.toLocaleString()}`,
      revenue: revStr,
      isPositive: true,
    };
  });

  const totalRevStr = base.roomRev >= 1000000
    ? `$${(base.roomRev / 1000000).toFixed(2)}M`
    : `$${Math.round(base.roomRev / 1000)}K`;

  segmentTable.push({
    segment: 'Total',
    rnights: '100%',
    adr: `$${base.adr.toLocaleString()}`,
    revenue: totalRevStr,
    isTotal: true,
  } as any);

  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.3s' }}
      onClick={() => openDrawer({ 
        type: 'MARKET_SEGMENT', 
        title: `Market Segment Mix — ${propertyName}`, 
        data: segmentTable 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Market Segment Mix</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'MARKET_SEGMENT',
                title: `Market Segment Mix — ${propertyName}`,
                data: segmentTable,
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="Visual breakdown of guest reservations grouped by key customer categories (Leisure, Business, Social, MICE, Others)." />
        </div>
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


