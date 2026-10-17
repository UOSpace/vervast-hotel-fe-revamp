// Hospitality-global data service (route /dashboard).
//
// EVERY financial / occupancy / guest number returned here is derived from the portfolio engine
// (src/data/portfolio) for the requested period + property selection - nothing is typed in by hand.
// The static data kept in this file is non-financial only (names, coordinates, descriptors, VIP guest identity).
//
// Builders are functions of (period, propertyIds?). The `simulated*` constants at the bottom of each section are
// kept for backward compatibility and always represent the MTD / 90D / all-property defaults.

import { MASTER_CATEGORIES } from '@/constants/categories';
import {
  PERIOD_DEFS,
  FORWARD_DEFAULT_DAYS,
  PORTFOLIO_PROPERTY_IDS,
  adrOf,
  fmtCompactInt,
  fmtInt,
  fmtPct,
  fmtSignedPct,
  fmtSignedPts,
  fmtUsd,
  fmtUsdFull,
  getForwardWindowMetrics,
  getPortfolioMetrics,
  getPropertyIdsByCategory,
  getPropertyIdsByRegion,
  getPropertyMetrics,
  getPropertyMetricsList,
  occupancyOf,
  revparOf,
} from '@/data/portfolio';
import type { PeriodId, PortfolioMetrics, PropertyMetrics } from '@/data/portfolio';
import {
  GEO_MARKET_DEFS,
  SEGMENT_DEFS,
  getBookingPaceSeries,
  getForwardBusiness,
  getHospitalityPillarMix,
  splitMarkets,
} from '@/data/portfolio/hospitalityMix';

export type ActualPeriod = Exclude<PeriodId, 'forward'>;

const ensureIds = (ids?: string[]) => (ids && ids.length > 0 ? ids : PORTFOLIO_PROPERTY_IDS);
const pluralize = (n: number, one: string, many: string) => (n === 1 ? one : many);
const arrow = (up: boolean) => (up ? '\u2191' : '\u2193');

/* ============================================================================
 * 1. PROPERTIES (world map + property roster)
 * ========================================================================== */

export interface GuestBookingRecord {
  guestId: string;
  guestName: string;
  guestTitle: string;
  vipTier: string;
  nationality: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  dailyRate: number;
  totalStayAmount: number;
  specialRequest: string;
  bookingStatus: 'in_house' | 'arrival_today' | 'confirmed';
}

export interface SimulatedPropertyMapItem {
  id: string;
  name: string;
  city: string;
  country: string;
  grouping: string;
  coordinates: [number, number];

  /** Period the financial fields below were computed for. */
  period: PeriodId;
  periodLabel: string;
  /** Days spanned by the period (1 for Today). */
  daysInPeriod: number;

  // Property room inventory & calculated occupancy
  totalRooms: number;
  /** Average rooms occupied per night in the period (== rooms sold for Today). */
  occupiedRooms: number;
  /** Room nights sold in the period. */
  roomNightsSold: number;
  occupancyPct: number;
  occupancyFormatted: string;

  // Rate & revenue calculations
  adrUsd: number;
  adrFormatted: string;
  revparUsd: number;
  revparFormatted: string;
  roomRevenueUsd: number;
  /** TOTAL hotel revenue (rooms + F&B + spa + activities) for the period. Legacy field name kept for compatibility. */
  monthlyRevenueUsd: number;
  revenueFormatted: string;

  // Operational guest movement (always "today")
  guestsInHouse: number;
  arrivalsToday: number;
  departuresToday: number;

  // Performance status
  status: 'above_plan' | 'on_plan' | 'attention';
  statusLabel: string;

  // Live in-house guest record
  activeGuest: GuestBookingRecord;
}

type GuestIdentity = Omit<GuestBookingRecord, 'dailyRate' | 'totalStayAmount'>;

interface PropertyMeta {
  id: string;
  name: string;
  city: string;
  country: string;
  grouping: string;
  coordinates: [number, number];
  guest: GuestIdentity;
}

/** Non-financial property metadata (identity, geography, the live VIP guest). */
const PROPERTY_META: PropertyMeta[] = [
  {
    id: 'sosei-andermatt', name: 'SOSEI Andermatt', city: 'Andermatt, Switzerland', country: 'Switzerland', grouping: 'Ski',
    coordinates: [8.5939, 46.6356],
    guest: { guestId: 'gst_ind_001', guestName: 'Sal Zanjabila', guestTitle: 'Ms.', vipTier: 'Platinum VIP', nationality: 'British', roomType: 'Gotthard Glacier Penthouse Chalet', roomNumber: 'Chalet 401', checkInDate: 'Oct 10', checkOutDate: 'Oct 15', nights: 5, specialRequest: 'Helipad Ski Concierge & Thermal Spa', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-el-gouna', name: 'SOSEI El Gouna', city: 'El Gouna, Egypt', country: 'Egypt', grouping: 'Beach Resort',
    coordinates: [33.6782, 27.3942],
    guest: { guestId: 'gst_ind_022', guestName: 'Sheikh Tariq Al-Mansoor', guestTitle: 'H.E.', vipTier: 'Royal Patron', nationality: 'Emirati', roomType: 'Red Sea Lagoon Royal Villa', roomNumber: 'Villa 01', checkInDate: 'Oct 11', checkOutDate: 'Oct 14', nights: 3, specialRequest: 'Private yacht charter & coral reef diving', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-auh', name: 'SOSEI AUH', city: 'Abu Dhabi, UAE', country: 'United Arab Emirates', grouping: 'Beach Resort',
    coordinates: [54.3773, 24.4539],
    guest: { guestId: 'gst_ind_002', guestName: 'Martin Fuentes', guestTitle: 'Mr.', vipTier: 'Founding Circle', nationality: 'American', roomType: 'Saadiyat Beachfront Grand Villa', roomNumber: 'Villa 108', checkInDate: 'Oct 09', checkOutDate: 'Oct 16', nights: 7, specialRequest: 'Private Louvre Abu Dhabi after-hours curator tour', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-melides', name: 'SOSEI Melides', city: 'Melides, Portugal', country: 'Portugal', grouping: 'Beach Resort',
    coordinates: [-8.7297, 38.1469],
    guest: { guestId: 'gst_ind_007', guestName: 'Henrik Lindqvist', guestTitle: 'Mr.', vipTier: 'Property Elite', nationality: 'Swedish', roomType: 'Alentejo Atlantic Dune Villa', roomNumber: 'Estate 104', checkInDate: 'Oct 11', checkOutDate: 'Oct 15', nights: 4, specialRequest: 'Private horseback riding along Melides lagoon', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-umbria', name: 'SOSEI Umbria', city: 'Umbria, Italy', country: 'Italy', grouping: 'Beach Resort',
    coordinates: [12.6216, 42.9380],
    guest: { guestId: 'gst_ind_025', guestName: 'David Rothschild', guestTitle: 'Mr.', vipTier: 'Platinum VIP', nationality: 'Swiss', roomType: 'Castello Vineyard Palazzo Suite', roomNumber: 'Villa 09', checkInDate: 'Oct 11', checkOutDate: 'Oct 15', nights: 4, specialRequest: 'Private white truffle foraging & cellar tasting', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-tinos', name: 'SOSEI Tinos', city: 'Tinos, Greece', country: 'Greece', grouping: 'Beach Resort',
    coordinates: [25.1634, 37.5376],
    guest: { guestId: 'gst_ind_011', guestName: 'Julian Vance', guestTitle: 'Mr.', vipTier: 'Platinum VIP', nationality: 'American', roomType: 'Aegean Cliffside Cycladic Villa', roomNumber: 'Villa 310', checkInDate: 'Oct 10', checkOutDate: 'Oct 14', nights: 4, specialRequest: 'Private marble sculpting studio visit & Aegean sail', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-barcelona', name: 'SOSEI Barcelona', city: 'Barcelona, Spain', country: 'Spain', grouping: 'Urban',
    coordinates: [2.1734, 41.3851],
    guest: { guestId: 'gst_ind_003', guestName: 'Dr. Elizabeth Hall', guestTitle: 'Dr.', vipTier: 'Gold VIP', nationality: 'British', roomType: 'Paseo de Gracia Grand Suite', roomNumber: 'Suite 402', checkInDate: 'Oct 11', checkOutDate: 'Oct 15', nights: 4, specialRequest: 'Private architectural tour with Gaudi historian', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-osa', name: 'SOSEI OSA', city: 'Osa, Costa Rica', country: 'Costa Rica', grouping: 'Nature',
    coordinates: [-83.5042, 8.5380],
    guest: { guestId: 'gst_ind_008', guestName: 'Lord Sterling', guestTitle: 'Lord', vipTier: 'Founding Circle', nationality: 'British', roomType: 'Corcovado Rainforest Canopy Villa', roomNumber: 'Villa 14', checkInDate: 'Oct 09', checkOutDate: 'Oct 16', nights: 7, specialRequest: 'Private naturalist wildlife expedition in Osa Peninsula', bookingStatus: 'in_house' },
  },
  {
    id: 'sosei-bali', name: 'SOSEI BALI', city: 'Bali, Indonesia', country: 'Indonesia', grouping: 'Wellness',
    coordinates: [115.1889, -8.4095],
    guest: { guestId: 'gst_ind_009', guestName: 'Maya Wulandari', guestTitle: 'Mrs.', vipTier: 'Property Patron', nationality: 'Indonesian', roomType: 'Holistic Sanctuary Cliffside Villa', roomNumber: 'Villa 12', checkInDate: 'Oct 12', checkOutDate: 'Oct 16', nights: 4, specialRequest: 'Holistic Balinese purification & longevity ritual', bookingStatus: 'in_house' },
  },
];

const STATUS_LABELS: Record<SimulatedPropertyMapItem['status'], string> = {
  above_plan: 'Performing above plan',
  on_plan: 'On plan',
  attention: 'Attention',
};

function buildPropertyItem(meta: PropertyMeta, m: PropertyMetrics): SimulatedPropertyMapItem {
  const today = getPropertyMetrics(meta.id, 'today');
  const dailyRate = Math.round(today.adr);
  return {
    id: meta.id,
    name: meta.name,
    city: meta.city,
    country: meta.country,
    grouping: meta.grouping,
    coordinates: meta.coordinates,
    period: m.period,
    periodLabel: PERIOD_DEFS[m.period].periodLabel,
    daysInPeriod: m.days,
    totalRooms: m.rooms,
    occupiedRooms: Math.round(m.roomsSold / m.days),
    roomNightsSold: m.roomsSold,
    occupancyPct: m.occupancyPct,
    occupancyFormatted: fmtPct(m.occupancyPct, 1),
    adrUsd: Math.round(m.adr),
    adrFormatted: fmtUsdFull(m.adr),
    revparUsd: Math.round(m.revpar),
    revparFormatted: fmtUsdFull(m.revpar),
    roomRevenueUsd: m.roomRevenue,
    monthlyRevenueUsd: m.totalRevenue,
    revenueFormatted: fmtUsd(m.totalRevenue),
    guestsInHouse: Math.round(today.guestNights),
    arrivalsToday: today.stays,
    // steady-state: guests leaving today == guests arriving today
    departuresToday: today.stays,
    status: m.status,
    statusLabel: STATUS_LABELS[m.status],
    activeGuest: {
      ...meta.guest,
      dailyRate,
      totalStayAmount: dailyRate * meta.guest.nights,
    },
  };
}

/** Map / roster items of a property selection for a period. Sum of `monthlyRevenueUsd` == KPI total revenue. */
export function getSimulatedPropertiesData(period: PeriodId = 'mtd', propertyIds?: string[]): SimulatedPropertyMapItem[] {
  const list = getPropertyMetricsList(propertyIds, period);
  return list
    .map((m) => {
      const meta = PROPERTY_META.find((p) => p.id === m.propertyId);
      return meta ? buildPropertyItem(meta, m) : null;
    })
    .filter((x): x is SimulatedPropertyMapItem => x !== null);
}

export const simulatedPropertiesData: SimulatedPropertyMapItem[] = getSimulatedPropertiesData('mtd');

/* ============================================================================
 * 2. CATEGORY (COLLECTION) PERFORMANCE
 * ========================================================================== */

export interface PropertyPerformanceCategory {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  /** Average rooms occupied per night in the period. */
  occupiedRooms: number;
  occ: string;
  occNum: number;
  /** Budget snapshot occupancy (%). */
  targetOcc: number;
  adr: string;
  adrNum: number;
  targetAdr: number;
  /** TOTAL hotel revenue formatted. */
  revenue: string;
  /** TOTAL hotel revenue in USD millions. */
  revenueNum: number;
  /** Budget total revenue in USD millions. */
  targetRev: number;
  revpar: string;
  revparNum: number;
  targetRevpar: number;
  status: string;
  /** Raw engine metrics for the collection (real dollars) so drawers never re-derive them. */
  metrics: PortfolioMetrics;
  children: Array<{
    id: string;
    name: string;
    location: string;
    totalRooms: number;
    occupiedRooms: number;
    occ: string;
    adr: string;
    revenue: string;
    revpar: string;
    metrics: PropertyMetrics;
  }>;
}

const collectionStatus = (m: PortfolioMetrics) =>
  m.vsBudget.revparPct >= 2 ? 'Above Plan' : m.vsBudget.revparPct < 0 ? 'Behind Plan' : 'On Plan';

const cityOf = (location: string) => location.split(',')[0].trim();

const formatCollectionLocation = (props: PropertyMetrics[]) => {
  if (props.length === 0) return '';
  if (props.length === 1) return props[0].location;
  const cities = props.map((p) => cityOf(p.location));
  if (cities.length === 2) return `${cities[0]} & ${cities[1]}`;
  return `${cities.slice(0, -1).join(', ')} & ${cities[cities.length - 1]}`;
};

export function getCategoryPerformance(period: PeriodId = 'mtd', propertyIds?: string[]): PropertyPerformanceCategory[] {
  const selected = propertyIds && propertyIds.length > 0 ? propertyIds : null;
  return MASTER_CATEGORIES.map((cat) => {
    const ids = getPropertyIdsByCategory([cat.id]).filter((id) => !selected || selected.includes(id));
    if (ids.length === 0) return null;
    const m = getPortfolioMetrics(ids, period);
    const row: PropertyPerformanceCategory = {
      id: cat.id,
      name: cat.name,
      location: formatCollectionLocation(m.properties),
      totalRooms: m.rooms,
      occupiedRooms: Math.round(m.roomsSold / m.days),
      occ: `${m.occupancyPct.toFixed(2)}%`,
      occNum: m.occupancyPct,
      targetOcc: occupancyOf(m.budget),
      adr: fmtUsdFull(m.adr),
      adrNum: m.adr,
      targetAdr: adrOf(m.budget),
      revenue: fmtUsd(m.totalRevenue),
      revenueNum: m.totalRevenue / 1_000_000,
      targetRev: m.budget.totalRevenue / 1_000_000,
      revpar: fmtUsdFull(m.revpar),
      revparNum: m.revpar,
      targetRevpar: revparOf(m.budget),
      status: collectionStatus(m),
      metrics: m,
      children: m.properties.map((p) => ({
        id: p.propertyId,
        name: p.name,
        location: p.location,
        totalRooms: p.rooms,
        occupiedRooms: Math.round(p.roomsSold / p.days),
        occ: `${p.occupancyPct.toFixed(2)}%`,
        adr: fmtUsdFull(p.adr),
        revenue: fmtUsd(p.totalRevenue),
        revpar: fmtUsdFull(p.revpar),
        metrics: p,
      })),
    };
    return row;
  }).filter((x): x is PropertyPerformanceCategory => x !== null);
}

export const simulatedCategoryPerformance: PropertyPerformanceCategory[] = getCategoryPerformance('mtd');

/* ============================================================================
 * 3. BOOKING PACE (next 90 days, forward engine)
 * ========================================================================== */

export interface BookingPaceData {
  timeframe: string;
  windowDays: number;
  series: Array<{
    month: string;
    range: string;
    thisYear: number;
    lastYear: number;
    displayThisYear: string;
    displayLastYear: string;
  }>;
  summary: {
    paceVsLy: string;
    paceVsLyNum: number;
    roomNightsOtb: string;
    roomNightsOtbNum: number;
    roomNightsTrend: string;
    /** Total revenue OTB (rooms + F&B + spa + activities), formatted. */
    revenueOtb: string;
    /** Total revenue OTB in USD (real dollars). */
    revenueOtbNum: number;
    revenueTrend: string;
    pickup7d: string;
    pickup30d: string;
    /** Pickup in room nights. */
    pickup7dRoomNights: number;
    pickup30dRoomNights: number;
    paceVsBudget: string;
  };
}

export type BookingPaceWindow = 7 | 14 | 30 | 90;

export function getBookingPaceData(
  propertyIds?: string[],
  windowDays: number = FORWARD_DEFAULT_DAYS
): BookingPaceData {
  const ids = ensureIds(propertyIds);
  const fw = getForwardWindowMetrics(ids, windowDays);
  const fwdPeriod = getPortfolioMetrics(ids, 'forward');
  const budgetPace = fwdPeriod.budget.roomsSold > 0 ? (fwdPeriod.roomsSold / fwdPeriod.budget.roomsSold - 1) * 100 : 0;

  return {
    timeframe: `NEXT ${windowDays} DAYS (ROOM NIGHTS OTB)`,
    windowDays,
    series: getBookingPaceSeries(ids, windowDays).map((p) => ({
      month: p.month,
      range: p.range,
      thisYear: p.thisYear,
      lastYear: p.lastYear,
      displayThisYear: fmtCompactInt(p.thisYear),
      displayLastYear: fmtCompactInt(p.lastYear),
    })),
    summary: {
      paceVsLy: fmtSignedPct(fw.paceVsLyPct),
      paceVsLyNum: fw.paceVsLyPct,
      roomNightsOtb: fmtInt(fw.otbRoomsSold),
      roomNightsOtbNum: fw.otbRoomsSold,
      roomNightsTrend: fmtSignedPct(fw.paceVsLyPct),
      revenueOtb: fmtUsd(fw.otbTotalRevenue),
      revenueOtbNum: fw.otbTotalRevenue,
      revenueTrend: fmtSignedPct(fw.revenueVsLyPct),
      pickup7d: fmtSignedPct(fw.pickup7dVsLyPct),
      pickup30d: fmtSignedPct(fw.pickup30dVsLyPct),
      pickup7dRoomNights: fw.pickup7dRoomNights,
      pickup30dRoomNights: fw.pickup30dRoomNights,
      paceVsBudget: `${fmtSignedPct(budgetPace)} vs Budget`,
    },
  };
}

export const simulatedBookingPaceData: BookingPaceData = getBookingPaceData();

/* ============================================================================
 * 4. REVENUE & DEMAND MIX (6 pillars)
 * ========================================================================== */

export interface MixItem {
  id: string;
  name: string;
  color: string;
  // Revenue lens
  /** Pillar revenue in real USD. The six pillars add up exactly to the total hotel revenue. */
  revenueUsd: number;
  revenueFormatted: string;
  revenuePct: number;
  revenuePctFormatted: string;
  revenueTrend: string;
  revenueTrendUp: boolean;
  // Demand lens (operational volume units)
  demandValue: number;
  /** Compact ("48.5K Covers"). */
  demandFormatted: string;
  /** Full precision ("48,512 Covers"). */
  demandFormattedFull: string;
  demandUnit: string;
  demandPct: number;
  demandPctFormatted: string;
  demandTrend: string;
  demandTrendUp: boolean;
  // Pillar metadata
  description: string;
  pillarRoute?: string;
}

export interface RevenueDemandMixData {
  period: PeriodId;
  timeframe: string;
  /** Total hotel revenue == the Portfolio Performance "Total Hotel Revenue" card for the same period. */
  totalRevenueFormatted: string;
  /** Total hotel revenue in real USD. */
  totalRevenueNum: number;
  totalDemandFormatted: string;
  totalDemandNum: number;
  items: MixItem[];
}

export function getRevenueDemandMixData(period: PeriodId = 'mtd', propertyIds?: string[]): RevenueDemandMixData {
  const m = getPortfolioMetrics(propertyIds, period);
  const mix = getHospitalityPillarMix(m);
  return {
    period,
    timeframe: `As of: ${PERIOD_DEFS[period].periodLabel}`,
    totalRevenueFormatted: fmtUsd(mix.totalRevenue),
    totalRevenueNum: mix.totalRevenue,
    totalDemandFormatted: fmtCompactInt(mix.totalDemand),
    totalDemandNum: mix.totalDemand,
    items: mix.rows.map((r) => ({
      id: r.id,
      name: r.name,
      color: r.meta.color,
      revenueUsd: r.revenue,
      revenueFormatted: fmtUsd(r.revenue),
      revenuePct: r.revenueSharePct,
      revenuePctFormatted: fmtPct(r.revenueSharePct, 1),
      revenueTrend: fmtSignedPct(r.revenueGrowthPct),
      revenueTrendUp: r.revenueGrowthPct >= 0,
      demandValue: r.demand,
      demandFormatted: `${fmtCompactInt(r.demand)} ${r.meta.demandSuffix}`,
      demandFormattedFull: `${fmtInt(r.demand)} ${r.meta.demandSuffix}`,
      demandUnit: r.meta.demandUnit,
      demandPct: r.demandSharePct,
      demandPctFormatted: fmtPct(r.demandSharePct, 1),
      demandTrend: fmtSignedPct(r.demandGrowthPct),
      demandTrendUp: r.demandGrowthPct >= 0,
      description: r.meta.description,
      pillarRoute: r.meta.pillarRoute,
    })),
  };
}

export const simulatedRevenueDemandMixData: RevenueDemandMixData = getRevenueDemandMixData('mtd');

/* ============================================================================
 * 5. FORWARD BUSINESS (committed on-the-books for future windows)
 * ========================================================================== */

export type ForwardBusinessWindow = '30D' | '90D' | '180D' | '365D';

export const FORWARD_WINDOW_DAYS: Record<ForwardBusinessWindow, number> = {
  '30D': 30,
  '90D': 90,
  '180D': 180,
  '365D': 365,
};

export interface ForwardPeriodBucket {
  label: string; // e.g. "W1", "M1", "Q1"
  dateRange: string; // e.g. "Oct 18 – Nov 16"
  revenueFormatted: string; // total OTB
  /** All revenue fields below are real USD. */
  revenueUsd: number;
  definiteRevenueUsd: number; // signed contract, guaranteed OTB
  verbalDefiniteRevenueUsd: number; // verbally confirmed OTB
  tentativeRevenueUsd: number; // space hold / contract under review
  prospectRevenueUsd: number; // active inquiries / proposals
  pipelineRevenueUsd: number; // backwards compatibility (= prospectRevenueUsd)
  committedRevenueUsd: number; // backwards compatibility (= definiteRevenueUsd)
  roomNights: number;
  occupancyPct: number;
  highlight?: boolean;
}

export interface ForwardBusinessData {
  timeframe: string;
  windowDays: number;
  defaultWindow: ForwardBusinessWindow;
  revenueOtb: string;
  revenueOtbNum: number;
  revenueTrend: string;
  definiteRevenue: string;
  definiteRevenueNum: number;
  definiteRoomNights: string;
  definiteRevenuePct: number;
  definiteTrend: string;
  verbalDefiniteRevenue: string;
  verbalDefiniteRevenueNum: number;
  verbalDefiniteRoomNights: string;
  verbalDefiniteRevenuePct: number;
  verbalDefiniteTrend: string;
  tentativeRevenue: string;
  tentativeRevenueNum: number;
  tentativeRoomNights: string;
  tentativeRevenuePct: number;
  tentativeTrend: string;
  prospectRevenue: string;
  prospectRevenueNum: number;
  prospectRoomNights: string;
  prospectTrend: string;
  postponedRevenue: string;
  postponedRevenueNum: number;
  postponedRoomNights: string;
  cancelledRevenue: string;
  cancelledRevenueNum: number;
  cancelledRoomNights: string;
  turnedDownRevenue: string;
  turnedDownRevenueNum: number;
  turnedDownRoomNights: string;
  roomNightsOtb: string;
  roomNightsOtbNum: number;
  roomNightsTrend: string;
  occupancyOtb: string;
  occupancyOtbNum: number;
  occupancyTrend: string; // "+4.0 pts vs LY"
  adrOtb: string;
  adrOtbNum: number;
  adrTrend: string;
  leadsPipeline: string;
  leadsPipelineNum: number;
  leadsPipelineTrend: string;
  leadsCount: number;
  cancellationExposure: string;
  cancellationExposureNum: number;
  cancellationTrend: string;
  cancellationTrendUp: boolean;
  strongestDemandPeriod: string;
  weakestDemandPeriod: string;
  forecastRevenue: string;
  forecastRevenueNum: number;
  buckets: ForwardPeriodBucket[];
}

export function getForwardBusinessData(window: ForwardBusinessWindow, propertyIds?: string[]): ForwardBusinessData {
  const days = FORWARD_WINDOW_DAYS[window];
  const fb = getForwardBusiness(propertyIds, days);
  const fw = fb.window;
  const unbooked = Math.max(0, fb.forecastRevenue - fb.otbRevenue);
  const describeBucket = (b: { dateRange: string; occupancyPct: number } | null) =>
    b ? `${b.dateRange} (${fmtPct(b.occupancyPct, 1)} OTB occ)` : '\u2014';

  return {
    timeframe: `NEXT ${days} DAYS (OTB & PIPELINE)`,
    windowDays: days,
    defaultWindow: window,
    revenueOtb: fmtUsd(fb.otbRevenue),
    revenueOtbNum: fb.otbRevenue,
    revenueTrend: `${fmtSignedPct(fb.revenueVsLyPct)} vs LY`,
    definiteRevenue: fmtUsd(fb.definiteRevenue),
    definiteRevenueNum: fb.definiteRevenue,
    definiteRoomNights: `${fmtInt(fb.definiteRoomNights)} RN`,
    definiteRevenuePct: fb.otbRevenue > 0 ? (fb.definiteRevenue / fb.otbRevenue) * 100 : 0,
    definiteTrend: `${fmtSignedPct(fb.revenueVsLyPct + 1.4)} vs LY`,
    verbalDefiniteRevenue: fmtUsd(fb.verbalDefiniteRevenue),
    verbalDefiniteRevenueNum: fb.verbalDefiniteRevenue,
    verbalDefiniteRoomNights: `${fmtInt(fb.verbalDefiniteRoomNights)} RN`,
    verbalDefiniteRevenuePct: fb.otbRevenue > 0 ? (fb.verbalDefiniteRevenue / fb.otbRevenue) * 100 : 0,
    verbalDefiniteTrend: `${fmtSignedPct(fb.revenueVsLyPct - 0.8)} vs LY`,
    tentativeRevenue: fmtUsd(fb.tentativeRevenue),
    tentativeRevenueNum: fb.tentativeRevenue,
    tentativeRoomNights: `${fmtInt(fb.tentativeRoomNights)} RN`,
    tentativeRevenuePct: fb.tentativeSharePct,
    tentativeTrend: `${fmtSignedPct(fb.paceVsLyPct - 1.2)} vs LY`,
    prospectRevenue: fmtUsd(fb.prospectRevenue),
    prospectRevenueNum: fb.prospectRevenue,
    prospectRoomNights: `${fmtInt(fb.prospectRoomNights)} RN`,
    prospectTrend: `${fmtSignedPct(fb.paceVsLyPct + 3.2)} vs LY`,
    postponedRevenue: fmtUsd(fb.postponedRevenue),
    postponedRevenueNum: fb.postponedRevenue,
    postponedRoomNights: `${fmtInt(fb.postponedRoomNights)} RN`,
    cancelledRevenue: fmtUsd(fb.cancelledRevenue),
    cancelledRevenueNum: fb.cancelledRevenue,
    cancelledRoomNights: `${fmtInt(fb.cancelledRoomNights)} RN`,
    turnedDownRevenue: fmtUsd(fb.turnedDownRevenue),
    turnedDownRevenueNum: fb.turnedDownRevenue,
    turnedDownRoomNights: `${fmtInt(fb.turnedDownRoomNights)} RN`,
    roomNightsOtb: fmtInt(fw.otbRoomsSold),
    roomNightsOtbNum: fw.otbRoomsSold,
    roomNightsTrend: `${fmtSignedPct(fb.paceVsLyPct)} vs LY`,
    occupancyOtb: fmtPct(fw.otbOccupancyPct, 1),
    occupancyOtbNum: fw.otbOccupancyPct,
    occupancyTrend: `${fmtSignedPts(fb.occupancyPtsVsLy)} vs LY`,
    adrOtb: fmtUsdFull(fw.adr),
    adrOtbNum: fw.adr,
    adrTrend: `${fmtSignedPct(fb.adrVsLyPct)} vs LY`,
    leadsPipeline: fmtUsd(fb.pipelineRevenue),
    leadsPipelineNum: fb.pipelineRevenue,
    leadsPipelineTrend: `${fmtPct(unbooked > 0 ? (fb.pipelineRevenue / unbooked) * 100 : 0, 0)} of unbooked`,
    leadsCount: fb.leadsCount,
    cancellationExposure: fmtUsd(fb.cancellationExposure),
    cancellationExposureNum: fb.cancellationExposure,
    cancellationTrend: `${fmtPct(fb.otbRevenue > 0 ? (fb.cancellationExposure / fb.otbRevenue) * 100 : 0, 1)} of OTB`,
    cancellationTrendUp: true,
    strongestDemandPeriod: describeBucket(fb.strongest),
    weakestDemandPeriod: describeBucket(fb.weakest),
    forecastRevenue: fmtUsd(fb.forecastRevenue),
    forecastRevenueNum: fb.forecastRevenue,
    buckets: fb.buckets.map((b) => ({
      label: b.label,
      dateRange: b.dateRange,
      revenueFormatted: fmtUsd(b.otbRevenue),
      revenueUsd: b.otbRevenue,
      definiteRevenueUsd: b.definiteRevenue,
      verbalDefiniteRevenueUsd: b.verbalDefiniteRevenue,
      tentativeRevenueUsd: b.tentativeRevenue,
      prospectRevenueUsd: b.prospectRevenue,
      pipelineRevenueUsd: b.pipelineRevenue,
      committedRevenueUsd: b.definiteRevenue,
      roomNights: b.roomNights,
      occupancyPct: b.occupancyPct,
      highlight: b.highlight,
    })),
  };
}

export const simulatedForwardBusinessData: Record<ForwardBusinessWindow, ForwardBusinessData> = {
  '30D': getForwardBusinessData('30D'),
  '90D': getForwardBusinessData('90D'),
  '180D': getForwardBusinessData('180D'),
  '365D': getForwardBusinessData('365D'),
};

/* ============================================================================
 * 6. SOSEI SIGNALS (portfolio intelligence, all amounts from the engine)
 * ========================================================================== */

export type SignalType = 'opportunity' | 'risk' | 'neutral' | 'ai_recommendation';

export interface PortfolioSignalItem {
  id: string;
  title: string;
  description: string;
  timestamp: string; // "Today", "Yesterday"
  signalType: SignalType;
  iconType: 'up_arrow' | 'down_arrow' | 'dash' | 'sparkle';
  impactSummary: string;
  affectedProperties: string[];
  category: 'Demand' | 'Performance' | 'Corporate' | 'Cancellation' | 'Intelligence';
  aiRecommendation?: string;
  isAiAssisted?: boolean;
}

export interface SOSEISignalsData {
  period: PeriodId;
  title: string;
  subtitle: string;
  items: PortfolioSignalItem[];
}

export function getSOSEISignalsData(period: PeriodId = 'mtd', propertyIds?: string[]): SOSEISignalsData {
  const ids = ensureIds(propertyIds);
  const periodShort = PERIOD_DEFS[period].label;
  const items: PortfolioSignalItem[] = [];

  // 1. Strongest forward demand region (OTB pace vs STLY over the next 90 days)
  const regionRows = GEO_MARKET_DEFS.map((def) => {
    const rIds = getPropertyIdsByRegion([def.id]).filter((id) => ids.includes(id));
    return rIds.length > 0 ? { def, rIds, fw: getForwardWindowMetrics(rIds, FORWARD_DEFAULT_DAYS) } : null;
  }).filter((r): r is NonNullable<typeof r> => r !== null);
  if (regionRows.length > 0) {
    const best = [...regionRows].sort((a, b) => b.fw.paceVsLyPct - a.fw.paceVsLyPct)[0];
    const names = getPropertyMetricsList(best.rIds, 'forward').map((p) => p.name);
    items.push({
      id: 'sig_1',
      title: `Demand accelerating in ${best.def.name}`,
      description: `${best.def.name} OTB room nights are ${fmtSignedPct(best.fw.paceVsLyPct)} vs last year across ${names.length} ${pluralize(names.length, 'property', 'properties')}.`,
      timestamp: 'Today',
      signalType: best.fw.paceVsLyPct >= 0 ? 'opportunity' : 'neutral',
      iconType: best.fw.paceVsLyPct >= 0 ? 'up_arrow' : 'dash',
      impactSummary: `${fmtSignedPct(best.fw.paceVsLyPct)} RN Pace vs STLY (next ${FORWARD_DEFAULT_DAYS}D)`,
      affectedProperties: names,
      category: 'Demand',
      isAiAssisted: false,
      aiRecommendation: 'Consider releasing premium villa inventory with a 4-night minimum stay to maximize ADR yield.',
    });
  }

  // 2. Collection furthest ahead of plan for the selected period
  const collections = MASTER_CATEGORIES.map((cat) => {
    const cIds = getPropertyIdsByCategory([cat.id]).filter((id) => ids.includes(id));
    return cIds.length > 0 ? { cat, m: getPortfolioMetrics(cIds, period) } : null;
  }).filter((r): r is NonNullable<typeof r> => r !== null);
  if (collections.length > 0) {
    const best = [...collections].sort((a, b) => b.m.vsBudget.revparPct - a.m.vsBudget.revparPct)[0];
    const ahead = best.m.vsBudget.revparPct >= 0;
    items.push({
      id: 'sig_2',
      title: ahead ? `${best.cat.name} outperforming plan` : `${best.cat.name} closest to plan`,
      description: `RevPAR is ${fmtSignedPct(best.m.vsBudget.revparPct)} vs budget with occupancy ${fmtSignedPts(best.m.vsBudget.occupancyPts)} vs plan (${periodShort}).`,
      timestamp: 'Today',
      signalType: ahead ? 'opportunity' : 'neutral',
      iconType: ahead ? 'up_arrow' : 'dash',
      impactSummary: `${fmtSignedPct(best.m.vsBudget.revparPct)} RevPAR vs Budget (${fmtSignedPts(best.m.vsBudget.occupancyPts)} Occ)`,
      affectedProperties: best.m.properties.map((p) => p.name),
      category: 'Performance',
      isAiAssisted: false,
      aiRecommendation: 'Opportunity to advance concierge package pricing ahead of the peak season for this collection.',
    });
  }

  // 3. Weakest forward booking pace
  const propPace = ids.map((id) => ({ id, fw: getForwardWindowMetrics([id], FORWARD_DEFAULT_DAYS) }));
  if (propPace.length > 0) {
    const worst = [...propPace].sort((a, b) => a.fw.paceVsLyPct - b.fw.paceVsLyPct)[0];
    const worstName = getPropertyMetrics(worst.id, 'forward').name;
    const soft = worst.fw.paceVsLyPct < 0;
    items.push({
      id: 'sig_3',
      title: soft ? `Demand softening at ${worstName}` : `Slowest booking pace: ${worstName}`,
      description: `OTB room nights are ${fmtSignedPct(worst.fw.paceVsLyPct)} vs last year with ${fmtPct(worst.fw.otbOccupancyPct, 1)} occupancy on the books.`,
      timestamp: 'Yesterday',
      signalType: soft ? 'risk' : 'neutral',
      iconType: soft ? 'down_arrow' : 'dash',
      impactSummary: `${fmtSignedPct(worst.fw.paceVsLyPct)} RN Pace vs STLY (next ${FORWARD_DEFAULT_DAYS}D)`,
      affectedProperties: [worstName],
      category: 'Demand',
      isAiAssisted: false,
      aiRecommendation: 'Activate relationship intelligence with feeder partners for midweek retreats and shoulder-date offers.',
    });
  }

  // 4. Cancellation exposure on the books
  const fb = getForwardBusiness(ids, FORWARD_DEFAULT_DAYS);
  const topExposure = [...fb.window.properties]
    .sort((a, b) => b.otbTotalRevenue - a.otbTotalRevenue)
    .slice(0, 3)
    .map((p) => getPropertyMetrics(p.propertyId, 'forward').name);
  items.push({
    id: 'sig_4',
    title: 'Increased cancellation exposure',
    description: `${fmtUsd(fb.cancellationExposure)} of on-the-books revenue falls within high-risk cancellation windows.`,
    timestamp: 'Yesterday',
    signalType: 'neutral',
    iconType: 'dash',
    impactSummary: `${fmtUsd(fb.cancellationExposure)} Revenue in Flexible/Non-Guaranteed Window`,
    affectedProperties: topExposure,
    category: 'Cancellation',
    isAiAssisted: false,
    aiRecommendation: 'Engage Butler Concierge for personalized pre-arrival itinerary confirmations to lock in deposits.',
  });

  return {
    period,
    title: 'SOSEI SIGNALS',
    subtitle: `KEY INSIGHTS \u00B7 ${PERIOD_DEFS[period].periodLabel}`,
    items,
  };
}

export const simulatedSOSEISignalsData: SOSEISignalsData = getSOSEISignalsData('mtd');

/* ============================================================================
 * 7. PORTFOLIO COMPARISON (collections + properties, targets = budget snapshot)
 * ========================================================================== */

export interface PortfolioComparisonItem {
  id: string;
  property: string;
  location: string;
  occupancy: string;
  occupancyNum: number;
  adrFormatted: string;
  adrNum: number;
  revparFormatted: string;
  revparNum: number;
  roomRevenueFormatted: string;
  /** Real USD. */
  roomRevenueNum: number;
  totalRevenueFormatted: string;
  /** Real USD. */
  totalRevenueNum: number;
  growthVsLy: string;
  growthVsLyNum: number;
  growthVsLyUp: boolean;
  vsBudget: string;
  vsBudgetNum: number;
  vsBudgetUp: boolean;
  /** Occupancy gap vs budget in percentage points. */
  occVsBudgetPts: number;
  status: 'above_plan' | 'on_plan' | 'attention';
  propertyRoute?: string;
  /** Properties of a collection row. */
  children?: PortfolioComparisonItem[];
}

export interface PortfolioComparisonData {
  period: PeriodId;
  title: string;
  subtitle: string;
  /** One row per collection. */
  items: PortfolioComparisonItem[];
  /** Every property (flat). Sum of totals == `total` == KPI total revenue. */
  properties: PortfolioComparisonItem[];
  /** Portfolio total row. */
  total: PortfolioComparisonItem;
}

type ComparisonSource = Pick<
  PortfolioMetrics,
  'occupancyPct' | 'adr' | 'revpar' | 'roomRevenue' | 'totalRevenue' | 'vsLy' | 'vsBudget'
>;

const statusFromBudget = (m: ComparisonSource): PortfolioComparisonItem['status'] =>
  m.vsBudget.revparPct >= 2 ? 'above_plan' : m.vsBudget.revparPct < 0 ? 'attention' : 'on_plan';

function comparisonRow(
  id: string,
  property: string,
  location: string,
  m: ComparisonSource,
  status: PortfolioComparisonItem['status'],
  route?: string
): PortfolioComparisonItem {
  return {
    id,
    property,
    location,
    occupancy: fmtPct(m.occupancyPct, 1),
    occupancyNum: m.occupancyPct,
    adrFormatted: fmtUsdFull(m.adr),
    adrNum: m.adr,
    revparFormatted: fmtUsdFull(m.revpar),
    revparNum: m.revpar,
    roomRevenueFormatted: fmtUsd(m.roomRevenue),
    roomRevenueNum: m.roomRevenue,
    totalRevenueFormatted: fmtUsd(m.totalRevenue),
    totalRevenueNum: m.totalRevenue,
    growthVsLy: fmtSignedPct(m.vsLy.totalRevenuePct),
    growthVsLyNum: m.vsLy.totalRevenuePct,
    growthVsLyUp: m.vsLy.totalRevenuePct >= 0,
    vsBudget: fmtSignedPct(m.vsBudget.totalRevenuePct),
    vsBudgetNum: m.vsBudget.totalRevenuePct,
    vsBudgetUp: m.vsBudget.totalRevenuePct >= 0,
    occVsBudgetPts: m.vsBudget.occupancyPts,
    status,
    propertyRoute: route,
  };
}

export function getPortfolioComparisonData(period: PeriodId = 'mtd', propertyIds?: string[]): PortfolioComparisonData {
  const selected = propertyIds && propertyIds.length > 0 ? propertyIds : null;
  const all = getPortfolioMetrics(propertyIds, period);

  const properties = all.properties.map((p) =>
    comparisonRow(p.propertyId, p.name, p.location, p, p.status, `/dashboard/property?id=${p.propertyId}`)
  );

  const items: PortfolioComparisonItem[] = [];
  MASTER_CATEGORIES.forEach((cat) => {
    const ids = getPropertyIdsByCategory([cat.id]).filter((id) => !selected || selected.includes(id));
    if (ids.length === 0) return;
    const m = getPortfolioMetrics(ids, period);
    const row = comparisonRow(
      cat.id,
      cat.name,
      formatCollectionLocation(m.properties),
      m,
      statusFromBudget(m),
      `/dashboard/property?id=${cat.id}`
    );
    row.children = properties.filter((p) => ids.includes(p.id));
    items.push(row);
  });

  return {
    period,
    title: 'PORTFOLIO COMPARISON',
    subtitle: `PERFORMANCE BY COLLECTION \u00B7 ${PERIOD_DEFS[period].periodLabel}`,
    items,
    properties,
    total: comparisonRow('portfolio', 'SOSEI Portfolio', `${all.propertyCount} properties`, all, statusFromBudget(all)),
  };
}

export const simulatedPortfolioComparisonData: PortfolioComparisonData = getPortfolioComparisonData('mtd');

/* ============================================================================
 * 8. GEO MARKET & MARKET SEGMENT (room nights + room revenue split with shared share tables)
 * ========================================================================== */

export interface GeoMarketItem {
  id: string;
  market: string;
  roomNights: number;
  roomNightsPct: number;
  /** Compact room nights ("6.7K"). */
  roomNightsFormatted: string;
  roomNightsPctFormatted: string;
  adrUsd: number;
  adrFormatted: string;
  /** Room revenue in USD millions (real value / 1e6). */
  revenueUsdMillions: number;
  /** Room revenue in real USD. */
  revenueUsd: number;
  revenueFormatted: string;
  revenuePct: number;
  vsLyPct: number;
  vsLyFormatted: string;
  isPositive: boolean;
  feederCountries: string[];
  keyHubs: string;
}

export interface GeoMarketData {
  period: PeriodId;
  title: string;
  subtitle: string;
  question: string;
  /** Room revenue of the selection (== Room Revenue KPI card). */
  totalRevenue: string;
  totalRoomNights: number;
  items: GeoMarketItem[];
}

const vsLyText = (pct: number) => `${arrow(pct >= 0)} ${fmtSignedPct(pct)}`;

export function getGeoMarketData(period: PeriodId = 'mtd', propertyIds?: string[]): GeoMarketData {
  const m = getPortfolioMetrics(propertyIds, period);
  const rows = splitMarkets(m, GEO_MARKET_DEFS);
  return {
    period,
    title: 'GEO MARKET',
    subtitle: `Regional Feeder Market Distribution \u00B7 ${PERIOD_DEFS[period].periodLabel}`,
    question: 'Where is demand coming from?',
    totalRevenue: fmtUsd(m.roomRevenue),
    totalRoomNights: m.roomsSold,
    items: rows.map((r) => ({
      id: r.def.id,
      market: r.def.name,
      roomNights: r.roomNights,
      roomNightsPct: r.roomNightsSharePct,
      roomNightsFormatted: fmtCompactInt(r.roomNights),
      roomNightsPctFormatted: fmtPct(r.roomNightsSharePct, 0),
      adrUsd: r.adr,
      adrFormatted: fmtUsdFull(r.adr),
      revenueUsdMillions: r.roomRevenue / 1_000_000,
      revenueUsd: r.roomRevenue,
      revenueFormatted: fmtUsd(r.roomRevenue),
      revenuePct: r.roomRevenueSharePct,
      vsLyPct: r.vsLyPct,
      vsLyFormatted: vsLyText(r.vsLyPct),
      isPositive: r.vsLyPct >= 0,
      feederCountries: r.def.feederCountries,
      keyHubs: r.def.keyHubs,
    })),
  };
}

export const simulatedGeoMarketData: GeoMarketData = getGeoMarketData('mtd');

export interface MarketSegmentItem {
  id: string;
  segment: string;
  roomNights: number;
  roomNightsPct: number;
  roomNightsFormatted: string;
  roomNightsPctFormatted: string;
  adrUsd: number;
  adrFormatted: string;
  revenueUsdMillions: number;
  revenueUsd: number;
  revenueFormatted: string;
  revenuePct: number;
  vsLyPct: number;
  vsLyFormatted: string;
  isPositive: boolean;
  description: string;
  avgLeadTimeDays: number;
  cancellationRisk: 'Low' | 'Medium' | 'High';
}

export interface MarketSegmentData {
  period: PeriodId;
  title: string;
  subtitle: string;
  question: string;
  totalRevenue: string;
  totalRoomNights: number;
  items: MarketSegmentItem[];
}

export function getMarketSegmentData(period: PeriodId = 'mtd', propertyIds?: string[]): MarketSegmentData {
  const m = getPortfolioMetrics(propertyIds, period);
  const rows = splitMarkets(m, SEGMENT_DEFS);
  return {
    period,
    title: 'MARKET SEGMENT',
    subtitle: `Guest Demand & Guest Type Composition \u00B7 ${PERIOD_DEFS[period].periodLabel}`,
    question: 'What kind of demand are we attracting?',
    totalRevenue: fmtUsd(m.roomRevenue),
    totalRoomNights: m.roomsSold,
    items: rows.map((r) => ({
      id: r.def.id,
      segment: r.def.name,
      roomNights: r.roomNights,
      roomNightsPct: r.roomNightsSharePct,
      roomNightsFormatted: fmtCompactInt(r.roomNights),
      roomNightsPctFormatted: fmtPct(r.roomNightsSharePct, 0),
      adrUsd: r.adr,
      adrFormatted: fmtUsdFull(r.adr),
      revenueUsdMillions: r.roomRevenue / 1_000_000,
      revenueUsd: r.roomRevenue,
      revenueFormatted: fmtUsd(r.roomRevenue),
      revenuePct: r.roomRevenueSharePct,
      vsLyPct: r.vsLyPct,
      vsLyFormatted: vsLyText(r.vsLyPct),
      isPositive: r.vsLyPct >= 0,
      description: r.def.description,
      avgLeadTimeDays: r.def.avgLeadTimeDays,
      cancellationRisk: r.def.cancellationRisk,
    })),
  };
}

export const simulatedMarketSegmentData: MarketSegmentData = getMarketSegmentData('mtd');
