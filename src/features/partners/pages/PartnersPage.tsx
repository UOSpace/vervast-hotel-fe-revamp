import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { createPortal } from 'react-dom';
import { DateRangeWidget } from '../../dashboard/components/widgets/resort-type/DateRangeWidget';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { AltArrowDown, CloseCircle } from '@solar-icons/react';

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
    urban: 'level4' | 'level3' | 'level2' | 'level1';
    ski: 'level4' | 'level3' | 'level2' | 'level1';
    beachResort: 'level4' | 'level3' | 'level2' | 'level1';
    nature: 'level4' | 'level3' | 'level2' | 'level1';
    wellness: 'level4' | 'level3' | 'level2' | 'level1';
  };
}

const PARTNERS_DATA: PartnerData[] = [
  {
    id: 'dertour-deluxe',
    name: 'Dertour Deluxe',
    guests: '864',
    guestsTrend: '↑ 14%',
    roomNights: '5,820',
    roomNightsTrend: '↑ 16%',
    revenue: '$7.8M',
    revenueTrend: '↑ 15%',
    adr: '$1,340',
    adrTrend: '↑ 8%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '76%',
    repeatRatioTrend: '↑ 6pp',
    type: 'Strategic CRM Partner',
    tier: 'TIER 1',
    strengths: ['Ski Lodges', 'Beach Resort Villas', 'Long Stays', 'Gastronomy'],
    destinations: {
      urban: 'level2',
      ski: 'level4',
      beachResort: 'level4',
      nature: 'level3',
      wellness: 'level2'
    }
  },
  {
    id: 'nuba',
    name: 'NUBa',
    guests: '742',
    guestsTrend: '↑ 18%',
    roomNights: '4,960',
    roomNightsTrend: '↑ 19%',
    revenue: '$6.5M',
    revenueTrend: '↑ 17%',
    adr: '$1,310',
    adrTrend: '↑ 10%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.4',
    repeatRatio: '74%',
    repeatRatioTrend: '↑ 5pp',
    type: 'Bespoke Luxury Agency',
    tier: 'TIER 1',
    strengths: ['Beach Resort Villas', 'Private Expeditions', 'Wellness Retreats', 'Multi-Property'],
    destinations: {
      urban: 'level2',
      ski: 'level3',
      beachResort: 'level4',
      nature: 'level3',
      wellness: 'level4'
    }
  },
  {
    id: 'voyages-du-monde',
    name: 'Voyages du Monde',
    guests: '618',
    guestsTrend: '↑ 11%',
    roomNights: '4,150',
    roomNightsTrend: '↑ 12%',
    revenue: '$5.4M',
    revenueTrend: '↑ 11%',
    adr: '$1,301',
    adrTrend: '↑ 9%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '71%',
    repeatRatioTrend: '↑ 4pp',
    type: 'Experiential Luxury Agency',
    tier: 'TIER 1',
    strengths: ['Nature Expeditions', 'Curated Journeys', 'Eco-Luxury', 'Family Travel'],
    destinations: {
      urban: 'level2',
      ski: 'level2',
      beachResort: 'level4',
      nature: 'level4',
      wellness: 'level3'
    }
  },
  {
    id: 'viajes-abreu',
    name: 'Viajes Abreu',
    guests: '524',
    guestsTrend: '↑ 9%',
    roomNights: '3,480',
    roomNightsTrend: '↑ 10%',
    revenue: '$4.6M',
    revenueTrend: '↑ 10%',
    adr: '$1,321',
    adrTrend: '↑ 7%',
    avgNights: '6.6',
    avgNightsTrend: '↑ 0.2',
    repeatRatio: '69%',
    repeatRatioTrend: '↑ 4pp',
    type: 'Iberian Luxury Partner',
    tier: 'TIER 1',
    strengths: ['Urban Residences', 'Beach Sanctuaries', 'Historic Villas', 'Culinary'],
    destinations: {
      urban: 'level4',
      ski: 'level2',
      beachResort: 'level4',
      nature: 'level2',
      wellness: 'level3'
    }
  },
  {
    id: 'cosa-travel',
    name: 'Cosa Travel',
    guests: '462',
    guestsTrend: '↑ 15%',
    roomNights: '3,120',
    roomNightsTrend: '↑ 14%',
    revenue: '$4.2M',
    revenueTrend: '↑ 16%',
    adr: '$1,346',
    adrTrend: '↑ 12%',
    avgNights: '6.8',
    avgNightsTrend: '↑ 0.5',
    repeatRatio: '77%',
    repeatRatioTrend: '↑ 6pp',
    type: 'Bespoke Travel Design',
    tier: 'TIER 1',
    strengths: ['Ski Chalets', 'Medical Wellness', 'Ultra-Luxury', 'Private Jets'],
    destinations: {
      urban: 'level3',
      ski: 'level4',
      beachResort: 'level3',
      nature: 'level2',
      wellness: 'level4'
    }
  },
  {
    id: 'airtours',
    name: 'Airtours',
    guests: '410',
    guestsTrend: '↑ 8%',
    roomNights: '2,740',
    roomNightsTrend: '↑ 9%',
    revenue: '$3.5M',
    revenueTrend: '↑ 8%',
    adr: '$1,277',
    adrTrend: '↑ 6%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '68%',
    repeatRatioTrend: '↑ 4pp',
    type: 'Premium Luxury Operator',
    tier: 'TIER 2',
    strengths: ['Beach Sanctuaries', 'Ski Lodges', 'All-Inclusive Packages'],
    destinations: {
      urban: 'level2',
      ski: 'level4',
      beachResort: 'level4',
      nature: 'level2',
      wellness: 'level2'
    }
  },
  {
    id: 'nyhavn',
    name: 'Nyhavn',
    guests: '365',
    guestsTrend: '↑ 10%',
    roomNights: '2,480',
    roomNightsTrend: '↑ 11%',
    revenue: '$3.1M',
    revenueTrend: '↑ 9%',
    adr: '$1,250',
    adrTrend: '↑ 7%',
    avgNights: '6.8',
    avgNightsTrend: '↑ 0.4',
    repeatRatio: '66%',
    repeatRatioTrend: '↑ 3pp',
    type: 'Nordic Luxury Tailor-Made',
    tier: 'TIER 2',
    strengths: ['Pristine Nature', 'Slow Travel', 'Family Suites', 'Wellness'],
    destinations: {
      urban: 'level2',
      ski: 'level3',
      beachResort: 'level3',
      nature: 'level4',
      wellness: 'level3'
    }
  },
  {
    id: 'sporting-vaccanze',
    name: 'Sporting Vaccanze',
    guests: '340',
    guestsTrend: '↑ 12%',
    roomNights: '2,290',
    roomNightsTrend: '↑ 13%',
    revenue: '$2.9M',
    revenueTrend: '↑ 12%',
    adr: '$1,266',
    adrTrend: '↑ 8%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '65%',
    repeatRatioTrend: '↑ 4pp',
    type: 'Tailor-Made Tour Operator',
    tier: 'TIER 2',
    strengths: ['Beach Luxury', 'Island Sanctuaries', 'Honeymoon Suites', 'Yacht Charters'],
    destinations: {
      urban: 'level2',
      ski: 'level2',
      beachResort: 'level4',
      nature: 'level2',
      wellness: 'level3'
    }
  },
  {
    id: 'manta-reisen',
    name: 'Manta Reisen',
    guests: '290',
    guestsTrend: '↑ 7%',
    roomNights: '1,980',
    roomNightsTrend: '↑ 8%',
    revenue: '$2.5M',
    revenueTrend: '↑ 7%',
    adr: '$1,262',
    adrTrend: '↑ 6%',
    avgNights: '6.8',
    avgNightsTrend: '↑ 0.2',
    repeatRatio: '63%',
    repeatRatioTrend: '↑ 3pp',
    type: 'Swiss Luxury Specialist',
    tier: 'TIER 2',
    strengths: ['Beach & Diving', 'Ski Expeditions', 'Thermal Spas'],
    destinations: {
      urban: 'level1',
      ski: 'level3',
      beachResort: 'level4',
      nature: 'level2',
      wellness: 'level3'
    }
  },
  {
    id: 'ferrer-y-saret',
    name: 'Ferrer y Saret',
    guests: '255',
    guestsTrend: '↑ 10%',
    roomNights: '1,720',
    roomNightsTrend: '↑ 9%',
    revenue: '$2.2M',
    revenueTrend: '↑ 10%',
    adr: '$1,279',
    adrTrend: '↑ 8%',
    avgNights: '6.7',
    avgNightsTrend: '↑ 0.3',
    repeatRatio: '62%',
    repeatRatioTrend: '↑ 3pp',
    type: 'Bespoke Luxury Agency',
    tier: 'TIER 2',
    strengths: ['Nature Estates', 'Ski Heli-Touring', 'Wine & Gastronomy', 'Urban Stays'],
    destinations: {
      urban: 'level3',
      ski: 'level4',
      beachResort: 'level2',
      nature: 'level4',
      wellness: 'level2'
    }
  }
];

// ── Monthly Booking Pace (forward OTB vs STLY) ─────────────────────────────
// Derived from each partner's own volume (room nights, YoY trend, ADR) so numbers
// stay consistent with the Partner Performance table. Forward window: next 6 months.
const PACE_MONTHS = ['Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27'];
const PACE_SEASONALITY = [1.0, 0.95, 1.25, 1.2, 1.15, 1.0]; // winter/ski season peak
const PACE_OTB_RATIO = [0.95, 0.78, 0.62, 0.48, 0.36, 0.25]; // share already on the books by lead time
const PACE_TREND_SHIFT = [0, 0.02, 0.03, 0.01, -0.01, -0.02]; // pace drift vs partner YoY trend

interface PacePoint {
  month: string;
  otb: number;
  stly: number;
  pace: number;
  revenue: number;
}

const parseNum = (s: string) => Number(s.replace(/[^0-9.]/g, ''));

function getPartnerPace(p: PartnerData): PacePoint[] {
  const base = parseNum(p.roomNights) / 8; // avg monthly room nights (Jan–Aug window)
  const trend = parseNum(p.roomNightsTrend) / 100;
  const adr = parseNum(p.adr);
  return PACE_MONTHS.map((month, i) => {
    const otb = Math.round(base * PACE_SEASONALITY[i] * PACE_OTB_RATIO[i]);
    const stly = Math.round(otb / (1 + trend + PACE_TREND_SHIFT[i]));
    return { month, otb, stly, pace: stly > 0 ? ((otb - stly) / stly) * 100 : 0, revenue: otb * adr };
  });
}

function sumPace(lists: PacePoint[][]): PacePoint[] {
  return PACE_MONTHS.map((month, i) => {
    const otb = lists.reduce((s, l) => s + l[i].otb, 0);
    const stly = lists.reduce((s, l) => s + l[i].stly, 0);
    const revenue = lists.reduce((s, l) => s + l[i].revenue, 0);
    return { month, otb, stly, pace: stly > 0 ? ((otb - stly) / stly) * 100 : 0, revenue };
  });
}

const fmtPace = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
const fmtMoney = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

const CONTRIBUTION_DATA = [
  { name: 'Dertour Deluxe', value: 28, color: '#0f172a' },
  { name: 'NUBa', value: 24, color: '#334155' },
  { name: 'Voyages du Monde', value: 20, color: '#475569' },
  { name: 'Viajes Abreu', value: 16, color: '#64748b' },
  { name: 'Cosa Travel', value: 12, color: '#94a3b8' },
];

export function PartnersPage() {
  const [selectedPartner, setSelectedPartner] = useState<PartnerData>(PARTNERS_DATA[0]);
  const [paceIds, setPaceIds] = useState<string[]>(PARTNERS_DATA.map((p) => p.id));
  const [paceMenuOpen, setPaceMenuOpen] = useState(false);
  const paceMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (paceMenuRef.current && !paceMenuRef.current.contains(e.target as Node)) setPaceMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const allPaceSelected = paceIds.length === PARTNERS_DATA.length;
  const togglePaceId = (id: string) =>
    setPaceIds((prev) => (prev.includes(id) ? (prev.length > 1 ? prev.filter((x) => x !== id) : prev) : [...prev, id]));
  const paceLabel = allPaceSelected
    ? 'All Partners'
    : paceIds.length === 1
      ? PARTNERS_DATA.find((p) => p.id === paceIds[0])?.name ?? 'Partner'
      : `${PARTNERS_DATA.find((p) => p.id === paceIds[0])?.name} +${paceIds.length - 1}`;
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

  // Booking pace (monthly OTB vs STLY)
  const allPace = sumPace(PARTNERS_DATA.map(getPartnerPace));
  const summarizePace = (pts: PacePoint[]) => {
    const otb = pts.reduce((s, x) => s + x.otb, 0);
    const stly = pts.reduce((s, x) => s + x.stly, 0);
    const revenue = pts.reduce((s, x) => s + x.revenue, 0);
    const peak = pts.reduce((best, x) => (x.otb > best.otb ? x : best), pts[0]);
    return { otb, stly, revenue, peak, pace: stly > 0 ? ((otb - stly) / stly) * 100 : 0 };
  };
  const allPaceTotals = summarizePace(allPace);
  const paceData = sumPace(PARTNERS_DATA.filter((p) => paceIds.includes(p.id)).map(getPartnerPace));
  const paceTotals = summarizePace(paceData);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden overflow-y-auto custom-scrollbar px-4 lg:px-6 pb-8 text-[10px] relative">
      {/* Header Container */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 z-10 animate-card-enter">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide mb-0.5">
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
            onClick={() => openDrawer('Partner Performance Ledger', 'Comprehensive performance across all 10 CRM partner travel agencies', (
              <div className="space-y-4">
                {/* 4 Summary Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Total Partner Revenue</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">$38.7M</div>
                    <div className="text-[9px] text-emerald-700 font-medium mt-0.5">↑ 14% vs LY</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Total Guests</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">4,789</div>
                    <div className="text-[9px] text-emerald-700 font-medium mt-0.5">↑ 12% vs LY</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Total Room Nights</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">31,340</div>
                    <div className="text-[9px] text-emerald-700 font-medium mt-0.5">↑ 13% vs LY</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Weighted ADR</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">$1,298</div>
                    <div className="text-[9px] text-emerald-700 font-medium mt-0.5">↑ 8% vs LY</div>
                  </div>
                </div>

                <div className="bg-zinc-50/70 border border-zinc-100 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-zinc-900 mb-1">Portfolio Agency Intelligence</h4>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Dertour Deluxe, NUBa, and Voyages du Monde spearhead portfolio luxury growth, contributing 72% of total partner volume. European and bespoke consortia maintain an average length of stay exceeding 6.5 nights with repeat ratios reaching 76%.
                  </p>
                </div>

                {/* Full 10 Partners Table */}
                <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-500 font-semibold text-[10px] whitespace-nowrap">
                        <th className="py-3 px-4">Partner Agency</th>
                        <th className="py-3 px-3">Tier</th>
                        <th className="py-3 px-3 text-right">Guests</th>
                        <th className="py-3 px-3 text-right">Nights</th>
                        <th className="py-3 px-3 text-right">Revenue</th>
                        <th className="py-3 px-3 text-right">ADR</th>
                        <th className="py-3 px-3 text-right">Avg Stay</th>
                        <th className="py-3 px-3 text-right">Repeat</th>
                        <th className="py-3 px-4">Top Strengths</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                      {PARTNERS_DATA.map((p, idx) => (
                        <tr
                          key={p.id}
                          onClick={() => setSelectedPartner(p)}
                          className={`hover:bg-zinc-50/80 cursor-pointer transition-colors ${selectedPartner.id === p.id ? 'bg-zinc-100/70 font-semibold' : ''}`}
                        >
                          <td className="py-3 px-4 font-semibold text-zinc-900">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-zinc-400 w-4 font-normal">{idx + 1}.</span>
                              <span className="text-zinc-900">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`whitespace-nowrap inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded tracking-wide ${p.tier === 'TIER 1' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 border border-zinc-200'}`}>
                              {p.tier}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-900 font-medium">
                            {p.guests} <span className="text-[9.5px] text-emerald-700 font-semibold ml-1">{p.guestsTrend}</span>
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.roomNights}</td>
                          <td className="py-3 px-3 text-right font-bold text-zinc-900">
                            {p.revenue} <span className="text-[9.5px] text-emerald-700 font-semibold ml-1">{p.revenueTrend}</span>
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.adr}</td>
                          <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.avgNights} nts</td>
                          <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.repeatRatio}</td>
                          <td className="py-3 px-4 text-[10px] text-zinc-600">
                            <div className="flex items-center gap-1.5">
                              {p.strengths.slice(0, 2).map((str, sIdx) => (
                                <span key={sIdx} className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/60 text-[9.5px] font-medium">
                                  {str}
                                </span>
                              ))}
                            </div>
                          </td>
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
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Performance</h3>
                <span className="text-[8.5px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">Top 5</span>
              </div>
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

              {/* Rows: Top 5 */}
              <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
                {PARTNERS_DATA.slice(0, 5).map((partner) => {
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
            onClick={() => openDrawer('Top Destinations by Partner Matrix', 'Full destination preference and geographic spread for all 10 CRM partner agencies', (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Urban Collection</div>
                    <div className="text-sm font-bold text-zinc-900 mt-0.5">18% Share</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">Viajes Abreu & Cosa Travel</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Ski Collection</div>
                    <div className="text-sm font-bold text-zinc-900 mt-0.5">26% Share</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">Dertour Deluxe & Manta Reisen</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Beach Resort</div>
                    <div className="text-sm font-bold text-zinc-900 mt-0.5">30% Share</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">NUBa & Sporting Vaccanze</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Nature Collection</div>
                    <div className="text-sm font-bold text-zinc-900 mt-0.5">14% Share</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">Voyages du Monde & Nyhavn</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Wellness Collection</div>
                    <div className="text-sm font-bold text-zinc-900 mt-0.5">12% Share</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">Cosa Travel & NUBa</div>
                  </div>
                </div>

                <div className="bg-zinc-50/70 border border-zinc-100 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Destination Intensity Heatmap</h4>
                      <p className="text-[11px] text-zinc-600 mt-0.5">Distribution of partner guest volume across Vervast's 5 luxury hotel categories.</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[8.5px] text-zinc-500 font-medium">
                      <span>Low</span>
                      <span className="w-2.5 h-2.5 rounded-xs bg-zinc-200"></span>
                      <span className="w-2.5 h-2.5 rounded-xs bg-zinc-400"></span>
                      <span className="w-2.5 h-2.5 rounded-xs bg-zinc-700"></span>
                      <span className="w-2.5 h-2.5 rounded-xs bg-zinc-900"></span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Table of all 10 Partners */}
                <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-500 font-semibold text-[10px] whitespace-nowrap">
                        <th className="py-3 px-4">Partner Agency</th>
                        <th className="py-3 px-3 text-center">Urban</th>
                        <th className="py-3 px-3 text-center">Ski</th>
                        <th className="py-3 px-3 text-center">Beach Resort</th>
                        <th className="py-3 px-3 text-center">Nature</th>
                        <th className="py-3 px-3 text-center">Wellness</th>
                        <th className="py-3 px-4">Primary Focus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                      {PARTNERS_DATA.map((partner) => (
                        <tr key={partner.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3 px-4 font-semibold text-zinc-900">{partner.name}</td>
                          <td className="py-3 px-3"><div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.urban)}`} /></div></td>
                          <td className="py-3 px-3"><div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.ski)}`} /></div></td>
                          <td className="py-3 px-3"><div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.beachResort)}`} /></div></td>
                          <td className="py-3 px-3"><div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.nature)}`} /></div></td>
                          <td className="py-3 px-3"><div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.wellness)}`} /></div></td>
                          <td className="py-3 px-4 text-[10px] text-zinc-500">{partner.strengths.slice(0, 2).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Destinations by Partner</h3>
                <span className="text-[8.5px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">Top 5</span>
              </div>
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
              <div className="grid grid-cols-[27%_14%_13%_16%_14%_16%] pb-1.5 border-b border-zinc-100 text-[9px] font-medium text-zinc-400 shrink-0 text-center">
                <div className="text-left">Partner</div>
                <div>Urban</div>
                <div>Ski</div>
                <div>Beach</div>
                <div>Nature</div>
                <div>Wellness</div>
              </div>

              {/* Rows: Top 5 */}
              <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
                {PARTNERS_DATA.slice(0, 5).map((partner) => (
                  <div key={partner.id} className="grid grid-cols-[27%_14%_13%_16%_14%_16%] items-center text-[10px]">
                    <div className="truncate text-zinc-700 font-medium text-left pr-1">{partner.name}</div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.urban)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.ski)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.beachResort)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.nature)}`} /></div>
                    <div className="flex justify-center"><span className={`w-4 h-3.5 rounded-[3px] ${getHeatmapColor(partner.destinations.wellness)}`} /></div>
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

        {/* ROW 1.5: Partner Booking Pace (monthly, forward OTB vs STLY) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          <div
            onClick={() => openDrawer('Partner Booking Pace by Month', 'Forward room nights on the books vs same time last year, next 6 months, all 10 CRM partners', (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Room Nights OTB (6M)</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">{allPaceTotals.otb.toLocaleString()}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">STLY {allPaceTotals.stly.toLocaleString()}</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Pace vs LY</div>
                    <div className={`text-lg font-bold mt-0.5 ${allPaceTotals.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>{fmtPace(allPaceTotals.pace)}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">Portfolio-wide</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Revenue OTB (6M)</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">{fmtMoney(allPaceTotals.revenue)}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">Room revenue at partner ADR</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                    <div className="text-[10px] text-zinc-500 font-medium">Peak Month</div>
                    <div className="text-lg font-bold text-zinc-900 mt-0.5">{allPaceTotals.peak.month}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{allPaceTotals.peak.otb.toLocaleString()} room nights</div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-500 font-semibold text-[10px] whitespace-nowrap">
                        <th className="py-3 px-4">Partner Agency</th>
                        {PACE_MONTHS.map((m) => (
                          <th key={m} className="py-3 px-3 text-right">{m}</th>
                        ))}
                        <th className="py-3 px-4 text-right">6M Pace vs LY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                      {PARTNERS_DATA.map((p) => {
                        const pts = getPartnerPace(p);
                        const otb = pts.reduce((s, x) => s + x.otb, 0);
                        const stly = pts.reduce((s, x) => s + x.stly, 0);
                        const pace = ((otb - stly) / stly) * 100;
                        return (
                          <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3 px-4 font-semibold text-zinc-900">{p.name}</td>
                            {pts.map((pt) => (
                              <td key={pt.month} className="py-3 px-3 text-right text-zinc-900 font-medium">
                                {pt.otb.toLocaleString()}
                                <span className={`ml-1 text-[9px] ${pt.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>{fmtPace(pt.pace)}</span>
                              </td>
                            ))}
                            <td className={`py-3 px-4 text-right font-semibold ${pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>{fmtPace(pace)}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-zinc-50/70 font-bold text-zinc-900">
                        <td className="py-3 px-4">Total Portfolio</td>
                        {allPace.map((pt) => (
                          <td key={pt.month} className="py-3 px-3 text-right">
                            {pt.otb.toLocaleString()}
                            <span className={`ml-1 text-[9px] ${pt.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>{fmtPace(pt.pace)}</span>
                          </td>
                        ))}
                        <td className={`py-3 px-4 text-right ${allPaceTotals.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>{fmtPace(allPaceTotals.pace)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Room nights on the books (OTB) per arrival month, compared with the same time last year (STLY). Winter months weigh heavier for ski-led partners; later months show lower OTB because of longer booking lead times.
                </p>
              </div>
            ))}
            className="col-span-12 lg:col-span-8 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.18s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Booking Pace</h3>
                <span className="text-[8.5px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">Next 6 Months · OTB vs LY</span>
                <InfoTooltip text="Forward-looking: room nights on the books for upcoming arrival months vs the same time last year. Independent of the header date range, which filters historical performance." />
              </div>
              <div ref={paceMenuRef} className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setPaceMenuOpen((o) => !o)}
                  className="h-6 pl-2.5 pr-2 rounded-lg border border-zinc-200/80 bg-white/80 hover:bg-zinc-100 text-[9.5px] font-medium text-zinc-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="max-w-[160px] truncate">{paceLabel}</span>
                  <AltArrowDown size={12} className={`text-zinc-500 transition-transform ${paceMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {paceMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 z-30 bg-white border border-zinc-200 rounded-lg shadow-lg shadow-black/10 p-1 max-h-72 overflow-y-auto custom-scrollbar">
                    <button
                      type="button"
                      onClick={() => setPaceIds(allPaceSelected ? [PARTNERS_DATA[0].id] : PARTNERS_DATA.map((p) => p.id))}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-50 text-[10px] font-semibold text-zinc-900 cursor-pointer"
                    >
                      <span className={`w-3 h-3 rounded-[3px] border flex items-center justify-center text-[8px] leading-none ${allPaceSelected ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'}`}>{allPaceSelected ? '✓' : ''}</span>
                      All Partners
                    </button>
                    <div className="h-px bg-zinc-100 my-1" />
                    {PARTNERS_DATA.map((p) => {
                      const on = paceIds.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePaceId(p.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-50 text-[10px] font-medium text-zinc-700 cursor-pointer"
                        >
                          <span className={`w-3 h-3 rounded-[3px] border flex items-center justify-center text-[8px] leading-none ${on ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300'}`}>{on ? '✓' : ''}</span>
                          <span className="truncate">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1 items-stretch">
              {/* Monthly dual-series area chart: OTB (solid) vs STLY (dashed) */}
              <div className="col-span-12 lg:col-span-8 flex flex-col justify-between">
                <div className="w-full h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={paceData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="paceOtbFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#18181b" stopOpacity={0.14} />
                          <stop offset="100%" stopColor="#18181b" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#f4f4f5" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: '#a1a1aa' }} width={40} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`)} />
                      <RechartsTooltip
                        cursor={{ stroke: '#d4d4d8', strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (!active || !payload || payload.length === 0) return null;
                          const d = payload[0].payload as PacePoint;
                          return (
                            <div className="bg-white border border-zinc-200 rounded-lg shadow-md px-3 py-2 text-[10px]">
                              <div className="font-bold text-zinc-900 mb-1">{d.month}</div>
                              <div className="flex justify-between gap-4 text-zinc-700"><span>This Year OTB</span><span className="font-medium text-zinc-900">{d.otb.toLocaleString()}</span></div>
                              <div className="flex justify-between gap-4 text-zinc-700"><span>Last Year STLY</span><span className="font-medium text-zinc-900">{d.stly.toLocaleString()}</span></div>
                              <div className={`flex justify-between gap-4 mt-1 font-semibold ${d.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}><span>Pace</span><span>{fmtPace(d.pace)}</span></div>
                            </div>
                          );
                        }}
                      />
                      <Area type="monotone" dataKey="stly" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={false} activeDot={{ r: 3, fill: '#a1a1aa', strokeWidth: 0 }} isAnimationActive={false} />
                      <Area type="monotone" dataKey="otb" stroke="#18181b" strokeWidth={2} fill="url(#paceOtbFill)" dot={{ r: 2.5, fill: '#18181b', strokeWidth: 0 }} activeDot={{ r: 4, fill: '#18181b', strokeWidth: 0 }} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 pt-2 text-[9px] text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-zinc-900 rounded-full" />This Year OTB</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 border-t border-dashed border-zinc-400" />Last Year (STLY)</span>
                </div>
              </div>

              {/* Summary metrics */}
              <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-x-5 gap-y-5 content-center border-t lg:border-t-0 lg:border-l border-zinc-100 pt-3 lg:pt-0 lg:pl-6">
                <div className="flex flex-col">
                  <span className={`text-[22px] font-normal leading-tight ${paceTotals.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>{fmtPace(paceTotals.pace)}</span>
                  <span className="text-[9.5px] text-zinc-500 font-medium">Pace vs LY</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[22px] font-normal text-zinc-900 leading-tight">{paceTotals.otb.toLocaleString()}</span>
                  <span className="text-[9.5px] text-zinc-500 font-medium">Room Nights OTB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[22px] font-normal text-zinc-900 leading-tight">{fmtMoney(paceTotals.revenue)}</span>
                  <span className="text-[9.5px] text-zinc-500 font-medium">Revenue OTB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[22px] font-normal text-zinc-900 leading-tight">{paceTotals.peak.month}</span>
                  <span className="text-[9.5px] text-zinc-500 font-medium">Peak Month</span>
                </div>
              </div>
            </div>
          </div>

          {/* PARTNER CONTRIBUTION MIX */}
          <div
            onClick={() => openDrawer('Partner Contribution Mix', 'Revenue & share distribution', (
              <div className="space-y-4">
                <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-zinc-900 mb-1">Contribution Mix</h4>
                  <p className="text-xs text-zinc-600">Dertour Deluxe continues to lead with a 28% total share of partner agency revenue.</p>
                </div>
              </div>
            ))}
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
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
        </div>

        {/* ROW 2: Corporate Accounts (4 cols) + Insights (4 cols) + Growth Opportunities (4 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
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
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
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
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Growth Opportunities</h3>
              <InfoTooltip text="High-impact initiatives identified to expand partner revenue." />
            </div>

            <div className="flex flex-col justify-between flex-1 pt-0.5 pb-0.5 gap-2">
              <div className="flex justify-between items-baseline border-b border-zinc-100 pb-1.5">
                <div className="min-w-0 pr-1">
                  <div className="text-[10px] font-bold text-zinc-900 truncate">Expand Alpine with Dertour Deluxe</div>
                  <div className="text-[8.5px] text-zinc-500 truncate">High winter wellness demand</div>
                </div>
                <span className="text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">High</span>
              </div>

              <div className="flex justify-between items-baseline">
                <div className="min-w-0 pr-1">
                  <div className="text-[10px] font-bold text-zinc-900 truncate">Co-brand with NUBa</div>
                  <div className="text-[8.5px] text-zinc-500 truncate">Family travel summer campaign</div>
                </div>
                <span className="text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">High</span>
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
            className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
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
                { partner: 'Dertour Deluxe', type: 'Quarterly Review', date: 'May 6' },
                { partner: 'NUBa', type: 'Strategy Call', date: 'May 9' },
                { partner: 'Cosa Travel', type: 'Product Update', date: 'May 12' },
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
                { title: 'Reconnect with NUBa', tag: 'May 6' },
                { title: 'Follow up with Voyages du Monde', tag: 'May 8' },
                { title: 'Thank Dertour Deluxe for Q1', tag: 'May 10' },
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
            className={`fixed top-1/2 left-1/2 z-[9999] max-h-[90vh] w-[95vw] sm:w-[940px] lg:w-[1080px] xl:w-[1200px] bg-white shadow-2xl rounded-2xl border border-zinc-200/90 flex flex-col overflow-hidden transition-all duration-300 ease-out transform -translate-x-1/2 ${drawerOpen
              ? 'opacity-100 scale-100 -translate-y-1/2'
              : 'opacity-0 scale-95 -translate-y-[45%] pointer-events-none'
              }`}
          >
            {drawerContent && (
              <>
                <div className="shrink-0 px-6 py-4 flex justify-between items-center border-b border-zinc-100 bg-zinc-50/70 backdrop-blur-xs">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">{drawerContent.title}</h2>
                    <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{drawerContent.description}</p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  >
                    <CloseCircle size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 text-zinc-800">
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
