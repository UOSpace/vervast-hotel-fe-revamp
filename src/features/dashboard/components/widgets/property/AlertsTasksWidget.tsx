import { UserId, Box, Settings, ArrowRight } from '@solar-icons/react';

export function AlertsTasksWidget() {
  const alerts = [
    { title: '3 VIP arrivals today', desc: 'Ensure personalized welcome', icon: UserId },
    { title: 'Low inventory: Spa gift cards', desc: 'Only 8 remaining', icon: Box },
    { title: 'Maintenance: Sauna room', desc: 'Scheduled for 2:00 PM', icon: Settings },
  ];

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 animate-card-enter" style={{ animationDelay: '0.6s' }}>
      <div className="flex justify-between items-center mb-4">
        <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e]">ALERTS & TASKS</div>
        <button className="flex items-center gap-1 text-[#4a3c31] text-[9px] font-bold hover:opacity-80 transition-opacity uppercase tracking-wider">
          View all <ArrowRight size={10} />
        </button>
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
              <ArrowRight size={14} className="text-[#d4c4b7] group-hover:text-[#8c6b4f] transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
