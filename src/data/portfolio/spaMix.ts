import { getForwardWindowMetrics, getPortfolioMetrics, getPropertyMetrics } from './engine';
import type { PortfolioMetrics } from './engine';
import { PERIOD_DEFS, SYSTEM_DATE_ISO } from './periods';
import type { PeriodId } from './periods';
import { WELLNESS_SHARE_OF_SPA, splitByShares } from './mix';
import type { ShareDef } from './mix';
import { PROPERTY_PROFILES } from './propertyProfiles';
import { MASTER_PROPERTIES } from '@/constants/categories';
import type { RegionId } from '@/constants/regions';

/**
 * SPA DOMAIN LAYER - everything the Spa dashboard and its drawers show is derived here from the portfolio engine.
 *
 *   Spa & Wellness revenue   = engine spaRevenue  (== Hospitality "Spa" + "Wellness / Medical" pillars)
 *   Wellness / Medical       = getHospitalityRevenuePillars().wellness  (WELLNESS_SHARE_OF_SPA)
 *   treatments               = engine spa.treatments
 *   therapist hours          = treatments x service duration (category mix)
 *   therapist capacity       = roster x productive hours x days, roster sized once from YTD demand
 *
 * Only ratios / unit assumptions live in this file; every absolute number is computed from engine values,
 * and every table is produced with splitByShares so it adds up to the headline above it.
 */

/* ───────────────────────── MODEL ASSUMPTIONS (ratios only) ───────────────────────── */

/** Billable (productive) hours one therapist can deliver per day. */
export const SPA_PRODUCTIVE_HOURS_PER_THERAPIST_DAY = 8;
/** Roster per property is sized so that YTD utilisation lands on this level. */
export const SPA_TARGET_YTD_UTILISATION = 0.72;
/** Treatments an average spa guest books per stay. */
export const SPA_TREATMENTS_PER_SPA_GUEST = 2.4;
/** Share of spa & wellness revenue sold through packages / memberships. */
export const SPA_PACKAGE_SHARE_OF_SPA_REVENUE = 0.16;
/** Cancellations + no-shows as % of booked appointments. */
export const SPA_CANCEL_NOSHOW_PCT = 3.2;
/** Status mix of today's appointments at the time of viewing. */
export const SPA_TODAY_STATUS_SHARES: ShareDef[] = [
  { id: 'completed', name: 'Completed', share: 55 },
  { id: 'inProgress', name: 'In Progress', share: 15 },
  { id: 'scheduled', name: 'Scheduled', share: 30 },
];

interface SpaTreatmentItemDef {
  id: string;
  name: string;
  /** Share of the category's treatments, %. */
  share: number;
  /** Ticket relative to the category average (1 = average). */
  ticketIndex: number;
  /** Guest rating offset vs the portfolio experience score. */
  ratingOffset: number;
}

interface SpaCategoryDef {
  id: string;
  name: string;
  /** Share of all treatments, %. */
  volumeShare: number;
  /** Therapist hours per treatment. */
  hoursPerTreatment: number;
  items: SpaTreatmentItemDef[];
}

/** Service categories: treatment volume, duration and menu. Wellness / Medical carries the WELLNESS_SHARE_OF_SPA revenue. */
export const SPA_SERVICE_CATEGORIES: SpaCategoryDef[] = [
  {
    id: 'massage', name: 'Holistic Massages', volumeShare: 34, hoursPerTreatment: 1.25,
    items: [
      { id: 'deep', name: 'Deep Tissue Recovery Massage', share: 34, ticketIndex: 1.0, ratingOffset: 0.05 },
      { id: 'aroma', name: 'Aromatherapy Sanctuary Massage', share: 28, ticketIndex: 1.0, ratingOffset: -0.02 },
      { id: 'stone', name: 'Thermal Hot Stone Therapy', share: 20, ticketIndex: 1.15, ratingOffset: 0.02 },
      { id: 'couples', name: 'Couples Sanctuary Retreat', share: 10, ticketIndex: 1.7, ratingOffset: 0.12 },
      { id: 'prenatal', name: 'Prenatal Restorative Therapy', share: 8, ticketIndex: 0.95, ratingOffset: 0.08 },
    ],
  },
  {
    id: 'facial', name: 'Advanced Facials', volumeShare: 16, hoursPerTreatment: 1.0,
    items: [
      { id: 'cellular', name: 'Signature Cellular Facial', share: 60, ticketIndex: 1.0, ratingOffset: 0.1 },
      { id: 'gold', name: 'Radiance Gold Facial', share: 40, ticketIndex: 1.3, ratingOffset: 0.05 },
    ],
  },
  {
    id: 'body', name: 'Body Wraps & Scrubs', volumeShare: 14, hoursPerTreatment: 1.25,
    items: [
      { id: 'detox', name: 'Alpine Detox Herbal Wrap', share: 40, ticketIndex: 1.1, ratingOffset: -0.12 },
      { id: 'salt', name: 'Himalayan Salt Glow Scrub', share: 35, ticketIndex: 0.9, ratingOffset: -0.05 },
      { id: 'seaweed', name: 'Seaweed Contour Wrap', share: 25, ticketIndex: 1.0, ratingOffset: -0.08 },
    ],
  },
  {
    id: 'thermal', name: 'Thermal & Hydro Rituals', volumeShare: 14, hoursPerTreatment: 0.75,
    items: [
      { id: 'onsen', name: 'Onsen & Hydro Circuit', share: 50, ticketIndex: 1.0, ratingOffset: 0.0 },
      { id: 'hammam', name: 'Hammam Ritual', share: 30, ticketIndex: 1.2, ratingOffset: 0.03 },
      { id: 'contrast', name: 'Ice & Sauna Contrast', share: 20, ticketIndex: 0.8, ratingOffset: -0.06 },
    ],
  },
  {
    id: 'wellness', name: 'Wellness & Medical', volumeShare: 22, hoursPerTreatment: 1.5,
    items: [
      { id: 'sound', name: 'Tibetan Sound Healing Session', share: 30, ticketIndex: 0.7, ratingOffset: 0.13 },
      { id: 'longevity', name: 'Longevity Diagnostics Consultation', share: 25, ticketIndex: 1.4, ratingOffset: 0.08 },
      { id: 'iv', name: 'IV Vitality Therapy', share: 20, ticketIndex: 1.2, ratingOffset: 0.02 },
      { id: 'reflex', name: 'Acupressure & Reflexology', share: 25, ticketIndex: 0.7, ratingOffset: -0.15 },
    ],
  },
];

/** Split of the SPA pillar (spa & wellness revenue minus the Wellness / Medical pillar) by revenue stream. */
export const SPA_PILLAR_REVENUE_SHARES: ShareDef[] = [
  { id: 'massage', name: 'Holistic Massages', share: 40 },
  { id: 'facial', name: 'Advanced Facials', share: 17 },
  { id: 'body', name: 'Body Wraps & Scrubs', share: 14 },
  { id: 'thermal', name: 'Thermal & Hydro Rituals', share: 15 },
  { id: 'retail', name: 'Retail & Take-Home', share: 14 },
];

/** Retail range: revenue share and unit price (price point, not a period fact). */
export const SPA_RETAIL_PRODUCTS: Array<ShareDef & { unitPrice: number }> = [
  { id: 'elixir', name: 'SOSEI Botanical Signature Elixir', share: 28, unitPrice: 78.5 },
  { id: 'balm', name: 'Calm & Restore Night Balm', share: 19, unitPrice: 41.95 },
  { id: 'soak', name: 'Himalayan Pink Mineral Soak', share: 15, unitPrice: 30 },
  { id: 'pillow', name: 'SOSEI Mulberry Silk Eye Pillow', share: 12, unitPrice: 45.2 },
  { id: 'other', name: 'Other Retail', share: 26, unitPrice: 52 },
];

/** Packages & memberships: share of package revenue, sessions bundled, discount, and share still active (held) after purchase. */
export const SPA_PACKAGE_TIERS: Array<ShareDef & { sessions: number; discountPct: number; holdFactor: number }> = [
  { id: 'elite', name: 'Wellness Elite Sanctuary Club', share: 38, sessions: 24, discountPct: 20, holdFactor: 0.9 },
  { id: 'immersion', name: 'Signature Immersion (10 Sessions)', share: 40, sessions: 10, discountPct: 12, holdFactor: 0.35 },
  { id: 'escape', name: 'Half-Day Escape Wellness Package', share: 22, sessions: 3, discountPct: 5, holdFactor: 0.12 },
];

/** Capacity share and load index per spa zone (capacity-weighted load index = 1.00). */
export const SPA_AREAS: Array<{ id: string; name: string; capacityWeight: number; loadIndex: number }> = [
  { id: 'suites', name: 'Treatment Rooms', capacityWeight: 48, loadIndex: 1.12 },
  { id: 'hydro', name: 'Hydro Facilities', capacityWeight: 20, loadIndex: 0.95 },
  { id: 'lounge', name: 'Relaxation Lounge', capacityWeight: 18, loadIndex: 0.92 },
  { id: 'studio', name: 'Movement Studio', capacityWeight: 8, loadIndex: 0.68 },
  { id: 'consultation', name: 'Wellness Consultation', capacityWeight: 6, loadIndex: 0.58 },
];

/** Share of weekly treatments per weekday, % (Mon..Sun, sums to 100). */
export const SPA_WEEKDAY_SHARES: ShareDef[] = [
  { id: 'Mon', name: 'Mon', share: 12.5 },
  { id: 'Tue', name: 'Tue', share: 12.8 },
  { id: 'Wed', name: 'Wed', share: 13.2 },
  { id: 'Thu', name: 'Thu', share: 14.2 },
  { id: 'Fri', name: 'Fri', share: 15.8 },
  { id: 'Sat', name: 'Sat', share: 17.2 },
  { id: 'Sun', name: 'Sun', share: 14.3 },
];

/** Share of a day's treatments per 3-hour block, % (sums to 100). */
export const SPA_HOUR_BLOCKS: Array<ShareDef & { window: string }> = [
  { id: '6am', name: '6 AM', window: '6:00 AM - 9:00 AM', share: 6 },
  { id: '9am', name: '9 AM', window: '9:00 AM - 12:00 PM', share: 17 },
  { id: '12pm', name: '12 PM', window: '12:00 PM - 3:00 PM', share: 21 },
  { id: '3pm', name: '3 PM', window: '3:00 PM - 6:00 PM', share: 26 },
  { id: '6pm', name: '6 PM', window: '6:00 PM - 9:00 PM', share: 22 },
  { id: '9pm', name: '9 PM', window: '9:00 PM - 12:00 AM', share: 8 },
];

/** Which block peaks on each weekday (Sun..Sat as returned by Date.getUTCDay()). */
const PEAK_BLOCK_BY_UTC_DAY = ['12pm', '3pm', '3pm', '3pm', '3pm', '3pm', '12pm'];

/** Experience score sub-ratings: offset vs the overall score. */
export const SPA_EXPERIENCE_SUBS: Array<{ id: string; label: string; offset: number }> = [
  { id: 'quality', label: 'Treatment Quality', offset: 0.1 },
  { id: 'therapist', label: 'Therapist Experience', offset: 0 },
  { id: 'facilities', label: 'Facilities & Ambience', offset: -0.1 },
  { id: 'booking', label: 'Booking Experience', offset: 0 },
];

/** Projected daily utilisation thresholds for the demand level (%). */
export const SPA_PEAK_HIGH_UTIL_PCT = 80;
export const SPA_PEAK_MEDIUM_UTIL_PCT = 65;

/** Therapist hours per treatment across the whole menu (derived from the category table). */
export const SPA_AVG_HOURS_PER_TREATMENT =
  SPA_SERVICE_CATEGORIES.reduce((a, c) => a + (c.volumeShare * c.hoursPerTreatment) / 100, 0) /
  (SPA_SERVICE_CATEGORIES.reduce((a, c) => a + c.volumeShare, 0) / 100);

/* ───────────────────────── TYPES ───────────────────────── */

export interface SpaPropertyRow {
  propertyId: string;
  name: string;
  location: string;
  img: string;
  regionId: RegionId;
  treatments: number;
  revenue: number;
  sharePct: number;
  vsLyPct: number;
  avgTreatment: number;
  revenuePerRoomNight: number;
  treatmentsPer100RoomNights: number;
  roomsSold: number;
  therapists: number;
  hours: number;
  capacityHours: number;
  utilisationPct: number;
}

export interface SpaRegionRow {
  id: RegionId;
  name: string;
  revenue: number;
  treatments: number;
  sharePct: number;
  vsLyPct: number;
  propertyCount: number;
}

export interface SpaTreatmentRow {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  treatments: number;
  revenue: number;
  avgTicket: number;
  rating: number;
}

export interface SpaCategoryRow {
  id: string;
  name: string;
  kind: 'service' | 'retail';
  treatments: number;
  revenue: number;
  revenueSharePct: number;
  avgTicket: number;
  hours: number;
  items: SpaTreatmentRow[];
}

export interface SpaRetailRow {
  id: string;
  name: string;
  revenue: number;
  units: number;
  unitPrice: number;
  sharePct: number;
}

export interface SpaPackageTierRow {
  id: string;
  name: string;
  revenue: number;
  sold: number;
  price: number;
  sessions: number;
  activeMembers: number;
}

export interface SpaAreaRow {
  id: string;
  name: string;
  capacityPerDay: number;
  capacityHours: number;
  utilisedHours: number;
  utilisationPct: number;
}

export interface SpaPipelineRow {
  id: string;
  name: string;
  value: number;
}

export interface SpaHeatCell {
  level: 1 | 2 | 3 | 4 | 5;
  sharePct: number;
  treatmentsPerWeek: number;
}

export interface SpaPeakRow {
  dateLabel: string;
  window: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  projectedUtilisationPct: number;
  preBookedPct: number;
  therapistsRequired: number;
  roster: number;
}

export interface SpaDashboardData {
  period: PeriodId;
  periodLabel: string;
  days: number;
  isForward: boolean;
  propertyCount: number;
  propertyIds: string[];

  revenue: number;
  vsLyPct: number;
  vsLyAbs: number;
  vsBudgetPct: number;
  vsForecastPct: number;
  vsLyTreatmentsPct: number;
  vsBudgetTreatmentsPct: number;
  vsForecastTreatmentsPct: number;
  vsLyAvgTreatmentPct: number;
  vsBudgetAvgTreatmentPct: number;
  vsForecastAvgTreatmentPct: number;
  vsLyUtilisationPts: number;
  vsBudgetUtilisationPts: number;
  vsForecastUtilisationPts: number;
  vsLyHoursPct: number;
  vsBudgetHoursPct: number;
  vsForecastHoursPct: number;
  vsLyRetailPct: number;
  vsBudgetRetailPct: number;
  vsForecastRetailPct: number;
  /** Hospitality "Spa" pillar. */
  spaPillarRevenue: number;
  /** Hospitality "Wellness / Medical" pillar. */
  wellnessRevenue: number;

  treatments: number;
  avgRevenuePerTreatment: number;
  roomsSold: number;
  stays: number;
  revenuePerRoomNight: number;
  treatmentsPer100RoomNights: number;
  spaGuests: number;
  attachmentPct: number;

  hours: number;
  capacityHours: number;
  therapists: number;
  utilisationPct: number;

  properties: SpaPropertyRow[];
  regions: SpaRegionRow[];
  categories: SpaCategoryRow[];
  treatmentsRanked: SpaTreatmentRow[];
  retail: { revenue: number; sharePct: number; units: number; products: SpaRetailRow[] };
  packages: { revenue: number; sold: number; activeMembers: number; tiers: SpaPackageTierRow[] };
  areas: SpaAreaRow[];
  pipeline: { total: number; rows: SpaPipelineRow[] };
  heatmap: {
    days: string[];
    blocks: Array<{ label: string; window: string; sharePct: number }>;
    cells: SpaHeatCell[][];
    peakBlockLabel: string;
    peakBlockWindow: string;
    peakBlockSharePct: number;
  };
  trend: Array<{ name: string; value: number; lyValue: number }>;
  monthlyTrend: Array<{ name: string; thisYear: number; lastYear: number }>;
  peaks: SpaPeakRow[];
  experience: { score: number; subs: Array<{ id: string; label: string; value: number }> };
  /** Next-90-day spa revenue on the books vs the forecast. */
  forwardCoverage: { otbRevenue: number; forecastRevenue: number; coveragePct: number };
}

/* ───────────────────────── HELPERS ───────────────────────── */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const ratioPct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function systemDatePlus(offsetDays: number): Date {
  const d = new Date(`${SYSTEM_DATE_ISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d;
}

const weekdayShareOf = (utcDay: number) => SPA_WEEKDAY_SHARES[(utcDay + 6) % 7].share;
const weekdayIndexOf = (utcDay: number) => weekdayShareOf(utcDay) / (100 / SPA_WEEKDAY_SHARES.length);

const rosterCache = new Map<string, number>();
/** Therapists on the roster of a property, sized once from its YTD demand (independent of the selected period). */
export function getSpaTherapistRoster(propertyId: string): number {
  const cached = rosterCache.get(propertyId);
  if (cached !== undefined) return cached;
  const ytd = getPropertyMetrics(propertyId, 'ytd');
  const hours = ytd.spa.treatments * SPA_AVG_HOURS_PER_TREATMENT;
  const need = hours / (PERIOD_DEFS.ytd.days * SPA_PRODUCTIVE_HOURS_PER_THERAPIST_DAY * SPA_TARGET_YTD_UTILISATION);
  const roster = Math.max(2, Math.ceil(need));
  rosterCache.set(propertyId, roster);
  return roster;
}

const hoursOf = (treatments: number) => Math.round(treatments * SPA_AVG_HOURS_PER_TREATMENT);

interface PackageResult {
  revenue: number;
  sold: number;
  tiers: SpaPackageTierRow[];
}

function computePackages(m: PortfolioMetrics): PackageResult {
  const revenue = Math.round(m.spaRevenue * SPA_PACKAGE_SHARE_OF_SPA_REVENUE);
  const split = splitByShares(revenue, SPA_PACKAGE_TIERS);
  const tiers = split.map((t, i) => {
    const def = SPA_PACKAGE_TIERS[i];
    const price = m.spa.avgTreatmentUsd * def.sessions * (1 - def.discountPct / 100);
    const sold = price > 0 ? Math.round(t.value / price) : 0;
    return {
      id: t.id,
      name: t.name,
      revenue: t.value,
      sold,
      price,
      sessions: def.sessions,
      activeMembers: 0,
    };
  });
  return { revenue, sold: tiers.reduce((a, t) => a + t.sold, 0), tiers };
}

function forecastSpa(ids: string[], windowDays: number) {
  const w = getForwardWindowMetrics(ids, windowDays);
  let revenue = 0;
  let treatments = 0;
  for (const p of w.properties) {
    const profile = PROPERTY_PROFILES[p.propertyId];
    const rev = Math.round(p.forecastRoomRevenue * profile.spaPct);
    revenue += rev;
    treatments += Math.round(rev / profile.spa.avgTreatmentUsd);
  }
  const otbRevenue = w.properties.reduce((a, p) => a + p.otbSpaRevenue, 0);
  return { revenue, treatments, otbRevenue };
}

/* ───────────────────────── MAIN ───────────────────────── */

/**
 * Every Spa dashboard / drawer number for a period and property selection.
 * Same inputs => same numbers on the page and in every drawer.
 */
export function getSpaDashboardData(propertyIds: string[] | undefined, period: PeriodId): SpaDashboardData {
  const m = getPortfolioMetrics(propertyIds, period);
  const ids = m.propertyIds;
  const days = m.days;

  /* headline */
  const wellnessRevenue = Math.round(m.spaRevenue * WELLNESS_SHARE_OF_SPA);
  const spaPillarRevenue = m.spaRevenue - wellnessRevenue;

  const treatments = m.spa.treatments;
  const spaGuests = Math.round(treatments / SPA_TREATMENTS_PER_SPA_GUEST);

  /* per-property */
  const propertyRows: SpaPropertyRow[] = m.properties.map((p) => {
    const roster = getSpaTherapistRoster(p.propertyId);
    const hours = hoursOf(p.spa.treatments);
    const capacityHours = roster * SPA_PRODUCTIVE_HOURS_PER_THERAPIST_DAY * days;
    const masterProp = MASTER_PROPERTIES.find((mp) => mp.id === p.propertyId);
    const profile = PROPERTY_PROFILES[p.propertyId];
    return {
      propertyId: p.propertyId,
      name: p.name,
      location: p.location,
      img: masterProp?.img ?? '',
      regionId: profile?.regionId ?? 'europe',
      treatments: p.spa.treatments,
      revenue: p.spaRevenue,
      sharePct: ratioPct(p.spaRevenue, m.spaRevenue),
      vsLyPct: p.vsLy.spaRevenuePct,
      avgTreatment: p.spa.treatments > 0 ? p.spaRevenue / p.spa.treatments : 0,
      revenuePerRoomNight: p.roomsSold > 0 ? p.spaRevenue / p.roomsSold : 0,
      treatmentsPer100RoomNights: p.spa.treatmentsPer100RoomNights,
      roomsSold: p.roomsSold,
      therapists: roster,
      hours,
      capacityHours,
      utilisationPct: ratioPct(hours, capacityHours),
    };
  });

  const REGION_META: Array<{ id: RegionId; name: string }> = [
    { id: 'europe', name: 'Europe' },
    { id: 'asia-pacific', name: 'Asia Pacific' },
    { id: 'middle-east', name: 'Middle East' },
    { id: 'america', name: 'Americas' },
    { id: 'africa', name: 'Africa' },
  ];

  const regions: SpaRegionRow[] = REGION_META.map((reg) => {
    const regProps = propertyRows.filter((p) => p.regionId === reg.id);
    const regRev = regProps.reduce((a, p) => a + p.revenue, 0);
    const regTreatments = regProps.reduce((a, p) => a + p.treatments, 0);
    const weightedLy = regProps.reduce((a, p) => a + p.revenue * p.vsLyPct, 0);
    return {
      id: reg.id,
      name: reg.name,
      revenue: regRev,
      treatments: regTreatments,
      sharePct: ratioPct(regRev, m.spaRevenue),
      vsLyPct: regRev > 0 ? weightedLy / regRev : 0,
      propertyCount: regProps.length,
    };
  }).filter((r) => r.propertyCount > 0);

  const hours = propertyRows.reduce((a, p) => a + p.hours, 0);
  const therapists = propertyRows.reduce((a, p) => a + p.therapists, 0);
  const capacityHours = propertyRows.reduce((a, p) => a + p.capacityHours, 0);
  const capacityPerDay = therapists * SPA_PRODUCTIVE_HOURS_PER_THERAPIST_DAY;
  const utilisationPct = ratioPct(hours, capacityHours);

  /* KPI deltas (vs LY, vs Budget, vs Forecast) derived consistently from engine m.vsLy / m.vsBudget / m.vsForecast */
  const vsLyPct = m.vsLy.spaRevenuePct;
  const vsBudgetPct = m.vsBudget.spaRevenuePct;
  const vsForecastPct = m.vsForecast.spaRevenuePct;

  const vsLyAvgTreatmentPct = m.vsLy.adrPct * 0.45;
  const vsBudgetAvgTreatmentPct = m.vsBudget.adrPct * 0.45;
  const vsForecastAvgTreatmentPct = m.vsForecast.adrPct * 0.45;

  const vsLyTreatmentsPct = ((1 + vsLyPct / 100) / (1 + vsLyAvgTreatmentPct / 100) - 1) * 100;
  const vsBudgetTreatmentsPct = ((1 + vsBudgetPct / 100) / (1 + vsBudgetAvgTreatmentPct / 100) - 1) * 100;
  const vsForecastTreatmentsPct = ((1 + vsForecastPct / 100) / (1 + vsForecastAvgTreatmentPct / 100) - 1) * 100;

  const vsLyHoursPct = vsLyTreatmentsPct;
  const vsBudgetHoursPct = vsBudgetTreatmentsPct;
  const vsForecastHoursPct = vsForecastTreatmentsPct;

  const vsLyUtilisationPts = utilisationPct * (1 - 1 / (1 + vsLyTreatmentsPct / 100));
  const vsBudgetUtilisationPts = utilisationPct * (1 - 1 / (1 + vsBudgetTreatmentsPct / 100));
  const vsForecastUtilisationPts = utilisationPct * (1 - 1 / (1 + vsForecastTreatmentsPct / 100));

  const vsLyRetailPct = vsLyPct * 1.18;
  const vsBudgetRetailPct = vsBudgetPct * 1.18;
  const vsForecastRetailPct = vsForecastPct * 1.18;

  /* experience score (treatment-weighted guest quality) */
  const qualityWeighted = m.properties.reduce((a, p) => a + p.experiences.qualityPct * p.spa.treatments, 0);
  const score = treatments > 0 ? (qualityWeighted / treatments / 100) * 5 : 0;
  const experience = {
    score,
    subs: SPA_EXPERIENCE_SUBS.map((s) => ({ id: s.id, label: s.label, value: clamp(score + s.offset, 0, 5) })),
  };

  /* revenue by category: spa pillar split by stream + Wellness / Medical pillar (== Hospitality pillars) */
  const pillarSplit = splitByShares(spaPillarRevenue, SPA_PILLAR_REVENUE_SHARES);
  const pillarRevenue = (id: string) => pillarSplit.find((s) => s.id === id)?.value ?? 0;
  const volumeSplit = splitByShares(
    treatments,
    SPA_SERVICE_CATEGORIES.map((c) => ({ id: c.id, name: c.name, share: c.volumeShare }))
  );
  const hourSplit = splitByShares(
    hours,
    SPA_SERVICE_CATEGORIES.map((c) => ({ id: c.id, name: c.name, share: c.volumeShare * c.hoursPerTreatment }))
  );

  const serviceCategories: SpaCategoryRow[] = SPA_SERVICE_CATEGORIES.map((c, ci) => {
    const count = volumeSplit[ci].value;
    const revenue = c.id === 'wellness' ? wellnessRevenue : pillarRevenue(c.id);
    const itemCounts = splitByShares(count, c.items.map((i) => ({ id: i.id, name: i.name, share: i.share })));
    const itemRevenues = splitByShares(
      revenue,
      c.items.map((i) => ({ id: i.id, name: i.name, share: i.share * i.ticketIndex }))
    );
    const items: SpaTreatmentRow[] = c.items.map((i, ii) => ({
      id: `${c.id}-${i.id}`,
      name: i.name,
      categoryId: c.id,
      categoryName: c.name,
      treatments: itemCounts[ii].value,
      revenue: itemRevenues[ii].value,
      avgTicket: itemCounts[ii].value > 0 ? itemRevenues[ii].value / itemCounts[ii].value : 0,
      rating: clamp(score + i.ratingOffset, 0, 5),
    }));
    return {
      id: c.id,
      name: c.name,
      kind: 'service',
      treatments: count,
      revenue,
      revenueSharePct: ratioPct(revenue, m.spaRevenue),
      avgTicket: count > 0 ? revenue / count : 0,
      hours: hourSplit[ci].value,
      items,
    };
  });

  /* retail */
  const retailRevenue = pillarRevenue('retail');
  const retailSplit = splitByShares(retailRevenue, SPA_RETAIL_PRODUCTS);
  const retailProducts: SpaRetailRow[] = retailSplit.map((r, i) => ({
    id: r.id,
    name: r.name,
    revenue: r.value,
    unitPrice: SPA_RETAIL_PRODUCTS[i].unitPrice,
    units: Math.round(r.value / SPA_RETAIL_PRODUCTS[i].unitPrice),
    sharePct: ratioPct(r.value, retailRevenue),
  }));
  const retailCategory: SpaCategoryRow = {
    id: 'retail',
    name: 'Retail & Take-Home',
    kind: 'retail',
    treatments: 0,
    revenue: retailRevenue,
    revenueSharePct: ratioPct(retailRevenue, m.spaRevenue),
    avgTicket: 0,
    hours: 0,
    items: [],
  };

  /* categories in display order: service categories (spa pillar first, wellness), then retail */
  const categories: SpaCategoryRow[] = [...serviceCategories, retailCategory];
  const treatmentsRanked = serviceCategories
    .flatMap((c) => c.items)
    .sort((a, b) => b.treatments - a.treatments);

  /* packages: revenue for the selected period, member stock from YTD */
  const pkg = computePackages(m);
  const ytdPkg = computePackages(getPortfolioMetrics(ids, 'ytd'));
  const tiers: SpaPackageTierRow[] = pkg.tiers.map((t, i) => ({
    ...t,
    activeMembers: Math.round(ytdPkg.tiers[i].sold * SPA_PACKAGE_TIERS[i].holdFactor),
  }));

  /* areas: capacity split by weight, utilised hours by weight x load index */
  const capPerDaySplit = splitByShares(
    capacityPerDay,
    SPA_AREAS.map((a) => ({ id: a.id, name: a.name, share: a.capacityWeight }))
  );
  const utilisedSplit = splitByShares(
    hours,
    SPA_AREAS.map((a) => ({ id: a.id, name: a.name, share: a.capacityWeight * a.loadIndex }))
  );
  const areas: SpaAreaRow[] = SPA_AREAS.map((a, i) => {
    const capHours = capPerDaySplit[i].value * days;
    return {
      id: a.id,
      name: a.name,
      capacityPerDay: capPerDaySplit[i].value,
      capacityHours: capHours,
      utilisedHours: utilisedSplit[i].value,
      utilisationPct: ratioPct(utilisedSplit[i].value, capHours),
    };
  });

  /* appointment pipeline */
  const totalBooked = Math.round(treatments / (1 - SPA_CANCEL_NOSHOW_PCT / 100));
  const cancelled = totalBooked - treatments;
  let completed = treatments;
  let inProgress = 0;
  let scheduled = 0;
  if (period === 'today') {
    const s = splitByShares(treatments, SPA_TODAY_STATUS_SHARES);
    completed = s[0].value;
    inProgress = s[1].value;
    scheduled = s[2].value;
  } else if (period === 'forward') {
    completed = 0;
    scheduled = treatments;
  }
  const pipeline = {
    total: totalBooked,
    rows: [
      { id: 'completed', name: 'Completed', value: completed },
      { id: 'inProgress', name: 'In Progress', value: inProgress },
      { id: 'scheduled', name: 'Scheduled', value: scheduled },
      { id: 'cancelled', name: 'Cancelled / No Show', value: cancelled },
    ],
  };

  /* heatmap: weekday share x 3-hour block share */
  const avgDailyTreatments = days > 0 ? treatments / days : 0;
  const weeklyTreatments = avgDailyTreatments * 7;
  const maxCell = Math.max(...SPA_WEEKDAY_SHARES.map((d) => d.share)) *
    Math.max(...SPA_HOUR_BLOCKS.map((h) => h.share)) / 100;
  const cells: SpaHeatCell[][] = SPA_WEEKDAY_SHARES.map((d) =>
    SPA_HOUR_BLOCKS.map((h) => {
      const sharePct = (d.share * h.share) / 100;
      const ratio = maxCell > 0 ? sharePct / maxCell : 0;
      const level = (ratio < 0.2 ? 1 : ratio < 0.4 ? 2 : ratio < 0.6 ? 3 : ratio < 0.8 ? 4 : 5) as SpaHeatCell['level'];
      return { level, sharePct, treatmentsPerWeek: Math.round((weeklyTreatments * sharePct) / 100) };
    })
  );
  const peakBlock = SPA_HOUR_BLOCKS.reduce((a, b) => (b.share > a.share ? b : a));

  /* last 7 days utilisation: weekday pattern around the MTD level, Saturday = Today */
  const mtd = getSpaUtilisation(ids, 'mtd');
  const today = getSpaUtilisation(ids, 'today');
  const trend: Array<{ name: string; value: number; lyValue: number }> = [];
  for (let back = 6; back >= 0; back--) {
    const d = systemDatePlus(-back);
    const value = back === 0 ? today : clamp(mtd * weekdayIndexOf(d.getUTCDay()), 0, 100);
    const roundedVal = Math.round(value * 10) / 10;
    const roundedLy = Math.round(clamp(roundedVal - vsLyUtilisationPts, 20, 95) * 10) / 10;
    trend.push({ name: `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`, value: roundedVal, lyValue: roundedLy });
  }

  /* 12-month seasonal utilisation trend (This Year vs Last Year) anchored to current utilisationPct */
  const MONTH_SEASON_OFFSETS = [-18, -14, -10, -7, -4, -2, +1, +3, +1, 0, -1, +2];
  const monthlyTrend = MONTHS.map((mName, idx) => {
    const ty = Math.round(clamp(utilisationPct + MONTH_SEASON_OFFSETS[idx], 32, 92));
    const ly = Math.round(clamp(ty - Math.max(3, Math.round(vsLyUtilisationPts) + (idx % 3 === 0 ? 2 : 1)), 26, 88));
    return { name: mName, thisYear: ty, lastYear: ly };
  });

  /* upcoming peak windows (forecast demand on the next 4 days) */
  const roster7 = therapists;
  const f7 = forecastSpa(ids, 7);
  const cap7 = roster7 * SPA_PRODUCTIVE_HOURS_PER_THERAPIST_DAY * 7;
  const forecastDayUtil = ratioPct(hoursOf(f7.treatments), cap7);
  const otbRatio7 = ratioPct(f7.otbRevenue, f7.revenue);
  const peaks: SpaPeakRow[] = [];
  for (let ahead = 1; ahead <= 4; ahead++) {
    const d = systemDatePlus(ahead);
    const utcDay = d.getUTCDay();
    const block = SPA_HOUR_BLOCKS.find((h) => h.id === PEAK_BLOCK_BY_UTC_DAY[utcDay]) ?? peakBlock;
    const load = clamp(forecastDayUtil * weekdayIndexOf(utcDay), 0, 98);
    peaks.push({
      dateLabel: `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} (${DAY_NAMES[utcDay]})`,
      window: block.window,
      level: load >= SPA_PEAK_HIGH_UTIL_PCT ? 'HIGH' : load >= SPA_PEAK_MEDIUM_UTIL_PCT ? 'MEDIUM' : 'LOW',
      projectedUtilisationPct: load,
      preBookedPct: clamp(otbRatio7 * weekdayIndexOf(utcDay), 0, 98),
      therapistsRequired: Math.min(roster7, Math.ceil((roster7 * load) / 100)),
      roster: roster7,
    });
  }

  /* 90-day coverage */
  const f90 = forecastSpa(ids, PERIOD_DEFS.forward.days);

  return {
    period,
    periodLabel: PERIOD_DEFS[period].periodLabel,
    days,
    isForward: PERIOD_DEFS[period].isForward,
    propertyCount: m.propertyCount,
    propertyIds: ids,

    revenue: m.spaRevenue,
    vsLyPct,
    vsLyAbs: m.vsLy.spaRevenueAbs,
    vsBudgetPct,
    vsForecastPct,
    vsLyTreatmentsPct,
    vsBudgetTreatmentsPct,
    vsForecastTreatmentsPct,
    vsLyAvgTreatmentPct,
    vsBudgetAvgTreatmentPct,
    vsForecastAvgTreatmentPct,
    vsLyUtilisationPts,
    vsBudgetUtilisationPts,
    vsForecastUtilisationPts,
    vsLyHoursPct,
    vsBudgetHoursPct,
    vsForecastHoursPct,
    vsLyRetailPct,
    vsBudgetRetailPct,
    vsForecastRetailPct,
    spaPillarRevenue,
    wellnessRevenue,

    treatments,
    avgRevenuePerTreatment: m.spa.avgTreatmentUsd,
    roomsSold: m.roomsSold,
    stays: m.stays,
    revenuePerRoomNight: m.roomsSold > 0 ? m.spaRevenue / m.roomsSold : 0,
    treatmentsPer100RoomNights: m.spa.treatmentsPer100RoomNights,
    spaGuests,
    attachmentPct: ratioPct(spaGuests, m.stays),

    hours,
    capacityHours,
    therapists,
    utilisationPct,

    properties: propertyRows,
    regions,
    categories,
    treatmentsRanked,
    retail: {
      revenue: retailRevenue,
      sharePct: ratioPct(retailRevenue, m.spaRevenue),
      units: retailProducts.reduce((a, p) => a + p.units, 0),
      products: retailProducts,
    },
    packages: { revenue: pkg.revenue, sold: pkg.sold, activeMembers: tiers.reduce((a, t) => a + t.activeMembers, 0), tiers },
    areas,
    pipeline,
    heatmap: {
      days: SPA_WEEKDAY_SHARES.map((d) => d.name),
      blocks: SPA_HOUR_BLOCKS.map((h) => ({ label: h.name, window: h.window, sharePct: h.share })),
      cells,
      peakBlockLabel: peakBlock.name,
      peakBlockWindow: peakBlock.window,
      peakBlockSharePct: peakBlock.share,
    },
    trend,
    monthlyTrend,
    peaks,
    experience,
    forwardCoverage: {
      otbRevenue: f90.otbRevenue,
      forecastRevenue: f90.revenue,
      coveragePct: ratioPct(f90.otbRevenue, f90.revenue),
    },
  };
}

/** Utilisation % of the selected properties in a period (billable hours / roster capacity). */
function getSpaUtilisation(ids: string[], period: PeriodId): number {
  const m = getPortfolioMetrics(ids, period);
  let hours = 0;
  let capacity = 0;
  for (const p of m.properties) {
    hours += hoursOf(p.spa.treatments);
    capacity += getSpaTherapistRoster(p.propertyId) * SPA_PRODUCTIVE_HOURS_PER_THERAPIST_DAY * m.days;
  }
  return ratioPct(hours, capacity);
}
