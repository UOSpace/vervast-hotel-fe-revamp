import React, { useState } from 'react';
import { RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';
import { simulatedCategoryPerformance } from '../../services/propertySimulation';

export type TimeHorizon = 'today' | 'mtd' | 'ytd';

interface PortfolioPerformanceDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

function getDynamicPeriodLabel(h: TimeHorizon): string {
  const now = new Date();
  const monthLong = now.toLocaleString('en-US', { month: 'long' });
  const monthShort = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();

  if (h === 'today') return `Today, ${monthLong} ${day}, ${year}`;
  if (h === 'mtd') return `${monthLong} 1–${day}, ${year}`;
  if (h === 'ytd') return `Jan 1 – ${monthShort} ${day}, ${year}`;
  return '';
}

export function PortfolioPerformanceDrawerContent({ config }: PortfolioPerformanceDrawerContentProps) {
  const initialHorizon: TimeHorizon = config?.data?.horizon || 'mtd';
  const [horizon, setHorizon] = useState<TimeHorizon>(initialHorizon);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const activePeriodLabel = getDynamicPeriodLabel(horizon);

  // Scaled data generator for the 5 collections & 10 sanctuaries
  const getHorizonCategoryData = (h: TimeHorizon) => {
    return simulatedCategoryPerformance.map((cat) => {
      if (h === 'today') {
        const factor = 1 / 30; // Daily proportion of MTD
        const occNum = Math.min(92, cat.occNum + 2.5);
        const adrNum = Math.round(cat.adrNum * 1.03);
        const revparNum = Math.round((occNum / 100) * adrNum);
        const revK = Math.round((cat.revenueNum * 1000 * factor));

        return {
          ...cat,
          occ: `${occNum.toFixed(2)}%`,
          adr: `$${adrNum.toLocaleString()}`,
          revenue: `$${revK.toLocaleString()}K`,
          revpar: `$${revparNum.toLocaleString()}`,
          status: 'Active Today',
          children: cat.children.map((ch) => {
            const chOcc = Math.min(95, parseFloat(ch.occ) + 2.2);
            const chAdr = Math.round(parseInt(ch.adr.replace(/[^0-9]/g, '')) * 1.03);
            const chRevpar = Math.round((chOcc / 100) * chAdr);
            const chRevM = parseFloat(ch.revenue.replace(/[^0-9.]/g, ''));
            const chRevK = Math.round((chRevM * 1000 * factor));
            return {
              ...ch,
              occ: `${chOcc.toFixed(2)}%`,
              adr: `$${chAdr.toLocaleString()}`,
              revenue: `$${chRevK.toLocaleString()}K`,
              revpar: `$${chRevpar.toLocaleString()}`,
            };
          }),
        };
      } else if (h === 'ytd') {
        const factor = 8.4; // Cumulative YTD multiple of MTD
        const occNum = Math.min(90, cat.occNum + 1.2);
        const adrNum = Math.round(cat.adrNum * 1.015);
        const revparNum = Math.round((occNum / 100) * adrNum);
        const revM = (cat.revenueNum * factor).toFixed(2);

        return {
          ...cat,
          occ: `${occNum.toFixed(2)}%`,
          adr: `$${adrNum.toLocaleString()}`,
          revenue: `$${revM}M`,
          revpar: `$${revparNum.toLocaleString()}`,
          status: 'Ahead of Target',
          children: cat.children.map((ch) => {
            const chOcc = Math.min(92, parseFloat(ch.occ) + 1.0);
            const chAdr = Math.round(parseInt(ch.adr.replace(/[^0-9]/g, '')) * 1.015);
            const chRevpar = Math.round((chOcc / 100) * chAdr);
            const chRevM = (parseFloat(ch.revenue.replace(/[^0-9.]/g, '')) * factor).toFixed(2);
            return {
              ...ch,
              occ: `${chOcc.toFixed(2)}%`,
              adr: `$${chAdr.toLocaleString()}`,
              revenue: `$${chRevM}M`,
              revpar: `$${chRevpar.toLocaleString()}`,
            };
          }),
        };
      } else {
        // MTD (Month-To-Date base)
        return {
          ...cat,
          children: cat.children.map(ch => ({ ...ch })),
        };
      }
    });
  };

  const currentCategories = getHorizonCategoryData(horizon);

  // Horizon metrics summary cards
  const summaryMetrics = {
    today: {
      totalRev: '$5.10M',
      revVsLy: '+9.4% vs LY',
      occ: '76.80%',
      occVsLy: '+5.2 pts vs LY',
      adr: '$1,465.00',
      adrVsLy: '+$97 vs LY (+7.1%)',
      revpar: '$1,125.00',
      revparVsLy: '+$104 vs LY (+10.2%)',
    },
    mtd: {
      totalRev: '$152.00M',
      revVsLy: '+11.0% vs LY',
      occ: '74.20%',
      occVsLy: '+4.8 pts vs LY',
      adr: '$1,420.00',
      adrVsLy: '+$85 vs LY (+6.0%)',
      revpar: '$1,054.00',
      revparVsLy: '+$92 vs LY (+8.5%)',
    },
    ytd: {
      totalRev: '$1.28B',
      revVsLy: '+12.4% vs LY',
      occ: '75.40%',
      occVsLy: '+5.6 pts vs LY',
      adr: '$1,440.00',
      adrVsLy: '+$106 vs LY (+8.0%)',
      revpar: '$1,085.00',
      revparVsLy: '+$112 vs LY (+11.5%)',
    },
  }[horizon];

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      {/* Top Header Filter Bar: Subtitle & Period + Horizon Filter Tabs (Today | MTD | YTD) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500">
            Portfolio performance and yield metrics across all 5 collections ({horizon === 'today' ? 'Today Actuals' : `${horizon.toUpperCase()} Actuals`}).
          </p>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Active Period: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{activePeriodLabel}</span>
          </p>
        </div>

        {/* Tab View Filter: Today | MTD | YTD */}
        <div className="inline-flex items-center p-0.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-lg shrink-0">
          {(['today', 'mtd', 'ytd'] as const).map((h) => {
            const isActive = horizon === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
                }`}
              >
                {h === 'today' ? 'Today' : h.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Executive Horizon KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Total Hotel Revenue</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summaryMetrics.totalRev}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
            ↑ {summaryMetrics.revVsLy}
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Occupancy</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summaryMetrics.occ}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
            ↑ {summaryMetrics.occVsLy}
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Average Daily Rate (ADR)</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summaryMetrics.adr}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
            ↑ {summaryMetrics.adrVsLy}
          </span>
        </div>
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">RevPAR Yield</span>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{summaryMetrics.revpar}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-flex items-center gap-1">
            ↑ {summaryMetrics.revparVsLy}
          </span>
        </div>
      </div>

      {/* Detailed Collection League Table */}
      <div>
        <div className="flex justify-between items-center mb-2 px-0.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Property Collection Performance ({horizon === 'today' ? 'Today' : horizon.toUpperCase()} Breakdown)
          </h4>
          <span className="text-[9.5px] text-zinc-400">
            Click collection row to expand individual sanctuaries
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <table className="w-full text-xs text-zinc-800 dark:text-zinc-200 border-separate border-spacing-0">
            <thead className="sticky -top-6 z-20 bg-zinc-50/90 dark:bg-zinc-800/90 shadow-2xs backdrop-blur-sm">
              <tr className="text-left text-zinc-400">
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Property Collection</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Location</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Occupancy</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">ADR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                  Revenue ({horizon === 'today' ? 'Today' : horizon.toUpperCase()})
                </th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">RevPAR (USD)</th>
                <th className="py-2.5 px-3 font-medium text-[9.5px] text-right border-b border-zinc-200 dark:border-zinc-800 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((prop) => {
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
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.occ}</td>
                      <td className="py-3 px-3 text-right font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.adr}</td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revenue}</td>
                      <td className="py-3 px-3 text-right font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{prop.revpar}</td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {prop.status}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && prop.children.map((child, cIdx) => (
                      <tr key={`${prop.id}-child-${cIdx}`} className="border-b border-zinc-100/60 dark:border-zinc-800/60 bg-zinc-50/40 dark:bg-zinc-800/20 text-zinc-600 dark:text-zinc-400">
                        <td className="py-2.5 px-3 pl-8 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">{child.name}</td>
                        <td className="py-2.5 px-3 text-[10px] text-zinc-400 whitespace-nowrap">{child.location}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.occ}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.adr}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap">{child.revenue}</td>
                        <td className="py-2.5 px-3 text-right text-[10.5px] whitespace-nowrap">{child.revpar}</td>
                        <td className="py-2.5 px-3 text-right text-[9.5px] text-zinc-400 whitespace-nowrap">Sanctuary Node</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              <tr className="font-bold border-t-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/80">
                <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100">Total / Portfolio Average</td>
                <td className="py-3 px-3 text-zinc-500">10 Sanctuaries Worldwide</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">{summaryMetrics.occ}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{summaryMetrics.adr}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{summaryMetrics.totalRev}</td>
                <td className="py-3 px-3 text-right text-zinc-900 dark:text-zinc-100 font-bold">{summaryMetrics.revpar}</td>
                <td className="py-3 px-3 text-right text-emerald-700 font-bold">Above Target</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
