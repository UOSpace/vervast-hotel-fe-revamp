import { Heart, UsersGroupTwoRounded, Plain, CloudRain } from '@solar-icons/react';

import dashboardData from '../../../../data/dashboardData.json';

const iconMap: Record<string, any> = {
  heart: <Heart size={18} className="text-[#947b66]" />,
  users: <UsersGroupTwoRounded size={18} className="text-[#947b66]" />,
  plane: <Plain size={18} className="text-[#947b66]" />,
  weather: <CloudRain size={18} className="text-[#947b66]" />
};

export function GlobalAlertsWidget() {
  const alerts = dashboardData.globalAlerts.map(a => ({
    ...a,
    icon: iconMap[a.icon]
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Global Alerts & Insights</h3>
        <button className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31]">View all →</button>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        {alerts.map((alert, i) => (
          <div key={i} className="flex flex-col">
            <div className="mb-2">{alert.icon}</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-[#4a3c31] mb-1">{alert.title}</h4>
            <p className="text-[10px] text-[#4a3c31] flex-1 pr-2 leading-relaxed">{alert.text}</p>
            <button className="text-[9px] text-[#7d6b5e] border-b border-transparent hover:border-[#7d6b5e] self-start transition-colors outline-none focus:outline-none">{alert.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
