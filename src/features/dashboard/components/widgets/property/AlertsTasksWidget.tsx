import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { UserId, Box, Settings, RoundAltArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

export function AlertsTasksWidget() {
  const { openDrawer } = useDashboardDrawer();
  const alerts = [
    { title: '3 VIP arrivals today', desc: 'Ensure personalized welcome', icon: UserId },
    { title: 'Low inventory: Spa gift cards', desc: 'Only 8 remaining', icon: Box },
    { title: 'Maintenance: Sauna room', desc: 'Scheduled for 2:00 PM', icon: Settings },
  ];

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 backdrop-blur-sm hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all cursor-pointer animate-card-enter" 
      style={{ animationDelay: '0.6s' }}
      onClick={() => openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' })}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="uppercase tracking-widest text-[10px] font-bold text-[#7d6b5e]">
          <span>ALERTS & TASKS</span>
        </div>
        <div className="flex items-center gap-2">
          <InfoTooltip text="High priority operation alerts and housekeeping or maintenance reminders." />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div key={alert.title} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-md border border-[#d4c4b7] flex items-center justify-center bg-[#f3eae1]/50 shrink-0">
                <Icon size={24} className="text-[#8c6b4f]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-[#4a3c31]">{alert.title}</span>
                <span className="text-[10px] text-[#6A5848]">{alert.desc}</span>
              </div>
              <RoundAltArrowRight size={14} className="text-[#d4c4b7] group-hover:text-[#8c6b4f] transition-colors" />
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
