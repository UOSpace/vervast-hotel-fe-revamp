import { Heart, UsersGroupTwoRounded, Wineglass, ArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 hover:text-[#C8A050] transition-colors text-[9px] border border-[#7d6b5e]/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#4a3c31] text-[#fdfaf7] text-[9.5px] rounded p-2 shadow-xl z-[90] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#4a3c31]" />
      </div>
    </div>
  );
}

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
        <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] flex items-center gap-1">
          <span>UPCOMING EVENTS</span>
          <InfoTooltip text="Highlights of upcoming retreats, group private buyouts, and guest activities." />
        </div>
        <button className="flex items-center gap-1 text-[#4a3c31] text-[9px] font-bold hover:opacity-80 transition-opacity uppercase tracking-wider">
          View all <ArrowRight size={10} />
        </button>
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
    </div>
  );
}
