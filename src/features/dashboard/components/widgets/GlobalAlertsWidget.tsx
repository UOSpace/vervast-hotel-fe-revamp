import { InfoTooltip } from '../../../common/components/InfoTooltip';
import dashboardData from '../../../../data/dashboardData.json';
import { useDashboardDrawer } from '../../context/DashboardDrawerContext';

export function GlobalAlertsWidget() {
  const { openDrawer } = useDashboardDrawer();

  // Show first 3 alerts as clean vertical list rows
  const alerts = dashboardData.globalAlerts.slice(0, 3);

  return (
    <div className="w-full h-full flex flex-col justify-between py-0.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <InfoTooltip text="Important alerts and notifications across all properties.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Global Alerts & Insights</h3>
            <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>REAL-TIME NOTIFICATIONS</span>
            </p>
          </div>
        </InfoTooltip>
      </div>

      {/* Vertical list rows without dots */}
      <div className="flex-1 flex flex-col justify-around py-0.5">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex flex-col py-1 px-1 rounded hover:bg-zinc-100/80 transition-all cursor-pointer group/alert border-b border-zinc-100 last:border-0"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'ALERTS',
                title: 'Alert Details',
                data: alert,
              });
            }}
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-wide text-zinc-900 truncate mb-0.5">{alert.title}</h4>
            <p className="text-[9.5px] text-zinc-600 leading-tight line-clamp-1 text-left">{alert.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
