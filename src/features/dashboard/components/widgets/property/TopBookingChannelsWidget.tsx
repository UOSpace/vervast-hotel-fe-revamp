import { ArrowRight } from '@solar-icons/react';

export function TopBookingChannelsWidget() {
  const data = [
    { channel: 'Direct', pct: '52%', trend: '↑ 6%', up: true },
    { channel: 'OTA', pct: '28%', trend: '↓ 2%', up: false },
    { channel: 'Travel Agent', pct: '12%', trend: '↑ 1%', up: true },
    { channel: 'Corporate', pct: '8%', trend: '↑ 1%', up: true },
  ];

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 animate-card-enter" style={{ animationDelay: '0.35s' }}>
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4">TOP BOOKING CHANNELS</div>

      <div className="flex flex-col text-xs text-[#4a3c31] h-full justify-between pb-1">
        <div>
          {/* Header */}
          <div className="grid grid-cols-[45%_25%_30%] mb-2 pb-2 border-b border-[#d4c4b7]/50 font-bold">
            <div>Channel</div>
            <div className="text-right whitespace-nowrap">% of Bookings</div>
            <div className="text-right">vs Yday</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-3 mt-3">
            {data.map((row) => (
              <div key={row.channel} className="grid grid-cols-[45%_25%_30%] items-center">
                <div className="truncate pr-2">{row.channel}</div>
                <div className="text-right">{row.pct}</div>
                <div className={`text-right ${row.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{row.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="flex items-center gap-1 text-[#C8A050] text-[9px] font-bold mt-4 hover:opacity-80 transition-opacity uppercase tracking-wider">
        View booking analytics <ArrowRight size={10} />
      </button>
    </div>
  );
}
