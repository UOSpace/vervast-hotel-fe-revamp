import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { createPortal } from 'react-dom';
import { PeriodTabsWidget } from '../../dashboard/components/widgets/resort-type/PeriodTabsWidget';
import { getPortfolioMetrics, PERIOD_DEFS, fmtUsd, fmtInt, fmtPct, type PeriodId } from '@/data/portfolio';
import { getBookingPaceSeries } from '@/data/portfolio/hospitalityMix';
import { InfoTooltip } from '../../common/components/InfoTooltip';
import { AltArrowDown, CloseCircle, RoundAltArrowRight, RoundAltArrowDown } from '@solar-icons/react';

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
    tier: 'TIER 3',
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
    tier: 'TIER 3',
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

// ── Forward Booking Pace (7D / 14D / 30D / 90D OTB vs STLY) ────────────────
type PaceWindowDays = 7 | 14 | 30 | 90;
const PACE_WINDOWS: { id: PaceWindowDays; label: string }[] = [
  { id: 7, label: '7D' },
  { id: 14, label: '14D' },
  { id: 30, label: '30D' },
  { id: 90, label: '90D' },
];
const PACE_SLICE_DRIFT = [0, 0.015, 0.025, 0.01, -0.01, -0.015, 0.008];

interface PacePoint {
  month: string;
  range: string;
  thisYear: number;
  lastYear: number;
  otb: number;
  stly: number;
  bookings: number;
  stlyBookings: number;
  pace: number;
  revenue: number;
  stlyRevenue: number;
}

const parseNum = (s: string) => Number(s.replace(/[^0-9.]/g, ''));
const TOTAL_PARTNER_BASE_RN = PARTNERS_DATA.reduce((s, p) => s + parseNum(p.roomNights), 0);

function getPartnerPaceForWindow(p: PartnerData, windowDays: PaceWindowDays): PacePoint[] {
  const baseSlices = getBookingPaceSeries(undefined, windowDays);
  const partnerShare = parseNum(p.roomNights) / Math.max(1, TOTAL_PARTNER_BASE_RN);
  const rnTrend = parseNum(p.roomNightsTrend) / 100;
  const bkTrend = parseNum(p.guestsTrend) / 100;
  const revTrend = parseNum(p.revenueTrend) / 100;
  const adr = parseNum(p.adr);
  const avgStay = Math.max(1, parseNum(p.avgNights));

  return baseSlices.map((s, i) => {
    const drift = PACE_SLICE_DRIFT[i % PACE_SLICE_DRIFT.length];
    const thisYear = Math.max(1, Math.round(s.thisYear * 0.48 * partnerShare * (1 + drift * 0.5)));
    const lastYear = Math.max(1, Math.round(thisYear / (1 + rnTrend + drift)));
    const bookings = Math.max(1, Math.round(thisYear / avgStay));
    const stlyBookings = Math.max(1, Math.round(bookings / (1 + bkTrend + drift)));
    const revenue = thisYear * adr;
    const stlyRevenue = Math.round(revenue / (1 + revTrend + drift));
    const pace = lastYear > 0 ? ((thisYear - lastYear) / lastYear) * 100 : 0;
    return {
      month: s.month,
      range: s.range,
      thisYear,
      lastYear,
      otb: thisYear,
      stly: lastYear,
      bookings,
      stlyBookings,
      pace,
      revenue,
      stlyRevenue,
    };
  });
}

function sumPaceForWindow(lists: PacePoint[][], windowDays: PaceWindowDays): PacePoint[] {
  const baseSlices = getBookingPaceSeries(undefined, windowDays);
  return baseSlices.map((s, i) => {
    const thisYear = lists.reduce((acc, l) => acc + (l[i]?.thisYear ?? 0), 0);
    const lastYear = lists.reduce((acc, l) => acc + (l[i]?.lastYear ?? 0), 0);
    const bookings = lists.reduce((acc, l) => acc + (l[i]?.bookings ?? 0), 0);
    const stlyBookings = lists.reduce((acc, l) => acc + (l[i]?.stlyBookings ?? 0), 0);
    const revenue = lists.reduce((acc, l) => acc + (l[i]?.revenue ?? 0), 0);
    const stlyRevenue = lists.reduce((acc, l) => acc + (l[i]?.stlyRevenue ?? 0), 0);
    const pace = lastYear > 0 ? ((thisYear - lastYear) / lastYear) * 100 : 0;
    return {
      month: s.month,
      range: s.range,
      thisYear,
      lastYear,
      otb: thisYear,
      stly: lastYear,
      bookings,
      stlyBookings,
      pace,
      revenue,
      stlyRevenue,
    };
  });
}

const fmtPace = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

const CONTRIBUTION_COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'] as const;

const TIER_META = [
  { id: 'TIER 1', label: 'Tier 1', color: '#0f172a' },
  { id: 'TIER 2', label: 'Tier 2', color: '#475569' },
  { id: 'TIER 3', label: 'Tier 3', color: '#94a3b8' },
] as const;

const SHARED_MOMENTS_DATA = [
  { img: privateDinnerImg, title: 'Private Dinner', partner: 'Dertour Deluxe', category: 'Ski', date: 'Feb 12' },
  { img: wellnessRetreatImg, title: 'Wellness Retreat', partner: 'NUBa', category: 'Wellness', date: 'Mar 5' },
  { img: productWorkshopImg, title: 'Product Workshop', partner: 'Voyages du Monde', category: 'Urban', date: 'Mar 26' },
  { img: sunsetCruiseImg, title: 'Sunset Cruise', partner: 'Viajes Abreu', category: 'Beach', date: 'Apr 18' },
  { img: privateDinnerImg, title: 'Executive Ski Summit', partner: 'Cosa Travel', category: 'Ski', date: 'May 2' },
  { img: wellnessRetreatImg, title: 'Thermal Spa Preview', partner: 'Airtours', category: 'Wellness', date: 'May 19' },
  { img: productWorkshopImg, title: 'Bespoke Culinary Table', partner: 'Nyhavn', category: 'Nature', date: 'Jun 8' },
  { img: sunsetCruiseImg, title: 'Island Villa Showcase', partner: 'Sporting Vaccanze', category: 'Beach', date: 'Jun 24' },
];

/** "See details" affordance. The click bubbles to the parent card, which already opens its drawer. */
function SeeDetailsLink() {
  return (
    <button
      type="button"
      className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
    >
      <span>See details</span> <RoundAltArrowRight size={10} />
    </button>
  );
}

type ScaledPartner = PartnerData & { gN: number; bN: number; nN: number; rN: number; bookings: string };

/** Partner base data is the YTD book; additive figures scale to the selected period via the portfolio engine. */
function scalePartners(period: PeriodId): ScaledPartner[] {
  const f = getPortfolioMetrics(undefined, period).roomsSold / Math.max(1, getPortfolioMetrics(undefined, 'ytd').roomsSold);
  return PARTNERS_DATA.map((p) => {
    const gN = Math.round(parseNum(p.guests) * f);
    const nN = Math.round(parseNum(p.roomNights) * f);
    const bN = Math.max(gN > 0 ? 1 : 0, Math.round(gN * 0.65));
    const rN = parseNum(p.revenue) * 1_000_000 * f;
    return { ...p, gN, bN, nN, rN, guests: fmtInt(gN), bookings: fmtInt(bN), roomNights: fmtInt(nN), revenue: fmtUsd(rN) };
  });
}

const wAvg = (rows: ScaledPartner[], w: (p: ScaledPartner) => number, v: (p: ScaledPartner) => number) => {
  const tw = rows.reduce((s, r) => s + w(r), 0);
  return tw > 0 ? rows.reduce((s, r) => s + w(r) * v(r), 0) / tw : 0;
};
export function PartnersPage() {
  const [period, setPeriod] = useState<PeriodId>('mtd');
  const [categoryMetric, setCategoryMetric] = useState<'revenue' | 'roomNights' | 'bookings'>('revenue');
  const [contributionMetric, setContributionMetric] = useState<'revenue' | 'roomNights' | 'bookings'>('revenue');
  const [paceWindowDays, setPaceWindowDays] = useState<PaceWindowDays>(90);
  const partners = scalePartners(period);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(PARTNERS_DATA[0].id);
  const selectedPartner = partners.find((x) => x.id === selectedPartnerId) ?? partners[0];
  const setSelectedPartner = (x: PartnerData) => setSelectedPartnerId(x.id);
  const [paceIds, setPaceIds] = useState<string[]>(PARTNERS_DATA.map((p) => p.id));
  const [paceMenuOpen, setPaceMenuOpen] = useState(false);
  const paceMenuRef = useRef<HTMLDivElement>(null);
  const momentsScrollRef = useRef<HTMLDivElement>(null);

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
  const [drawerContent, setDrawerContent] = useState<{ title: string; description: string; children: React.ReactNode; widthClass?: string } | null>(null);


  const openDrawer = (title: string, description: string, children: React.ReactNode, widthClass?: string) => {
    setDrawerContent({ title, description, children, widthClass });
    setDrawerOpen(true);
  };

  // Pure SVG Donut calculations
  const donutSize = 110;
  const donutStrokeWidth = 14;
  const donutRadius = (donutSize - donutStrokeWidth) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let donutAccumulated = 0;

  // Booking pace (forward OTB vs STLY across 7D / 14D / 30D / 90D)
  const summarizePace = (pts: PacePoint[]) => {
    const otb = pts.reduce((s, x) => s + x.otb, 0);
    const stly = pts.reduce((s, x) => s + x.stly, 0);
    const bookings = pts.reduce((s, x) => s + x.bookings, 0);
    const stlyBookings = pts.reduce((s, x) => s + x.stlyBookings, 0);
    const revenue = pts.reduce((s, x) => s + x.revenue, 0);
    const stlyRevenue = pts.reduce((s, x) => s + x.stlyRevenue, 0);
    const peak = pts.reduce((best, x) => (x.otb > best.otb ? x : best), pts[0]);
    const pace = stly > 0 ? ((otb - stly) / stly) * 100 : 0;
    const bkPace = stlyBookings > 0 ? ((bookings - stlyBookings) / stlyBookings) * 100 : pace;
    const revPace = stlyRevenue > 0 ? ((revenue - stlyRevenue) / stlyRevenue) * 100 : pace + 1.2;
    const pickup7d = fmtPace(pace * 0.52);
    const pickup30d = fmtPace(pace * 0.94);
    return {
      otb,
      stly,
      bookings,
      stlyBookings,
      revenue,
      stlyRevenue,
      peak,
      pace,
      bkPace,
      revPace,
      paceVsLy: fmtPace(pace),
      bookingsOtb: fmtInt(bookings),
      bookingsTrend: fmtPace(bkPace),
      roomNightsOtb: fmtInt(otb),
      roomNightsTrend: fmtPace(pace),
      revenueOtb: fmtUsd(revenue),
      revenueTrend: fmtPace(revPace),
      pickup7d,
      pickup30d,
    };
  };
  const paceData = sumPaceForWindow(
    PARTNERS_DATA.filter((p) => paceIds.includes(p.id)).map((p) => getPartnerPaceForWindow(p, paceWindowDays)),
    paceWindowDays
  );
  const paceTotals = summarizePace(paceData);

  return (
    <div className="w-full h-full flex flex-col pt-4 lg:pt-6 overflow-x-hidden overflow-y-auto custom-scrollbar px-4 lg:px-6 pb-8 text-[10px] relative">
      {/* Header Container */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 z-10 animate-card-enter">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-wide mb-0.5">
            Relationship Intelligence Dashboard
          </h1>
          <p className="text-zinc-900 text-xs font-medium">
            As of: {PERIOD_DEFS[period].periodLabel}
          </p>
        </div>

        {/* Filters/Export Actions */}
        <div className="flex items-center gap-3">
          <PeriodTabsWidget period={period} setPeriod={setPeriod} showLabel={false} />

          <button className="h-9 border border-zinc-200/80 text-zinc-800 hover:bg-zinc-100 rounded-lg text-[10px] px-3.5 font-medium flex items-center gap-2 bg-white/80 backdrop-blur-sm transition-all shadow-xs cursor-pointer">
            <AltArrowDown size={14} className="rotate-180 text-zinc-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Grid Content Container */}
      <div className="flex-1 flex flex-col gap-5 pb-4">
        {/* KPI strip: partner-driven hotel performance for the selected period */}
        {(() => {
          const rev = partners.reduce((s, x) => s + x.rN, 0);
          const nights = partners.reduce((s, x) => s + x.nN, 0);
          const bookings = partners.reduce((s, x) => s + x.bN, 0);
          const adr = nights > 0 ? rev / nights : 0;
          const repeat = wAvg(partners, (x) => x.gN, (x) => parseNum(x.repeatRatio));
          const repeatPts = wAvg(partners, (x) => x.gN, (x) => parseNum(x.repeatRatioTrend));
          const active = partners.filter((x) => x.nN > 0).length;

          const revLy = wAvg(partners, (x) => x.rN, (x) => parseNum(x.revenueTrend));
          const rnLy = wAvg(partners, (x) => x.nN, (x) => parseNum(x.roomNightsTrend));
          const bkLy = wAvg(partners, (x) => x.gN, (x) => parseNum(x.guestsTrend));
          const adrLy = wAvg(partners, (x) => x.rN, (x) => parseNum(x.adrTrend));

          const kpis = [
            {
              label: 'Hotel Revenue',
              value: fmtUsd(rev),
              vsLy: `+${revLy.toFixed(1)}% vs LY`,
              vsBudget: `+${(revLy * 0.36).toFixed(1)}% vs Budget`,
              vsForecast: `+${(revLy * 0.18).toFixed(1)}% vs Forecast`,
            },
            {
              label: 'Room Nights',
              value: fmtInt(nights),
              vsLy: `+${rnLy.toFixed(1)}% vs LY`,
              vsBudget: `+${(rnLy * 0.35).toFixed(1)}% vs Budget`,
              vsForecast: `+${(rnLy * 0.17).toFixed(1)}% vs Forecast`,
            },
            {
              label: 'Bookings',
              value: fmtInt(bookings),
              vsLy: `+${bkLy.toFixed(1)}% vs LY`,
              vsBudget: `+${(bkLy * 0.34).toFixed(1)}% vs Budget`,
              vsForecast: `+${(bkLy * 0.16).toFixed(1)}% vs Forecast`,
            },
            {
              label: 'ADR',
              value: `$${Math.round(adr).toLocaleString('en-US')}`,
              vsLy: `+${adrLy.toFixed(1)}% vs LY`,
              vsBudget: `+${(adrLy * 0.38).toFixed(1)}% vs Budget`,
              vsForecast: `+${(adrLy * 0.19).toFixed(1)}% vs Forecast`,
            },
            {
              label: 'Repeat Rate',
              value: fmtPct(repeat, 0),
              vsLy: `+${repeatPts.toFixed(1)} pts vs LY`,
              vsBudget: `+${(repeatPts * 0.44).toFixed(1)} pts vs Budget`,
              vsForecast: `+${(repeatPts * 0.22).toFixed(1)} pts vs Forecast`,
            },
            {
              label: 'Active Agencies',
              value: String(active),
              vsLy: '+2 vs LY',
              vsBudget: '+0 vs Budget',
              vsForecast: '+0 vs Forecast',
            },
          ];
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 -mx-3">
              {kpis.map((k, i) => (
                <div
                  key={k.label}
                  className="relative rounded-[12px] p-3 flex flex-col justify-between h-full animate-card-enter hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                      {k.label}
                    </span>
                    <span className="inline-flex items-center text-[8.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                      {k.vsLy}
                    </span>
                  </div>
                  <div className="text-[20px] font-normal text-zinc-900 leading-tight my-1">
                    {k.value}
                  </div>
                  <div className="flex items-center gap-1 flex-nowrap">
                    <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                      {k.vsBudget}
                    </span>
                    <span className="inline-flex items-center text-[7.5px] xl:text-[8px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                      {k.vsForecast}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
        {/* ROW 1: Partner Performance (5 cols) + Destinations Heatmap (4 cols) + Selected Partner Profile (3 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {/* PARTNER PERFORMANCE Table (col-span-5) */}
          <div
            onClick={() => {
              const totalGuests = partners.reduce((s, p) => s + p.gN, 0);
              const totalBookings = partners.reduce((s, p) => s + p.bN, 0);
              const totalRoomNights = partners.reduce((s, p) => s + p.nN, 0);
              const totalRevenue = partners.reduce((s, p) => s + p.rN, 0);
              const avgAdr = totalRoomNights > 0 ? Math.round(totalRevenue / totalRoomNights) : 0;
              const avgStay = wAvg(partners, (x) => x.nN, (x) => parseNum(x.avgNights));
              const avgRepeat = wAvg(partners, (x) => x.gN, (x) => parseNum(x.repeatRatio));

              const guestsLy = wAvg(partners, (x) => x.gN, (x) => parseNum(x.guestsTrend));
              const bookingsLy = wAvg(partners, (x) => x.bN, (x) => parseNum(x.guestsTrend));
              const rnLy = wAvg(partners, (x) => x.nN, (x) => parseNum(x.roomNightsTrend));
              const revLy = wAvg(partners, (x) => x.rN, (x) => parseNum(x.revenueTrend));
              const adrLy = wAvg(partners, (x) => x.rN, (x) => parseNum(x.adrTrend));
              const stayLy = wAvg(partners, (x) => x.nN, (x) => parseNum(x.avgNightsTrend));
              const repeatPts = wAvg(partners, (x) => x.gN, (x) => parseNum(x.repeatRatioTrend));

              const drawerSummaries = [
                {
                  label: 'Guests',
                  value: fmtInt(totalGuests),
                  vsLy: `+${guestsLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(guestsLy * 0.34).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(guestsLy * 0.16).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Bookings',
                  value: fmtInt(totalBookings),
                  vsLy: `+${bookingsLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(bookingsLy * 0.34).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(bookingsLy * 0.16).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Room Nights',
                  value: fmtInt(totalRoomNights),
                  vsLy: `+${rnLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(rnLy * 0.35).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(rnLy * 0.17).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Revenue',
                  value: fmtUsd(totalRevenue),
                  vsLy: `+${revLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(revLy * 0.36).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(revLy * 0.18).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'ADR',
                  value: `$${avgAdr.toLocaleString('en-US')}`,
                  vsLy: `+${adrLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(adrLy * 0.38).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(adrLy * 0.19).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Avg Stay',
                  value: `${avgStay.toFixed(1)} nts`,
                  vsLy: `+${stayLy.toFixed(1)} nts vs LY`,
                  vsBudget: `+${(stayLy * 0.4).toFixed(1)} nts vs Budget`,
                  vsForecast: `+${(stayLy * 0.2).toFixed(1)} nts vs Forecast`,
                },
                {
                  label: 'Repeat',
                  value: fmtPct(avgRepeat, 0),
                  vsLy: `+${repeatPts.toFixed(1)} pts vs LY`,
                  vsBudget: `+${(repeatPts * 0.44).toFixed(1)} pts vs Budget`,
                  vsForecast: `+${(repeatPts * 0.22).toFixed(1)} pts vs Forecast`,
                },
              ];

              openDrawer(
                'Partner Performance Ledger',
                'Comprehensive performance across all 10 CRM partner travel agencies',
                <div className="space-y-4">
                  {/* Summary Metric Cards matching Table Columns & Global Overview Layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                    {drawerSummaries.map((s) => (
                      <div
                        key={s.label}
                        className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-2.5 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9.5px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                            {s.label}
                          </span>
                          <span className="inline-flex items-center text-[8px] font-semibold px-1 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                            {s.vsLy}
                          </span>
                        </div>
                        <div className="text-[18px] font-normal text-zinc-900 leading-tight my-1.5">
                          {s.value}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="inline-flex items-center text-[7px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                            {s.vsBudget}
                          </span>
                          <span className="inline-flex items-center text-[7px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                            {s.vsForecast}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full 10 Partners Table */}
                  <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-500 font-semibold text-[10px] whitespace-nowrap">
                          <th className="py-3 px-4">Partner Agency</th>
                          <th className="py-3 px-3">Tier</th>
                          <th className="py-3 px-3 text-right">Guests</th>
                          <th className="py-3 px-3 text-right">Bookings</th>
                          <th className="py-3 px-3 text-right">Room Nights</th>
                          <th className="py-3 px-3 text-right">Revenue</th>
                          <th className="py-3 px-3 text-right">ADR</th>
                          <th className="py-3 px-3 text-right">Avg Stay</th>
                          <th className="py-3 px-4 text-right">Repeat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                        {partners.map((p, idx) => (
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
                            <td className="py-3 px-3 text-right text-zinc-900 font-medium">{p.guests}</td>
                            <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.bookings}</td>
                            <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.roomNights}</td>
                            <td className="py-3 px-3 text-right font-bold text-zinc-900">{p.revenue}</td>
                            <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.adr}</td>
                            <td className="py-3 px-3 text-right text-zinc-800 font-medium">{p.avgNights} nts</td>
                            <td className="py-3 px-4 text-right text-zinc-800 font-medium">{p.repeatRatio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }}
            className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.05s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Performance</h3>
                <span className="text-[8.5px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">Top 5</span>
              </div>
              <div className="flex items-center gap-2"><InfoTooltip text="Comparative booking volume, revenue generation, and ADR trends across luxury consortia." /><SeeDetailsLink /></div>
            </div>

            <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
              {/* Header */}
              <div className="grid grid-cols-[26%_13%_15%_18%_15%_13%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
                <div>Partner</div>
                <div className="text-right">Guests</div>
                <div className="text-right">Bookings</div>
                <div className="text-right">Room Nights</div>
                <div className="text-right">Revenue</div>
                <div className="text-right">ADR</div>
              </div>

              {/* Rows: Top 5 */}
              <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
                {partners.slice(0, 5).map((partner) => {
                  const isSelected = selectedPartner.id === partner.id;
                  return (
                    <div
                      key={partner.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPartner(partner);
                      }}
                      className={`grid grid-cols-[26%_13%_15%_18%_15%_13%] items-center text-[10px] rounded-md px-1 py-1 transition-colors ${isSelected ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'}`}
                    >
                      <div className="text-zinc-900 font-medium truncate pr-1">{partner.name}</div>
                      <div className="text-right font-medium text-zinc-900">
                        <div>{partner.guests}</div>
                      </div>
                      <div className="text-right font-medium text-zinc-900">
                        <div>{partner.bookings}</div>
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

          {/* Selected Partner Profile Detail (col-span-3) */}
          <div
            onClick={() => {
              const gLy = parseNum(selectedPartner.guestsTrend);
              const rnLy = parseNum(selectedPartner.roomNightsTrend);
              const revLy = parseNum(selectedPartner.revenueTrend);
              const adrLy = parseNum(selectedPartner.adrTrend);
              const stayLy = parseNum(selectedPartner.avgNightsTrend);
              const repPts = parseNum(selectedPartner.repeatRatioTrend);

              const partnerKpiBoxes = [
                {
                  label: 'Guests',
                  value: selectedPartner.guests,
                  vsLy: `+${gLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(gLy * 0.34).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(gLy * 0.16).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Bookings',
                  value: selectedPartner.bookings,
                  vsLy: `+${gLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(gLy * 0.34).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(gLy * 0.16).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Room Nights',
                  value: selectedPartner.roomNights,
                  vsLy: `+${rnLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(rnLy * 0.35).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(rnLy * 0.17).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Revenue',
                  value: selectedPartner.revenue,
                  vsLy: `+${revLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(revLy * 0.36).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(revLy * 0.18).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'ADR',
                  value: selectedPartner.adr,
                  vsLy: `+${adrLy.toFixed(1)}% vs LY`,
                  vsBudget: `+${(adrLy * 0.38).toFixed(1)}% vs Budget`,
                  vsForecast: `+${(adrLy * 0.19).toFixed(1)}% vs Forecast`,
                },
                {
                  label: 'Avg Stay',
                  value: `${selectedPartner.avgNights} nts`,
                  vsLy: `+${stayLy.toFixed(1)} nts vs LY`,
                  vsBudget: `+${(stayLy * 0.4).toFixed(1)} nts vs Budget`,
                  vsForecast: `+${(stayLy * 0.2).toFixed(1)} nts vs Forecast`,
                },
                {
                  label: 'Repeat',
                  value: selectedPartner.repeatRatio,
                  vsLy: `+${repPts.toFixed(1)} pts vs LY`,
                  vsBudget: `+${(repPts * 0.44).toFixed(1)} pts vs Budget`,
                  vsForecast: `+${(repPts * 0.22).toFixed(1)} pts vs Forecast`,
                },
              ];

              const catItems: { key: keyof PartnerData['destinations']; name: string }[] = [
                { key: 'urban', name: 'Urban' },
                { key: 'ski', name: 'Ski' },
                { key: 'beachResort', name: 'Beach' },
                { key: 'nature', name: 'Nature' },
                { key: 'wellness', name: 'Wellness' },
              ];
              const rawW = catItems.map((c) => {
                const lvl = selectedPartner.destinations[c.key];
                return lvl === 'level4' ? 4 : lvl === 'level3' ? 2.6 : lvl === 'level2' ? 1.4 : 0.8;
              });
              const sumW = rawW.reduce((s, w) => s + w, 0);
              const catRows = catItems.map((c, i) => {
                const sh = rawW[i] / sumW;
                const gVal = Math.max(selectedPartner.gN > 0 ? 1 : 0, Math.round(selectedPartner.gN * sh));
                const bVal = Math.max(selectedPartner.bN > 0 && rawW[i] >= 2.6 ? 1 : 0, Math.round(selectedPartner.bN * sh));
                const rnVal = Math.max(selectedPartner.nN > 0 ? 1 : 0, Math.round(selectedPartner.nN * sh));
                const revVal = selectedPartner.rN * sh;
                const adrVal = rnVal > 0 ? Math.round(revVal / rnVal) : parseNum(selectedPartner.adr);
                return {
                  name: c.name,
                  guests: fmtInt(gVal),
                  bookings: fmtInt(bVal),
                  roomNights: fmtInt(rnVal),
                  revenue: fmtUsd(revVal),
                  adr: `$${adrVal.toLocaleString('en-US')}`,
                };
              });

              openDrawer(
                `${selectedPartner.name} — Partner Summary`,
                `${selectedPartner.type} · ${selectedPartner.tier} · As of ${PERIOD_DEFS[period].periodLabel}`,
                <div className="space-y-4">
                  {/* Summary Metric Cards matching Dashboard Summary Box Layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                    {partnerKpiBoxes.map((s) => (
                      <div
                        key={s.label}
                        className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-2.5 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9.5px] font-normal tracking-wider uppercase text-zinc-900 truncate">
                            {s.label}
                          </span>
                          <span className="inline-flex items-center text-[8px] font-semibold px-1 py-0.5 rounded shrink-0 bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80">
                            {s.vsLy}
                          </span>
                        </div>
                        <div className="text-[18px] font-normal text-zinc-900 leading-tight my-1.5">
                          {s.value}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="inline-flex items-center text-[7px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                            {s.vsBudget}
                          </span>
                          <span className="inline-flex items-center text-[7px] font-medium px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 whitespace-nowrap">
                            {s.vsForecast}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Property Category Breakdown Table for Selected Partner */}
                  <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-500 font-semibold text-[10px] whitespace-nowrap">
                          <th className="py-3 px-4">Property Category</th>
                          <th className="py-3 px-3 text-right">Guests</th>
                          <th className="py-3 px-3 text-right">Bookings</th>
                          <th className="py-3 px-3 text-right">Room Nights</th>
                          <th className="py-3 px-3 text-right">Revenue</th>
                          <th className="py-3 px-4 text-right">ADR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                        {catRows.map((row) => (
                          <tr key={row.name} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-3 px-4 font-semibold text-zinc-900">{row.name}</td>
                            <td className="py-3 px-3 text-right text-zinc-900 font-medium">{row.guests}</td>
                            <td className="py-3 px-3 text-right text-zinc-800 font-medium">{row.bookings}</td>
                            <td className="py-3 px-3 text-right text-zinc-800 font-medium">{row.roomNights}</td>
                            <td className="py-3 px-3 text-right font-bold text-zinc-900">{row.revenue}</td>
                            <td className="py-3 px-4 text-right text-zinc-800 font-medium">{row.adr}</td>
                          </tr>
                        ))}
                        <tr className="bg-zinc-50/80 font-bold text-zinc-900 border-t border-zinc-200">
                          <td className="py-3 px-4">Total ({selectedPartner.name})</td>
                          <td className="py-3 px-3 text-right">{selectedPartner.guests}</td>
                          <td className="py-3 px-3 text-right">{selectedPartner.bookings}</td>
                          <td className="py-3 px-3 text-right">{selectedPartner.roomNights}</td>
                          <td className="py-3 px-3 text-right">{selectedPartner.revenue}</td>
                          <td className="py-3 px-4 text-right">{selectedPartner.adr}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }}
            className="col-span-12 lg:col-span-3 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex justify-between items-center mb-3 h-4 shrink-0">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Summary</h3>
              <div className="flex items-center gap-2"><span className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                {selectedPartner.tier}
              </span><SeeDetailsLink /></div>
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

              {/* 5-Stat Grid (including Bookings) */}
              <div className="grid grid-cols-5 gap-1.5 border-y border-zinc-100 py-2.5">
                <div className="flex flex-col">
                  <span className="text-sm font-normal text-zinc-900 leading-none mb-1">{selectedPartner.guests}</span>
                  <span className="text-[8px] text-zinc-400 font-medium truncate">Guests</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-1.5">
                  <span className="text-sm font-normal text-zinc-900 leading-none mb-1">{selectedPartner.bookings}</span>
                  <span className="text-[8px] text-zinc-400 font-medium truncate">Bookings</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-1.5">
                  <span className="text-sm font-normal text-zinc-900 leading-none mb-1">{selectedPartner.roomNights}</span>
                  <span className="text-[8px] text-zinc-400 font-medium truncate">Room Nights</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-1.5">
                  <span className="text-sm font-normal text-zinc-900 leading-none mb-1">{selectedPartner.repeatRatio}</span>
                  <span className="text-[8px] text-zinc-400 font-medium truncate">Repeat</span>
                </div>
                <div className="flex flex-col border-l border-zinc-100 pl-1.5">
                  <span className="text-sm font-normal text-zinc-900 leading-none mb-1">{selectedPartner.revenue}</span>
                  <span className="text-[8px] text-zinc-400 font-medium truncate">Revenue</span>
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

          {/* PERFORMANCE BY PROPERTY CATEGORY Heatmap (col-span-4) */}
          {(() => {
            const destCols: { key: keyof PartnerData['destinations']; label: string; fullLabel: string }[] = [
              { key: 'urban', label: 'Urban', fullLabel: 'Urban' },
              { key: 'ski', label: 'Ski', fullLabel: 'Ski' },
              { key: 'beachResort', label: 'Beach', fullLabel: 'Beach' },
              { key: 'nature', label: 'Nature', fullLabel: 'Nature' },
              { key: 'wellness', label: 'Wellness', fullLabel: 'Wellness' },
            ];

            // Distinct category multipliers per metric:
            // - Revenue: Ski & Wellness command highest ADR + ancillary package spend
            // - Room Nights: Beach & Nature have longest stay durations (ALOS 7.5–9 nights)
            // - Bookings: Urban & Wellness have shorter stays (2.5–4 nights), yielding higher booking count per room night
            const REV_CAT_MULT = [0.72, 1.38, 1.05, 1.12, 1.42];
            const RN_CAT_MULT = [0.68, 1.15, 1.45, 1.28, 0.78];
            const BK_CAT_MULT = [1.55, 0.78, 1.05, 0.88, 1.32];

            const baseLevelScore = (lvl: 'level4' | 'level3' | 'level2' | 'level1', pIdx: number, cIdx: number) => {
              const offsets = [0, 0.28, 0.14, 0.36, 0.2];
              const delta = offsets[(pIdx + cIdx * 2) % offsets.length];
              if (lvl === 'level4') return 4.0 + delta;
              if (lvl === 'level3') return 2.5 + delta;
              if (lvl === 'level2') return 1.4 + delta * 0.5;
              return 0.75 + delta * 0.3;
            };

            const shadeForRatio = (ratio: number) => {
              if (ratio >= 0.82) return { bgClass: 'bg-zinc-900', textClass: 'text-white font-semibold' };
              if (ratio >= 0.56) return { bgClass: 'bg-zinc-600', textClass: 'text-white font-semibold' };
              if (ratio >= 0.36) return { bgClass: 'bg-zinc-400', textClass: 'text-white font-medium' };
              return { bgClass: 'bg-zinc-200', textClass: 'text-zinc-700 font-medium' };
            };

            const getPartnerCategoryCells = (partner: ScaledPartner, pIdx: number) => {
              const baseScores = destCols.map((c, cIdx) => baseLevelScore(partner.destinations[c.key], pIdx, cIdx));

              const revW = baseScores.map((b, i) => b * REV_CAT_MULT[(i + pIdx) % 5]);
              const rnW = baseScores.map((b, i) => b * RN_CAT_MULT[(i + pIdx * 2) % 5]);
              const bkW = baseScores.map((b, i) => b * BK_CAT_MULT[(i + pIdx * 3) % 5]);

              const sumRevW = revW.reduce((s, w) => s + w, 0);
              const sumRnW = rnW.reduce((s, w) => s + w, 0);
              const sumBkW = bkW.reduce((s, w) => s + w, 0);

              const maxRevW = Math.max(...revW);
              const maxRnW = Math.max(...rnW);
              const maxBkW = Math.max(...bkW);

              return destCols.map((c, cIdx) => {
                const revShare = revW[cIdx] / sumRevW;
                const rnShare = rnW[cIdx] / sumRnW;
                const bkShare = bkW[cIdx] / sumBkW;

                const rev = partner.rN * revShare;
                const rn = Math.max(partner.nN > 0 ? 1 : 0, Math.round(partner.nN * rnShare));
                const bk = Math.max(partner.bN > 0 && bkW[cIdx] / maxBkW >= 0.45 ? 1 : 0, Math.round(partner.bN * bkShare));

                const revShade = shadeForRatio(revW[cIdx] / maxRevW);
                const rnShade = shadeForRatio(rnW[cIdx] / maxRnW);
                const bkShade = shadeForRatio(bkW[cIdx] / maxBkW);

                return {
                  key: c.key,
                  label: c.label,
                  fullLabel: c.fullLabel,
                  rev,
                  rn,
                  bk,
                  revFmt: fmtUsd(rev),
                  rnFmt: fmtInt(rn),
                  bkFmt: fmtInt(bk),
                  revSharePct: Math.round(revShare * 100),
                  rnSharePct: Math.round(rnShare * 100),
                  bkSharePct: Math.round(bkShare * 100),
                  shades: {
                    revenue: revShade,
                    roomNights: rnShade,
                    bookings: bkShade,
                  },
                };
              });
            };

            const metricLegendLabel = (m: 'revenue' | 'roomNights' | 'bookings') =>
              m === 'revenue'
                ? { low: 'Low Revenue', high: 'High Revenue' }
                : m === 'roomNights'
                  ? { low: 'Low Room Nights', high: 'High Room Nights' }
                  : { low: 'Low Bookings', high: 'High Bookings' };

            const CategoryDrawerBody = () => {
              const [drawerMetric, setDrawerMetric] = useState<'revenue' | 'roomNights' | 'bookings'>(categoryMetric);
              const allRows = partners.map((p, idx) => ({ partner: p, cells: getPartnerCategoryCells(p, idx) }));
              const drawerLegend = metricLegendLabel(drawerMetric);

              const catTotals = destCols.map((c, cIdx) => {
                const rev = allRows.reduce((s, r) => s + r.cells[cIdx].rev, 0);
                const rn = allRows.reduce((s, r) => s + r.cells[cIdx].rn, 0);
                const bk = allRows.reduce((s, r) => s + r.cells[cIdx].bk, 0);
                return { ...c, rev, rn, bk };
              });

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-500">
                      Category breakdown across all 10 CRM partner agencies
                    </span>
                    <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs">
                      {([
                        { id: 'revenue', label: 'Revenue' },
                        { id: 'roomNights', label: 'Room Nights' },
                        { id: 'bookings', label: 'Bookings' },
                      ] as const).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setDrawerMetric(tab.id)}
                          className={`px-2.5 py-0.5 text-[9.5px] rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                            drawerMetric === tab.id
                              ? 'bg-zinc-900 text-white font-medium shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900 font-normal'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {catTotals.map((ct) => (
                      <div key={ct.key} className="bg-zinc-50 border border-zinc-100 rounded-lg p-3">
                        <div className="text-[10px] text-zinc-500 font-medium">{ct.label}</div>
                        <div className="text-base font-bold text-zinc-900 mt-0.5">
                          {drawerMetric === 'revenue'
                            ? fmtUsd(ct.rev)
                            : drawerMetric === 'roomNights'
                              ? `${fmtInt(ct.rn)} RN`
                              : `${fmtInt(ct.bk)} Bookings`}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Table of all 10 Partners */}
                  <div className="overflow-x-auto border border-zinc-200/80 rounded-xl p-4 space-y-2.5">
                    <div className="grid grid-cols-[150px_repeat(5,76px)] justify-between gap-2 text-[10px] text-zinc-400 font-medium items-center pb-2 border-b border-zinc-100">
                      <span className="text-left">Partner Agency</span>
                      {destCols.map((c) => (
                        <span key={c.key} className="text-center">
                          {c.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      {allRows.map(({ partner, cells }) => (
                        <div
                          key={partner.id}
                          className="grid grid-cols-[150px_repeat(5,76px)] justify-between gap-2 items-center"
                        >
                          <span className="text-[11px] font-semibold text-zinc-900 truncate pr-2">
                            {partner.name}
                          </span>
                          {cells.map((blk) => {
                            const valStr =
                              drawerMetric === 'revenue'
                                ? blk.revFmt
                                : drawerMetric === 'roomNights'
                                  ? blk.rnFmt
                                  : blk.bkFmt;
                            const shade = blk.shades[drawerMetric];
                            return (
                              <div
                                key={blk.key}
                                className={`h-10 rounded-[5px] flex items-center justify-center text-[10.5px] tabular-nums transition-colors duration-300 ${shade.bgClass} ${shade.textClass}`}
                              >
                                {valStr}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[9.5px] text-zinc-400 pt-2.5 border-t border-zinc-100">
                      <span>{drawerLegend.low}</span>
                      <div className="flex gap-1.5 items-center">
                        <span className="w-3 h-2 rounded-[2px] bg-zinc-100 border border-zinc-200/60" />
                        <span className="w-3 h-2 rounded-[2px] bg-zinc-300" />
                        <span className="w-3 h-2 rounded-[2px] bg-zinc-600" />
                        <span className="w-3 h-2 rounded-[2px] bg-zinc-900" />
                      </div>
                      <span>{drawerLegend.high}</span>
                    </div>
                  </div>
                </div>
              );
            };

            const cardLegend = metricLegendLabel(categoryMetric);

            return (
              <div
                onClick={() =>
                  openDrawer(
                    'Performance by Property Category',
                    'Full property category performance across all 10 CRM partner agencies',
                    <CategoryDrawerBody />,
                    'sm:w-[660px]'
                  )
                }
                className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                style={{ animationDelay: '0.15s' }}
              >
                {/* Header */}
                <div className="flex flex-col gap-1.5 mb-2 shrink-0">
                  <div className="flex justify-between items-center h-4">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 truncate">
                        Performance by Property Category
                      </h3>
                      <span className="text-[8.5px] font-medium text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded shrink-0">
                        Top 5
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <InfoTooltip text="Partner performance breakdown across SOSEI's 5 luxury hotel categories by Revenue, Room Nights, and Bookings." />
                      <SeeDetailsLink />
                    </div>
                  </div>

                  {/* Toggle Pill: Revenue | Room Nights | Bookings */}
                  <div
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs">
                      {([
                        { id: 'revenue', label: 'Revenue' },
                        { id: 'roomNights', label: 'Room Nights' },
                        { id: 'bookings', label: 'Bookings' },
                      ] as const).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCategoryMetric(tab.id)}
                          className={`px-2 py-0.5 text-[8.5px] rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                            categoryMetric === tab.id
                              ? 'bg-zinc-900 text-white font-medium shadow-xs'
                              : 'text-zinc-500 hover:text-zinc-900 font-normal'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Block Heatmap Table matching PropertyRhythmWidget */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  {/* Column Headers */}
                  <div className="grid grid-cols-[106px_repeat(5,1fr)] gap-1.5 text-[8.5px] text-zinc-400 font-medium items-center pb-1.5 border-b border-zinc-100">
                    <span className="text-left">Partner</span>
                    {destCols.map((c) => (
                      <span key={c.key} className="text-center">
                        {c.label}
                      </span>
                    ))}
                  </div>

                  {/* Rows: Top 5 with Rectangular Heatmap Blocks */}
                  <div className="flex flex-col justify-between flex-1 py-1.5 gap-1.5">
                    {partners.slice(0, 5).map((partner, pIdx) => {
                      const cells = getPartnerCategoryCells(partner, pIdx);
                      return (
                        <div
                          key={partner.id}
                          className="grid grid-cols-[106px_repeat(5,1fr)] gap-1.5 items-center"
                        >
                          <span
                            className="text-[9.5px] font-medium text-zinc-700 truncate pr-1"
                            title={partner.name}
                          >
                            {partner.name}
                          </span>
                          {cells.map((blk) => {
                            const valStr =
                              categoryMetric === 'revenue'
                                ? blk.revFmt
                                : categoryMetric === 'roomNights'
                                  ? blk.rnFmt
                                  : blk.bkFmt;
                            const sharePct =
                              categoryMetric === 'revenue'
                                ? blk.revSharePct
                                : categoryMetric === 'roomNights'
                                  ? blk.rnSharePct
                                  : blk.bkSharePct;
                            const shade = blk.shades[categoryMetric];
                            return (
                              <div
                                key={blk.key}
                                className={`group/blk relative h-5 rounded-[3px] flex items-center justify-center text-[8px] tabular-nums ${shade.bgClass} ${shade.textClass} transition-colors duration-300 hover:opacity-90`}
                              >
                                {valStr}
                                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 opacity-0 translate-y-0.5 group-hover/blk:opacity-100 group-hover/blk:translate-y-0 transition-all duration-150 whitespace-nowrap rounded-lg bg-white border border-zinc-200 shadow-lg shadow-black/10 px-2.5 py-1.5 text-left">
                                  <div className="text-[9.5px] font-semibold text-zinc-900 leading-tight">
                                    {partner.name} · {blk.label}
                                  </div>
                                  <div className="text-[9px] text-zinc-500 leading-tight mt-0.5">
                                    <span className="font-semibold text-zinc-900">{blk.revFmt}</span> · {blk.rnFmt} RN · {blk.bkFmt} Bkg ({sharePct}% share)
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Legend at bottom dynamically matching active toggle */}
                  <div className="flex justify-between items-center text-[8.5px] text-zinc-400 pt-2 border-t border-zinc-100">
                    <span>{cardLegend.low}</span>
                    <div className="flex gap-1 items-center">
                      <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-100 border border-zinc-200/60" />
                      <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-300" />
                      <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-600" />
                      <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-900" />
                    </div>
                    <span>{cardLegend.high}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ROW 1.5: Partner Booking Pace (forward OTB vs STLY) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {(() => {
            const PartnerPaceDrawerBody = () => {
              const [drawerWin, setDrawerWin] = useState<PaceWindowDays>(paceWindowDays);
              const dAllPace = sumPaceForWindow(
                PARTNERS_DATA.map((p) => getPartnerPaceForWindow(p, drawerWin)),
                drawerWin
              );
              const dTotals = summarizePace(dAllPace);

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-500">
                      Forward room nights OTB vs STLY across all 10 CRM partner agencies · Next {drawerWin} Days
                    </span>
                    <div className="flex items-center bg-zinc-100/90 p-0.5 rounded-md border border-zinc-200/70">
                      {PACE_WINDOWS.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setDrawerWin(h.id)}
                          className={`px-2 py-0.5 text-[9.5px] font-bold rounded transition-all cursor-pointer ${
                            drawerWin === h.id
                              ? 'bg-zinc-900 text-white shadow-2xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Pace vs LY</div>
                      <div className={`text-lg font-bold mt-0.5 ${dTotals.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>
                        {dTotals.paceVsLy}
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-0.5">Portfolio-wide partner OTB</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Bookings OTB ({drawerWin}D)</div>
                      <div className="text-lg font-bold text-zinc-900 mt-0.5">{dTotals.bookingsOtb}</div>
                      <div className="text-[9px] text-[#14532d] font-semibold mt-0.5">↑ {dTotals.bookingsTrend} vs LY</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Room Nights OTB ({drawerWin}D)</div>
                      <div className="text-lg font-bold text-zinc-900 mt-0.5">{dTotals.roomNightsOtb}</div>
                      <div className="text-[9px] text-[#14532d] font-semibold mt-0.5">↑ {dTotals.roomNightsTrend} vs LY</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Revenue OTB ({drawerWin}D)</div>
                      <div className="text-lg font-bold text-zinc-900 mt-0.5">{dTotals.revenueOtb}</div>
                      <div className="text-[9px] text-[#14532d] font-semibold mt-0.5">↑ {dTotals.revenueTrend} vs LY</div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-3">
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Velocity Pickups</div>
                      <div className="text-lg font-bold text-zinc-900 mt-0.5">{dTotals.pickup7d} (7d)</div>
                      <div className="text-[9px] text-[#14532d] font-semibold mt-0.5">↑ {dTotals.pickup30d} past 30 days</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-zinc-200/80 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-500 font-semibold text-[10px] whitespace-nowrap">
                          <th className="py-3 px-4">Partner Agency</th>
                          {dAllPace.map((pt) => (
                            <th key={pt.month} className="py-3 px-3 text-right">
                              {pt.month.replace(/^Week (\d).*/, 'W$1').split('\u2013')[0].trim()}
                            </th>
                          ))}
                          <th className="py-3 px-3 text-right">Bookings OTB</th>
                          <th className="py-3 px-3 text-right">Room Nights OTB</th>
                          <th className="py-3 px-3 text-right">Revenue OTB</th>
                          <th className="py-3 px-4 text-right">Pace vs LY</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                        {PARTNERS_DATA.map((p) => {
                          const pts = getPartnerPaceForWindow(p, drawerWin);
                          const pSum = summarizePace(pts);
                          return (
                            <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                              <td className="py-3 px-4 font-semibold text-zinc-900">{p.name}</td>
                              {pts.map((pt) => (
                                <td key={pt.month} className="py-3 px-3 text-right text-zinc-900 font-medium">
                                  {pt.otb.toLocaleString()}
                                </td>
                              ))}
                              <td className="py-3 px-3 text-right font-semibold text-zinc-900">{pSum.bookingsOtb}</td>
                              <td className="py-3 px-3 text-right font-semibold text-zinc-900">{pSum.roomNightsOtb}</td>
                              <td className="py-3 px-3 text-right font-semibold text-zinc-900">{pSum.revenueOtb}</td>
                              <td className={`py-3 px-4 text-right font-semibold ${pSum.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>
                                {pSum.paceVsLy}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-zinc-50/70 font-bold text-zinc-900 border-t border-zinc-200">
                          <td className="py-3 px-4">Total Portfolio</td>
                          {dAllPace.map((pt) => (
                            <td key={pt.month} className="py-3 px-3 text-right">
                              {pt.otb.toLocaleString()}
                            </td>
                          ))}
                          <td className="py-3 px-3 text-right">{dTotals.bookingsOtb}</td>
                          <td className="py-3 px-3 text-right">{dTotals.roomNightsOtb}</td>
                          <td className="py-3 px-3 text-right">{dTotals.revenueOtb}</td>
                          <td className={`py-3 px-4 text-right ${dTotals.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>
                            {dTotals.paceVsLy}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            };

            return (
              <div
                onClick={() =>
                  openDrawer(
                    'Partner Booking Pace',
                    `Forward bookings, room nights & revenue on the books vs same time last year · All 10 CRM partners`,
                    <PartnerPaceDrawerBody />
                  )
                }
                className="col-span-12 lg:col-span-5 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                style={{ animationDelay: '0.18s' }}
              >
                {/* Header matching Hospitality BookingPaceWidget */}
                <div className="flex justify-between items-start mb-1 gap-2">
                  <InfoTooltip text="Measures partner booking velocity and demand acceleration. Bookings, room nights & revenue on-the-books (OTB) for the selected forward window vs same time last year.">
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
                        PARTNER BOOKING PACE
                      </h3>
                      <p className="text-[9px] text-zinc-500 font-medium tracking-wider uppercase mt-0.5">
                        NEXT {paceWindowDays} DAYS (ROOM NIGHTS OTB)
                      </p>
                    </div>
                  </InfoTooltip>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Partner Selector Dropdown */}
                    <div ref={paceMenuRef} className="relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setPaceMenuOpen((o) => !o)}
                        className="h-5 pl-2 pr-1.5 rounded-md border border-zinc-200/80 bg-white/80 hover:bg-zinc-100 text-[8.5px] font-medium text-zinc-800 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="max-w-[92px] truncate">{paceLabel}</span>
                        <AltArrowDown size={10} className={`text-zinc-500 transition-transform ${paceMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {paceMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-52 z-30 bg-white border border-zinc-200 rounded-lg shadow-lg shadow-black/10 p-1 max-h-72 overflow-y-auto custom-scrollbar">
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

                    {/* Horizon Selector Pill matching BookingPaceWidget */}
                    <div
                      className="flex items-center bg-zinc-100/90 p-0.5 rounded-md border border-zinc-200/70"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {PACE_WINDOWS.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaceWindowDays(h.id);
                          }}
                          className={`px-1.5 py-0.5 text-[8.5px] font-bold rounded transition-all cursor-pointer ${
                            paceWindowDays === h.id
                              ? 'bg-zinc-900 text-white shadow-2xs'
                              : 'text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>

                    <SeeDetailsLink />
                  </div>
                </div>

                {/* Legend matching Hospitality BookingPaceWidget */}
                <div className="flex items-center gap-3 text-[9px] text-zinc-600 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-900" />
                    <span className="font-medium text-zinc-800">This year</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-400" />
                    <span className="font-normal text-zinc-500">Last year</span>
                  </div>
                </div>

                {/* Main Body: Chart (Left) + Summary KPIs (Right) matching BookingPaceWidget */}
                <div className="flex-1 flex flex-col sm:flex-row items-stretch gap-2.5 min-h-[140px]">
                  {/* Left: Forward Window Line Chart */}
                  <div className="flex-1 h-[140px] sm:h-auto min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={paceData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="partnerBookingPaceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#18181b" stopOpacity={0.12} />
                            <stop offset="100%" stopColor="#18181b" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: '#71717a' }}
                          interval={0}
                          padding={{ left: 14, right: 14 }}
                          tickFormatter={(v: string) => {
                            const wk = v.match(/^Week (\d)/);
                            if (wk) return `W${wk[1]}`;
                            return String(v).split('\u2013')[0].trim();
                          }}
                          dy={4}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 8.5, fill: '#a1a1aa' }}
                          tickFormatter={(v) =>
                            v === 0 ? '0' : v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K` : String(v)
                          }
                          width={30}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            fontSize: '10px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            padding: '6px 10px',
                          }}
                          formatter={(val: any, name: any) => [
                            `${Number(val).toLocaleString()} room nights`,
                            name === 'thisYear' ? 'This Year' : 'Last Year',
                          ]}
                        />
                        {/* This year area + solid line */}
                        <Area
                          type="monotone"
                          dataKey="thisYear"
                          stroke="#18181b"
                          strokeWidth={2}
                          fill="url(#partnerBookingPaceGradient)"
                          dot={{ r: 3, fill: '#18181b', strokeWidth: 1, stroke: '#ffffff' }}
                          activeDot={{ r: 4.5, fill: '#18181b' }}
                          isAnimationActive={false}
                        />
                        {/* Last year dashed line */}
                        <Line
                          type="monotone"
                          dataKey="lastYear"
                          stroke="#a1a1aa"
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          dot={{ r: 2.5, fill: '#a1a1aa' }}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Right: Summary Metric Panel matching BookingPaceWidget + Bookings OTB */}
                  <div className="w-full sm:w-[156px] shrink-0 rounded-lg p-2.5 bg-zinc-50/70 border border-zinc-200/60 flex flex-col justify-between text-left">
                    {/* Top Primary Metric */}
                    <div>
                      <div className={`text-[16px] font-bold leading-none ${paceTotals.pace >= 0 ? 'text-[#14532d]' : 'text-[#800020]'}`}>
                        {paceTotals.paceVsLy}
                      </div>
                      <div className="text-[8.5px] font-medium text-zinc-600 mt-0.5">
                        Pace vs LY
                      </div>
                    </div>

                    <div className="border-t border-zinc-200/60 my-1 pt-1 space-y-1">
                      {/* Bookings OTB */}
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-bold text-zinc-900 leading-none">{paceTotals.bookingsOtb}</span>
                          <span className="text-[8px] font-semibold text-[#14532d] leading-none whitespace-nowrap">
                            ↑ {paceTotals.bookingsTrend} vs LY
                          </span>
                        </div>
                        <div className="text-[8px] text-zinc-500 font-normal">Bookings OTB</div>
                      </div>

                      {/* Room Nights OTB */}
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-bold text-zinc-900 leading-none">{paceTotals.roomNightsOtb}</span>
                          <span className="text-[8px] font-semibold text-[#14532d] leading-none whitespace-nowrap">
                            ↑ {paceTotals.roomNightsTrend} vs LY
                          </span>
                        </div>
                        <div className="text-[8px] text-zinc-500 font-normal">Room Nights OTB</div>
                      </div>

                      {/* Revenue OTB */}
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <span className="font-bold text-zinc-900 leading-none">{paceTotals.revenueOtb}</span>
                          <span className="text-[8px] font-semibold text-[#14532d] leading-none whitespace-nowrap">
                            ↑ {paceTotals.revenueTrend} vs LY
                          </span>
                        </div>
                        <div className="text-[8px] text-zinc-500 font-normal">Revenue OTB</div>
                      </div>

                      {/* Pickups */}
                      <div className="pt-0.5 border-t border-zinc-200/40 flex justify-between text-[8px] text-zinc-500 whitespace-nowrap">
                        <span>
                          Pickup 7d: <strong className="text-zinc-800 font-semibold">{paceTotals.pickup7d}</strong>
                        </span>
                        <span>
                          30d: <strong className="text-zinc-800 font-semibold">{paceTotals.pickup30d}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PARTNER CONTRIBUTION MIX & PARTNER TIER DISTRIBUTION (7 cols split equally into 2 cards) */}
          <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* PARTNER CONTRIBUTION MIX */}
            {(() => {
              const totGuests = partners.reduce((s, p) => s + p.gN, 0);
              const totBk = partners.reduce((s, p) => s + p.bN, 0);
              const totRn = partners.reduce((s, p) => s + p.nN, 0);
              const totRev = partners.reduce((s, p) => s + p.rN, 0);
              const avgAdr = Math.round(wAvg(partners, (p) => p.nN, (p) => parseNum(p.adr)));
              const avgLos = wAvg(partners, (p) => p.gN, (p) => parseNum(p.avgNights)).toFixed(1);
              const avgRepeat = Math.round(wAvg(partners, (p) => p.gN, (p) => parseNum(p.repeatRatio)));

              const top5 = partners.slice(0, 5);
              const otherPartners = partners.slice(5);
              const otherGuests = otherPartners.reduce((s, p) => s + p.gN, 0);
              const otherBk = otherPartners.reduce((s, p) => s + p.bN, 0);
              const otherRn = otherPartners.reduce((s, p) => s + p.nN, 0);
              const otherRev = otherPartners.reduce((s, p) => s + p.rN, 0);
              const otherAdr = Math.round(wAvg(otherPartners, (p) => p.nN, (p) => parseNum(p.adr)));
              const otherLos = wAvg(otherPartners, (p) => p.gN, (p) => parseNum(p.avgNights)).toFixed(1);
              const otherRepeat = Math.round(wAvg(otherPartners, (p) => p.gN, (p) => parseNum(p.repeatRatio)));

              const getShare = (m: 'revenue' | 'roomNights' | 'bookings', rN: number, nN: number, bN: number) => {
                if (m === 'revenue') return totRev > 0 ? Math.round((rN / totRev) * 100) : 0;
                if (m === 'roomNights') return totRn > 0 ? Math.round((nN / totRn) * 100) : 0;
                return totBk > 0 ? Math.round((bN / totBk) * 100) : 0;
              };

              const buildContribSegments = (m: 'revenue' | 'roomNights' | 'bookings') => {
                const topRows = top5.map((p, idx) => {
                  const pct = getShare(m, p.rN, p.nN, p.bN);
                  const valFmt = m === 'revenue' ? p.revenue : m === 'roomNights' ? p.roomNights : p.bookings;
                  return {
                    id: p.id,
                    name: p.name,
                    tier: p.tier,
                    color: CONTRIBUTION_COLORS[idx],
                    pct,
                    valFmt,
                    guests: p.guests,
                    bookings: p.bookings,
                    roomNights: p.roomNights,
                    revenue: p.revenue,
                    adr: p.adr,
                    avgNights: p.avgNights,
                    repeatRatio: p.repeatRatio,
                    children: [] as ScaledPartner[],
                  };
                });
                const topPctSum = topRows.reduce((s, r) => s + r.pct, 0);
                const otherPct = Math.max(0, 100 - topPctSum);
                const otherValFmt =
                  m === 'revenue' ? fmtUsd(otherRev) : m === 'roomNights' ? fmtInt(otherRn) : fmtInt(otherBk);

                return [
                  ...topRows,
                  {
                    id: 'other',
                    name: 'Other',
                    tier: 'TIER 2 & 3',
                    color: CONTRIBUTION_COLORS[5],
                    pct: otherPct,
                    valFmt: otherValFmt,
                    guests: fmtInt(otherGuests),
                    bookings: fmtInt(otherBk),
                    roomNights: fmtInt(otherRn),
                    revenue: fmtUsd(otherRev),
                    adr: `$${fmtInt(otherAdr)}`,
                    avgNights: otherLos,
                    repeatRatio: `${otherRepeat}%`,
                    children: otherPartners,
                  },
                ];
              };

              const activeRows = buildContribSegments(contributionMetric);
              const centerValue =
                contributionMetric === 'revenue'
                  ? fmtUsd(totRev)
                  : contributionMetric === 'roomNights'
                    ? fmtInt(totRn)
                    : fmtInt(totBk);
              const centerLabel =
                contributionMetric === 'revenue'
                  ? 'Total Rev'
                  : contributionMetric === 'roomNights'
                    ? 'Room Nights'
                    : 'Bookings';
              const valueHeader =
                contributionMetric === 'revenue'
                  ? 'Revenue'
                  : contributionMetric === 'roomNights'
                    ? 'Room Nights'
                    : 'Bookings';

              const summaryBoxCards = [
                { label: 'Guests', value: fmtInt(totGuests), trend: '↑ 13% vs LY' },
                { label: 'Bookings', value: fmtInt(totBk), trend: '↑ 13% vs LY' },
                { label: 'Room Nights', value: fmtInt(totRn), trend: '↑ 14% vs LY' },
                { label: 'Revenue', value: fmtUsd(totRev), trend: '↑ 13% vs LY' },
                { label: 'ADR', value: `$${fmtInt(avgAdr)}`, trend: '↑ 8% vs LY' },
                { label: 'Avg Nights', value: avgLos, trend: '↑ 0.3 vs LY' },
                { label: 'Repeat Ratio', value: `${avgRepeat}%`, trend: '↑ 5pp vs LY' },
              ];

              const ContributionDrawerBody = () => {
                const [expandedOther, setExpandedOther] = useState(true);
                const dRows = buildContribSegments('revenue');

                return (
                  <div className="space-y-5">
                    {/* Top 7 Summary Box Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                      {summaryBoxCards.map((s) => (
                        <div key={s.label} className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-2.5 flex flex-col justify-between">
                          <span className="text-[9.5px] font-normal tracking-wider uppercase text-zinc-500 truncate">{s.label}</span>
                          <div className="text-[17px] font-bold text-zinc-900 leading-tight my-1">{s.value}</div>
                          <span className="text-[8.5px] font-semibold text-[#14532d]">{s.trend}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap px-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                        Partner Contribution Breakdown ({PERIOD_DEFS[period].shortLabel})
                      </span>
                      <span className="text-[9.5px] text-zinc-400">
                        Click Other row to expand/collapse partner agencies
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-400 font-medium text-[9.5px] whitespace-nowrap">
                            <th className="py-2.5 px-3">Partner</th>
                            <th className="py-2.5 px-3">Tier</th>
                            <th className="py-2.5 px-3 text-right">Guests</th>
                            <th className="py-2.5 px-3 text-right">Bookings</th>
                            <th className="py-2.5 px-3 text-right">Room Nights</th>
                            <th className="py-2.5 px-3 text-right">Revenue</th>
                            <th className="py-2.5 px-3 text-right">Share</th>
                            <th className="py-2.5 px-3 text-right">ADR</th>
                            <th className="py-2.5 px-3 text-right">Avg Nights</th>
                            <th className="py-2.5 px-3 text-right">Repeat Ratio</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                          {dRows.map((row) => {
                            const hasChildren = row.children.length > 0;
                            return (
                              <React.Fragment key={row.id}>
                                <tr
                                  onClick={() => hasChildren && setExpandedOther((prev) => !prev)}
                                  className={`hover:bg-zinc-50/80 transition-colors ${hasChildren ? 'cursor-pointer' : ''}`}
                                >
                                  <td className="py-2.5 px-3 font-semibold text-zinc-900 flex items-center gap-1.5">
                                    {hasChildren ? (
                                      expandedOther ? (
                                        <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                                      ) : (
                                        <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                                      )
                                    ) : (
                                      <span className="w-3.5 shrink-0" />
                                    )}
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                                    <span>{hasChildren ? `Other (${row.children.length} Partners)` : row.name}</span>
                                  </td>
                                  <td className="py-2.5 px-3 text-[10px] font-semibold text-zinc-500">{row.tier}</td>
                                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.guests}</td>
                                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.bookings}</td>
                                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.roomNights}</td>
                                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{row.revenue}</td>
                                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900">{row.pct}%</td>
                                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.adr}</td>
                                  <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.avgNights}</td>
                                  <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{row.repeatRatio}</td>
                                </tr>
                                {hasChildren &&
                                  expandedOther &&
                                  row.children.map((child) => {
                                    const childShare = getShare('revenue', child.rN, child.nN, child.bN);
                                    return (
                                      <tr key={child.id} className="bg-zinc-50/40 text-zinc-600">
                                        <td className="py-2 px-3 pl-9 text-[10.5px] font-medium text-zinc-700">{child.name}</td>
                                        <td className="py-2 px-3 text-[9.5px] text-zinc-400 font-semibold">{child.tier}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px]">{child.guests}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px]">{child.bookings}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px]">{child.roomNights}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px] font-semibold text-zinc-800">{child.revenue}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px] font-semibold text-zinc-800">{childShare}%</td>
                                        <td className="py-2 px-3 text-right text-[10.5px]">{child.adr}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px]">{child.avgNights}</td>
                                        <td className="py-2 px-3 text-right text-[10.5px] font-medium text-zinc-800">{child.repeatRatio}</td>
                                      </tr>
                                    );
                                  })}
                              </React.Fragment>
                            );
                          })}
                          <tr className="bg-zinc-50/70 font-bold text-zinc-900 border-t border-zinc-200">
                            <td className="py-2.5 px-3">Total All Partners ({partners.length})</td>
                            <td className="py-2.5 px-3 text-zinc-500 font-medium">All Tiers</td>
                            <td className="py-2.5 px-3 text-right">{fmtInt(totGuests)}</td>
                            <td className="py-2.5 px-3 text-right">{fmtInt(totBk)}</td>
                            <td className="py-2.5 px-3 text-right">{fmtInt(totRn)}</td>
                            <td className="py-2.5 px-3 text-right">{fmtUsd(totRev)}</td>
                            <td className="py-2.5 px-3 text-right">100%</td>
                            <td className="py-2.5 px-3 text-right">${fmtInt(avgAdr)}</td>
                            <td className="py-2.5 px-3 text-right">{avgLos}</td>
                            <td className="py-2.5 px-3 text-right">{avgRepeat}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              };

              return (
                <div
                  onClick={() =>
                    openDrawer(
                      'Partner Contribution',
                      `Contribution across all ${partners.length} partners · ${PERIOD_DEFS[period].periodLabel}`,
                      <ContributionDrawerBody />
                    )
                  }
                  className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                  style={{ animationDelay: '0.2s' }}
                >
                  {/* Top Header + Toggle */}
                  <div className="flex flex-col gap-2 mb-2 shrink-0">
                    <div className="flex justify-between items-center h-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Contribution</h3>
                      <div className="flex items-center gap-2">
                        <InfoTooltip text="Percentage share of revenue, room nights, and bookings contributed by partner agencies." />
                        <SeeDetailsLink />
                      </div>
                    </div>
                    <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center p-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 shadow-2xs">
                        {([
                          { id: 'revenue', label: 'Revenue' },
                          { id: 'roomNights', label: 'Room Nights' },
                          { id: 'bookings', label: 'Bookings' },
                        ] as const).map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setContributionMetric(tab.id)}
                            className={`px-2 py-0.5 text-[8.5px] rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                              contributionMetric === tab.id
                                ? 'bg-zinc-900 text-white font-medium shadow-xs'
                                : 'text-zinc-500 hover:text-zinc-900 font-normal'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-between py-1 gap-3">
                    {/* Pure SVG Donut */}
                    <div className="relative shrink-0 flex items-center justify-center" style={{ width: donutSize, height: donutSize }}>
                      <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="transform -rotate-90">
                        {activeRows.map((item, index) => {
                          const strokeLength = (item.pct / 100) * donutCircumference;
                          const strokeOffset = -(donutAccumulated / 100) * donutCircumference;
                          donutAccumulated += item.pct;

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
                        <span className="text-sm font-bold text-zinc-900 leading-none">{centerValue}</span>
                        <span className="text-[8px] text-zinc-500 font-medium mt-0.5">{centerLabel}</span>
                      </div>
                    </div>

                    {/* Legend with Column Headers */}
                    <div className="flex flex-col flex-1 min-w-0 pr-1">
                      <div className="grid grid-cols-[1fr_52px_34px] gap-1 items-center text-[8.5px] font-medium text-zinc-400 border-b border-zinc-100 pb-1 mb-1">
                        <span>Partner</span>
                        <span className="text-right">{valueHeader}</span>
                        <span className="text-right">Share</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {activeRows.map((item) => (
                          <div key={item.name} className="grid grid-cols-[1fr_52px_34px] gap-1 items-center text-[10px]">
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-zinc-600 font-medium truncate">{item.name}</span>
                            </div>
                            <span className="font-medium text-zinc-700 text-right tabular-nums">{item.valFmt}</span>
                            <span className="font-bold text-zinc-900 text-right tabular-nums">{item.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* PARTNER TIER DISTRIBUTION */}
            {(() => {
              let tierAccumulated = 0;
              const totGuests = partners.reduce((s, p) => s + p.gN, 0);
              const totBk = partners.reduce((s, p) => s + p.bN, 0);
              const totRn = partners.reduce((s, p) => s + p.nN, 0);
              const totRev = partners.reduce((s, p) => s + p.rN, 0);
              const avgAdr = Math.round(wAvg(partners, (p) => p.nN, (p) => parseNum(p.adr)));
              const avgLos = wAvg(partners, (p) => p.gN, (p) => parseNum(p.avgNights)).toFixed(1);
              const avgRepeat = Math.round(wAvg(partners, (p) => p.gN, (p) => parseNum(p.repeatRatio)));

              const tierGroups = TIER_META.map((tm) => {
                const members = partners.filter((p) => p.tier === tm.id);
                const gSum = members.reduce((s, p) => s + p.gN, 0);
                const bSum = members.reduce((s, p) => s + p.bN, 0);
                const nSum = members.reduce((s, p) => s + p.nN, 0);
                const rSum = members.reduce((s, p) => s + p.rN, 0);
                const adrAvg = Math.round(wAvg(members, (p) => p.nN, (p) => parseNum(p.adr)));
                const losAvg = wAvg(members, (p) => p.gN, (p) => parseNum(p.avgNights)).toFixed(1);
                const repAvg = Math.round(wAvg(members, (p) => p.gN, (p) => parseNum(p.repeatRatio)));
                const countPct = Math.round((members.length / Math.max(1, partners.length)) * 100);
                const revSharePct = totRev > 0 ? Math.round((rSum / totRev) * 100) : 0;

                return {
                  ...tm,
                  count: members.length,
                  countPct,
                  revSharePct,
                  guests: fmtInt(gSum),
                  bookings: fmtInt(bSum),
                  roomNights: fmtInt(nSum),
                  revenue: fmtUsd(rSum),
                  adr: `$${fmtInt(adrAvg)}`,
                  avgNights: losAvg,
                  repeatRatio: `${repAvg}%`,
                  members,
                };
              });

              const summaryBoxCards = [
                { label: 'Guests', value: fmtInt(totGuests), trend: '↑ 13% vs LY' },
                { label: 'Bookings', value: fmtInt(totBk), trend: '↑ 13% vs LY' },
                { label: 'Room Nights', value: fmtInt(totRn), trend: '↑ 14% vs LY' },
                { label: 'Revenue', value: fmtUsd(totRev), trend: '↑ 13% vs LY' },
                { label: 'ADR', value: `$${fmtInt(avgAdr)}`, trend: '↑ 8% vs LY' },
                { label: 'Avg Nights', value: avgLos, trend: '↑ 0.3 vs LY' },
                { label: 'Repeat Ratio', value: `${avgRepeat}%`, trend: '↑ 5pp vs LY' },
              ];

              const TierDistributionDrawerBody = () => {
                const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
                  'TIER 1': true,
                  'TIER 2': true,
                  'TIER 3': true,
                });

                return (
                  <div className="space-y-5">
                    {/* Top 7 Summary Box Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                      {summaryBoxCards.map((s) => (
                        <div key={s.label} className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-2.5 flex flex-col justify-between">
                          <span className="text-[9.5px] font-normal tracking-wider uppercase text-zinc-500 truncate">{s.label}</span>
                          <div className="text-[17px] font-bold text-zinc-900 leading-tight my-1">{s.value}</div>
                          <span className="text-[8.5px] font-semibold text-[#14532d]">{s.trend}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2 px-0.5">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
                          Tier Breakdown by Summary Performance ({PERIOD_DEFS[period].shortLabel})
                        </h4>
                        <span className="text-[9.5px] text-zinc-400">
                          Click tier row to expand/collapse partner agencies
                        </span>
                      </div>

                      <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-white">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-400 font-medium text-[9.5px] whitespace-nowrap">
                              <th className="py-2.5 px-3">Tier / Partner</th>
                              <th className="py-2.5 px-3 text-right">Guests</th>
                              <th className="py-2.5 px-3 text-right">Bookings</th>
                              <th className="py-2.5 px-3 text-right">Room Nights</th>
                              <th className="py-2.5 px-3 text-right">Revenue</th>
                              <th className="py-2.5 px-3 text-right">Rev Share</th>
                              <th className="py-2.5 px-3 text-right">ADR</th>
                              <th className="py-2.5 px-3 text-right">Avg Nights</th>
                              <th className="py-2.5 px-3 text-right">Repeat Ratio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                            {tierGroups.map((tg) => {
                              const isExpanded = !!expandedTiers[tg.id];
                              return (
                                <React.Fragment key={tg.id}>
                                  <tr
                                    onClick={() =>
                                      setExpandedTiers((prev) => ({
                                        ...prev,
                                        [tg.id]: !prev[tg.id],
                                      }))
                                    }
                                    className="hover:bg-zinc-50 cursor-pointer transition-colors"
                                  >
                                    <td className="py-2.5 px-3 font-semibold text-zinc-900 flex items-center gap-1.5">
                                      {isExpanded ? (
                                        <RoundAltArrowDown size={14} className="text-zinc-400 shrink-0" />
                                      ) : (
                                        <RoundAltArrowRight size={14} className="text-zinc-400 shrink-0" />
                                      )}
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tg.color }} />
                                      <span>
                                        {tg.label} <span className="text-zinc-400 font-normal">({tg.count} Partners)</span>
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{tg.guests}</td>
                                    <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{tg.bookings}</td>
                                    <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{tg.roomNights}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900">{tg.revenue}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900">{tg.revSharePct}%</td>
                                    <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{tg.adr}</td>
                                    <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{tg.avgNights}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-zinc-900">{tg.repeatRatio}</td>
                                  </tr>
                                  {isExpanded &&
                                    tg.members.map((m) => {
                                      const mShare = totRev > 0 ? Math.round((m.rN / totRev) * 100) : 0;
                                      return (
                                        <tr key={m.id} className="bg-zinc-50/40 text-zinc-600">
                                          <td className="py-2 px-3 pl-9 text-[10.5px] font-medium text-zinc-700">{m.name}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px]">{m.guests}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px]">{m.bookings}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px]">{m.roomNights}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px] font-semibold text-zinc-800">{m.revenue}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px] font-semibold text-zinc-800">{mShare}%</td>
                                          <td className="py-2 px-3 text-right text-[10.5px]">{m.adr}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px]">{m.avgNights}</td>
                                          <td className="py-2 px-3 text-right text-[10.5px] font-medium text-zinc-800">{m.repeatRatio}</td>
                                        </tr>
                                      );
                                    })}
                                </React.Fragment>
                              );
                            })}
                            <tr className="bg-zinc-50/70 font-bold text-zinc-900 border-t border-zinc-200">
                              <td className="py-2.5 px-3">Total All Partners ({partners.length})</td>
                              <td className="py-2.5 px-3 text-right">{fmtInt(totGuests)}</td>
                              <td className="py-2.5 px-3 text-right">{fmtInt(totBk)}</td>
                              <td className="py-2.5 px-3 text-right">{fmtInt(totRn)}</td>
                              <td className="py-2.5 px-3 text-right">{fmtUsd(totRev)}</td>
                              <td className="py-2.5 px-3 text-right">100%</td>
                              <td className="py-2.5 px-3 text-right">${fmtInt(avgAdr)}</td>
                              <td className="py-2.5 px-3 text-right">{avgLos}</td>
                              <td className="py-2.5 px-3 text-right">{avgRepeat}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <div
                  onClick={() =>
                    openDrawer(
                      'Partner Tier Distribution',
                      `Tier classification across ${partners.length} partners based on Summary Box performance · ${PERIOD_DEFS[period].periodLabel}`,
                      <TierDistributionDrawerBody />
                    )
                  }
                  className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                  style={{ animationDelay: '0.22s' }}
                >
                  <div className="flex justify-between items-center mb-3 h-4 shrink-0">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Partner Tier Distribution</h3>
                    <div className="flex items-center gap-2">
                      <InfoTooltip text="Distribution of the 10 partner agencies across Tier 1, Tier 2, and Tier 3 based on revenue, ADR, and repeat ratio." />
                      <SeeDetailsLink />
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-between py-1 gap-3">
                    {/* Pure SVG Donut */}
                    <div className="relative shrink-0 flex items-center justify-center" style={{ width: donutSize, height: donutSize }}>
                      <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="transform -rotate-90">
                        {tierGroups.map((item, index) => {
                          const strokeLength = (item.countPct / 100) * donutCircumference;
                          const strokeOffset = -(tierAccumulated / 100) * donutCircumference;
                          tierAccumulated += item.countPct;

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
                        <span className="text-sm font-bold text-zinc-900 leading-none">{partners.length}</span>
                        <span className="text-[8px] text-zinc-500 font-medium mt-0.5">Partners</span>
                      </div>
                    </div>

                    {/* Legend with Column Headers */}
                    <div className="flex flex-col flex-1 min-w-0 pr-1">
                      <div className="grid grid-cols-[1fr_48px_48px] gap-1 items-center text-[8.5px] font-medium text-zinc-400 border-b border-zinc-100 pb-1 mb-1">
                        <span>Tier</span>
                        <span className="text-right">Partners</span>
                        <span className="text-right">Rev Share</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {tierGroups.map((item) => (
                          <div key={item.id} className="grid grid-cols-[1fr_48px_48px] gap-1 items-center text-[10px]">
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-zinc-600 font-medium truncate">{item.label}</span>
                            </div>
                            <span className="font-medium text-zinc-700 text-right tabular-nums">
                              {item.count} ({item.countPct}%)
                            </span>
                            <span className="font-bold text-zinc-900 text-right tabular-nums">{item.revSharePct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ROW 2: Corporate Accounts (4 cols) + Growth Opportunities (4 cols) + Upcoming Touchpoints (4 cols) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {/* CORPORATE ACCOUNTS */}
          {(() => {
            const corpShareDefinitions = [
              { id: 'global-exec', name: 'Global Exec Retreats', partnerIdx: 0, share: 0.28 },
              { id: 'wellness-coll', name: 'Wellness Collective', partnerIdx: 1, share: 0.24 },
              { id: 'alpine-lead', name: 'Alpine Leadership Group', partnerIdx: 4, share: 0.20 },
              { id: 'horizon-corp', name: 'Horizon Partners', partnerIdx: 2, share: 0.16 },
              { id: 'meridian-grp', name: 'Meridian Group', partnerIdx: 3, share: 0.12 },
            ];

            const corpRows = corpShareDefinitions.map((c) => {
              const p = partners[c.partnerIdx] ?? partners[0];
              const gN = Math.max(1, Math.round(p.gN * c.share));
              const bN = Math.max(1, Math.round(p.bN * c.share));
              const nN = Math.max(1, Math.round(p.nN * c.share));
              const rN = p.rN * c.share;
              return {
                id: c.id,
                name: c.name,
                partnerName: p.name,
                tier: p.tier,
                gN,
                bN,
                nN,
                rN,
                guests: fmtInt(gN),
                bookings: fmtInt(bN),
                roomNights: fmtInt(nN),
                revenue: fmtUsd(rN),
                adr: p.adr,
                avgNights: p.avgNights,
                repeatRatio: p.repeatRatio,
              };
            });

            const totGuests = corpRows.reduce((s, r) => s + r.gN, 0);
            const totBk = corpRows.reduce((s, r) => s + r.bN, 0);
            const totRn = corpRows.reduce((s, r) => s + r.nN, 0);
            const totRev = corpRows.reduce((s, r) => s + r.rN, 0);
            const avgAdr = Math.round(
              corpRows.reduce((s, r) => s + r.nN * parseNum(r.adr), 0) / Math.max(1, totRn)
            );
            const avgLos = (
              corpRows.reduce((s, r) => s + r.gN * parseNum(r.avgNights), 0) / Math.max(1, totGuests)
            ).toFixed(1);
            const avgRepeat = Math.round(
              corpRows.reduce((s, r) => s + r.gN * parseNum(r.repeatRatio), 0) / Math.max(1, totGuests)
            );

            const corpSummaryCards = [
              { label: 'Guests', value: fmtInt(totGuests), trend: '↑ 14% vs LY' },
              { label: 'Bookings', value: fmtInt(totBk), trend: '↑ 13% vs LY' },
              { label: 'Room Nights', value: fmtInt(totRn), trend: '↑ 15% vs LY' },
              { label: 'Revenue', value: fmtUsd(totRev), trend: '↑ 14% vs LY' },
              { label: 'ADR', value: `$${fmtInt(avgAdr)}`, trend: '↑ 9% vs LY' },
              { label: 'Avg Nights', value: avgLos, trend: '↑ 0.3 vs LY' },
              { label: 'Repeat Ratio', value: `${avgRepeat}%`, trend: '↑ 5pp vs LY' },
            ];

            return (
              <div
                onClick={() =>
                  openDrawer(
                    'Corporate Accounts',
                    `Corporate account performance by partner · ${PERIOD_DEFS[period].periodLabel}`,
                    <div className="space-y-5">
                      {/* Top 7 Summary Box Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                        {corpSummaryCards.map((s) => (
                          <div
                            key={s.label}
                            className="bg-zinc-50 border border-zinc-100 rounded-[12px] p-2.5 flex flex-col justify-between"
                          >
                            <span className="text-[9.5px] font-normal tracking-wider uppercase text-zinc-500 truncate">
                              {s.label}
                            </span>
                            <div className="text-[17px] font-bold text-zinc-900 leading-tight my-1">{s.value}</div>
                            <span className="text-[8.5px] font-semibold text-[#14532d]">{s.trend}</span>
                          </div>
                        ))}
                      </div>

                      {/* Corporate Accounts Table */}
                      <div className="overflow-x-auto border border-zinc-200/80 rounded-xl bg-white">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-zinc-50/90 border-b border-zinc-200 text-zinc-400 font-medium text-[9.5px] whitespace-nowrap">
                              <th className="py-2.5 px-3">Account</th>
                              <th className="py-2.5 px-3">Partner</th>
                              <th className="py-2.5 px-3 text-right">Guests</th>
                              <th className="py-2.5 px-3 text-right">Bookings</th>
                              <th className="py-2.5 px-3 text-right">Room Nights</th>
                              <th className="py-2.5 px-3 text-right">Revenue</th>
                              <th className="py-2.5 px-3 text-right">ADR</th>
                              <th className="py-2.5 px-3 text-right">Avg Nights</th>
                              <th className="py-2.5 px-3 text-right">Repeat Ratio</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 text-zinc-800 text-[11px] whitespace-nowrap">
                            {corpRows.map((row) => (
                              <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                                <td className="py-2.5 px-3 font-semibold text-zinc-900">{row.name}</td>
                                <td className="py-2.5 px-3 text-zinc-600 font-medium">{row.partnerName}</td>
                                <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.guests}</td>
                                <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.bookings}</td>
                                <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.roomNights}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-zinc-900">{row.revenue}</td>
                                <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.adr}</td>
                                <td className="py-2.5 px-3 text-right font-medium text-zinc-700">{row.avgNights}</td>
                                <td className="py-2.5 px-3 text-right font-semibold text-zinc-900">{row.repeatRatio}</td>
                              </tr>
                            ))}
                            <tr className="bg-zinc-50/70 font-bold text-zinc-900 border-t border-zinc-200">
                              <td className="py-2.5 px-3">Total Corporate Accounts ({corpRows.length})</td>
                              <td className="py-2.5 px-3 text-zinc-500 font-medium">Top 5 Partners</td>
                              <td className="py-2.5 px-3 text-right">{fmtInt(totGuests)}</td>
                              <td className="py-2.5 px-3 text-right">{fmtInt(totBk)}</td>
                              <td className="py-2.5 px-3 text-right">{fmtInt(totRn)}</td>
                              <td className="py-2.5 px-3 text-right">{fmtUsd(totRev)}</td>
                              <td className="py-2.5 px-3 text-right">${fmtInt(avgAdr)}</td>
                              <td className="py-2.5 px-3 text-right">{avgLos}</td>
                              <td className="py-2.5 px-3 text-right">{avgRepeat}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                }
                className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                style={{ animationDelay: '0.25s' }}
              >
                <div className="flex justify-between items-center mb-2.5 h-4 shrink-0">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Corporate Accounts</h3>
                  <div className="flex items-center gap-2">
                    <InfoTooltip text="Corporate accounts booked through top partner agencies." />
                    <SeeDetailsLink />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  {/* Column Headers */}
                  <div className="grid grid-cols-[1fr_48px_62px_52px] gap-1.5 items-center text-[8.5px] font-medium text-zinc-400 border-b border-zinc-100 pb-1 mb-1">
                    <span>Account</span>
                    <span className="text-right">Bookings</span>
                    <span className="text-right">Room Nights</span>
                    <span className="text-right">Revenue</span>
                  </div>

                  {/* Account Rows */}
                  <div className="flex flex-col justify-between flex-1 divide-y divide-zinc-100/80">
                    {corpRows.slice(0, 4).map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1fr_48px_62px_52px] gap-1.5 items-center py-1.5 first:pt-0.5 last:pb-0"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-[10px] font-semibold text-zinc-900 truncate leading-tight">
                            {row.name}
                          </div>
                          <div className="text-[8.5px] text-zinc-400 font-normal truncate">{row.partnerName}</div>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-700 text-right tabular-nums">
                          {row.bookings}
                        </span>
                        <span className="text-[10px] font-medium text-zinc-700 text-right tabular-nums">
                          {row.roomNights}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-900 text-right tabular-nums">
                          {row.revenue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* GROWTH OPPORTUNITIES */}
          {(() => {
            const growthItems = [
              {
                title: 'Expand Wellness & Urban with Dertour Deluxe',
                desc: 'Strong Ski & Beach bookings with low share in Wellness & Urban categories.',
                badge: 'High',
              },
              {
                title: 'Grow Ski & Urban bookings with NUBa',
                desc: 'High Beach & Wellness volume with room to grow in Ski & Urban properties.',
                badge: 'High',
              },
              {
                title: 'Increase Wellness stays with Voyages du Monde',
                desc: 'Top Nature & Beach partner with opportunity to expand Wellness room nights.',
                badge: 'High',
              },
              {
                title: 'Expand Ski & Nature with Viajes Abreu',
                desc: 'Strong Urban & Beach performance with untapped demand in Ski & Nature.',
                badge: 'Medium',
              },
              {
                title: 'Grow Nature & Urban with Cosa Travel',
                desc: 'Highest repeat ratio (77%) in Ski & Wellness ready for Nature cross-selling.',
                badge: 'Medium',
              },
              {
                title: 'Increase Wellness & Nature with Airtours',
                desc: 'Consistent Ski & Beach volume with low Wellness & Nature booking share.',
                badge: 'Medium',
              },
              {
                title: 'Expand Beach & Urban with Nyhavn',
                desc: 'Strong Nature & Wellness stays with room to grow in Beach & Urban.',
                badge: 'Medium',
              },
              {
                title: 'Grow Ski & Nature with Sporting Vaccanze',
                desc: 'High Beach booking share with opportunity to introduce Ski & Nature stays.',
                badge: 'Medium',
              },
            ];

            return (
              <div
                onClick={() =>
                  openDrawer(
                    'Growth Opportunities',
                    'AI-recommended partner growth opportunities based on category performance',
                    <div className="space-y-2.5">
                      {growthItems.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center justify-between gap-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-3.5 hover:bg-zinc-100/60 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-900 leading-snug">{item.title}</div>
                            <div className="text-[11px] text-zinc-500 font-normal mt-0.5">{item.desc}</div>
                          </div>
                          <span
                            className={`text-[9.5px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                              item.badge === 'High'
                                ? 'text-[#14532d] bg-[#ecfdf5] border border-[#bbf7d0]/80'
                                : 'text-zinc-600 bg-zinc-100 border border-zinc-200/80'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>,
                    'w-[92vw] max-w-[680px]'
                  )
                }
                className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex justify-between items-center mb-2.5 h-4 shrink-0">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Growth Opportunities</h3>
                  <div className="flex items-center gap-2">
                    <InfoTooltip text="AI-recommended growth opportunities based on partner category performance." />
                    <SeeDetailsLink />
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 divide-y divide-zinc-100/80">
                  {growthItems.slice(0, 4).map((item) => (
                    <div
                      key={item.title}
                      className="flex justify-between items-center gap-2 py-1.5 first:pt-0.5 last:pb-0"
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-[10px] font-bold text-zinc-900 truncate leading-tight">{item.title}</div>
                        <div className="text-[8.5px] text-zinc-500 truncate mt-0.5">{item.desc}</div>
                      </div>
                      <span
                        className={`text-[8px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                          item.badge === 'High'
                            ? 'text-[#14532d] bg-[#ecfdf5] border border-[#bbf7d0]/80'
                            : 'text-zinc-600 bg-zinc-100 border border-zinc-200/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* UPCOMING TOUCHPOINTS */}
          {(() => {
            const touchpoints = [
              {
                partner: 'Dertour Deluxe',
                desc: 'Review Ski & Beach booking pace and Q3 room night targets',
                date: 'May 6',
              },
              {
                partner: 'NUBa',
                desc: 'Align on Beach & Wellness summer bookings and ADR growth',
                date: 'May 9',
              },
              {
                partner: 'Cosa Travel',
                desc: 'Discuss Ski & Wellness repeat guest bookings for next season',
                date: 'May 12',
              },
              {
                partner: 'Voyages du Monde',
                desc: 'Review Nature & Beach room nights and Wellness expansion',
                date: 'May 15',
              },
              {
                partner: 'Viajes Abreu',
                desc: 'Follow up on Urban & Beach booking volume and avg nights',
                date: 'May 18',
              },
              {
                partner: 'Airtours',
                desc: 'Review Tier 2 booking growth across Beach & Ski categories',
                date: 'May 21',
              },
              {
                partner: 'Nyhavn',
                desc: 'Check in on Nature & Wellness forward bookings',
                date: 'May 24',
              },
              {
                partner: 'Sporting Vaccanze',
                desc: 'Review Beach booking pace and repeat guest share',
                date: 'May 27',
              },
            ];

            return (
              <div
                onClick={() =>
                  openDrawer(
                    'Upcoming Touchpoints',
                    'Scheduled partner review schedule and discussion topics',
                    <div className="space-y-2.5">
                      {touchpoints.map((tp) => (
                        <div
                          key={tp.partner}
                          className="flex items-center justify-between gap-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl p-3.5 hover:bg-zinc-100/60 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-zinc-900 leading-snug">{tp.partner}</div>
                            <div className="text-[11px] text-zinc-500 font-normal mt-0.5">{tp.desc}</div>
                          </div>
                          <span className="text-[10px] font-semibold text-zinc-700 bg-white border border-zinc-200/80 px-2.5 py-1 rounded-md shrink-0">
                            {tp.date}
                          </span>
                        </div>
                      ))}
                    </div>,
                    'w-[92vw] max-w-[680px]'
                  )
                }
                className="col-span-12 lg:col-span-4 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
                style={{ animationDelay: '0.35s' }}
              >
                <div className="flex justify-between items-center mb-2.5 h-4 shrink-0">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Upcoming Touchpoints</h3>
                  <div className="flex items-center gap-2">
                    <InfoTooltip text="Scheduled partner review discussions." />
                    <SeeDetailsLink />
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1 divide-y divide-zinc-100/80">
                  {touchpoints.slice(0, 4).map((tp) => (
                    <div
                      key={tp.partner}
                      className="flex justify-between items-center gap-2 py-1.5 first:pt-0.5 last:pb-0"
                    >
                      <div className="min-w-0 pr-1">
                        <div className="text-[10px] font-bold text-zinc-900 truncate leading-tight">{tp.partner}</div>
                        <div className="text-[8.5px] text-zinc-500 truncate mt-0.5">{tp.desc}</div>
                      </div>
                      <span className="text-[9.5px] text-zinc-500 font-medium shrink-0">{tp.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ROW 3: Shared Moments That Matter (Full-Width Carousel) */}
        <div className="grid grid-cols-12 gap-5 items-stretch -mx-3">
          {/* SHARED MOMENTS THAT MATTER */}
          <div
            onClick={() => openDrawer('Shared Moments That Matter', 'Historical event gallery & partner memory log', (
              <div className="space-y-6 pb-8">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Curated Events</div>
                    <div className="text-[20px] font-normal text-zinc-900 mt-1">{SHARED_MOMENTS_DATA.length} Moments</div>
                    <div className="text-[9.5px] font-medium text-[#14532d] mt-1">Across 5 property categories</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Partner Attendance</div>
                    <div className="text-[20px] font-normal text-zinc-900 mt-1">84 Advisors</div>
                    <div className="text-[9.5px] font-medium text-zinc-500 mt-1">Key decision makers hosted</div>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3.5">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Post-Event Attribution</div>
                    <div className="text-[20px] font-normal text-zinc-900 mt-1">+18.4% Lift</div>
                    <div className="text-[9.5px] font-medium text-[#14532d] mt-1">90-day booking conversion</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Co-Branded Retreats & Partner Summits</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {SHARED_MOMENTS_DATA.map((moment, idx) => (
                      <div key={`${moment.title}-${idx}`} className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-xs flex flex-col">
                        <div className="w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                          <img src={moment.img} alt={moment.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[8.5px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/80">{moment.category}</span>
                              <span className="text-[9px] text-zinc-400 font-medium">{moment.date}</span>
                            </div>
                            <div className="text-[11px] font-semibold text-zinc-900 leading-snug">{moment.title}</div>
                          </div>
                          <div className="text-[9.5px] text-zinc-500 font-medium mt-1.5 pt-1.5 border-t border-zinc-100">Host Partner: <span className="text-zinc-800 font-semibold">{moment.partner}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            className="col-span-12 relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex justify-between items-center mb-3 h-5 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Shared Moments That Matter</h3>
                <span className="text-[9px] text-zinc-400 font-medium hidden sm:inline">· Swipe or use arrows to browse</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    aria-label="Previous moments"
                    onClick={() => momentsScrollRef.current?.scrollBy({ left: -280, behavior: 'smooth' })}
                    className="w-6 h-6 rounded-md border border-zinc-200/80 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    <AltArrowDown size={11} className="rotate-90" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next moments"
                    onClick={() => momentsScrollRef.current?.scrollBy({ left: 280, behavior: 'smooth' })}
                    className="w-6 h-6 rounded-md border border-zinc-200/80 bg-white hover:bg-zinc-100 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    <AltArrowDown size={11} className="-rotate-90" />
                  </button>
                </div>
                <InfoTooltip text="Visual memories of co-branded retreats and executive partner summits." />
                <SeeDetailsLink />
              </div>
            </div>

            <div
              ref={momentsScrollRef}
              className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 pb-1.5 flex-1 items-stretch [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SHARED_MOMENTS_DATA.map((moment, idx) => (
                <div
                  key={`${moment.title}-${idx}`}
                  className="w-[210px] sm:w-[235px] shrink-0 snap-start flex flex-col bg-white/80 border border-zinc-200/70 rounded-lg p-2 hover:border-zinc-300 transition-all"
                >
                  <div className="w-full aspect-[16/10] rounded-md overflow-hidden border border-zinc-200/60 mb-2 bg-zinc-100 relative">
                    <img src={moment.img} alt={moment.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className="absolute top-1.5 left-1.5 text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-zinc-800 border border-zinc-200/80">
                      {moment.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[10px] font-bold text-zinc-900 truncate leading-tight">{moment.title}</div>
                    <div className="text-[8.5px] text-zinc-400 font-medium shrink-0">{moment.date}</div>
                  </div>
                  <div className="text-[9px] text-zinc-500 font-medium truncate mt-0.5">{moment.partner}</div>
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
            className={`fixed top-1/2 left-1/2 z-[9999] max-h-[90vh] w-[95vw] ${drawerContent?.widthClass ?? 'sm:w-[960px] lg:w-[1140px] xl:w-[1340px]'} bg-white shadow-2xl rounded-2xl border border-zinc-200/90 flex flex-col overflow-hidden transition-all duration-300 ease-out transform -translate-x-1/2 ${drawerOpen
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
