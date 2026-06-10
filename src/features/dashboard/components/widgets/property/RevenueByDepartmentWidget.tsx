import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function RevenueByDepartmentWidget() {
  const { openDrawer } = useDashboardDrawer();
  const data = [
    { dept: 'Rooms', today: '$1,046,800', trend: '↑ 9%', up: true },
    { dept: 'F&B', today: '$374,400', trend: '↑ 7%', up: true },
    { dept: 'Spa & Wellness', today: '$119,600', trend: '↑ 12%', up: true },
    { dept: 'Other Income', today: '$28,400', trend: '↑ 5%', up: true },
  ];

  const totals = { today: '$1,569,200', trend: '↑ 8%', up: true };

  return (
    <div 
      className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 transition-all cursor-pointer animate-card-enter" 
      style={{ animationDelay: '0.25s' }}
      onClick={() => openDrawer({ type: 'SPEND_OVERTIME', title: 'Revenue by Department', data: totals.today })}
    >
      <div className="uppercase tracking-widest text-[10px] font-bold text-[#7d6b5e] mb-4 flex items-center justify-between">
        <span>REVENUE BY DEPARTMENT (USD)</span>
        <InfoTooltip text="Income breakdown across rooms, food & beverage, spa, and miscellaneous departments." />
      </div>

      <div className="flex flex-col text-xs text-[#4a3c31] h-full justify-between pb-1">
        <div>
          {/* Header */}
          <div className="grid grid-cols-[45%_35%_20%] mb-2 pb-2 border-b border-[#d4c4b7]/50 font-bold">
            <div>Department</div>
            <div className="text-right">Revenue</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-3 mt-3">
            {data.map((row) => (
              <div key={row.dept} className="grid grid-cols-[45%_35%_20%] items-center">
                <div>{row.dept}</div>
                <div className="text-right">{row.today}</div>
                <div className={`text-right ${row.up ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>{row.trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[45%_35%_20%] items-center mt-4 pt-3 border-t border-[#d4c4b7]/50 font-bold">
          <div>Total</div>
          <div className="text-right">{totals.today}</div>
          <div className={`text-right ${totals.up ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>{totals.trend}</div>
        </div>
      </div>
    </div>
  );
}
