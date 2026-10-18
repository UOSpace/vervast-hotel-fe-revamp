import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import { fmtUsdFull, type PeriodId } from '@/data/portfolio';
import { getPropertyEvents } from '@/data/portfolio/hospitalitySubMix';

export function UpcomingEventsWidget({
  propertyId: rawPropertyId = 'sosei-barcelona',
  propertyName = 'SOSEI Barcelona',
  period = 'mtd',
}: {
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const events = getPropertyEvents(propertyId).map((ev) => ({
    ...ev,
    revenue: fmtUsdFull(ev.revenueUsd),
  }));

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.55s' }}
      onClick={() => openDrawer({ 
        type: 'UPCOMING_EVENTS', 
        title: `Upcoming Events & Buyouts — ${propertyName}`, 
        data: { propertyId, propertyName, period, events } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <InfoTooltip text="Highlights of upcoming retreats, group private buyouts, and guest activities.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Upcoming Events</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'UPCOMING_EVENTS',
                title: `Upcoming Events & Buyouts — ${propertyName}`,
                data: { propertyId, propertyName, period, events }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5">
        {events.map((event) => (
          <div key={event.title} className="flex justify-between items-baseline border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0">
            <div>
              <div className="text-[10.5px] font-bold text-zinc-900 leading-tight">{event.title}</div>
              <div className="text-[9px] text-zinc-400 font-normal mt-0.5">{event.category}</div>
            </div>
            <span className="text-[9.5px] text-zinc-500 font-medium">{event.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


