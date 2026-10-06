import React, { useState, useEffect } from 'react';
import { useDashboardDrawer } from '../context/DashboardDrawerContext';
import { CloseCircle, RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import dashboardData from '../../../data/dashboardData.json';
import { getDashboardComputedData } from '../../../data/pms';
import { useTheme } from '../../../config/theme-provider';
import { MetricDrawerContent, accuratePropertiesData } from './drawers/MetricDrawerContent';
import { GuestMovementDrawerContent } from './drawers/GuestMovementDrawerContent';
import { FnbDrawerContent } from './drawers/FnbDrawerContent';
import { SpaDrawerContent } from './drawers/SpaDrawerContent';

const propertiesPerformanceData = accuratePropertiesData;


export function DashboardDrawer() {
  const { isOpen, config, closeDrawer, openDrawer } = useDashboardDrawer();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setActive(true), 20);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
    }
  }, [isOpen]);

  if (!config) return null;

  const renderContent = () => {
    if (!config) return null;

    switch (config.type) {
      case 'LIVE_OVERVIEW':
        return (
          <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Global real-time property status across all 6 collections.</p>
              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Avg 78.4% Occupancy
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Sosei Alpine Collection', location: 'St. Moritz & Zermatt', time: '14:30 CET', occ: '87.2%', status: 'Peak Season', count: '180 Rms' },
                { name: 'Sosei Ocean Collection', location: 'Maldives & Amalfi', time: '18:30 MVT', occ: '84.1%', status: 'High Demand', count: '170 Rms' },
                { name: 'Sosei City Collection', location: 'Tokyo & New York', time: '22:30 JST', occ: '76.8%', status: 'Normal Pace', count: '280 Rms' },
                { name: 'Sosei Countryside Collection', location: 'Kyoto & Tuscany', time: '22:30 JST', occ: '75.3%', status: 'Normal Pace', count: '190 Rms' },
                { name: 'Sosei Forest Collection', location: 'Black Forest & Hokkaido', time: '14:30 CET', occ: '69.4%', status: 'Steady Flow', count: '240 Rms' },
                { name: 'Sosei Desert Collection', location: 'Al Wadi & Sedona', time: '17:30 GST', occ: '61.2%', status: 'Midweek Dip', count: '180 Rms' },
              ].map((resort) => (
                <div key={resort.name} className="p-3.5 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 flex justify-between items-center hover:bg-zinc-100/60 dark:hover:bg-zinc-800/70 transition-all">
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">{resort.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{resort.location} Â· Local Time: <span className="font-medium text-zinc-700 dark:text-zinc-300">{resort.time}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">{resort.occ}</div>
                    <div className="text-[10px] text-zinc-500 flex items-center justify-end gap-1.5 mt-0.5">
                      <span>{resort.count}</span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">{resort.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'METRIC':
        return <MetricDrawerContent config={config} theme={theme} />;

      case 'ALERTS':
        // If data is provided, show specific alert detail
        if (config.data) {
          const alert = config.data;
          const priorityColorMap: Record<string, string> = {
            High: '#e11d48',
            Medium: '#f59e0b',
            Low: '#059669',
          };
          const priorityColor = priorityColorMap[alert.priority] || '#71717a';

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <button
                onClick={() => openDrawer({ type: 'ALERTS', title: 'Global Alerts & Insights' })}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 mb-2 outline-none cursor-pointer transition-colors"
              >
                â† Back to all alerts
              </button>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50/40 dark:bg-zinc-800/30">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ borderColor: `${priorityColor}40`, color: priorityColor, backgroundColor: `${priorityColor}10` }}>
                    {alert.priority} Priority
                  </span>
                </div>

                <h3 className="text-base font-bold mb-2 leading-snug text-zinc-900 dark:text-zinc-100">{alert.title}</h3>
                <p className="text-xs font-medium mb-4 text-zinc-500">{alert.text}</p>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
                  <h4 className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-2">Detailed Operational Report</h4>
                  <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {alert.detail}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={closeDrawer}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          );
        }

        // Otherwise, show list of all alerts
        return (
          <div className="space-y-4 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <p className="text-xs text-zinc-500 mb-2 font-normal">Actionable insights requiring operational attention across all properties.</p>
            <div className="flex flex-col gap-3">
              {dashboardData.globalAlerts.map((alert: any) => {
                const priorityColorMap: Record<string, string> = {
                  High: '#e11d48',
                  Medium: '#f59e0b',
                  Low: '#059669',
                };
                const borderLeftColor = priorityColorMap[alert.priority] || '#71717a';

                return (
                  <div
                    key={alert.id}
                    className="p-4 border-l-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 border-t border-r border-b border-zinc-200 dark:border-zinc-800 flex flex-col justify-between"
                    style={{ borderLeftColor }}
                  >
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{alert.title}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border" style={{ borderColor: `${borderLeftColor}30`, color: borderLeftColor, backgroundColor: `${borderLeftColor}08` }}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{alert.text}</p>
                    </div>
                    <button
                      onClick={() => openDrawer({ type: 'ALERTS', title: 'Alert Details', data: alert })}
                      className="text-[9.5px] text-zinc-700 dark:text-zinc-300 font-semibold hover:underline mt-3 self-end flex items-center gap-1 cursor-pointer"
                    >
                      See details <RoundAltArrowRight size={10} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'GUEST_MOVEMENT':
        return <GuestMovementDrawerContent theme={theme} />;

      case 'ROOM_TIER_OCCUPANCY':
        return (
          <div className="space-y-6 animate-fade-in text-xs text-zinc-900">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Room Tier & Suite Occupancy Performance</h4>
              <p className="text-xs text-zinc-500 mt-1">Real-time room tier occupancy rates, ADR premium, and inventory breakdown across all 12 sanctuaries.</p>
            </div>

            {/* Metric summary boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Total Suite Inventory</span>
                <div className="text-xl font-bold text-zinc-900 mt-1">320 Suites</div>
                <span className="text-[10px] text-zinc-400 mt-0.5 block">Across 12 Sanctuaries</span>
              </div>
              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Tier Occupancy Average</span>
                <div className="text-xl font-bold text-emerald-700 mt-1">83.42%</div>
                <span className="text-[10px] text-emerald-700 font-medium mt-0.5 block">â†‘ 5.2% vs Last Month</span>
              </div>
              <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Top Tier ADR</span>
                <div className="text-xl font-bold text-zinc-900 mt-1">$3,450.00</div>
                <span className="text-[10px] text-zinc-400 mt-0.5 block">Presidential & Royal Villas</span>
              </div>
            </div>

            {/* Table with horizontal scroll safety and clear cell padding */}
            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
              <table className="w-full min-w-[650px] text-xs text-zinc-800 border-separate border-spacing-0">
                <thead className="sticky -top-6 z-20 bg-zinc-50 shadow-2xs">
                  <tr className="text-left text-zinc-500">
                    <th className="py-3 px-3.5 font-semibold text-[10.5px] bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">Room Tier</th>
                    <th className="py-3 px-3 font-semibold text-[10.5px] bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">Category</th>
                    <th className="py-3 px-3 font-semibold text-[10.5px] text-right bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">Inventory</th>
                    <th className="py-3 px-3 font-semibold text-[10.5px] text-right bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">Occupied</th>
                    <th className="py-3 px-3 font-semibold text-[10.5px] text-right bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">Occupancy</th>
                    <th className="py-3 px-3 font-semibold text-[10.5px] text-right bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">ADR (USD)</th>
                    <th className="py-3 px-3.5 font-semibold text-[10.5px] text-right bg-zinc-50 border-b border-zinc-200 whitespace-nowrap">RevPAR (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tier: 'Presidential & Royal Villas', category: 'Ultra Luxury Tier', total: 36, occRooms: 33, occ: '92.00%', adr: '$3,450.00', revpar: '$3,174.00' },
                    { tier: 'Horizon Overwater Suites', category: 'Signature Suite Tier', total: 68, occRooms: 59, occ: '86.50%', adr: '$2,250.00', revpar: '$1,946.25' },
                    { tier: 'Signature Panoramic Chalets', category: 'Premium Chalet Tier', total: 92, occRooms: 75, occ: '81.20%', adr: '$1,650.00', revpar: '$1,339.80' },
                    { tier: 'Garden & Forest Pavilions', category: 'Sanctuary Pavilion Tier', total: 124, occRooms: 92, occ: '74.00%', adr: '$1,180.00', revpar: '$873.20' },
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-semibold text-zinc-900 whitespace-nowrap">{r.tier}</td>
                      <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">{r.category}</td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-700 whitespace-nowrap">{r.total} Rooms</td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-700 whitespace-nowrap">{r.occRooms} Rooms</td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10.5px]">
                          {r.occ}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 whitespace-nowrap">{r.adr}</td>
                      <td className="py-3 px-3.5 text-right font-medium text-zinc-900 whitespace-nowrap">{r.revpar}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'PORTFOLIO_PERFORMANCE':
        return (
          <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Portfolio performance and yield metrics across all 6 collections MTD.</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                12 Sanctuaries MTD Actuals
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
                <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 shadow-2xs">
                  <tr className="text-left text-zinc-400">
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Property Collection</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Occupancy</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">ADR (USD)</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Revenue (USD)</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">RevPAR (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesPerformanceData.map((prop) => {
                    const isExpanded = !!expandedRows[prop.id];
                    return (
                      <React.Fragment key={prop.id}>
                        <tr
                          className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                          onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                        >
                          <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                            {isExpanded ? (
                              <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                            ) : (
                              <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                            )}
                            {prop.name}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                          <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                          <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                          <td className="py-3 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                        </tr>
                        {isExpanded && prop.children.map((child, cIdx) => (
                          <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                            <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                  <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                    <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Average</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">78.40%</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$2,450.00</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$14.80M</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$1,920.80</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'WORLD_MAP':
        return (
          <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Geographic distribution, timezone, and operational property status.</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                12 Sanctuaries Worldwide
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
                <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 shadow-2xs">
                  <tr className="text-left text-zinc-400">
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Property Collection</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Region / Location</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Local Time</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Occupancy</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">ADR (USD)</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Revenue (USD)</th>
                    <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">RevPAR (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesPerformanceData.map((prop) => {
                    const isExpanded = !!expandedRows[prop.id];
                    return (
                      <React.Fragment key={prop.id}>
                        <tr
                          className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                          onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                        >
                          <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 whitespace-nowrap">
                            {isExpanded ? (
                              <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                            ) : (
                              <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                            )}
                            {prop.name}
                          </td>
                          <td className="py-3 px-3 text-zinc-500 whitespace-nowrap">{prop.location}</td>
                          <td className="py-3 px-3 text-right text-zinc-500 whitespace-nowrap">{prop.localTime}</td>
                          <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                          <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                          <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                          <td className="py-3 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                        </tr>
                        {isExpanded && prop.children.map((child, cIdx) => (
                          <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                            <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                            <td className="py-2.5 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                            <td className="py-2.5 px-3 text-right text-[10px] text-zinc-400 whitespace-nowrap">Operational Node</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                            <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                  <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                    <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Average</td>
                    <td className="py-3 px-3 text-zinc-500">12 Sanctuaries Worldwide</td>
                    <td className="py-3 px-3 text-right text-zinc-400">-</td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-bold">78.40%</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$2,450.00</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$14.80M</td>
                    <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">$1,920.80</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'TOP_NATIONALITIES':
        {
          const computed = getDashboardComputedData();
          const nationalityData = computed.topNationalities;

          const totalShare = nationalityData.reduce((acc, item) => acc + (item.pct || 0), 0);
          const totalRevenueUsd = nationalityData.reduce((acc, item) => {
            const num = parseFloat(item.revenue.replace(/[^0-9.]/g, '')) || 0;
            return acc + num;
          }, 0);
          const avgAdrUsd = nationalityData.length > 0
            ? nationalityData.reduce((acc, item) => acc + (parseFloat(item.adr.replace(/[^0-9.]/g, '')) || 0), 0) / nationalityData.length
            : 0;
          const avgRevParUsd = nationalityData.length > 0
            ? nationalityData.reduce((acc, item) => acc + (item.val || 0), 0) / nationalityData.length
            : 0;

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Top nationality performance metrics & market guest share MTD.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  Global Feeder Markets
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
                  <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 shadow-2xs">
                    <tr className="text-left text-zinc-400">
                      <th className="py-2.5 px-3 font-medium text-[9.5px] w-8 border-b border-zinc-200 dark:border-zinc-800">#</th>
                      <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Nationality</th>
                      <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Occupancy Share</th>
                      <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">ADR (USD)</th>
                      <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Total Revenue</th>
                      <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">RevPAR (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nationalityData.map((item, idx) => (
                      <tr key={item.code || idx} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-3 text-zinc-400 font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{item.country}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-emerald-700">{item.occ || `${item.pct.toFixed(2)}%`}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100">{item.adr}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{item.revenue}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100">{item.revPar}</td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                      <td className="py-3 px-3"></td>
                      <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Top Markets Share</td>
                      <td className="py-3 px-3 text-right text-emerald-700">{totalShare.toFixed(2)}%</td>
                      <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">${avgAdrUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">${totalRevenueUsd.toFixed(2)}M</td>
                      <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100">${avgRevParUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'SENTIMENT_SCORE':
        {
          const sentimentByProperty = [
            {
              id: 'alpine',
              name: 'Sosei Alpine',
              score: '4.8',
              children: [
                { name: 'Location', score: '4.3' },
                { name: 'Rooms', score: '4.2' },
                { name: 'Value', score: '4.5' },
                { name: 'Cleanliness', score: '4.5' },
                { name: 'Service', score: '4.6' },
                { name: 'Sleep Quality', score: '4.5' },
              ],
            },
            {
              id: 'ocean',
              name: 'Sosei Ocean',
              score: '4.6',
              children: [
                { name: 'Location', score: '4.1' },
                { name: 'Rooms', score: '4.0' },
                { name: 'Value', score: '4.3' },
                { name: 'Cleanliness', score: '4.4' },
                { name: 'Service', score: '4.5' },
                { name: 'Sleep Quality', score: '4.2' },
              ],
            },
            {
              id: 'city',
              name: 'Sosei City',
              score: '4.5',
              children: [
                { name: 'Location', score: '4.0' },
                { name: 'Rooms', score: '3.9' },
                { name: 'Value', score: '4.1' },
                { name: 'Cleanliness', score: '4.3' },
                { name: 'Service', score: '4.4' },
                { name: 'Sleep Quality', score: '4.0' },
              ],
            },
            {
              id: 'forest',
              name: 'Sosei Forest',
              score: '4.7',
              children: [
                { name: 'Location', score: '4.2' },
                { name: 'Rooms', score: '4.1' },
                { name: 'Value', score: '4.4' },
                { name: 'Cleanliness', score: '4.6' },
                { name: 'Service', score: '4.5' },
                { name: 'Sleep Quality', score: '4.3' },
              ],
            },
          ];

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Sentiment score breakdown by property collection and service touchpoints.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Portfolio Avg: 4.7 / 5.0
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
                  <thead className="bg-zinc-50/90 dark:bg-zinc-800/90 shadow-2xs">
                    <tr className="text-left text-zinc-400">
                      <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800">Property Collection</th>
                      <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800">Overall Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentimentByProperty.map((prop) => {
                      const isExpanded = !!expandedRows[prop.id];
                      return (
                        <React.Fragment key={prop.id}>
                          <tr
                            className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                            onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                          >
                            <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                              {isExpanded ? (
                                <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                              ) : (
                                <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                              )}
                              {prop.name}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-emerald-700">{prop.score}</td>
                          </tr>
                          {isExpanded && prop.children.map((child, cIdx) => {
                            const scoreNum = parseFloat(child.score);
                            const barWidth = Math.round((scoreNum / 5) * 100);
                            return (
                              <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20">
                                <td className="py-2.5 px-3 pl-8">
                                  <div className="flex items-center gap-3">
                                    <span className="text-zinc-500 w-24 shrink-0 text-[10.5px]">{child.name}</span>
                                    <div className="flex-1 max-w-[200px] h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all" style={{ width: `${barWidth}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-right font-medium text-zinc-700 dark:text-zinc-300 text-[10.5px]">{child.score}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'SENTIMENT_OVER_TIME':
        {
          const generateReviews = () => {
            const reviews = [
              { guest: 'Anderson Family', property: 'SOSEI Alpine', score: 4.8, rating: 'Excellent', comment: 'Absolutely stunning resort. The spa at Alpine was world-class.', color: '#059669' },
              { guest: 'James Wilson', property: 'SOSEI Forest', score: 4.6, rating: 'Excellent', comment: 'Impeccable service, though dining options slightly limited at night.', color: '#059669' },
              { guest: 'Maria Schmidt', property: 'SOSEI Ocean', score: 4.5, rating: 'Very Good', comment: 'Beautiful ocean views. The private beach access was a highlight.', color: '#059669' },
              { guest: 'Park Family', property: 'SOSEI Desert', score: 4.3, rating: 'Very Good', comment: 'Unique desert experience. Pool area could use more shaded loungers.', color: '#71717a' },
              { guest: 'Robert Chen', property: 'SOSEI City', score: 4.0, rating: 'Good', comment: 'Great city location. Room was comfortable but street noise noticeable.', color: '#71717a' },
              { guest: 'Emma Watson', property: 'SOSEI Countryside', score: 3.8, rating: 'Good', comment: 'Lovely countryside retreat. Some outdoor activities were unavailable.', color: '#71717a' },
              { guest: 'Hiroshi Tanaka', property: 'SOSEI Forest', score: 4.7, rating: 'Excellent', comment: 'A magical forest sanctuary. The morning meditation was unforgettable.', color: '#059669' },
              { guest: 'Sarah Davis', property: 'SOSEI Alpine', score: 3.5, rating: 'Fair', comment: 'Nice property but room upgrade not available despite request. Good ski access.', color: '#e11d48' },
            ];
            return reviews.map((r, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (7 - i));
              return { ...r, stay: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
            });
          };

          const last8Reviews = generateReviews();

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500 font-normal">Recent verified guest feedback & operational reviews across all sanctuaries.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  Last 8 Reviews
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {last8Reviews.map((review, idx) => (
                  <div key={idx} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{review.guest}</span>
                        <span className="text-[10px] text-zinc-500 ml-2 font-medium">{review.property}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold" style={{ color: review.color }}>{review.score}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">"{review.comment}"</p>
                    <div className="text-[9.5px] text-zinc-400 mt-2">{review.stay}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 'GUEST_ARRIVALS':
        return (
          <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">VVIP arrivals schedule and personalized sanctuary arrangements today.</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {dashboardData.guestArrivals.length} Confirmed Guests
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {dashboardData.guestArrivals.filter((g: any) => g.vip).map((guest: any) => (
                <div key={guest.id} className="p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{guest.name}</span>
                      <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">{guest.property} Â· <span className="text-zinc-500 font-normal">{guest.suite || 'Grand Sanctuary Villa'}</span></p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] border border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 bg-zinc-900/5 dark:bg-zinc-100/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">VVIP Tier 1</span>
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-semibold uppercase">{guest.status || 'Confirmed'}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5 mt-3 pt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <div className="flex justify-between">
                      <span><strong>Expected Arrival:</strong> {guest.time}</span>
                      <span><strong>Party Size:</strong> {guest.guestsCount || '2 Guests'}</span>
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300"><strong>Special Arrangements:</strong> {guest.specialRequest || 'Private helicopter transfer, bespoke tea ritual & heated Onsen ready upon arrival.'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'GUEST_NEEDS':
        {
          const guestNeedsByProperty = [
            {
              id: 'alpine',
              name: 'Sosei Alpine Collection',
              needs: [
                { label: 'Private Ski Guide & Equipment Fitting', pct: '36%', pctNum: 36 },
                { label: 'Thermal Onsen & Alpine Recovery Spa', pct: '28%', pctNum: 28 },
                { label: 'Fireside Fondue & Private Dining', pct: '20%', pctNum: 20 },
                { label: 'Helicopter Transfer & Concierge', pct: '16%', pctNum: 16 },
              ],
            },
            {
              id: 'ocean',
              name: 'Sosei Ocean Collection',
              needs: [
                { label: 'Private Catamaran & Coral Diving', pct: '38%', pctNum: 38 },
                { label: 'Holistic Ayurveda & Ocean Spa', pct: '30%', pctNum: 30 },
                { label: 'Sunset Sandbank Omakase', pct: '20%', pctNum: 20 },
                { label: 'Bespoke Family Water Villas', pct: '12%', pctNum: 12 },
              ],
            },
            {
              id: 'city',
              name: 'Sosei City Collection',
              needs: [
                { label: 'Michelin Dining & Rooftop Bar Reservations', pct: '34%', pctNum: 34 },
                { label: 'Chauffeured Electric Maybach Fleet', pct: '26%', pctNum: 26 },
                { label: 'Executive Meeting Suites & Boardrooms', pct: '22%', pctNum: 22 },
                { label: 'High-Altitude Sky Wellness & Gym', pct: '18%', pctNum: 18 },
              ],
            },
            {
              id: 'countryside',
              name: 'Sosei Countryside Collection',
              needs: [
                { label: 'Traditional Tea Ceremony & Zen Gardens', pct: '35%', pctNum: 35 },
                { label: 'Farm-to-Table Organic Harvest Dining', pct: '27%', pctNum: 27 },
                { label: 'Artisanal Pottery & Calligraphy Masters', pct: '22%', pctNum: 22 },
                { label: 'Scenic Cycling & Temple Passes', pct: '16%', pctNum: 16 },
              ],
            },
            {
              id: 'forest',
              name: 'Sosei Forest Collection',
              needs: [
                { label: 'Shinrin-yoku (Forest Bathing) & Meditation', pct: '37%', pctNum: 37 },
                { label: 'Treehouse Herbal Bath Therapy', pct: '29%', pctNum: 29 },
                { label: 'Botanical Foraging with Executive Chef', pct: '21%', pctNum: 21 },
                { label: 'Star Gazing & Night Canopy Walks', pct: '13%', pctNum: 13 },
              ],
            },
            {
              id: 'desert',
              name: 'Sosei Desert Collection',
              needs: [
                { label: 'Private Dune Camp & Starlight Dining', pct: '40%', pctNum: 40 },
                { label: 'Bedouin Herbal Scrub & Hammam', pct: '26%', pctNum: 26 },
                { label: 'Falconry & Desert Wildlife Safari', pct: '20%', pctNum: 20 },
                { label: 'Helicopter Scenic Flight & Transfers', pct: '14%', pctNum: 14 },
              ],
            },
          ];

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Breakdown of priority guest preferences across collections.</p>
                <span className="text-[10px] font-medium text-zinc-500">Click collection to expand</span>
              </div>
              <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left bg-zinc-50/50 dark:bg-zinc-800/40">
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Top Categories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestNeedsByProperty.map((prop) => {
                      const isExpanded = !!expandedRows[prop.id];
                      return (
                        <React.Fragment key={prop.id}>
                          <tr
                            className="border-b border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                            onClick={() => setExpandedRows(prev => ({ ...prev, [prop.id]: !prev[prop.id] }))}
                          >
                            <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                              {isExpanded ? (
                                <RoundAltArrowDown size={14} className="text-zinc-500 shrink-0" />
                              ) : (
                                <RoundAltArrowRight size={14} className="text-zinc-500 shrink-0" />
                              )}
                              {prop.name}
                            </td>
                            <td className="py-3 px-3 text-right text-zinc-500 text-[11px] whitespace-nowrap">{prop.needs.length} priority categories</td>
                          </tr>
                          {isExpanded && prop.needs.map((need, nIdx) => (
                            <tr key={`${prop.id}-need-${nIdx}`} className="border-b border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-100/30 dark:bg-zinc-800/20">
                              <td className="py-2.5 pl-8 pr-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-zinc-600 dark:text-zinc-400 text-[10px] w-48 shrink-0">{need.label}</span>
                                  <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-zinc-800 dark:bg-zinc-200 rounded-full transition-all" style={{ width: `${need.pctNum}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 text-[10px] w-12">{need.pct}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'NOTES_YESTERDAY':
        return (
          <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <p className="text-xs text-zinc-500">Executive operational handover log and general manager observations.</p>
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 relative text-xs leading-relaxed">
              <span className="text-zinc-300 dark:text-zinc-600 text-4xl absolute top-2 left-3 leading-none font-serif">â€œ</span>
              <div className="pl-6 pt-1">
                <p className="text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed">
                  {dashboardData.notesFromYesterday.text}
                </p>
                <div className="text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-4">â€” {dashboardData.notesFromYesterday.author}</div>
              </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <h4 className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-3">Department Performance Verification</h4>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between items-center p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-800/20">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Front Office & VIP Concierge</span>
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">100% On-time Arrival Check-in</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-800/20">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">F&B Sanctuary Dining</span>
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">4.92 / 5.0 Tasting Menu CSAT</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-800/20">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Housekeeping & Turndown</span>
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">Turnaround 23m avg (Target &lt;30m)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-800/20">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Holistic Wellness & Spa</span>
                  <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-semibold">88.5% Slot Utilization Rate</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'JOURNEY_TIMELINE':
        return (
          <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
            <p className="text-xs text-zinc-500">Historical expansion and milestone sanctuaries of the Sosei hospitality brand.</p>
            <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-3 pl-6 space-y-6">
              {dashboardData.journeyTimeline.map((item: any, idx: number) => (
                <div key={idx} className="relative">
                  {/* Dot on the vertical line */}
                  <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100"></span>
                  </span>
                  <div className="text-[9.5px] font-bold text-zinc-500 tracking-wider uppercase">{item.date}</div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{item.name}</h4>
                  <p className="text-[10px] text-zinc-500">{item.location}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'SPEND_OVERTIME':
        {
          const spendByProperty = [
            {
              id: 'alpine', name: 'Sosei Alpine Collection', total: '$32.8M', avg: '$2,780', years: [
                { year: '2026 YTD', avg: '$2,780', total: '$32.8M' }, { year: '2025', avg: '$2,690', total: '$29.8M' }, { year: '2024', avg: '$2,540', total: '$26.4M' }, { year: '2023', avg: '$2,380', total: '$23.2M' },
              ], categories: [
                { cat: 'Suites & Chalets', avg2026: '$1,720', avg2025: '$1,660', avg2024: '$1,570', avg2023: '$1,470' },
                { cat: 'F&B & Fine Dining', avg2026: '$560', avg2025: '$540', avg2024: '$510', avg2023: '$480' },
                { cat: 'Thermal Spa & Recovery', avg2026: '$310', avg2025: '$300', avg2024: '$280', avg2023: '$260' },
                { cat: 'Ski Guiding & Heli', avg2026: '$190', avg2025: '$190', avg2024: '$180', avg2023: '$170' },
              ]
            },
            {
              id: 'ocean', name: 'Sosei Ocean Collection', total: '$28.5M', avg: '$2,650', years: [
                { year: '2026 YTD', avg: '$2,650', total: '$28.5M' }, { year: '2025', avg: '$2,580', total: '$25.9M' }, { year: '2024', avg: '$2,440', total: '$23.1M' }, { year: '2023', avg: '$2,310', total: '$20.5M' },
              ], categories: [
                { cat: 'Water Villas & Suites', avg2026: '$1,640', avg2025: '$1,600', avg2024: '$1,510', avg2023: '$1,430' },
                { cat: 'F&B & Sandbank Dining', avg2026: '$520', avg2025: '$505', avg2024: '$480', avg2023: '$455' },
                { cat: 'Ocean Spa & Ayurveda', avg2026: '$310', avg2025: '$300', avg2024: '$285', avg2023: '$265' },
                { cat: 'Catamaran & Diving', avg2026: '$180', avg2025: '$175', avg2024: '$165', avg2023: '$160' },
              ]
            },
            {
              id: 'city', name: 'Sosei City Collection', total: '$23.6M', avg: '$2,380', years: [
                { year: '2026 YTD', avg: '$2,380', total: '$23.6M' }, { year: '2025', avg: '$2,310', total: '$21.5M' }, { year: '2024', avg: '$2,210', total: '$19.4M' }, { year: '2023', avg: '$2,100', total: '$17.2M' },
              ], categories: [
                { cat: 'Skyline Suites', avg2026: '$1,440', avg2025: '$1,400', avg2024: '$1,340', avg2023: '$1,270' },
                { cat: 'Michelin F&B & Bar', avg2026: '$530', avg2025: '$515', avg2024: '$490', avg2023: '$470' },
                { cat: 'Urban Wellness Club', avg2026: '$230', avg2025: '$225', avg2024: '$215', avg2023: '$200' },
                { cat: 'Chauffeur & Concierge', avg2026: '$180', avg2025: '$170', avg2024: '$165', avg2023: '$160' },
              ]
            },
            {
              id: 'countryside', name: 'Sosei Countryside Collection', total: '$13.2M', avg: '$2,250', years: [
                { year: '2026 YTD', avg: '$2,250', total: '$13.2M' }, { year: '2025', avg: '$2,180', total: '$12.1M' }, { year: '2024', avg: '$2,070', total: '$11.0M' }, { year: '2023', avg: '$1,960', total: '$9.8M' },
              ], categories: [
                { cat: 'Estate Ryokan Villas', avg2026: '$1,380', avg2025: '$1,340', avg2024: '$1,270', avg2023: '$1,200' },
                { cat: 'Farm-to-Table Dining', avg2026: '$440', avg2025: '$425', avg2024: '$405', avg2023: '$385' },
                { cat: 'Zen Bath & Tea Spa', avg2026: '$250', avg2025: '$240', avg2024: '$230', avg2023: '$215' },
                { cat: 'Cultural Experiences', avg2026: '$180', avg2025: '$175', avg2024: '$165', avg2023: '$160' },
              ]
            },
            {
              id: 'forest', name: 'Sosei Forest Collection', total: '$11.6M', avg: '$2,150', years: [
                { year: '2026 YTD', avg: '$2,150', total: '$11.6M' }, { year: '2025', avg: '$2,090', total: '$10.6M' }, { year: '2024', avg: '$1,990', total: '$9.6M' }, { year: '2023', avg: '$1,890', total: '$8.5M' },
              ], categories: [
                { cat: 'Canopy & Forest Villas', avg2026: '$1,320', avg2025: '$1,280', avg2024: '$1,220', avg2023: '$1,160' },
                { cat: 'Foraged Forest Dining', avg2026: '$420', avg2025: '$410', avg2024: '$390', avg2023: '$370' },
                { cat: 'Herbal Onsen & Spa', avg2026: '$245', avg2025: '$238', avg2024: '$225', avg2023: '$210' },
                { cat: 'Botanical & Wilderness', avg2026: '$165', avg2025: '$162', avg2024: '$155', avg2023: '$150' },
              ]
            },
            {
              id: 'desert', name: 'Sosei Desert Collection', total: '$8.3M', avg: '$1,980', years: [
                { year: '2026 YTD', avg: '$1,980', total: '$8.3M' }, { year: '2025', avg: '$1,920', total: '$7.5M' }, { year: '2024', avg: '$1,820', total: '$6.8M' }, { year: '2023', avg: '$1,720', total: '$5.9M' },
              ], categories: [
                { cat: 'Dune Tent Lodges', avg2026: '$1,210', avg2025: '$1,170', avg2024: '$1,110', avg2023: '$1,050' },
                { cat: 'Starlight Oasis Dining', avg2026: '$390', avg2025: '$380', avg2024: '$360', avg2023: '$340' },
                { cat: 'Bedouin Hammam Spa', avg2026: '$210', avg2025: '$205', avg2024: '$190', avg2023: '$180' },
                { cat: 'Desert Safari Excursions', avg2026: '$170', avg2025: '$165', avg2024: '$160', avg2023: '$150' },
              ]
            },
          ];

          const revenueTrend = [
            { year: '2023', Alpine: 23.2, Ocean: 20.5, City: 17.2, Countryside: 9.8, Forest: 8.5, Desert: 5.9 },
            { year: '2024', Alpine: 26.4, Ocean: 23.1, City: 19.4, Countryside: 11.0, Forest: 9.6, Desert: 6.8 },
            { year: '2025', Alpine: 29.8, Ocean: 25.9, City: 21.5, Countryside: 12.1, Forest: 10.6, Desert: 7.5 },
            { year: '2026 YTD', Alpine: 32.8, Ocean: 28.5, City: 23.6, Countryside: 13.2, Forest: 11.6, Desert: 8.3 },
          ];

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Total guest spend & revenue realization across all 6 collections, 2023â€“2026.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  $118.0M YTD Total
                </span>
              </div>

              {/* Revenue Trend Bar Chart */}
              <div className="h-[200px] w-full -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrend} margin={{ top: 8, right: 10, left: -5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme === 'dark' ? '#a1a1aa' : '#71717a' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: theme === 'dark' ? '#a1a1aa' : '#71717a' }} tickFormatter={(v) => `$${v}M`} width={46} />
                    <Tooltip
                      formatter={(v: any) => [`$${v}M`, '']}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                        border: '1px solid ' + (theme === 'dark' ? '#27272a' : '#e4e4e7'),
                        borderRadius: '10px',
                        fontSize: '11px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="Alpine" fill="#18181b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Ocean" fill="#3f3f46" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="City" fill="#71717a" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Countryside" fill="#059669" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Forest" fill="#0d9488" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Desert" fill="#d97706" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Simple property table */}
              <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-800/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left bg-zinc-50/50 dark:bg-zinc-800/40">
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Collection</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">2026 YTD Revenue</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Avg / Booking</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Drilldown</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spendByProperty.map((prop) => (
                      <tr key={prop.id} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{prop.name}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{prop.total}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{prop.avg}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDrawer({ type: 'SPEND_COMPARISON', title: `${prop.name} â€” Year Comparison`, data: prop });
                            }}
                            className="text-[10px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 underline cursor-pointer whitespace-nowrap"
                          >
                            Year View â†’
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'SPEND_COMPARISON':
        {
          const prop = config.data;
          if (!prop) return <p className="text-xs text-zinc-500">No data available.</p>;

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Year-over-year revenue progression and guest basket breakdown for {prop.name}.</p>
                <button
                  onClick={() => openDrawer({ type: 'SPEND_OVERTIME', title: 'Guest Spend Over Time' })}
                  className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline cursor-pointer"
                >
                  â† Back to all spend
                </button>
              </div>

              {/* Year summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {prop.years.map((yr: any, yIdx: number) => (
                  <div key={yIdx} className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 text-center bg-zinc-50/50 dark:bg-zinc-800/40">
                    <div className="text-[9.5px] font-medium text-zinc-500 mb-1">{yr.year}</div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{yr.total}</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">{yr.avg} / booking</div>
                  </div>
                ))}
              </div>

              {/* Category breakdown table */}
              <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-800/20">
                <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-[9.5px] font-bold uppercase tracking-wider text-zinc-500">
                  Average Guest Spend Per Category (USD)
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left bg-zinc-50/30 dark:bg-zinc-800/30">
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Category</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">2023</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">2024</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">2025</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">2026 YTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prop.categories.map((cat: any, cIdx: number) => (
                      <tr key={cIdx} className="border-b border-zinc-200/40 dark:border-zinc-800/40 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-zinc-800 dark:text-zinc-200">{cat.cat}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-500">{cat.avg2023}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-500">{cat.avg2024}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{cat.avg2025}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-bold">{cat.avg2026}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'GEO_MARKET':
        {
          const rawTableData = Array.isArray(config.data) ? config.data : [
            { region: 'Asia Pacific', rnights: '32.5%', adr: '$2,580', revenue: '$3.77M' },
            { region: 'Europe', rnights: '28.4%', adr: '$2,620', revenue: '$3.29M' },
            { region: 'Americas', rnights: '22.7%', adr: '$2,410', revenue: '$2.63M' },
            { region: 'Middle East', rnights: '11.2%', adr: '$2,750', revenue: '$1.30M' },
            { region: 'Africa & Others', rnights: '5.2%', adr: '$2,120', revenue: '$0.61M' },
          ];

          const countriesMap: Record<string, string> = {
            'Asia Pacific': 'Japan, China, Singapore, Australia',
            'Europe': 'UK, Switzerland, Germany, France',
            'Americas': 'USA, Canada, Brazil',
            'Middle East': 'UAE, Saudi Arabia, Qatar',
            'Africa & Others': 'South Africa, Egypt, Kenya',
          };

          const geoTableData = rawTableData
            .filter((item: any) => !item.isTotal)
            .map((item: any) => ({
              region: item.region || item.name || '',
              rnights: item.rnights || (item.value ? `${item.value}%` : ''),
              adr: item.adr || '-',
              revenue: item.revenue || '-',
              countries: item.countries || countriesMap[item.region || item.name] || 'Local feeder markets',
            }));

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Regional room nights and revenue contribution across global feeder markets.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Total MTD Room Rev: $11.60M
                </span>
              </div>
              <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Source Region</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Room Nights Share</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">ADR (USD)</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Room Revenue (USD)</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Primary Feeder Markets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoTableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.region}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.rnights}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.adr}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.revenue}</td>
                        <td className="py-2.5 px-3 text-zinc-500 text-[10px]">{row.countries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'MARKET_SEGMENT':
        {
          const rawSegmentData = Array.isArray(config.data) ? config.data : [
            { segment: 'Leisure & FIT Luxury', rnights: '54.0%', adr: '$2,640', revenue: '$6.26M' },
            { segment: 'Corporate & Executive Retreats', rnights: '22.5%', adr: '$2,480', revenue: '$2.61M' },
            { segment: 'Wellness & Sanctuary Immersion', rnights: '14.5%', adr: '$2,320', revenue: '$1.68M' },
            { segment: 'Private Buyouts & Events', rnights: '9.0%', adr: '$2,850', revenue: '$1.05M' },
          ];

          const descMap: Record<string, string> = {
            'Leisure & FIT Luxury': 'High net-worth independent travelers, bespoke couples & holiday seekers',
            'Corporate & Executive Retreats': 'C-suite retreats, Fortune 500 board meetings & partner programs',
            'Wellness & Sanctuary Immersion': 'Multi-day holistic wellness, thermal onsen & detox programs',
            'Private Buyouts & Events': 'Exclusive full-property sanctuary buyouts & elite gatherings',
          };

          const segmentTableData = rawSegmentData
            .filter((item: any) => !item.isTotal)
            .map((item: any) => ({
              segment: item.segment || item.name || '',
              rnights: item.rnights || (item.value ? `${item.value}%` : ''),
              adr: item.adr || '-',
              revenue: item.revenue || '-',
              desc: item.desc || descMap[item.segment || item.name] || 'General guest segment',
            }));

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Performance and yield realization by guest market segment.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Total MTD Room Rev: $11.60M
                </span>
              </div>
              <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Market Segment</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Room Nights Share</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">ADR (USD)</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Room Revenue (USD)</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Strategic Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentTableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.segment}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.rnights}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.adr}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.revenue}</td>
                        <td className="py-2.5 px-3 text-zinc-500 text-[10px]">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'CHANNEL_DISTRIBUTION':
        {
          const rawChannelData = Array.isArray(config.data) ? config.data : [
            { channel: 'Direct & VIP Concierge', rnights: '38.5%', adr: '$2,680', revenue: '$4.47M' },
            { channel: 'Luxury Consortia (Virtuoso, Amex FHR)', rnights: '28.2%', adr: '$2,550', revenue: '$3.27M' },
            { channel: 'Official Sosei Portal', rnights: '18.3%', adr: '$2,350', revenue: '$2.12M' },
            { channel: 'Curated Tour Operators', rnights: '15.0%', adr: '$2,120', revenue: '$1.74M' },
          ];

          const feeMap: Record<string, string> = {
            'Direct & VIP Concierge': '0% commission, highest margin private concierge bookings',
            'Luxury Consortia (Virtuoso, Amex FHR)': '10% standard fee, high ADR with verified elite amenities',
            'Official Sosei Portal': 'Direct digital web & mobile app booking channel',
            'Curated Tour Operators': 'Contracted luxury wholesale & seasonal alpine/ocean allotments',
          };

          const channelTableData = rawChannelData
            .filter((item: any) => !item.isTotal)
            .map((item: any) => ({
              channel: item.channel || item.name || '',
              rnights: item.rnights || item.pct || (item.value ? `${item.value}%` : ''),
              adr: item.adr || '-',
              revenue: item.revenue || '-',
              fee: item.fee || feeMap[item.channel || item.name] || 'General booking source info',
            }));

          return (
            <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Booking channel yield and commission economics comparison.</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Total MTD Room Rev: $11.60M
                </span>
              </div>
              <div className="overflow-x-auto border border-zinc-200/80 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-zinc-800/20">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-left">
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Distribution Channel</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Room Nights Share</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">ADR (USD)</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400 text-right">Room Revenue (USD)</th>
                      <th className="py-2.5 px-3 text-[9.5px] font-medium text-zinc-400">Channel Economics & Terms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelTableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-zinc-200/60 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-zinc-900 dark:text-zinc-100">{row.channel}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-medium">{row.rnights}</td>
                        <td className="py-2.5 px-3 text-right text-zinc-600 dark:text-zinc-300">{row.adr}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">{row.revenue}</td>
                        <td className="py-2.5 px-3 text-zinc-500 text-[10px]">{row.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

      case 'FNB_DETAIL':
        return <FnbDrawerContent config={config} />;

      case 'SPA_DETAIL':
        return <SpaDrawerContent config={config} />;

      default:
        return null;
    }
  };

  const getDrawerWidth = () => {
    if (!config) return 'w-[95vw] sm:w-[580px]';
    switch (config.type) {
      case 'METRIC':
      case 'SPEND_OVERTIME':
      case 'WORLD_MAP':
      case 'PORTFOLIO_PERFORMANCE':
      case 'ROOM_TIER_OCCUPANCY':
        return 'w-[96vw] sm:w-[780px] lg:w-[860px]';
      case 'TOP_NATIONALITIES':
      case 'GEO_MARKET':
      case 'MARKET_SEGMENT':
      case 'CHANNEL_DISTRIBUTION':
      case 'GUEST_MOVEMENT':
      case 'FNB_DETAIL':
      case 'SPA_DETAIL':
        return 'w-[94vw] sm:w-[680px] lg:w-[760px]';
      default:
        return 'w-[94vw] sm:w-[580px]';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[60] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />

      {/* Centered Modal Panel */}
      <div
        className={`fixed top-1/2 left-1/2 z-[70] max-h-[88vh] ${getDrawerWidth()} bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden transition-all duration-300 ease-out transform -translate-x-1/2 ${active ? 'opacity-100 scale-100 -translate-y-1/2' : 'opacity-0 scale-95 -translate-y-[45%] pointer-events-none'}`}
      >
        <div className="shrink-0 px-6 py-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{config?.title || 'Details'}</h2>
            <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Sosei Executive Management & Operational Intelligence</p>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <CloseCircle size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </>
  );
}
