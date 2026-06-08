import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { Heart, UsersGroupTwoRounded, Wineglass, RoundAltArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function UpcomingEventsWidget() {
  const { openDrawer } = useDashboardDrawer();
  const events = [
    { title: 'Wellness Retreat', date: 'May 20 - May 23, 2027', icon: Heart },
    { title: 'Private Buyout', date: 'May 28 - May 30, 2027', icon: UsersGroupTwoRounded },
    { title: 'Wine Tasting Evening', date: 'June 1, 2027', icon: Wineglass },
  ];

  return (
    <div 
      className="relative border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all cursor-pointer animate-card-enter" 
      style={{ animationDelay: '0.55s' }}
      onClick={() => openDrawer({ type: 'GUEST_ARRIVALS', title: 'Upcoming Events' })}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="uppercase tracking-widest text-[10px] font-bold text-[#7d6b5e]">
          <span>UPCOMING EVENTS</span>
        </div>
        <div className="flex items-center gap-2">
          <InfoTooltip text="Highlights of upcoming retreats, group private buyouts, and guest activities." />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <div key={event.title} className="flex items-center gap-4">
              <Icon size={28} className="text-[#8c6b4f] shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#4a3c31]">{event.title}</span>
                <span className="text-[10px] text-[#6A5848]">{event.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="flex items-center gap-1 text-[#4a3c31] text-[9px] font-bold mt-auto self-end hover:opacity-80 transition-opacity uppercase tracking-wider">
        View all <RoundAltArrowRight size={10} />
      </button>
    </div>
  );
}
