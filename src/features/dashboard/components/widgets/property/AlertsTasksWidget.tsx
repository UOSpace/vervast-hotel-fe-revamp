import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import { type PeriodId } from '@/data/portfolio';
import { getPropertyAlerts } from '@/data/portfolio/hospitalitySubMix';

export function AlertsTasksWidget({
  propertyId: rawPropertyId = 'sosei-geneva',
  propertyName = 'SOSEI Geneva',
  period = 'mtd',
}: {
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const alerts = getPropertyAlerts(propertyId, propertyName);

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.6s' }}
      onClick={() => openDrawer({ 
        type: 'ALERTS', 
        title: `Operational Alerts & Tasks — ${propertyName}`, 
        data: { propertyName, propertyId, period, alerts } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <InfoTooltip text="High priority operation alerts and housekeeping or maintenance reminders.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Alerts &amp; Tasks</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'ALERTS',
                title: `Operational Alerts & Tasks — ${propertyName}`,
                data: { propertyName, propertyId, period, alerts },
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5">
        {alerts.map((alert) => (
          <div key={alert.title} className="flex flex-col border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[10.5px] font-bold text-zinc-900 leading-tight truncate">{alert.title}</span>
              <span className="text-[9px] font-semibold text-zinc-400 shrink-0 ml-2">{alert.tag}</span>
            </div>
            <span className="text-[9.5px] text-zinc-500 font-normal leading-snug truncate">{alert.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



