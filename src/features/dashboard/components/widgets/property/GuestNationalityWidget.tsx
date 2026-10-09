import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function GuestNationalityWidget({
  propertyId = 'sosei-nocturne',
  propertyName = 'SOSEI Nocturne',
}: {
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();

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
    { country: 'United States', shareNum: 24, pct: '24%', trend: '↑ 2%', up: true, adrFactor: 1.08 },
    { country: 'United Kingdom', shareNum: 16, pct: '16%', trend: '↑ 1%', up: true, adrFactor: 1.02 },
    { country: 'Germany', shareNum: 12, pct: '12%', trend: '↓ 1%', up: false, adrFactor: 0.95 },
    { country: 'Switzerland', shareNum: 10, pct: '10%', trend: '↑ 3%', up: true, adrFactor: 1.12 },
  ];

  const nationalityTable = data.map((item, idx) => {
    const natRev = Math.round(base.roomRev * (item.shareNum / 100));
    const natAdr = Math.round(base.adr * item.adrFactor);
    const revStr = natRev >= 1000000
      ? `$${(natRev / 1000000).toFixed(2)}M`
      : `$${Math.round(natRev / 1000)}K`;

    return {
      code: `nat-${idx}`,
      country: item.country,
      name: item.country,
      pct: item.shareNum,
      share: item.pct,
      adr: `$${natAdr.toLocaleString()}`,
      revenue: revStr,
      trend: item.trend,
      up: item.up,
      val: Math.round(natAdr * 0.76),
    };
  });

  const totals = { pct: '62%', trend: '↑ 5%', up: true };

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.4s' }}
      onClick={() => openDrawer({ 
        type: 'TOP_NATIONALITIES', 
        title: `Top Nationalities — ${propertyName}`, 
        data: nationalityTable 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Guest Nationality (Top 4)</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'TOP_NATIONALITIES',
                title: `Top Nationalities — ${propertyName}`,
                data: nationalityTable,
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="The distribution of guest origin countries based on check-ins MTD." />
        </div>
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
        {/* Header */}
        <div className="grid grid-cols-[48%_32%_20%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
          <div>Country</div>
          <div className="text-right">% Share</div>
          <div className="text-right">Trend</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
          {data.map((row) => (
            <div key={row.country} className="grid grid-cols-[48%_32%_20%] items-center text-[10px]">
              <div className="truncate text-zinc-700 font-medium pr-1">{row.country}</div>
              <div className="text-right font-medium text-zinc-900">{row.pct}</div>
              <div className={`text-right font-medium text-[9.5px] ${row.up ? 'text-emerald-700' : 'text-rose-600'}`}>{row.trend}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[48%_32%_20%] items-center pt-1.5 border-t border-zinc-100 text-[10px] shrink-0">
          <div className="font-bold text-zinc-900">Top 4 Total</div>
          <div className="text-right font-bold text-zinc-900">{totals.pct}</div>
          <div className={`text-right font-bold text-[9.5px] ${totals.up ? 'text-emerald-700' : 'text-rose-600'}`}>{totals.trend}</div>
        </div>
      </div>
    </div>
  );
}


