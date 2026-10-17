import {
  getForwardWindowMetrics,
  getPortfolioMetrics,
  PORTFOLIO_PROPERTY_IDS,
} from './engine';
import type { ForwardWindowMetrics, MetricsCore } from './engine';
import { SYSTEM_DATE_ISO } from './periods';
import type { PeriodId } from './periods';
import {
  getHospitalityRevenuePillars,
  PACKAGE_SHARE_OF_ROOM_REVENUE,
  splitByShares,
  WELLNESS_SHARE_OF_SPA,
} from './mix';
import type { RevenuePillar, ShareDef } from './mix';

/**
 * HOSPITALITY GLOBAL MODEL (route /dashboard)
 *
 * Everything here is derived from the portfolio engine (engine.ts / mix.ts). Only *model assumptions*
 * (share tables, ADR indices, derivation factors) are declared in this file - never an absolute amount.
 * The Hospitality widgets, drawers and the world map all consume these helpers, so the same period +
 * property selection always yields the same numbers on every Hospitality view.
 */

/* ───────────────────────── COMMON ───────────────────────── */

export type ActualPeriodId = Exclude<PeriodId, 'forward'>;

const pctChange = (cur: number, ref: number) => (ref > 0 ? (cur / ref - 1) * 100 : 0);

const interp = (table: Array<[number, number]>, x: number): number => {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x0, y0] = table[i - 1];
    const [x1, y1] = table[i];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return table[table.length - 1][1];
};

/* ───────────────────────── REVENUE & DEMAND MIX ───────────────────────── */

export type PillarId = RevenuePillar['id'];

export interface PillarMeta {
  color: string;
  description: string;
  pillarRoute: string;
  /** Long unit label used in drawers ("Dining Covers & Checks"). */
  demandUnit: string;
  /** Short unit suffix used next to the number ("Covers"). */
  demandSuffix: string;
}

/** Luxury black-to-slate gradient (AGENTS.md) + descriptive metadata for the 6 pillars. */
export const PILLAR_META: Record<PillarId, PillarMeta> = {
  rooms: {
    color: '#0f172a',
    description: 'Luxury suites, chalets, overwater villas and sanctuary pavilions',
    pillarRoute: '/dashboard/property',
    demandUnit: 'Room Nights Occupied',
    demandSuffix: 'RN',
  },
  fnb: {
    color: '#334155',
    description: 'Fine dining restaurants, omakase counters, wine cellars & private dining',
    pillarRoute: '/dashboard/fnb',
    demandUnit: 'Dining Covers & Checks',
    demandSuffix: 'Covers',
  },
  spa: {
    color: '#475569',
    description: 'Alpine thermal baths, onsen therapies, signature massages & holistic rituals',
    pillarRoute: '/dashboard/experience/spa',
    demandUnit: 'Signature Spa Treatments',
    demandSuffix: 'Treats',
  },
  wellness: {
    color: '#64748b',
    description: 'Longevity diagnostics, cryotherapy, sound healing & meditation journeys',
    pillarRoute: '/dashboard/experience/wellness',
    demandUnit: 'Wellness & Medical Sessions',
    demandSuffix: 'Sessions',
  },
  activities: {
    color: '#94a3b8',
    description: 'Heli-skiing, desert safaris, private yacht charters & cultural expeditions',
    pillarRoute: '/dashboard/experience',
    demandUnit: 'Activity Participants',
    demandSuffix: 'Guests',
  },
  packages: {
    color: '#cbd5e1',
    description: 'Curated multi-day journeys combining suites, fine dining, spa & excursions',
    pillarRoute: '/dashboard/sales/events',
    demandUnit: 'Curated Packages Booked',
    demandSuffix: 'Bookings',
  },
};

/**
 * Non-room demand grows slower than the matching revenue (the rest of the revenue growth is rate/price).
 * demand growth % = revenue growth % x this factor. Rooms use the real room-night growth from the engine.
 */
export const DEMAND_GROWTH_FRACTION_OF_REVENUE_GROWTH = 0.6;

type DemandSource = Pick<MetricsCore, 'roomsSold' | 'stays' | 'fnb' | 'spa' | 'experiences'>;

/**
 * Operational volume units behind each pillar, all derived from the engine:
 *   rooms = room nights sold, fnb = dining covers, spa/wellness = treatments split by WELLNESS_SHARE_OF_SPA,
 *   activities = experience attendances, packages = guest stays x PACKAGE_SHARE_OF_ROOM_REVENUE
 *   (the same 4.5% of the stay base that is sold inside curated packages).
 */
export function getHospitalityDemandUnits(m: DemandSource): Record<PillarId, number> {
  const wellness = Math.round(m.spa.treatments * WELLNESS_SHARE_OF_SPA);
  return {
    rooms: m.roomsSold,
    fnb: m.fnb.covers,
    spa: m.spa.treatments - wellness,
    wellness,
    activities: m.experiences.attendances,
    packages: Math.round(m.stays * PACKAGE_SHARE_OF_ROOM_REVENUE),
  };
}

export interface PillarRow {
  id: PillarId;
  name: string;
  meta: PillarMeta;
  /** Revenue lens (USD, real dollars). Rows add up exactly to metrics.totalRevenue. */
  revenue: number;
  revenueSharePct: number;
  revenueGrowthPct: number;
  /** Demand lens (operational volume units). */
  demand: number;
  demandSharePct: number;
  demandGrowthPct: number;
}

export interface PillarMix {
  rows: PillarRow[];
  totalRevenue: number;
  totalDemand: number;
}

/** The 6-pillar Revenue & Demand Mix of a metrics object (portfolio, category or single property). */
export function getHospitalityPillarMix(
  m: Pick<MetricsCore, 'roomRevenue' | 'fnbRevenue' | 'spaRevenue' | 'experienceRevenue' | 'totalRevenue'> &
    DemandSource &
    Pick<MetricsCore, 'ly' | 'vsLy'>
): PillarMix {
  const pillars = getHospitalityRevenuePillars(m);
  const units = getHospitalityDemandUnits(m);
  const totalDemand = Object.values(units).reduce((a, v) => a + v, 0);

  const revenueGrowth: Record<PillarId, number> = {
    rooms: m.vsLy.roomRevenuePct,
    packages: m.vsLy.roomRevenuePct,
    fnb: m.vsLy.fnbRevenuePct,
    spa: m.vsLy.spaRevenuePct,
    wellness: m.vsLy.spaRevenuePct,
    activities: m.vsLy.experienceRevenuePct,
  };
  const demandGrowth: Record<PillarId, number> = {
    rooms: pctChange(m.roomsSold, m.ly.roomsSold),
    packages: revenueGrowth.packages * DEMAND_GROWTH_FRACTION_OF_REVENUE_GROWTH,
    fnb: revenueGrowth.fnb * DEMAND_GROWTH_FRACTION_OF_REVENUE_GROWTH,
    spa: revenueGrowth.spa * DEMAND_GROWTH_FRACTION_OF_REVENUE_GROWTH,
    wellness: revenueGrowth.wellness * DEMAND_GROWTH_FRACTION_OF_REVENUE_GROWTH,
    activities: revenueGrowth.activities * DEMAND_GROWTH_FRACTION_OF_REVENUE_GROWTH,
  };

  const rows: PillarRow[] = pillars.map((p) => ({
    id: p.id,
    name: p.name,
    meta: PILLAR_META[p.id],
    revenue: p.value,
    revenueSharePct: p.sharePct,
    revenueGrowthPct: revenueGrowth[p.id],
    demand: units[p.id],
    demandSharePct: totalDemand > 0 ? (units[p.id] / totalDemand) * 100 : 0,
    demandGrowthPct: demandGrowth[p.id],
  }));

  return { rows, totalRevenue: m.totalRevenue, totalDemand };
}

/* ───────────────────────── GEO MARKET & MARKET SEGMENT ───────────────────────── */

export interface MarketDef {
  id: string;
  name: string;
  /** Share of room nights sold, %. Must sum to 100 inside one table. */
  rnShare: number;
  /** ADR index vs the selection's ADR (1.00 = average). */
  adrIndex: number;
  /** Year-over-year room revenue growth gap vs the selection total, in pts. */
  yoyOffsetPts: number;
}

export interface GeoMarketDef extends MarketDef {
  feederCountries: string[];
  keyHubs: string;
}

export interface SegmentDef extends MarketDef {
  description: string;
  avgLeadTimeDays: number;
  cancellationRisk: 'Low' | 'Medium' | 'High';
}

/** Where the guests come from (origin market of the room nights). */
export const GEO_MARKET_DEFS: GeoMarketDef[] = [
  { id: 'asia-pacific', name: 'Asia Pacific', rnShare: 35, adrIndex: 0.97, yoyOffsetPts: 2.2, feederCountries: ['Japan', 'Singapore', 'Australia', 'Hong Kong'], keyHubs: 'Tokyo (HND/NRT), Singapore (SIN), Sydney (SYD)' },
  { id: 'europe', name: 'Europe', rnShare: 25, adrIndex: 1.07, yoyOffsetPts: 0.4, feederCountries: ['United Kingdom', 'Switzerland', 'Germany', 'France'], keyHubs: 'London (LHR), Zurich (ZRH), Frankfurt (FRA), Paris (CDG)' },
  { id: 'america', name: 'America', rnShare: 20, adrIndex: 0.99, yoyOffsetPts: -1.6, feederCountries: ['United States', 'Canada', 'Brazil', 'Mexico'], keyHubs: 'New York (JFK), Los Angeles (LAX), Miami (MIA)' },
  { id: 'middle-east', name: 'Middle East', rnShare: 12, adrIndex: 1.16, yoyOffsetPts: -0.6, feederCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar'], keyHubs: 'Dubai (DXB), Riyadh (RUH), Doha (DOH)' },
  { id: 'africa', name: 'Africa', rnShare: 8, adrIndex: 0.79, yoyOffsetPts: -4.2, feederCountries: ['South Africa', 'Kenya', 'Morocco', 'Egypt'], keyHubs: 'Johannesburg (JNB), Nairobi (NBO), Casablanca (CMN)' },
];

/** What kind of demand: guest-type composition of the room nights. */
export const SEGMENT_DEFS: SegmentDef[] = [
  { id: 'leisure', name: 'Leisure', rnShare: 55, adrIndex: 0.97, yoyOffsetPts: 1.2, description: 'High net-worth leisure travelers, couples & luxury holidaymakers', avgLeadTimeDays: 52, cancellationRisk: 'Low' },
  { id: 'business', name: 'Business', rnShare: 25, adrIndex: 1.14, yoyOffsetPts: -2.4, description: 'C-suite executives, corporate retreat buyouts & partner stays', avgLeadTimeDays: 21, cancellationRisk: 'Medium' },
  { id: 'social', name: 'Social', rnShare: 10, adrIndex: 0.83, yoyOffsetPts: -0.8, description: 'Private celebrations, bespoke weddings & family gatherings', avgLeadTimeDays: 45, cancellationRisk: 'Low' },
  { id: 'mice', name: 'MICE', rnShare: 7, adrIndex: 1.21, yoyOffsetPts: 0.6, description: 'Executive leadership summits, conferences & private buyouts', avgLeadTimeDays: 85, cancellationRisk: 'Medium' },
  { id: 'others', name: 'Others', rnShare: 3, adrIndex: 0.74, yoyOffsetPts: -5.0, description: 'Diplomatic delegations, media partners & industry affiliations', avgLeadTimeDays: 18, cancellationRisk: 'Low' },
];

export interface MarketRow<T extends MarketDef> {
  def: T;
  roomNights: number;
  roomNightsSharePct: number;
  roomRevenue: number;
  roomRevenueSharePct: number;
  adr: number;
  vsLyPct: number;
}

/**
 * Splits the selection's room nights and room revenue across a market table.
 * Room nights add up to m.roomsSold and revenue adds up to m.roomRevenue (largest-remainder split);
 * revenue shares = room-night share x ADR index, so each market ADR is simply revenue / room nights.
 */
export function splitMarkets<T extends MarketDef>(
  m: Pick<MetricsCore, 'roomsSold' | 'roomRevenue' | 'vsLy'>,
  defs: T[]
): Array<MarketRow<T>> {
  const rn = splitByShares(
    m.roomsSold,
    defs.map((d): ShareDef => ({ id: d.id, name: d.name, share: d.rnShare }))
  );
  const rev = splitByShares(
    m.roomRevenue,
    defs.map((d): ShareDef => ({ id: d.id, name: d.name, share: d.rnShare * d.adrIndex }))
  );
  return defs.map((def, i) => ({
    def,
    roomNights: rn[i].value,
    roomNightsSharePct: m.roomsSold > 0 ? (rn[i].value / m.roomsSold) * 100 : 0,
    roomRevenue: rev[i].value,
    roomRevenueSharePct: m.roomRevenue > 0 ? (rev[i].value / m.roomRevenue) * 100 : 0,
    adr: rn[i].value > 0 ? rev[i].value / rn[i].value : 0,
    vsLyPct: m.vsLy.roomRevenuePct + def.yoyOffsetPts,
  }));
}

/* ───────────────────────── FORWARD BUSINESS ───────────────────────── */

export const FORWARD_WINDOWS = [30, 90, 180, 365] as const;
export type ForwardWindowDays = (typeof FORWARD_WINDOWS)[number];

/**
 * TENTATIVE / PIPELINE / CANCELLATION derivation (documented model assumptions - the engine only
 * knows on-the-books revenue):
 *  - On-the-books (OTB) revenue = engine `otbTotalRevenue` for the window.
 *  - Tentative = share of OTB that is still a space hold / contract under review. The share grows with
 *    the booking horizon (further out = softer bookings).
 *  - Definite = OTB - Tentative.
 *  - Pipeline (leads) is NOT on the books: PIPELINE_CAPTURE_OF_UNBOOKED of the revenue still to be booked
 *    (engine forecast total - OTB total) is in active negotiation.
 *  - Cancellation exposure = CANCELLATION_EXPOSURE_PCT_OF_OTB of the OTB revenue sits in flexible /
 *    non-guaranteed windows.
 *  - A lead is on average LEAD_AVG_ROOM_NIGHTS room nights at the window ADR.
 */
const TENTATIVE_SHARE_BY_WINDOW: Array<[number, number]> = [
  [30, 0.26],
  [90, 0.27],
  [180, 0.29],
  [365, 0.31],
];
export const PIPELINE_CAPTURE_OF_UNBOOKED = 0.3;
export const CANCELLATION_EXPOSURE_PCT_OF_OTB = 0.055;
export const LEAD_AVG_ROOM_NIGHTS = 12;

export const getTentativeShare = (windowDays: number) => interp(TENTATIVE_SHARE_BY_WINDOW, windowDays);
export const getCancellationExposure = (otbRevenue: number) =>
  Math.round(otbRevenue * CANCELLATION_EXPOSURE_PCT_OF_OTB);

/** Cumulative day cut-offs of the 3 cadence buckets of a window (30D -> 10/20/30, 90D -> 30/60/90 ...). */
export function getForwardBucketBounds(windowDays: number): number[] {
  switch (windowDays) {
    case 30:
      return [10, 20, 30];
    case 90:
      return [30, 60, 90];
    case 180:
      return [60, 120, 180];
    case 365:
      return [120, 240, 365];
    default: {
      const third = Math.max(1, Math.round(windowDays / 3));
      return [third, third * 2, windowDays];
    }
  }
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Calendar date of forward day N (day 1 = the day after the system date). */
function forwardDate(day: number): Date {
  const d = new Date(`${SYSTEM_DATE_ISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + day);
  return d;
}
const fmtMonthDay = (d: Date) => `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;

/** "Oct 18 - Nov 16" for forward days [fromDay..toDay]. */
export function getForwardDateRange(fromDay: number, toDay: number): string {
  return `${fmtMonthDay(forwardDate(fromDay))} \u2013 ${fmtMonthDay(forwardDate(toDay))}`;
}

export interface ForwardBucket {
  label: string;
  dateRange: string;
  fromDay: number;
  toDay: number;
  roomNights: number;
  availableRoomNights: number;
  occupancyPct: number;
  otbRevenue: number;
  definiteRevenue: number;
  tentativeRevenue: number;
  pipelineRevenue: number;
  highlight: boolean;
}

export interface ForwardBusiness {
  windowDays: number;
  window: ForwardWindowMetrics;
  otbRevenue: number;
  definiteRevenue: number;
  tentativeRevenue: number;
  tentativeSharePct: number;
  pipelineRevenue: number;
  leadsCount: number;
  cancellationExposure: number;
  forecastRevenue: number;
  /** OTB occupancy delta vs same time last year, in percentage points. */
  occupancyPtsVsLy: number;
  adrVsLyPct: number;
  paceVsLyPct: number;
  revenueVsLyPct: number;
  buckets: ForwardBucket[];
  strongest: ForwardBucket | null;
  weakest: ForwardBucket | null;
}

/**
 * Forward business of a property selection for any window. Bucket values are exact differences of the
 * cumulative engine windows, so buckets always add up to the window total (and the 90D window equals
 * getPortfolioMetrics(ids, 'forward')).
 */
export function getForwardBusiness(propertyIds: string[] | undefined, windowDays: number): ForwardBusiness {
  const ids = propertyIds && propertyIds.length > 0 ? propertyIds : PORTFOLIO_PROPERTY_IDS;
  const fw = getForwardWindowMetrics(ids, windowDays);
  const tentativeShare = getTentativeShare(windowDays);

  const bounds = getForwardBucketBounds(windowDays);
  const cumulative = bounds.map((b) => (b === windowDays ? fw : getForwardWindowMetrics(ids, b)));
  const buckets: ForwardBucket[] = cumulative.map((cur, i) => {
    const prev = i > 0 ? cumulative[i - 1] : null;
    const fromDay = i > 0 ? bounds[i - 1] + 1 : 1;
    const roomNights = cur.otbRoomsSold - (prev?.otbRoomsSold ?? 0);
    const available = cur.availableRoomNights - (prev?.availableRoomNights ?? 0);
    const otbRevenue = cur.otbTotalRevenue - (prev?.otbTotalRevenue ?? 0);
    const forecastRevenue = cur.forecastTotalRevenue - (prev?.forecastTotalRevenue ?? 0);
    const tentative = Math.round(otbRevenue * tentativeShare);
    return {
      label: `${fromDay === 1 ? 0 : fromDay}\u2013${bounds[i]}D`,
      dateRange: getForwardDateRange(fromDay, bounds[i]),
      fromDay,
      toDay: bounds[i],
      roomNights,
      availableRoomNights: available,
      occupancyPct: available > 0 ? (roomNights / available) * 100 : 0,
      otbRevenue,
      definiteRevenue: otbRevenue - tentative,
      tentativeRevenue: tentative,
      pipelineRevenue: Math.round(Math.max(0, forecastRevenue - otbRevenue) * PIPELINE_CAPTURE_OF_UNBOOKED),
      highlight: false,
    };
  });

  const maxRevenue = Math.max(...buckets.map((b) => b.otbRevenue));
  buckets.forEach((b) => {
    b.highlight = b.otbRevenue === maxRevenue;
  });

  const tentativeRevenue = buckets.reduce((a, b) => a + b.tentativeRevenue, 0);
  const pipelineRevenue = buckets.reduce((a, b) => a + b.pipelineRevenue, 0);
  const otbRevenue = fw.otbTotalRevenue;
  const stlyOccPct = fw.availableRoomNights > 0 ? (fw.stlyOtbRoomsSold / fw.availableRoomNights) * 100 : 0;
  const stlyAdr = fw.stlyOtbRoomsSold > 0 ? fw.stlyOtbRoomRevenue / fw.stlyOtbRoomsSold : 0;

  const byOcc = [...buckets].sort((a, b) => b.occupancyPct - a.occupancyPct);

  return {
    windowDays,
    window: fw,
    otbRevenue,
    definiteRevenue: otbRevenue - tentativeRevenue,
    tentativeRevenue,
    tentativeSharePct: otbRevenue > 0 ? (tentativeRevenue / otbRevenue) * 100 : 0,
    pipelineRevenue,
    leadsCount: fw.adr > 0 ? Math.max(1, Math.round(pipelineRevenue / (fw.adr * LEAD_AVG_ROOM_NIGHTS))) : 0,
    cancellationExposure: getCancellationExposure(otbRevenue),
    forecastRevenue: fw.forecastTotalRevenue,
    occupancyPtsVsLy: fw.otbOccupancyPct - stlyOccPct,
    adrVsLyPct: pctChange(fw.adr, stlyAdr),
    paceVsLyPct: fw.paceVsLyPct,
    revenueVsLyPct: fw.revenueVsLyPct,
    buckets,
    strongest: byOcc[0] ?? null,
    weakest: byOcc[byOcc.length - 1] ?? null,
  };
}

/* ───────────────────────── BOOKING PACE ───────────────────────── */

export interface PaceMonthPoint {
  /** Axis label ("Oct", "Nov", ...). */
  month: string;
  /** "Oct 18 - 31" style range (partial months at both ends of the window). */
  range: string;
  days: number;
  fromDay: number;
  toDay: number;
  /** Room nights on the books for this slice of the window (this year / same time last year). */
  thisYear: number;
  lastYear: number;
}

/**
 * Monthly OTB room nights vs STLY across the next N days (default 90). Slices are differences of cumulative
 * engine windows, so they add up to getForwardWindowMetrics(ids, N).otbRoomsSold / stlyOtbRoomsSold exactly.
 */
export function getBookingPaceSeries(propertyIds: string[] | undefined, totalDays = 90): PaceMonthPoint[] {
  const ids = propertyIds && propertyIds.length > 0 ? propertyIds : PORTFOLIO_PROPERTY_IDS;

  // group forward days into calendar months
  const slices: Array<{ month: number; fromDay: number; toDay: number }> = [];
  for (let day = 1; day <= totalDays; day++) {
    const month = forwardDate(day).getUTCMonth();
    const last = slices[slices.length - 1];
    if (last && last.month === month) last.toDay = day;
    else slices.push({ month, fromDay: day, toDay: day });
  }

  let prevOtb = 0;
  let prevStly = 0;
  return slices.map((s) => {
    const cum = getForwardWindowMetrics(ids, s.toDay);
    const point: PaceMonthPoint = {
      month: MONTHS_SHORT[s.month],
      range: `${fmtMonthDay(forwardDate(s.fromDay))} \u2013 ${
        forwardDate(s.toDay).getUTCDate()
      }`,
      days: s.toDay - s.fromDay + 1,
      fromDay: s.fromDay,
      toDay: s.toDay,
      thisYear: cum.otbRoomsSold - prevOtb,
      lastYear: cum.stlyOtbRoomsSold - prevStly,
    };
    prevOtb = cum.otbRoomsSold;
    prevStly = cum.stlyOtbRoomsSold;
    return point;
  });
}

/* ───────────────────────── PERIOD HELPERS ───────────────────────── */

/** Metrics of the selection for a period (thin wrapper kept here so Hospitality code has one import). */
export const getHospitalityMetrics = (propertyIds: string[] | undefined, period: PeriodId) =>
  getPortfolioMetrics(propertyIds, period);
