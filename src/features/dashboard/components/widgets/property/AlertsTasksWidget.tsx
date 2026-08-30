import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function AlertsTasksWidget() {
  const { openDrawer } = useDashboardDrawer();
  const alerts = [
    { title: '3 VIP arrivals today', desc: 'Ensure personalized welcome and amenity setup in Villa 12 & 14', tag: 'VIP Care' },
    { title: 'Low inventory: Spa gift cards', desc: 'Only 8 cards remaining in stock, order pending approval', tag: 'Inventory' },
    { title: 'Maintenance: Sauna room', desc: 'Scheduled maintenance at 2:00 PM today with Engineering team', tag: 'Facilities' },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.6s' }}
      onClick={() => openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Alerts & Tasks</h3>
        <InfoTooltip text="High priority operation alerts and housekeeping or maintenance reminders." />
      </div>

      <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5">
        {alerts.map((alert) => (
          <div key={alert.title} className="flex flex-col border-b border-zinc-100 pb-2.5 last:border-0 last:pb-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[10.5px] font-bold text-zinc-900 leading-tight truncate">{alert.title}</span>
              <span className="text-[9px] font-semibold text-zinc-400 shrink-0 ml-2">{alert.tag}</span>
            </div>
            <span className="text-[9.5px] text-zinc-500 font-normal leading-snug truncate">{alert.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



