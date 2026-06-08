import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { Heart, UsersGroupTwoRounded, Plain, CloudRain } from '@solar-icons/react';

import dashboardData from '../../../../data/dashboardData.json';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';

const iconMap: Record<string, any> = {
  heart: <Heart size={18} className="text-[#947b66]" />,
  users: <UsersGroupTwoRounded size={18} className="text-[#947b66]" />,
  plane: <Plain size={18} className="text-[#947b66]" />,
  weather: <CloudRain size={18} className="text-[#947b66]" />
};

export function GlobalAlertsWidget() {
  const { openDrawer } = useDashboardDrawer();

  // Show only first 4 alerts in the widget card
  const alerts = dashboardData.globalAlerts.slice(0, 4).map(a => ({
    ...a,
    icon: iconMap[a.icon]
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#4a3c31]">Global Alerts & Insights</h3>
        <InfoTooltip text="Important alerts and notifications across all properties." />
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1">
        {alerts.map((alert, i) => (
          <div key={i} className="flex flex-col">
            <div className="mb-2">{alert.icon}</div>
            <h4 className="text-[10px] font-bold uppercase tracking-wide text-[#4a3c31] mb-1">{alert.title}</h4>
            <p className="text-[10px] text-[#4a3c31] flex-1 pr-2 leading-relaxed">{alert.text}</p>
            <button
              className="text-[9px] text-[#a65e52] font-semibold border-b border-transparent hover:border-[#a65e52] self-start transition-colors outline-none focus:outline-none cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                openDrawer({
                  type: 'ALERTS',
                  title: 'Alert Details',
                  data: alert
                });
              }}
            >
              {alert.action}
            </button>
          </div>
        ))}
      </div>

      <button
        className="text-[10px] text-[#7d6b5e] hover:text-[#4a3c31] underline cursor-pointer self-start mt-3"
        onClick={(e) => {
          e.stopPropagation();
          openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' });
        }}
      >
        View all →
      </button>
    </div>
  );
}
