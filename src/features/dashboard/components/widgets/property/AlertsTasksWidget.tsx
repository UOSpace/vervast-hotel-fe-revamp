import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function AlertsTasksWidget({
  propertyId = 'sosei-nocturne',
  propertyName = 'SOSEI Nocturne',
}: {
  propertyId?: string;
  propertyName?: string;
}) {
  const { openDrawer } = useDashboardDrawer();

  const propertyAlertsMap: Record<string, Array<{ id: string; priority: string; title: string; text: string; detail: string; tag: string }>> = {
    'sosei-nocturne': [
      { id: 'alt-1', priority: 'High', title: '3 VIP Arrivals Scheduled Today', text: 'Ensure personalized welcome and Matterhorn amenity setup in Villa 12 & 14', detail: 'Lord & Lady Harrington (Villa 12) arriving 14:30. Butler Jean-Paul has prepared bespoke Swiss chocolate assortment and vintage champagne.', tag: 'VIP Care' },
      { id: 'alt-2', priority: 'Medium', title: 'Low Inventory: Thermal Spa Elixirs', text: 'Only 8 custom botanical tinctures remaining in dispensary stock', detail: 'Order pending signature with Valais Alpine Apothecary. Delivery scheduled for tomorrow morning.', tag: 'Inventory' },
      { id: 'alt-3', priority: 'Low', title: 'Scheduled Maintenance: Panoramic Sauna', text: 'Routine thermal inspection scheduled at 2:00 PM today with Engineering', detail: 'Maintenance window: 14:00 – 15:30. Guest notice already published on private digital butler app.', tag: 'Facilities' },
    ],
  };

  const alerts = propertyAlertsMap[propertyId] ?? [
    { id: 'alt-1', priority: 'High', title: '2 VIP Arrivals Expected This Afternoon', text: 'Butler suite preparation and personalized private check-in ready', detail: 'Ensure champagne and private concierge briefing are complete before 15:00 arrival.', tag: 'VIP Care' },
    { id: 'alt-2', priority: 'Medium', title: 'Spa Booking Pace +18% Above Average', text: 'Peak treatment slots for 16:00 – 19:00 fully booked; extra practitioner standby requested', detail: 'Review therapist schedule for afternoon rotation to accommodate in-house walk-ins.', tag: 'Operations' },
    { id: 'alt-3', priority: 'Low', title: 'Wine Cellar Delivery Inspection', text: 'Sommelier team conducting inventory reception for Grand Cru vintage allocation', detail: 'Delivery arrives at 11:30. Temperature controlled receiving dock prepped.', tag: 'Culinary' },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.6s' }}
      onClick={() => openDrawer({ 
        type: 'ALERTS', 
        title: `Operational Alerts & Tasks — ${propertyName}`, 
        data: { propertyName, propertyId, alerts } 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Alerts & Tasks</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'ALERTS',
                title: `Operational Alerts & Tasks — ${propertyName}`,
                data: { propertyName, propertyId, alerts },
              });
            }}
            className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer lowercase"
          >
            <span className="capitalize">See</span> details <span className="text-zinc-600">→</span>
          </button>
          <InfoTooltip text="High priority operation alerts and housekeeping or maintenance reminders." />
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



