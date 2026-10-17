import { MASTER_PROPERTIES, resolvePropertyId } from '@/constants/categories';
import type { HotelCategoryId } from '@/constants/categories';
import type { RegionId } from '@/constants/regions';
import { PERIOD_DEFS, FORWARD_DEFAULT_DAYS } from './periods';
import type { PeriodId } from './periods';
import { PROPERTY_PROFILES } from './propertyProfiles';
import type { PropertyProfile } from './propertyProfiles';

/**
 * PORTFOLIO DATA ENGINE - the single source of truth for every dashboard.
 *
 * Model (all derived, nothing is typed in by hand per dashboard):
 *   rooms sold      = rooms x days x occupancy
 *   room revenue    = rooms sold x ADR
 *   F&B / Spa / Exp = room revenue x per-property ancillary ratio (propertyProfiles.ts)
 *   covers / attendances / sessions / treatments derive from guest-nights of the rooms sold
 *
 * Because every page reads these functions (and portfolio figures are plain sums of the property figures),
 * the Hospitality "F&B revenue" is, by construction, identical to the F&B dashboard revenue for the same
 * period and the same property selection.
 */

/* ───────────────────────── TYPES ───────────────────────── */

/** Extensive (additive) quantities. Occupancy / ADR / RevPAR are always derived from these. */
export interface RevenueSnapshot {
  availableRoomNights: number;
  roomsSold: number;
  roomRevenue: number;
  fnbRevenue: number;
  spaRevenue: number;
  experienceRevenue: number;
  totalRevenue: number;
}

export interface Variance {
  /** Occupancy delta in percentage points. */
  occupancyPts: number;
  adrAbs: number;
  adrPct: number;
  revparAbs: number;
  revparPct: number;
  roomRevenueAbs: number;
  roomRevenuePct: number;
  fnbRevenueAbs: number;
  fnbRevenuePct: number;
  spaRevenueAbs: number;
  spaRevenuePct: number;
  experienceRevenueAbs: number;
  experienceRevenuePct: number;
  totalRevenueAbs: number;
  totalRevenuePct: number;
}

export interface FnbMetrics {
  outlets: number;
  covers: number;
  avgCheck: number;
  /** F&B revenue per in-house guest-night. */
  spendPerGuestNight: number;
  captureRatePct: number;
  bevSharePct: number;
  bevRevenue: number;
  revpash: number;
  seatTurn: number;
  seats: number;
  seatHours: number;
  seatDays: number;
}

export interface SpaMetrics {
  revenue: number;
  treatments: number;
  avgTreatmentUsd: number;
  /** Treatments per 100 occupied room nights. */
  treatmentsPer100RoomNights: number;
}

export interface ExperienceMetrics {
  programs: number;
  eligibleGuests: number;
  uniqueParticipants: number;
  participationRatePct: number;
  attendances: number;
  activitiesPerStay: number;
  paidAttendances: number;
  complimentaryAttendances: number;
  compSharePct: number;
  /** Paid experience revenue (== experienceRevenue). */
  paidRevenue: number;
  revenuePerPaidParticipant: number;
  sessions: number;
  capacityOffered: number;
  capacityUtilPct: number;
  validDemand: number;
  /** Waitlisted / turned-away demand (validDemand - attendances). */
  unmetDemand: number;
  demandFulfillmentPct: number;
  qualityPct: number;
  readinessPct: number;
}

export interface MetricsCore extends RevenueSnapshot {
  period: PeriodId;
  days: number;
  rooms: number;
  occupancyPct: number;
  adr: number;
  revpar: number;
  /** Total revenue per available room-night. */
  trevpar: number;
  guestNights: number;
  /** Unique guest stays (arrivals) in the period. */
  stays: number;
  avgDailyInHouseGuests: number;
  avgDailyArrivals: number;
  fnb: FnbMetrics;
  spa: SpaMetrics;
  experiences: ExperienceMetrics;
  ly: RevenueSnapshot;
  budget: RevenueSnapshot;
  forecast: RevenueSnapshot;
  vsLy: Variance;
  vsBudget: Variance;
  vsForecast: Variance;
}

export interface PropertyMetrics extends MetricsCore {
  propertyId: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  regionId: RegionId;
  location: string;
  status: 'above_plan' | 'on_plan' | 'attention';
}

export interface PortfolioMetrics extends MetricsCore {
  propertyCount: number;
  propertyIds: string[];
  properties: PropertyMetrics[];
}

export interface ForwardWindowProperty {
  propertyId: string;
  windowDays: number;
  availableRoomNights: number;
  forecastRoomsSold: number;
  forecastOccupancyPct: number;
  otbRoomsSold: number;
  otbOccupancyPct: number;
  adr: number;
  otbRoomRevenue: number;
  forecastRoomRevenue: number;
  otbFnbRevenue: number;
  otbSpaRevenue: number;
  otbExperienceRevenue: number;
  otbTotalRevenue: number;
  forecastTotalRevenue: number;
  forecastCovers: number;
  otbCovers: number;
  forecastAttendances: number;
  otbAttendances: number;
  stlyOtbRoomsSold: number;
  stlyOtbRoomRevenue: number;
  pickup7dRoomNights: number;
  pickup30dRoomNights: number;
  stlyPickup7dRoomNights: number;
  stlyPickup30dRoomNights: number;
}

export interface ForwardWindowMetrics extends Omit<ForwardWindowProperty, 'propertyId'> {
  propertyCount: number;
  propertyIds: string[];
  otbRatioPct: number;
  paceVsLyPct: number;
  revenueVsLyPct: number;
  pickup7dVsLyPct: number;
  pickup30dVsLyPct: number;
  properties: ForwardWindowProperty[];
}

/* ───────────────────────── CONSTANTS ───────────────────────── */

const RESTAURANT_HOURS_PER_DAY = 11.5;

/** How much of the final (forecast) occupancy is already on the books, by days-out. Linear interpolation. */
const OTB_CURVE: Array<[number, number]> = [
  [0, 1.0],
  [7, 0.88],
  [30, 0.74],
  [90, 0.55],
  [180, 0.34],
  [365, 0.18],
];

/** Share of eventual ancillary spend that is pre-booked / pre-paid, relative to the rooms OTB ratio. */
const PREBOOK_FACTOR = { fnb: 0.5, spa: 0.45, exp: 0.8 } as const;

/** Budget / Forecast variances are a fixed fraction of the year-over-year variance. */
const BUDGET_FRACTION_OF_YOY = 0.42;
const FORECAST_FRACTION_OF_YOY = 0.2;

/** Share of rooms OTB picked up in the last 7 / 30 days. */
const PICKUP_7D_SHARE = 0.055;
const PICKUP_30D_SHARE = 0.21;

/* ───────────────────────── HELPERS ───────────────────────── */

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n);
const pct = (cur: number, ref: number) => (ref > 0 ? (cur / ref - 1) * 100 : 0);
const ratioPct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);

export const occupancyOf = (s: RevenueSnapshot) => ratioPct(s.roomsSold, s.availableRoomNights);
export const adrOf = (s: RevenueSnapshot) => (s.roomsSold > 0 ? s.roomRevenue / s.roomsSold : 0);
export const revparOf = (s: RevenueSnapshot) =>
  s.availableRoomNights > 0 ? s.roomRevenue / s.availableRoomNights : 0;

function emptySnapshot(): RevenueSnapshot {
  return {
    availableRoomNights: 0,
    roomsSold: 0,
    roomRevenue: 0,
    fnbRevenue: 0,
    spaRevenue: 0,
    experienceRevenue: 0,
    totalRevenue: 0,
  };
}

function addSnapshot(a: RevenueSnapshot, b: RevenueSnapshot): RevenueSnapshot {
  return {
    availableRoomNights: a.availableRoomNights + b.availableRoomNights,
    roomsSold: a.roomsSold + b.roomsSold,
    roomRevenue: a.roomRevenue + b.roomRevenue,
    fnbRevenue: a.fnbRevenue + b.fnbRevenue,
    spaRevenue: a.spaRevenue + b.spaRevenue,
    experienceRevenue: a.experienceRevenue + b.experienceRevenue,
    totalRevenue: a.totalRevenue + b.totalRevenue,
  };
}

export function computeVariance(cur: RevenueSnapshot, ref: RevenueSnapshot): Variance {
  const curAdr = adrOf(cur);
  const refAdr = adrOf(ref);
  const curRevpar = revparOf(cur);
  const refRevpar = revparOf(ref);
  return {
    occupancyPts: occupancyOf(cur) - occupancyOf(ref),
    adrAbs: curAdr - refAdr,
    adrPct: pct(curAdr, refAdr),
    revparAbs: curRevpar - refRevpar,
    revparPct: pct(curRevpar, refRevpar),
    roomRevenueAbs: cur.roomRevenue - ref.roomRevenue,
    roomRevenuePct: pct(cur.roomRevenue, ref.roomRevenue),
    fnbRevenueAbs: cur.fnbRevenue - ref.fnbRevenue,
    fnbRevenuePct: pct(cur.fnbRevenue, ref.fnbRevenue),
    spaRevenueAbs: cur.spaRevenue - ref.spaRevenue,
    spaRevenuePct: pct(cur.spaRevenue, ref.spaRevenue),
    experienceRevenueAbs: cur.experienceRevenue - ref.experienceRevenue,
    experienceRevenuePct: pct(cur.experienceRevenue, ref.experienceRevenue),
    totalRevenueAbs: cur.totalRevenue - ref.totalRevenue,
    totalRevenuePct: pct(cur.totalRevenue, ref.totalRevenue),
  };
}

function otbRatioAt(daysOut: number): number {
  const d = clamp(daysOut, 0, 365);
  for (let i = 1; i < OTB_CURVE.length; i++) {
    const [d0, r0] = OTB_CURVE[i - 1];
    const [d1, r1] = OTB_CURVE[i];
    if (d <= d1) return r0 + ((r1 - r0) * (d - d0)) / (d1 - d0);
  }
  return OTB_CURVE[OTB_CURVE.length - 1][1];
}

const otbAvgCache = new Map<number, number>();
/** Average share on the books across a forward window of N days (days 1..N). */
export function averageOtbRatio(windowDays: number): number {
  const n = Math.max(1, Math.round(windowDays));
  const cached = otbAvgCache.get(n);
  if (cached !== undefined) return cached;
  let sum = 0;
  for (let d = 1; d <= n; d++) sum += otbRatioAt(d);
  const avg = sum / n;
  otbAvgCache.set(n, avg);
  return avg;
}

/* ───────────────────────── PROPERTY REGISTRY ───────────────────────── */

export const PORTFOLIO_PROPERTY_IDS: string[] = MASTER_PROPERTIES.map((p) => p.id);

export function getPropertyProfile(propertyId: string): PropertyProfile {
  const canonicalId = resolvePropertyId(propertyId);
  const profile = PROPERTY_PROFILES[canonicalId];
  if (!profile) throw new Error(`Unknown portfolio property: ${propertyId}`);
  return profile;
}

export function getPropertyIdsByCategory(categoryIds: string[]): string[] {
  return MASTER_PROPERTIES.filter((p) => categoryIds.includes(p.categoryId)).map((p) => p.id);
}

export function getPropertyIdsByRegion(regionIds: string[]): string[] {
  return MASTER_PROPERTIES.filter((p) => regionIds.includes(PROPERTY_PROFILES[p.id].regionId)).map((p) => p.id);
}

/* ───────────────────────── CORE COMPUTATION ───────────────────────── */

interface CoreResult {
  days: number;
  forward: boolean;
  /** Share of the final forecast that is on the books (1 for actual periods). */
  roomShare: number;
  fnbShare: number;
  spaShare: number;
  expShare: number;
  adr: number;
  available: number;
  forecastRoomsSold: number;
  roomsSold: number;
  forecastOccupancyPct: number;
}

function resolveDrivers(
  base: { rooms: number; baseOcc: number; baseAdr: number },
  profile: PropertyProfile,
  period: PeriodId,
  windowDays: number
): CoreResult {
  const forward = period === 'forward';
  const days = forward ? windowDays : PERIOD_DEFS[period].days;

  let occ = base.baseOcc;
  let adrRaw = base.baseAdr;
  let ratio = 1;

  if (period === 'today') {
    occ = clamp(base.baseOcc + profile.occTodayDelta, 0, 97);
    adrRaw = base.baseAdr * profile.adrTodayIdx;
  } else if (period === 'ytd') {
    occ = clamp(base.baseOcc + profile.occYtdDelta, 0, 97);
    adrRaw = base.baseAdr * profile.adrYtdIdx;
  } else if (forward) {
    occ = clamp(base.baseOcc + profile.occForecastDelta, 0, 96);
    adrRaw = base.baseAdr * profile.adrForecastIdx;
    ratio = averageOtbRatio(windowDays);
  }

  const available = base.rooms * days;
  const forecastRoomsSold = round((available * occ) / 100);
  const roomsSold = forward ? round(forecastRoomsSold * ratio) : forecastRoomsSold;

  return {
    days,
    forward,
    roomShare: ratio,
    fnbShare: forward ? PREBOOK_FACTOR.fnb * ratio : 1,
    spaShare: forward ? PREBOOK_FACTOR.spa * ratio : 1,
    expShare: forward ? Math.min(1, PREBOOK_FACTOR.exp * ratio) : 1,
    adr: round(adrRaw),
    available,
    forecastRoomsSold,
    roomsSold,
    forecastOccupancyPct: occ,
  };
}

function buildReference(
  cur: RevenueSnapshot,
  profile: PropertyProfile,
  k: number,
  forward: boolean
): RevenueSnapshot {
  const curOcc = occupancyOf(cur);
  const curAdr = adrOf(cur);

  const roomsSold = forward
    ? round(cur.roomsSold / (1 + (k * profile.paceVsLyPct) / 100))
    : round((cur.availableRoomNights * Math.max(0, curOcc - k * profile.yoyOccPts)) / 100);
  const adr = curAdr / (1 + (k * profile.yoyAdrPct) / 100);
  const roomRevenue = round(roomsSold * adr);
  const fnbRevenue = round(cur.fnbRevenue / (1 + (k * profile.yoyFnbPct) / 100));
  const spaRevenue = round(cur.spaRevenue / (1 + (k * profile.yoySpaPct) / 100));
  const experienceRevenue = round(cur.experienceRevenue / (1 + (k * profile.yoyExpPct) / 100));

  return {
    availableRoomNights: cur.availableRoomNights,
    roomsSold,
    roomRevenue,
    fnbRevenue,
    spaRevenue,
    experienceRevenue,
    totalRevenue: roomRevenue + fnbRevenue + spaRevenue + experienceRevenue,
  };
}

const propertyCache = new Map<string, PropertyMetrics>();

function computePropertyMetrics(rawPropertyId: string, period: PeriodId, windowDays: number): PropertyMetrics {
  const propertyId = resolvePropertyId(rawPropertyId);
  const master = MASTER_PROPERTIES.find((p) => p.id === propertyId);
  if (!master) throw new Error(`Unknown portfolio property: ${rawPropertyId}`);
  const profile = getPropertyProfile(propertyId);
  const d = resolveDrivers(master, profile, period, windowDays);

  const forecastRoomRevenue = d.forecastRoomsSold * d.adr;
  const roomRevenue = d.roomsSold * d.adr;
  const fnbRevenue = round(forecastRoomRevenue * profile.fnbPct * d.fnbShare);
  const spaRevenue = round(forecastRoomRevenue * profile.spaPct * d.spaShare);
  const experienceRevenue = round(forecastRoomRevenue * profile.expPct * d.expShare);
  const totalRevenue = roomRevenue + fnbRevenue + spaRevenue + experienceRevenue;

  const guestNights = round(d.roomsSold * profile.guestsPerRoom);
  const forecastGuestNights = round(d.forecastRoomsSold * profile.guestsPerRoom);
  const stays = round(guestNights / profile.avgLosNights);

  /* F&B */
  const covers = round(forecastGuestNights * profile.fnb.coversPerGuestNight * d.fnbShare);
  const seats = round(master.rooms * profile.fnb.seatsPerRoom);
  const seatDays = seats * d.days;
  const seatHours = seatDays * RESTAURANT_HOURS_PER_DAY;
  const fnb: FnbMetrics = {
    outlets: profile.fnb.outlets,
    covers,
    avgCheck: covers > 0 ? fnbRevenue / covers : 0,
    spendPerGuestNight: guestNights > 0 ? fnbRevenue / guestNights : 0,
    captureRatePct: profile.fnb.captureRatePct,
    bevSharePct: profile.fnb.bevSharePct,
    bevRevenue: round((fnbRevenue * profile.fnb.bevSharePct) / 100),
    revpash: seatHours > 0 ? fnbRevenue / seatHours : 0,
    seatTurn: seatDays > 0 ? covers / seatDays : 0,
    seats,
    seatHours,
    seatDays,
  };

  /* Spa */
  const treatments = round(spaRevenue / profile.spa.avgTreatmentUsd);
  const spa: SpaMetrics = {
    revenue: spaRevenue,
    treatments,
    avgTreatmentUsd: profile.spa.avgTreatmentUsd,
    treatmentsPer100RoomNights: d.roomsSold > 0 ? (treatments / d.roomsSold) * 100 : 0,
  };

  /* Experiences */
  const participationFactor = d.forward ? d.expShare / d.roomShare : 1;
  const uniqueParticipants = round(stays * (profile.exp.participationPct / 100) * participationFactor);
  const attendances = round(uniqueParticipants * profile.exp.activitiesPerStay);
  const paidAttendances = round(attendances * (1 - profile.exp.compSharePct / 100));
  const capacityOffered = round(attendances / (profile.exp.capacityUtilPct / 100));
  const validDemand = round(attendances / (profile.exp.demandFulfillmentPct / 100));
  const experiences: ExperienceMetrics = {
    programs: profile.exp.programs,
    eligibleGuests: stays,
    uniqueParticipants,
    participationRatePct: ratioPct(uniqueParticipants, stays),
    attendances,
    activitiesPerStay: profile.exp.activitiesPerStay,
    paidAttendances,
    complimentaryAttendances: attendances - paidAttendances,
    compSharePct: ratioPct(attendances - paidAttendances, attendances),
    paidRevenue: experienceRevenue,
    revenuePerPaidParticipant: paidAttendances > 0 ? experienceRevenue / paidAttendances : 0,
    sessions: Math.max(1, round(capacityOffered / profile.exp.avgSessionCapacity)),
    capacityOffered,
    capacityUtilPct: ratioPct(attendances, capacityOffered),
    validDemand,
    unmetDemand: validDemand - attendances,
    demandFulfillmentPct: ratioPct(attendances, validDemand),
    qualityPct: profile.exp.qualityPct,
    readinessPct: profile.exp.readinessPct,
  };

  const snapshot: RevenueSnapshot = {
    availableRoomNights: d.available,
    roomsSold: d.roomsSold,
    roomRevenue,
    fnbRevenue,
    spaRevenue,
    experienceRevenue,
    totalRevenue,
  };
  const ly = buildReference(snapshot, profile, 1, d.forward);
  const budget = buildReference(snapshot, profile, BUDGET_FRACTION_OF_YOY, d.forward);
  const forecast = buildReference(snapshot, profile, FORECAST_FRACTION_OF_YOY, d.forward);

  return {
    propertyId,
    name: master.name,
    categoryId: master.categoryId,
    categoryName: master.categoryName,
    regionId: profile.regionId,
    location: master.location,
    status: master.status,
    period,
    days: d.days,
    rooms: master.rooms,
    ...snapshot,
    occupancyPct: occupancyOf(snapshot),
    adr: adrOf(snapshot),
    revpar: revparOf(snapshot),
    trevpar: d.available > 0 ? totalRevenue / d.available : 0,
    guestNights,
    stays,
    avgDailyInHouseGuests: guestNights / d.days,
    avgDailyArrivals: stays / d.days,
    fnb,
    spa,
    experiences,
    ly,
    budget,
    forecast,
    vsLy: computeVariance(snapshot, ly),
    vsBudget: computeVariance(snapshot, budget),
    vsForecast: computeVariance(snapshot, forecast),
  };
}

/**
 * Metrics of ONE property for a period. Forward uses the default 90-day OTB window.
 */
export function getPropertyMetrics(rawPropertyId: string, period: PeriodId): PropertyMetrics {
  const propertyId = resolvePropertyId(rawPropertyId);
  const key = `${propertyId}|${period}|${FORWARD_DEFAULT_DAYS}`;
  const cached = propertyCache.get(key);
  if (cached) return cached;
  const result = computePropertyMetrics(propertyId, period, FORWARD_DEFAULT_DAYS);
  propertyCache.set(key, result);
  return result;
}

/* ───────────────────────── PORTFOLIO AGGREGATION ───────────────────────── */

function aggregateMetrics(list: PropertyMetrics[], period: PeriodId): PortfolioMetrics {
  const snapshot = list.reduce<RevenueSnapshot>(
    (acc, p) =>
      addSnapshot(acc, {
        availableRoomNights: p.availableRoomNights,
        roomsSold: p.roomsSold,
        roomRevenue: p.roomRevenue,
        fnbRevenue: p.fnbRevenue,
        spaRevenue: p.spaRevenue,
        experienceRevenue: p.experienceRevenue,
        totalRevenue: p.totalRevenue,
      }),
    emptySnapshot()
  );
  const ly = list.reduce((acc, p) => addSnapshot(acc, p.ly), emptySnapshot());
  const budget = list.reduce((acc, p) => addSnapshot(acc, p.budget), emptySnapshot());
  const forecast = list.reduce((acc, p) => addSnapshot(acc, p.forecast), emptySnapshot());

  const sum = (fn: (p: PropertyMetrics) => number) => list.reduce((acc, p) => acc + fn(p), 0);
  const days = list[0]?.days ?? PERIOD_DEFS[period].days;

  const guestNights = sum((p) => p.guestNights);
  const stays = sum((p) => p.stays);

  const covers = sum((p) => p.fnb.covers);
  const seatDays = sum((p) => p.fnb.seatDays);
  const seatHours = sum((p) => p.fnb.seatHours);
  const bevRevenue = sum((p) => p.fnb.bevRevenue);
  const fnb: FnbMetrics = {
    outlets: sum((p) => p.fnb.outlets),
    covers,
    avgCheck: covers > 0 ? snapshot.fnbRevenue / covers : 0,
    spendPerGuestNight: guestNights > 0 ? snapshot.fnbRevenue / guestNights : 0,
    captureRatePct:
      guestNights > 0 ? sum((p) => p.fnb.captureRatePct * p.guestNights) / guestNights : 0,
    bevSharePct: ratioPct(bevRevenue, snapshot.fnbRevenue),
    bevRevenue,
    revpash: seatHours > 0 ? snapshot.fnbRevenue / seatHours : 0,
    seatTurn: seatDays > 0 ? covers / seatDays : 0,
    seats: sum((p) => p.fnb.seats),
    seatHours,
    seatDays,
  };

  const treatments = sum((p) => p.spa.treatments);
  const spa: SpaMetrics = {
    revenue: snapshot.spaRevenue,
    treatments,
    avgTreatmentUsd: treatments > 0 ? snapshot.spaRevenue / treatments : 0,
    treatmentsPer100RoomNights: snapshot.roomsSold > 0 ? (treatments / snapshot.roomsSold) * 100 : 0,
  };

  const attendances = sum((p) => p.experiences.attendances);
  const uniqueParticipants = sum((p) => p.experiences.uniqueParticipants);
  const paidAttendances = sum((p) => p.experiences.paidAttendances);
  const capacityOffered = sum((p) => p.experiences.capacityOffered);
  const validDemand = sum((p) => p.experiences.validDemand);
  const sessions = sum((p) => p.experiences.sessions);
  const experiences: ExperienceMetrics = {
    programs: sum((p) => p.experiences.programs),
    eligibleGuests: stays,
    uniqueParticipants,
    participationRatePct: ratioPct(uniqueParticipants, stays),
    attendances,
    activitiesPerStay: uniqueParticipants > 0 ? attendances / uniqueParticipants : 0,
    paidAttendances,
    complimentaryAttendances: attendances - paidAttendances,
    compSharePct: ratioPct(attendances - paidAttendances, attendances),
    paidRevenue: snapshot.experienceRevenue,
    revenuePerPaidParticipant: paidAttendances > 0 ? snapshot.experienceRevenue / paidAttendances : 0,
    sessions,
    capacityOffered,
    capacityUtilPct: ratioPct(attendances, capacityOffered),
    validDemand,
    unmetDemand: validDemand - attendances,
    demandFulfillmentPct: ratioPct(attendances, validDemand),
    qualityPct:
      attendances > 0 ? sum((p) => p.experiences.qualityPct * p.experiences.attendances) / attendances : 0,
    readinessPct: sessions > 0 ? sum((p) => p.experiences.readinessPct * p.experiences.sessions) / sessions : 0,
  };

  return {
    propertyCount: list.length,
    propertyIds: list.map((p) => p.propertyId),
    properties: list,
    period,
    days,
    rooms: sum((p) => p.rooms),
    ...snapshot,
    occupancyPct: occupancyOf(snapshot),
    adr: adrOf(snapshot),
    revpar: revparOf(snapshot),
    trevpar: snapshot.availableRoomNights > 0 ? snapshot.totalRevenue / snapshot.availableRoomNights : 0,
    guestNights,
    stays,
    avgDailyInHouseGuests: days > 0 ? guestNights / days : 0,
    avgDailyArrivals: days > 0 ? stays / days : 0,
    fnb,
    spa,
    experiences,
    ly,
    budget,
    forecast,
    vsLy: computeVariance(snapshot, ly),
    vsBudget: computeVariance(snapshot, budget),
    vsForecast: computeVariance(snapshot, forecast),
  };
}

/**
 * Aggregated metrics for a selection of properties (default = all 9 SOSEI properties).
 * Revenue / covers / attendances are straight sums of getPropertyMetrics(); occupancy, ADR, RevPAR,
 * average check, participation, utilisation, ... are re-derived from those sums (never averaged).
 */
export function getPortfolioMetrics(propertyIds: string[] | undefined, period: PeriodId): PortfolioMetrics {
  const ids = propertyIds && propertyIds.length > 0 ? propertyIds.map(resolvePropertyId) : PORTFOLIO_PROPERTY_IDS;
  // keep the canonical property order regardless of the order of the selection
  const ordered = PORTFOLIO_PROPERTY_IDS.filter((id) => ids.includes(id));
  return aggregateMetrics(
    ordered.map((id) => getPropertyMetrics(id, period)),
    period
  );
}

/** Metrics of every property in a selection, in canonical order. */
export function getPropertyMetricsList(propertyIds: string[] | undefined, period: PeriodId): PropertyMetrics[] {
  return getPortfolioMetrics(propertyIds, period).properties;
}

/* ───────────────────────── FORWARD WINDOWS ───────────────────────── */

function computeForwardProperty(rawPropertyId: string, windowDays: number): ForwardWindowProperty {
  const propertyId = resolvePropertyId(rawPropertyId);
  const master = MASTER_PROPERTIES.find((p) => p.id === propertyId);
  if (!master) throw new Error(`Unknown portfolio property: ${rawPropertyId}`);
  const profile = getPropertyProfile(propertyId);
  const otb =
    windowDays === FORWARD_DEFAULT_DAYS
      ? getPropertyMetrics(propertyId, 'forward')
      : computePropertyMetrics(propertyId, 'forward', windowDays);
  const d = resolveDrivers(master, profile, 'forward', windowDays);

  const forecastRoomRevenue = d.forecastRoomsSold * d.adr;
  const forecastFnb = round(forecastRoomRevenue * profile.fnbPct);
  const forecastSpa = round(forecastRoomRevenue * profile.spaPct);
  const forecastExp = round(forecastRoomRevenue * profile.expPct);

  const forecastGuestNights = round(d.forecastRoomsSold * profile.guestsPerRoom);
  const forecastStays = round(forecastGuestNights / profile.avgLosNights);
  const forecastAttendances = round(
    forecastStays * (profile.exp.participationPct / 100) * profile.exp.activitiesPerStay
  );

  const stlyOtbRoomsSold = round(otb.roomsSold / (1 + profile.paceVsLyPct / 100));
  const pickup7d = round(otb.roomsSold * PICKUP_7D_SHARE);
  const pickup30d = round(otb.roomsSold * PICKUP_30D_SHARE);

  return {
    propertyId,
    windowDays,
    availableRoomNights: d.available,
    forecastRoomsSold: d.forecastRoomsSold,
    forecastOccupancyPct: ratioPct(d.forecastRoomsSold, d.available),
    otbRoomsSold: otb.roomsSold,
    otbOccupancyPct: ratioPct(otb.roomsSold, d.available),
    adr: d.adr,
    otbRoomRevenue: otb.roomRevenue,
    forecastRoomRevenue,
    otbFnbRevenue: otb.fnbRevenue,
    otbSpaRevenue: otb.spaRevenue,
    otbExperienceRevenue: otb.experienceRevenue,
    otbTotalRevenue: otb.totalRevenue,
    forecastTotalRevenue: forecastRoomRevenue + forecastFnb + forecastSpa + forecastExp,
    forecastCovers: round(forecastGuestNights * profile.fnb.coversPerGuestNight),
    otbCovers: otb.fnb.covers,
    forecastAttendances,
    otbAttendances: otb.experiences.attendances,
    stlyOtbRoomsSold,
    stlyOtbRoomRevenue: round((stlyOtbRoomsSold * d.adr) / (1 + profile.yoyAdrPct / 100)),
    pickup7dRoomNights: pickup7d,
    pickup30dRoomNights: pickup30d,
    stlyPickup7dRoomNights: round(pickup7d / (1 + (profile.paceVsLyPct * 0.5) / 100)),
    stlyPickup30dRoomNights: round(pickup30d / (1 + profile.paceVsLyPct / 100)),
  };
}

const forwardCache = new Map<string, ForwardWindowProperty>();

/**
 * Forward business for ANY window length (7, 14, 30, 60, 90, 180, 365 ...). The 90-day window equals
 * getPortfolioMetrics(ids, 'forward') exactly, so Booking Pace, Forward Business, F&B outlook and
 * Experiences outlook all read the same on-the-books numbers.
 */
export function getForwardWindowMetrics(propertyIds: string[] | undefined, windowDays: number): ForwardWindowMetrics {
  const ids = propertyIds && propertyIds.length > 0 ? propertyIds.map(resolvePropertyId) : PORTFOLIO_PROPERTY_IDS;
  const ordered = PORTFOLIO_PROPERTY_IDS.filter((id) => ids.includes(id));
  const props = ordered.map((id) => {
    const key = `${id}|${windowDays}`;
    const cached = forwardCache.get(key);
    if (cached) return cached;
    const computed = computeForwardProperty(id, windowDays);
    forwardCache.set(key, computed);
    return computed;
  });
  const sum = (fn: (p: ForwardWindowProperty) => number) => props.reduce((acc, p) => acc + fn(p), 0);

  const available = sum((p) => p.availableRoomNights);
  const forecastRoomsSold = sum((p) => p.forecastRoomsSold);
  const otbRoomsSold = sum((p) => p.otbRoomsSold);
  const otbTotalRevenue = sum((p) => p.otbTotalRevenue);
  const stlyOtbRoomsSold = sum((p) => p.stlyOtbRoomsSold);
  const otbRoomRevenue = sum((p) => p.otbRoomRevenue);
  const stlyOtbRoomRevenue = sum((p) => p.stlyOtbRoomRevenue);
  const pickup7d = sum((p) => p.pickup7dRoomNights);
  const pickup30d = sum((p) => p.pickup30dRoomNights);
  const stlyPickup7d = sum((p) => p.stlyPickup7dRoomNights);
  const stlyPickup30d = sum((p) => p.stlyPickup30dRoomNights);

  return {
    propertyCount: props.length,
    propertyIds: props.map((p) => p.propertyId),
    windowDays,
    availableRoomNights: available,
    forecastRoomsSold,
    forecastOccupancyPct: ratioPct(forecastRoomsSold, available),
    otbRoomsSold,
    otbOccupancyPct: ratioPct(otbRoomsSold, available),
    otbRatioPct: ratioPct(otbRoomsSold, forecastRoomsSold),
    adr: otbRoomsSold > 0 ? otbRoomRevenue / otbRoomsSold : 0,
    otbRoomRevenue,
    forecastRoomRevenue: sum((p) => p.forecastRoomRevenue),
    otbFnbRevenue: sum((p) => p.otbFnbRevenue),
    otbSpaRevenue: sum((p) => p.otbSpaRevenue),
    otbExperienceRevenue: sum((p) => p.otbExperienceRevenue),
    otbTotalRevenue,
    forecastTotalRevenue: sum((p) => p.forecastTotalRevenue),
    forecastCovers: sum((p) => p.forecastCovers),
    otbCovers: sum((p) => p.otbCovers),
    forecastAttendances: sum((p) => p.forecastAttendances),
    otbAttendances: sum((p) => p.otbAttendances),
    stlyOtbRoomsSold,
    stlyOtbRoomRevenue,
    paceVsLyPct: pct(otbRoomsSold, stlyOtbRoomsSold),
    revenueVsLyPct: pct(otbRoomRevenue, stlyOtbRoomRevenue),
    pickup7dRoomNights: pickup7d,
    pickup30dRoomNights: pickup30d,
    stlyPickup7dRoomNights: stlyPickup7d,
    stlyPickup30dRoomNights: stlyPickup30d,
    pickup7dVsLyPct: pct(pickup7d, stlyPickup7d),
    pickup30dVsLyPct: pct(pickup30d, stlyPickup30d),
    properties: props,
  };
}
