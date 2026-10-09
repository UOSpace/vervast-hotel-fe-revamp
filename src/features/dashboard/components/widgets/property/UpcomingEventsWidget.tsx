import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function UpcomingEventsWidget({
  propertyId = 'sosei-nocturne',
  propertyName = 'SOSEI Nocturne',
}: {
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();

  const propertyEventsMap: Record<string, Array<{ title: string; date: string; category: string; attendees: number; revenue: string }>> = {
    'sosei-nocturne': [
      { title: 'Alpine Peak Wellness Retreat', date: 'Oct 14 – Oct 18, 2026', category: 'Wellness Sanctuary', attendees: 24, revenue: '$148,000' },
      { title: 'Zermatt Private Chalet Buyout', date: 'Oct 22 – Oct 25, 2026', category: 'Corporate Buyout', attendees: 38, revenue: '$285,000' },
      { title: 'Matterhorn Sommeliers Evening', date: 'Nov 02, 2026', category: 'Culinary Gala', attendees: 45, revenue: '$42,000' },
    ],
    'sosei-aurora': [
      { title: 'Northern Lights Photography Expedition', date: 'Oct 15 – Oct 19, 2026', category: 'Expedition', attendees: 18, revenue: '$112,000' },
      { title: 'Arctic Thermal Recovery Weekend', date: 'Oct 24 – Oct 27, 2026', category: 'Wellness', attendees: 22, revenue: '$135,000' },
      { title: 'Lapland Private Estate Buyout', date: 'Nov 05 – Nov 09, 2026', category: 'Private Buyout', attendees: 30, revenue: '$210,000' },
    ],
  };

  const events = propertyEventsMap[propertyId] ?? [
    { title: 'Bespoke Curated Sanctuary Retreat', date: 'Oct 16 – Oct 20, 2026', category: 'Wellness Retreat', attendees: 20, revenue: '$125,000' },
    { title: 'Exclusive Estate Buyout', date: 'Oct 25 – Oct 28, 2026', category: 'Private Event', attendees: 32, revenue: '$195,000' },
    { title: 'Signature Culinary Masterclass', date: 'Nov 04, 2026', category: 'Culinary', attendees: 25, revenue: '$35,000' },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.55s' }}
      onClick={() => openDrawer({ 
        type: 'UPCOMING_EVENTS', 
        title: `Upcoming Events & Buyouts — ${propertyName}`, 
        data: { propertyId, propertyName, events } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Events</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'UPCOMING_EVENTS',
                title: `Upcoming Events & Buyouts — ${propertyName}`,
                data: { propertyId, propertyName, events }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="Highlights of upcoming retreats, group private buyouts, and guest activities." />
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


