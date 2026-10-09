import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  simulatedRevenueDemandMixData,
  simulatedPropertiesData,
  type MixItem,
} from '../../services/propertySimulation';

interface RevenueDemandMixDrawerContentProps {
  theme?: string;
  onNavigatePillar?: (path: string) => void;
}

export function RevenueDemandMixDrawerContent({
  onNavigatePillar,
}: RevenueDemandMixDrawerContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'revenue' | 'demand'>('revenue');
  const data = simulatedRevenueDemandMixData;

  const handlePillarClick = (item: MixItem) => {
    if (item.pillarRoute) {
      if (onNavigatePillar) {
        onNavigatePillar(item.pillarRoute);
      } else {
        navigate(item.pillarRoute);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs text-zinc-900 pb-10">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Pillar Architecture
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-zinc-900 text-white">
              5 Pillars + Packages
            </span>
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mt-1">
            Revenue &amp; Demand Mix Analysis
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Connecting Rooms, Culinary (F&amp;B), Spa, Longevity Wellness, Experiential Activities, and Curated Packages.
          </p>
        </div>

        {/* View Mode Switch */}
        <div className="inline-flex items-center p-1 rounded-lg bg-zinc-100 border border-zinc-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${activeTab === 'revenue'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            Revenue Perspective ($)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demand')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${activeTab === 'demand'
                ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            Demand &amp; Volume Units
          </button>
        </div>
      </div>

      {/* 4 Executive Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Total Hotel Revenue
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">
            {data.totalRevenueFormatted}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              ↑ +11.0% vs LY
            </span>
            <span className="text-[10px] text-zinc-500">+4.0% vs Budget</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Rooms Revenue Core
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">$118.0M</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-700 font-medium">77.4% Total Mix</span>
            <span className="text-[10px] text-emerald-700 font-medium">↑ +14% YoY</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Non-Room Pillars
          </span>
          <div className="text-xl font-bold text-zinc-900 mt-1">$34.4M</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-zinc-700 font-medium">22.6% Ancillary Mix</span>
            <span className="text-[10px] text-emerald-700 font-medium">↑ +12.8% YoY</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
            Peak Growth Driver
          </span>
          <div className="text-xl font-bold text-emerald-700 mt-1">Wellness &amp; Med</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              ↑ +18% Pace
            </span>
            <span className="text-[10px] text-zinc-500">$7.0M generated</span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Table across Pillars */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            {activeTab === 'revenue'
              ? 'Revenue Contribution by SOSEI Pillar'
              : 'Operational Demand & Guest Engagement Units'}
          </h5>
          <span className="text-[10px] text-zinc-400">
            Click any row to drill into dedicated pillar workspace
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50/80">
                <th className="py-2.5 px-3.5 font-semibold text-[10px] border-b border-zinc-200">
                  Business Pillar
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  MTD Revenue
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Mix %
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Demand Volume
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  YoY Growth
                </th>
                <th className="py-2.5 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  vs Budget
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => handlePillarClick(item)}
                  className={`hover:bg-zinc-50/80 transition-colors cursor-pointer group ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                    }`}
                >
                  <td className="py-3 px-3.5 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 max-w-[280px] truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                    {item.revenueFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-zinc-700 border-b border-zinc-100">
                    {item.revenuePctFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-zinc-600 border-b border-zinc-100">
                    <span className="font-semibold text-zinc-800">{item.demandFormatted}</span>
                    <span className="block text-[9px] text-zinc-400">{item.demandUnit}</span>
                  </td>
                  <td className="py-3 px-3 text-right border-b border-zinc-100">
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] border border-emerald-100">
                      ↑ {item.revenueTrend}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-zinc-600 text-[10px] font-medium border-b border-zinc-100">
                    +{(Math.abs(parseFloat(item.revenueTrend)) * 0.35).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3.5 text-right border-b border-zinc-100">
                    <span className="text-[10px] font-semibold text-zinc-700 group-hover:text-zinc-950 underline underline-offset-2">
                      Drilldown →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property-Level Pillar Contribution (Single Source of Truth from simulatedPropertiesData) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Property Contribution Across All 12 Sanctuaries
          </h5>
          <span className="text-[10px] text-zinc-400">
            Live PMS Sync (100% SSOT Data)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[700px] text-xs text-zinc-800 border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50/80">
                <th className="py-2 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Sanctuary Property
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] border-b border-zinc-200">
                  Location &amp; Collection
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Rooms Rev
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Est. F&amp;B
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Est. Spa / Well
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Total MTD Rev
                </th>
                <th className="py-2 px-3 font-semibold text-[10px] text-right border-b border-zinc-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {simulatedPropertiesData.map((prop, idx) => {
                const roomRev = prop.monthlyRevenueUsd / 1000000;
                const fnbRev = roomRev * 0.16;
                const spaRev = roomRev * 0.11;
                const totalPropRev = roomRev + fnbRev + spaRev;

                return (
                  <tr
                    key={prop.id}
                    className={`hover:bg-zinc-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'
                      }`}
                  >
                    <td className="py-2 px-3 font-bold text-zinc-900 border-b border-zinc-100">
                      {prop.name}
                    </td>
                    <td className="py-2 px-3 text-zinc-500 text-[10.5px] border-b border-zinc-100">
                      {prop.city} · <span className="font-medium text-zinc-700">{prop.grouping}</span>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-zinc-800 border-b border-zinc-100">
                      ${roomRev.toFixed(2)}M
                    </td>
                    <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">
                      ${fnbRev.toFixed(2)}M
                    </td>
                    <td className="py-2 px-3 text-right text-zinc-600 border-b border-zinc-100">
                      ${spaRev.toFixed(2)}M
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-zinc-900 border-b border-zinc-100">
                      ${totalPropRev.toFixed(2)}M
                    </td>
                    <td className="py-2 px-3 text-right border-b border-zinc-100">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${prop.status === 'above_plan'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : prop.status === 'on_plan'
                              ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}
                      >
                        {prop.status === 'above_plan'
                          ? 'Above Plan'
                          : prop.status === 'on_plan'
                            ? 'On Plan'
                            : 'Attention'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
