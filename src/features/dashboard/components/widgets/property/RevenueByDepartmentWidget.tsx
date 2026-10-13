import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';

export function RevenueByDepartmentWidget({ 
  propertyId: rawPropertyId = 'sosei-barcelona',
  propertyName,
}: { 
  propertyId?: string;
  propertyName?: string;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const propertyRevenueMap: Record<string, number> = {
    'sosei-barcelona': 1480000,
    'sosei-tokyo': 1350000,
    'sosei-bali': 980000,
    'sosei-maldives': 1850000,
    'sosei-switzerland': 1950000,
    'sosei-canada': 1120000,
    'sosei-costa-rica': 820000,
    'sosei-japan': 1050000,
    'sosei-oman': 920000,
    'sosei-egypt': 760000,
  };

  const roomRev = propertyRevenueMap[propertyId] ?? 1480000;
  const fnbRev = Math.round(roomRev * 0.32);
  const spaRev = Math.round(roomRev * 0.11);
  const otherRev = Math.round(roomRev * 0.03);
  const totalRev = roomRev + fnbRev + spaRev + otherRev;

  const data = [
    { dept: 'Rooms', today: `$${roomRev.toLocaleString()}`, rawVal: roomRev, trend: '↑ 14.0%', up: true },
    { dept: 'F&B', today: `$${fnbRev.toLocaleString()}`, rawVal: fnbRev, trend: '↑ 8.5%', up: true },
    { dept: 'Spa & Wellness', today: `$${spaRev.toLocaleString()}`, rawVal: spaRev, trend: '↑ 11.2%', up: true },
    { dept: 'Other Income', today: `$${otherRev.toLocaleString()}`, rawVal: otherRev, trend: '↑ 5.0%', up: true },
  ];

  const totals = { today: `$${totalRev.toLocaleString()}`, trend: '↑ 12.8%', up: true };
  const activePropName = propertyName || 'SOSEI Barcelona';

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.25s' }}
      onClick={() => openDrawer({ 
        type: 'DEPARTMENT_REVENUE', 
        title: `Department Revenue — ${activePropName}`, 
        data: { propertyId, propertyName: activePropName, roomRev, fnbRev, spaRev, otherRev, totalRev, data, totals } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Revenue by Department (USD)</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'DEPARTMENT_REVENUE',
                title: `Department Revenue — ${activePropName}`,
                data: { propertyId, propertyName: activePropName, roomRev, fnbRev, spaRev, otherRev, totalRev, data, totals }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="Income breakdown across rooms, food & beverage, spa, and miscellaneous departments." />
        </div>
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
        {/* Header */}
        <div className="grid grid-cols-[48%_32%_20%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
          <div>Department</div>
          <div className="text-right">Revenue</div>
          <div className="text-right">Trend</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
          {data.map((row) => (
            <div key={row.dept} className="grid grid-cols-[48%_32%_20%] items-center text-[10px]">
              <div className="text-zinc-700 font-medium truncate pr-1">{row.dept}</div>
              <div className="text-right font-medium text-zinc-900">{row.today}</div>
              <div className={`text-right font-medium text-[9.5px] ${row.up ? 'text-emerald-700' : 'text-rose-600'}`}>{row.trend}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[48%_32%_20%] items-center pt-1.5 border-t border-zinc-100 text-[10px] shrink-0">
          <div className="font-bold text-zinc-900">Total</div>
          <div className="text-right font-bold text-zinc-900">{totals.today}</div>
          <div className={`text-right font-bold text-[9.5px] ${totals.up ? 'text-emerald-700' : 'text-rose-600'}`}>{totals.trend}</div>
        </div>
      </div>
    </div>
  );
}

