import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { DateRangeWidget } from '../../dashboard/components/widgets/resort-type/DateRangeWidget';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { AltArrowDown } from '@solar-icons/react';

// Shared Moments images
import privateDinnerImg from '../../../assets/contents/private_dinner_alpine.png';
import wellnessRetreatImg from '../../../assets/contents/wellness_retreat.png';
import productWorkshopImg from '../../../assets/contents/product_workshop.png';
import sunsetCruiseImg from '../../../assets/contents/sunset_cruise.png';

interface PartnerData {
  id: string;
  name: string;
  guests: string;
  guestsTrend: string;
  roomNights: string;
  roomNightsTrend: string;
  revenue: string;
  revenueTrend: string;
  adr: string;
  adrTrend: string;
  avgNights: string;
  avgNightsTrend: string;
  repeatRatio: string;
  repeatRatioTrend: string;
  type: string;
  tier: string;
  strengths: string[];
  destinations: {
    alpine: 'level4' | 'level3' | 'level2' | 'level1';
    ocean: 'level4' | 'level3' | 'level2' | 'level1';
    forest: 'level4' | 'level3' | 'level2' | 'level1';
    desert: 'level4' | 'level3' | 'level2' | 'level1';
    city: 'level4' | 'level3' | 'level2' | 'level1';
    countryside: 'level4' | 'level3' | 'level2' | 'level1';
  };
}

const PARTNERS_DATA: PartnerData[] = [
  {
    id: 'virtuoso',
    name: 'Virtuoso',
    guests: '1,024',
    guestsTrend: '↑ 15%',
    roomNights: '6,842',
    roomNightsTrend: '↑ 18%',
    revenue: '$9.6M',
    revenueTrend: '↑ 16%',
    adr: '$1,403',
    adrTrend: '↑ 17%',
    avgNights: '6.8',
    avgNightsTrend: '↑ 0.4',
    repeatRatio: '78%',
    repeatRatioTrend: '↑ 7pp',
    type: 'Strategic Partner',
    tier: 'TIER 1',
    strengths: ['Family Travel', 'Wellness', 'Multi-Property', 'Long Stays'],
    destinations: {
      alpine: 'level4',
      ocean: 'level4',
      forest: 'level3',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'serandipians',
    name: 'Serandipians',
    guests: '642',
    guestsTrend: '↑ 10%',
    roomNights: '3,921',
    roomNightsTrend: '↑ 12%',
    revenue: '$5.1M',
    revenueTrend: '↑ 9%',
    adr: '$1,300',
    adrTrend: '↑ 10%',
    avgNights: '6.1',
    avgNightsTrend: '↑ 0.2',
    repeatRatio: '72%',
    repeatRatioTrend: '↑ 5pp',
    type: 'Preferred Partner',
    tier: 'TIER 1',
    strengths: ['Wellness', 'Family Travel', 'Villas', 'Eco-Luxury'],
    destinations: {
      alpine: 'level4',
      ocean: 'level4',
      forest: 'level2',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'travel-edge',
    name: 'Travel Edge',
    guests: '428',
    guestsTrend: '↑ 8%',
    roomNights: '2,713',
    roomNightsTrend: '↑ 9%',
    revenue: '$3.2M',
    revenueTrend: '↑ 7%',
    adr: '$1,180',
    adrTrend: '↑ 8%',
    avgNights: '6.3',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '68%',
    repeatRatioTrend: '↑ 4pp',
    type: 'Leisure Partner',
    tier: 'TIER 2',
    strengths: ['Multi-Property', 'Wellness', 'Weekend Escapes'],
    destinations: {
      alpine: 'level4',
      ocean: 'level4',
      forest: 'level1',
      desert: 'level1',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'remote-lands',
    name: 'Remote Lands',
    guests: '315',
    guestsTrend: '↑ 12%',
    roomNights: '2,104',
    roomNightsTrend: '↑ 10%',
    revenue: '$2.4M',
    revenueTrend: '↑ 11%',
    adr: '$1,140',
    adrTrend: '↑ 11%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.5',
    repeatRatio: '65%',
    repeatRatioTrend: '↑ 3pp',
    type: 'Bespoke Agency',
    tier: 'TIER 2',
    strengths: ['Curated Journeys', 'Private Villas', 'Culinary'],
    destinations: {
      alpine: 'level3',
      ocean: 'level3',
      forest: 'level2',
      desert: 'level2',
      city: 'level1',
      countryside: 'level1'
    }
  },
  {
    id: 'global-escapes',
    name: 'Global Escapes',
    guests: '210',
    guestsTrend: '↑ 5%',
    roomNights: '1,380',
    roomNightsTrend: '↑ 6%',
    revenue: '$1.5M',
    revenueTrend: '↑ 4%',
    adr: '$1,087',
    adrTrend: '↑ 5%',
    avgNights: '6.6',
    avgNightsTrend: '↑ 0.2',
    repeatRatio: '59%',
    repeatRatioTrend: '↑ 2pp',
    type: 'Affiliate Partner',
    tier: 'TIER 3',
    strengths: ['Weekend Escapes', 'Spa Programs', 'Dining'],
    destinations: {
      alpine: 'level2',
      ocean: 'level2',
      forest: 'level1',
      desert: 'level1',
      city: 'level2',
      countryside: 'level1'
    }
  }
];

const CONTRIBUTION_DATA = [
  { name: 'Virtuoso', value: 45, color: '#0f172a' },
  { name: 'Serandipians', value: 28, color: '#334155' },
  { name: 'Travel Edge', value: 14, color: '#64748b' },
  { name: 'Remote Lands', value: 8, color: '#94a3b8' },
  { name: 'Global Escapes', value: 5, color: '#cbd5e1' },
];

export function PartnersPage() {
  const [selectedPartner, setSelectedPartner] = useState<PartnerData>(PARTNERS_DATA[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<{ title: string; description: string; children: React.ReactNode } | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(new Date('2026-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2026-08-30'));
  const [compStartDate, setCompStartDate] = useState<Date | null>(new Date('2025-01-01'));
  const [compEndDate, setCompEndDate] = useState<Date | null>(new Date('2025-08-30'));

  const openDrawer = (title: string, description: string, children: React.ReactNode) => {
    setDrawerContent({ title, description, children });
    setDrawerOpen(true);
  };

  const getHeatmapColor = (level: 'level4' | 'level3' | 'level2' | 'level1') => {
    if (level === 'level4') return 'bg-zinc-900';
    if (level === 'level3') return 'bg-zinc-700';
    if (level === 'level2') return 'bg-zinc-400';
    return 'bg-zinc-200';
  };

  // Pure SVG Donut calculations
  const donutSize = 110;
  const donutStrokeWidth = 14;
  const donutRadius = (donutSize - donutStrokeWidth) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let donutAccumulated = 0;

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden overflow-y-auto custom-scrollbar px-4 lg:px-6 pb-8 text-[10px] relative">
      {/* Header Container */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 z-10 animate-card-enter">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 leading-tight mb-0.5">
            Relationship Intelligence
          </h1>
          <p className="text-zinc-500 text-xs font-normal">
            Deep understanding · Stronger connections · Shared success
          </p>
        </div>

        {/* Filters/Export Actions */}
        <div className="flex items-center gap-3">
          <DateRangeWidget
            startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
            compStartDate={compStartDate} setCompStartDate={setCompStartDate} compEndDate={compEndDate} setCompEndDate={setCompEndDate}
            showComparison={false}
          />

          <button className="h-9 border border-zinc-200/80 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3.5 font-medium flex items-center gap-2 bg-white/80 backdrop-blur-sm transition-all shadow-xs cursor-pointer">
            <AltArrowDown size={14} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Grid Content Container */}
      <div className="flex-1 flex flex-col gap-5 pb-4">
        {/* ROW 1: Partner Performance (5 cols) + Destinations Heatmap (4 cols) + Selected Partner Profile (3 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {/* PARTNER PERFORMANCE Table (col-span-5) */}
          <div
            onClick={() => openDrawer('Partner Performance', 'Consortia & luxury travel agencies overview', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Partner Performance Analysis</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Virtuoso and Serandipians drive over 70% of consortia revenue, demonstrating strong year-over-year ADR growth.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-400 font-medium text-[10px]">
                        <th className="py-2">Partner</th>
                        <th className="py-2 text-right">Guests</th>
                        <th className="py-2 text-right">Revenue</th>
                        <th className="py-2 text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800">
                      {PARTNERS_DATA.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50">
                          <td className="py-2.5 font-medium">{p.name}</td>
                          <td className="py-2.5 text-right">{p.guests}</td>
                          <td className="py-2.5 text-right">{p.revenue}</td>
                          <td className="py-2.5 text-right text-emerald-700 font-medium">{p.guestsTrend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Performance</h3>
              <InfoTooltip text="Comparative booking volume, revenue generation, and ADR trends across luxury consortia." />
            </div>

            <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
              {/* Header */}
              <div className="grid grid-cols-[28%_18%_18%_20%_16%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
                <div>Partner</div>
                <div className="text-right">Guests</div>
                <div className="text-right">Nights</div>
                <div className="text-right">Revenue</div>
                <div className="text-right">ADR</div>
              </div>

              {/* Rows */}
              <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
                {PARTNERS_DATA.map((partner) => {
                  const isSelected = selectedPartner.id === partner.id;
                  return (
                    <div
                      key={partner.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPartner(partner);
                      }}
                      className={`grid grid-cols-[28%_18%_18%_20%_16%] items-center text-[10px] rounded-md px-1 py-1 transition-colors ${isSelected ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'}`}
                    >
                      <div className="text-zinc-900 font-medium truncate pr-1">{partner.name}</div>
                      <div className="text-right font-medium text-zinc-900">
                        <div>{partner.guests}</div>
                      </div>
                      <div className="text-right font-medium text-zinc-900">
                        <div>{partner.roomNights}</div>
                      </div>
                      <div className="text-right font-medium text-zinc-900">
                        <div>{partner.revenue}</div>
                      </div>
                      <div className="text-right font-medium text-zinc-900">
                        <div>{partner.adr}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TOP DESTINATIONS BY PARTNER Heatmap (col-span-4) */}
          <div
            onClick={() => openDrawer('Top Destinations by Partner', 'Performance heatmap analysis by destination category', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Destination Preferences</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Alpine and Ocean destinations represent our top volume categories, driven heavily by Virtuoso and Serandipians.
                  </p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Destinations by Partner</h3>
              <div className="flex items-center gap-1.5 text-[8.5px] text-zinc-500 font-medium">
                <span>Low</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-200"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-400"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-700"></span>
                <span className="w-2.5 h-2.5 rounded-xs bg-zinc-900"></span>
                <span>High</span>
              </div>
            </div>

            <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
              {/* Header */}
              <div className="grid grid-cols-[28%_12%_12%_12%_12%_12%_12%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0 text-center">
                <div className="text-left">Partner</div>
                <div>Alp</div>
                <div>Ocn</div>
                <div>For</div>
                <div>Des</div>
                <div>Cty</div>
                <div>Cnt</div>
              </div>

              {/* Rows */}
              <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
                {PARTNERS_DATA.map((partner) => (
                  <div key={partner.id} className="grid grid-cols-[28%_12%_12%_12%_12%_12%_12%] items-center text-[10px]">
                    <div className="truncate text-zinc-700 font-medium text-left pr-1">{partner.name}</div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.alpine)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.ocean)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.forest)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.desert)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.city)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.countryside)}`} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Partner Profile Detail (col-span-3) */}
          <div
            onClick={() => openDrawer(`${selectedPartner.name} Profile`, 'Agency partner deep-dive and relationship history', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">{selectedPartner.name} Profile</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{selectedPartner.type} · {selectedPartner.tier}</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Summary</h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                {selectedPartner.tier}
              </span>
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-3">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                  {selectedPartner.name}
                </h2>
                <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                  {selectedPartner.type}
                </p>
              </div>

              {/* 4-Stat Grid */}
              <div className="grid grid-cols-4 gap-2 border-y border-zinc-100 py-2.5">
                <div className="flex flex-col">
                  <span className="text-base font-normal text-zinc-900 leading-none mb-1">{selectedPartner.guests}</span>
                  <span className="text-[8.5px] text-zinc-400 font-medium">Guests</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-2">
                  <span className="text-base font-normal text-zinc-900 leading-none mb-1">{selectedPartner.avgNights}</span>
                  <span className="text-[8.5px] text-zinc-400 font-medium">Nights</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-2">
                  <span className="text-base font-normal text-zinc-900 leading-none mb-1">{selectedPartner.repeatRatio}</span>
                  <span className="text-[8.5px] text-zinc-400 font-medium">Repeat</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-2">
                  <span className="text-base font-normal text-zinc-900 leading-none mb-1">{selectedPartner.revenue}</span>
                  <span className="text-[8.5px] text-zinc-400 font-medium">Rev</span>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <div className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Top Strengths</div>
                <div className="flex flex-wrap gap-1">
                  {selectedPartner.strengths.slice(0, 3).map((str, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200/80 text-zinc-700 text-[9px] font-medium">
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Partner Contribution Mix (3 cols) + Corporate Accounts (3 cols) + Insights (3 cols) + Growth Opportunities (3 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {/* PARTNER CONTRIBUTION MIX */}
          <div
            onClick={() => openDrawer('Partner Contribution Mix', 'Revenue & share distribution', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Contribution Mix</h4>
                  <p className="text-xs text-zinc-600">Virtuoso continues to lead with a 45% total share of revenue.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Contribution Mix</h3>
              <InfoTooltip text="Percentage share of revenue contributed by top travel consortia." />
            </div>

            <div className="flex-1 flex items-center justify-between py-1 gap-3">
              {/* Pure SVG Donut */}
              <div className="relative shrink-0 flex items-center justify-center" style={{ width: donutSize, height: donutSize }}>
                <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="transform -rotate-90">
                  {CONTRIBUTION_DATA.map((item, index) => {
                    const strokeLength = (item.value / 100) * donutCircumference;
                    const strokeOffset = -(donutAccumulated / 100) * donutCircumference;
                    donutAccumulated += item.value;

                    return (
                      <circle
                        key={index}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="none"
                        stroke={item.color}
                        strokeWidth={donutStrokeWidth}
                        strokeDasharray={`${Math.max(0, strokeLength - 1.5)} ${donutCircumference}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-sm font-bold text-zinc-900 leading-none">$18.7M</span>
                  <span className="text-[8px] text-zinc-500 font-medium mt-0.5">Total Rev</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-1">
                {CONTRIBUTION_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-500 font-medium truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-zinc-900 ml-2">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CORPORATE ACCOUNTS */}
          <div
            onClick={() => openDrawer('Corporate Accounts', 'Incentive travel & group retreats strategy', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Corporate Client Accounts</h4>
                  <p className="text-xs text-zinc-600">Managed relationships show a 93% satisfaction score.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.25s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Corporate Accounts</h3>
              <InfoTooltip text="Key managed accounts for executive retreats and enterprise programs." />
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-2.5">
              <div className="flex flex-col border-b border-zinc-100 pb-2">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-[10.5px] font-bold text-zinc-900 leading-tight">Global Exec Retreats</span>
                  <span className="text-[9.5px] font-bold text-zinc-900">$2.1M</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-normal">Leadership retreats · 12 Events YTD</span>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-[10.5px] font-bold text-zinc-900 leading-tight">Wellness Collective</span>
                  <span className="text-[9.5px] font-bold text-zinc-900">$1.4M</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-normal">Corporate wellness · 8 Events YTD</span>
              </div>
            </div>
          </div>

          {/* KEY RELATIONSHIP INSIGHTS */}
          <div
            onClick={() => openDrawer('Key Relationship Insights', 'AI-generated intelligence reports', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Relationship Insights</h4>
                  <p className="text-xs text-zinc-600">AI analysis to maximize partner engagement and revenue.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Key Relationship Insights</h3>
              <InfoTooltip text="Actionable intelligence on partner loyalty and growth factors." />
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-2">
              <div className="border-b border-zinc-100 pb-2">
                <div className="text-[10px] font-bold text-zinc-900 leading-tight">High Engagement, Strong Potential</div>
                <div className="text-[9px] text-zinc-500 font-normal mt-0.5">Tier 1 partners show 18% higher revenue growth.</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-900 leading-tight">Wellness is a Shared Strength</div>
                <div className="text-[9px] text-zinc-500 font-normal mt-0.5">68% of top partners co-create wellness experiences.</div>
              </div>
            </div>
          </div>

          {/* GROWTH OPPORTUNITIES */}
          <div
            onClick={() => openDrawer('Growth Opportunities', 'Partnership roadmaps & expansion plans', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Partnership Roadmaps</h4>
                  <p className="text-xs text-zinc-600">Action items to co-create exclusive initiatives.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Growth Opportunities</h3>
              <InfoTooltip text="High-impact initiatives identified to expand partner revenue." />
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-2">
              <div className="flex justify-between items-baseline border-b border-zinc-100 pb-1.5">
                <div className="min-w-0 pr-1">
                  <div className="text-[10px] font-bold text-zinc-900 truncate">Expand Alpine with Virtuoso</div>
                  <div className="text-[8.5px] text-zinc-500 truncate">High winter wellness demand</div>
                </div>
                <span className="text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">High</span>
              </div>

              <div className="flex justify-between items-baseline">
                <div className="min-w-0 pr-1">
                  <div className="text-[10px] font-bold text-zinc-900 truncate">Co-brand with Serandipians</div>
                  <div className="text-[8.5px] text-zinc-500 truncate">Family travel summer campaign</div>
                </div>
                <span className="text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Upcoming Touchpoints (4 cols) + Shared Moments (5 cols) + Next Best Actions (3 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {/* UPCOMING TOUCHPOINTS */}
          <div
            onClick={() => openDrawer('Upcoming Touchpoints', 'Strategy calls & review schedules', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Touchpoint Agenda</h4>
                  <p className="text-xs text-zinc-600">Scheduled sync meetings with luxury consortia leadership.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Touchpoints</h3>
              <InfoTooltip text="Scheduled review meetings, strategy calls, and co-marketing syncs." />
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-2.5">
              {[
                { partner: 'Virtuoso', type: 'Quarterly Review', date: 'May 6' },
                { partner: 'Serandipians', type: 'Strategy Call', date: 'May 9' },
                { partner: 'Travel Edge', type: 'Product Update', date: 'May 12' },
              ].map((tp) => (
                <div key={tp.partner} className="flex justify-between items-baseline border-b border-zinc-100 pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="text-[10.5px] font-bold text-zinc-900 leading-tight">{tp.partner}</div>
                    <div className="text-[9px] text-zinc-400 font-normal mt-0.5">{tp.type}</div>
                  </div>
                  <span className="text-[9.5px] text-zinc-500 font-medium">{tp.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SHARED MOMENTS THAT MATTER */}
          <div
            onClick={() => openDrawer('Shared Moments That Matter', 'Historical event gallery & memory log', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Shared Moments</h4>
                  <p className="text-xs text-zinc-600">Photo gallery of partner networking events and retreats.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.45s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Shared Moments That Matter</h3>
              <InfoTooltip text="Visual memories of co-branded retreats and executive partner summits." />
            </div>

            <div className="grid grid-cols-4 gap-3 py-1 flex-1 items-center">
              {[
                { img: privateDinnerImg, title: 'Private Dinner', date: 'Feb 12' },
                { img: wellnessRetreatImg, title: 'Wellness Retreat', date: 'Mar 5' },
                { img: productWorkshopImg, title: 'Product Workshop', date: 'Mar 26' },
                { img: sunsetCruiseImg, title: 'Sunset Cruise', date: 'Apr 18' },
              ].map((moment) => (
                <div key={moment.title} className="flex flex-col min-w-0">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200/80 mb-1.5 bg-zinc-100">
                    <img src={moment.img} alt={moment.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[9.5px] font-bold text-zinc-900 truncate leading-tight">{moment.title}</div>
                  <div className="text-[8.5px] text-zinc-400 font-normal mt-0.5">{moment.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* NEXT BEST ACTIONS */}
          <div
            onClick={() => openDrawer('Next Best Actions', 'Operational task checklist & execution log', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Action Items</h4>
                  <p className="text-xs text-zinc-600">Immediate tasks to execute and monitor partner relations.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Next Best Actions</h3>
              <InfoTooltip text="Priority relationship actions recommended by intelligence insights." />
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-2.5">
              {[
                { title: 'Reconnect with Serandipians', tag: 'May 6' },
                { title: 'Follow up with Travel Edge', tag: 'May 8' },
                { title: 'Thank Virtuoso for Q1', tag: 'May 10' },
              ].map((action) => (
                <div key={action.title} className="flex justify-between items-baseline border-b border-zinc-100 pb-2 last:border-0 last:pb-0">
                  <div className="text-[10px] font-bold text-zinc-900 leading-tight truncate pr-1">{action.title}</div>
                  <span className="text-[9px] text-zinc-400 font-medium shrink-0">{action.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Panel Portal */}
      {createPortal(
        <>
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[9998] transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setDrawerOpen(false)}
          />

          <div
            className={`fixed top-1/2 left-1/2 z-[9999] max-h-[85vh] w-[92vw] sm:w-[600px] bg-white shadow-2xl rounded-2xl border border-zinc-200 flex flex-col overflow-hidden transition-all duration-300 ease-out transform -translate-x-1/2 ${drawerOpen
              ? 'opacity-100 scale-100 -translate-y-1/2'
              : 'opacity-0 scale-95 -translate-y-[45%] pointer-events-none'
              }`}
          >
            {drawerContent && (
              <>
                <div className="shrink-0 p-5 flex justify-between items-center border-b border-zinc-100 bg-zinc-50/50">
                  <div>
                    <h2 className="text-base font-bold text-zinc-900">{drawerContent.title}</h2>
                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{drawerContent.description}</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 text-zinc-800">
                  {drawerContent.children}
                </div>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
