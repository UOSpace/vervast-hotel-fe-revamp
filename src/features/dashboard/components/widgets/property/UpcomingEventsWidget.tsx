import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function UpcomingEventsWidget() {
  const { openDrawer } = useDashboardDrawer();
  const events = [
    { title: 'Wellness Retreat', date: 'May 20 – May 23, 2027', category: 'Retreat' },
    { title: 'Private Buyout', date: 'May 28 – May 30, 2027', category: 'Private Event' },
    { title: 'Wine Tasting Evening', date: 'June 1, 2027', category: 'Culinary' },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.55s' }}
      onClick={() => openDrawer({ type: 'GUEST_ARRIVALS', title: 'Upcoming Events' })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Events</h3>
        <InfoTooltip text="Highlights of upcoming retreats, group private buyouts, and guest activities." />
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


