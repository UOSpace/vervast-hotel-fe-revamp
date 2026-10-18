import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import {
  getPropertyMetrics,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import { fmtTrendArrow } from '@/data/portfolio/hospitalitySubMix';

export function RevenueByDepartmentWidget({ 
  propertyId: rawPropertyId = 'sosei-barcelona',
  propertyName,
  period = 'mtd',
}: { 
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const m = getPropertyMetrics(propertyId, period);

  const roomRev = m.roomRevenue;
  const fnbRev = m.fnbRevenue;
  const spaRev = m.spaRevenue;
  const otherRev = m.experienceRevenue;
  const totalRev = m.totalRevenue;

  const data = [
    { dept: 'Rooms', today: fmtUsdFull(roomRev), rawVal: roomRev, trend: fmtTrendArrow(m.vsLy.roomRevenuePct), up: m.vsLy.roomRevenuePct >= 0 },
    { dept: 'F&B', today: fmtUsdFull(fnbRev), rawVal: fnbRev, trend: fmtTrendArrow(m.vsLy.fnbRevenuePct), up: m.vsLy.fnbRevenuePct >= 0 },
    { dept: 'Spa & Wellness', today: fmtUsdFull(spaRev), rawVal: spaRev, trend: fmtTrendArrow(m.vsLy.spaRevenuePct), up: m.vsLy.spaRevenuePct >= 0 },
    { dept: 'Activities & Experiences', today: fmtUsdFull(otherRev), rawVal: otherRev, trend: fmtTrendArrow(m.vsLy.experienceRevenuePct), up: m.vsLy.experienceRevenuePct >= 0 },
  ];

  const totals = {
    today: fmtUsdFull(totalRev),
    trend: fmtTrendArrow(m.vsLy.totalRevenuePct),
    up: m.vsLy.totalRevenuePct >= 0,
  };
  const activePropName = propertyName || m.name;

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.25s' }}
      onClick={() => openDrawer({ 
        type: 'DEPARTMENT_REVENUE', 
        title: `Department Revenue — ${activePropName}`, 
        data: { propertyId, propertyName: activePropName, period, roomRev, fnbRev, spaRev, otherRev, totalRev, data, totals } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <InfoTooltip text="Income breakdown across rooms, food & beverage, spa, and experience departments.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Revenue by Department (USD)</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'DEPARTMENT_REVENUE',
                title: `Department Revenue — ${activePropName}`,
                data: { propertyId, propertyName: activePropName, period, roomRev, fnbRev, spaRev, otherRev, totalRev, data, totals }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
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

