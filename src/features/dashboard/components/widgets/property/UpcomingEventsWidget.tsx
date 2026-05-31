import { Heart, UsersGroupTwoRounded, Wineglass, ArrowRight } from '@solar-icons/react';

export function UpcomingEventsWidget() {
  const events = [
    { title: 'Wellness Retreat', date: 'May 20 - May 23, 2027', icon: Heart },
    { title: 'Private Buyout', date: 'May 28 - May 30, 2027', icon: UsersGroupTwoRounded },
    { title: 'Wine Tasting Evening', date: 'June 1, 2027', icon: Wineglass },
  ];

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 animate-card-enter" style={{ animationDelay: '0.55s' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e]">UPCOMING EVENTS</div>
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
