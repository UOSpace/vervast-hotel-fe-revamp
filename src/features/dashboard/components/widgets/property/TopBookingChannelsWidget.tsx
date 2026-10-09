import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function TopBookingChannelsWidget({
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

  const data = [
    { channel: 'Direct Brand Website', shareNum: 52, pct: '52%', trend: '↑ 6%', up: true, adrFactor: 1.05 },
    { channel: 'Virtuoso & Advisors', shareNum: 28, pct: '28%', trend: '↓ 2%', up: false, adrFactor: 1.08 },
    { channel: 'Luxury OTA', shareNum: 12, pct: '12%', trend: '↑ 1%', up: true, adrFactor: 0.83 },
    { channel: 'Corporate & Groups', shareNum: 8, pct: '8%', trend: '↑ 1%', up: true, adrFactor: 0.78 },
  ];

  const channelTable = data.map(item => {
    const chRev = Math.round(base.roomRev * (item.shareNum / 100));
    const chAdr = Math.round(base.adr * item.adrFactor);
    const revStr = chRev >= 1000000
      ? `$${(chRev / 1000000).toFixed(2)}M`
      : `$${Math.round(chRev / 1000)}K`;

    return {
      channel: item.channel,
      rnights: item.pct,
      adr: `$${chAdr.toLocaleString()}`,
      revenue: revStr,
      trend: item.trend,
      up: item.up,
    };
  });

  const totalRevStr = base.roomRev >= 1000000
    ? `$${(base.roomRev / 1000000).toFixed(2)}M`
    : `$${Math.round(base.roomRev / 1000)}K`;

  channelTable.push({
    channel: 'Total',
    rnights: '100%',
    adr: `$${base.adr.toLocaleString()}`,
    revenue: totalRevStr,
    trend: '↑ 6%',
    up: true,
    isTotal: true,
  } as any);

  const totals = { pct: '100%', trend: '↑ 6%', up: true };

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.35s' }}
      onClick={() => openDrawer({ 
        type: 'CHANNEL_DISTRIBUTION', 
        title: `Top Booking Channels — ${propertyName}`, 
        data: channelTable 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Top Booking Channels</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'CHANNEL_DISTRIBUTION',
                title: `Top Booking Channels — ${propertyName}`,
                data: channelTable,
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="Performance of main distribution sources (Direct vs OTAs) by percentage of total bookings." />
        </div>
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
        {/* Header */}
        <div className="grid grid-cols-[48%_32%_20%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
          <div>Channel</div>
          <div className="text-right">% Share</div>
          <div className="text-right">Trend</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
          {data.map((row) => (
            <div key={row.channel} className="grid grid-cols-[48%_32%_20%] items-center text-[10px]">
              <div className="truncate text-zinc-700 font-medium pr-1">{row.channel}</div>
              <div className="text-right font-medium text-zinc-900">{row.pct}</div>
              <div className={`text-right font-medium text-[9.5px] ${row.up ? 'text-emerald-700' : 'text-rose-600'}`}>{row.trend}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[48%_32%_20%] items-center pt-1.5 border-t border-zinc-100 text-[10px] shrink-0">
          <div className="font-bold text-zinc-900">Total</div>
          <div className="text-right font-bold text-zinc-900">{totals.pct}</div>
          <div className={`text-right font-bold text-[9.5px] ${totals.up ? 'text-emerald-700' : 'text-rose-600'}`}>{totals.trend}</div>
        </div>
      </div>
    </div>
  );
}


