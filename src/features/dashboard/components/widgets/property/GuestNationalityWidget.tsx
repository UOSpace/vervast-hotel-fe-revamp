import { ArrowRight } from '@solar-icons/react';

export function GuestNationalityWidget() {
  const data = [
    { country: 'United States', iso: 'US', pct: '24%', trend: '↑ 2%', up: true },
    { country: 'United Kingdom', iso: 'GB', pct: '16%', trend: '↑ 1%', up: true },
    { country: 'Germany', iso: 'DE', pct: '12%', trend: '↓ 1%', up: false },
    { country: 'Switzerland', iso: 'CH', pct: '10%', trend: '↑ 3%', up: true },
  ];

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 animate-card-enter" style={{ animationDelay: '0.4s' }}>
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4">GUEST NATIONALITY (TOP 5)</div>

      <div className="flex flex-col text-xs text-[#4a3c31] h-full justify-between pb-1">
        <div>
          {/* Header */}
          <div className="grid grid-cols-[45%_25%_30%] mb-2 pb-2 border-b border-[#d4c4b7]/50 font-bold">
            <div>Country</div>
            <div className="text-right whitespace-nowrap">% of Guests</div>
            <div className="text-right">vs Yday</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-3 mt-3">
            {data.map((row) => (
              <div key={row.country} className="grid grid-cols-[45%_25%_30%] items-center">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-[10px] font-bold bg-[#e5d8cb] text-[#4a3c31] px-1.5 py-0.5 rounded-[4px] w-6 text-center shrink-0">{row.iso}</span>
                  <span className="truncate">{row.country}</span>
                </div>
                <div className="text-right">{row.pct}</div>
                <div className={`text-right ${row.up ? 'text-[#657454]' : 'text-[#a65e52]'}`}>{row.trend}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="flex items-center gap-1 text-[#C8A050] text-[9px] font-bold mt-4 hover:opacity-80 transition-opacity uppercase tracking-wider">
        View all nationalities <ArrowRight size={10} />
      </button>
    </div>
  );
}
