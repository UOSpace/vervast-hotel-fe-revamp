import { InfoTooltip } from '../../../common/components/InfoTooltip';

import dashboardData from '../../../../data/dashboardData.json';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';

export function GlobalAlertsWidget() {
  const { openDrawer } = useDashboardDrawer();

  // Show first 3 alerts with Zen status dots and Shoji dividers for Wa & Wabi-Sabi balance
  const alerts = dashboardData.globalAlerts.slice(0, 3);
  const statusColors = ['bg-[#C3A481]', 'bg-[#6B7280]', 'bg-[#15803d]'];

  return (
    <div className="w-full h-full flex flex-col justify-between py-1">
      {/* Header with serene subtitle & live pulse */}
      <div className="flex items-center justify-between mb-2">
        <InfoTooltip text="Important alerts and notifications across all properties.">
          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-[#374151] cursor-help">Global Alerts & Insights</h3>
            <p className="text-[10px] text-[#6B7280] flex items-center gap-1.5">
              <span>REAL-TIME NOTIFICATIONS</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </p>
          </div>
        </InfoTooltip>
      </div>

      {/* Shoji-style 3-column grid with vertical dividers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 flex-1 my-auto items-stretch py-1">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex flex-col justify-between px-3 py-1 border-b sm:border-b-0 sm:border-r border-[#d4c4b7]/30 last:border-0 hover:bg-gray-200/30 transition-all duration-300 cursor-pointer group/alert h-full"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'ALERTS',
                title: 'Alert Details',
                data: alert,
              });
            }}
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColors[i % statusColors.length]}`} />
                <h4 className="text-[10px] font-semibold uppercase tracking-wide text-[#374151] leading-tight truncate">{alert.title}</h4>
              </div>
              <p className="text-[10px] text-[#6B7280] leading-relaxed flex-1 text-left">{alert.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
