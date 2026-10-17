import { MASTER_REGIONS } from '@/constants/regions';
import type { RegionId } from '@/constants/regions';
import {
  getForwardWindowMetrics,
  getPortfolioMetrics,
  getPropertyMetrics,
  getPropertyMetricsList,
  getPropertyProfile,
} from './engine';
import type { PortfolioMetrics, PropertyMetrics } from './engine';
import { fmtInt, fmtPct, fmtSignedPct, fmtSignedPts, fmtUsd, fmtUsdFull } from './format';
import { EXPERIENCE_CATEGORY_REVENUE_SHARES, EXPERIENCE_CATEGORY_SHARES, EXPERIENCE_PAID_MODEL_REVENUE_SHARES, splitByShares } from './mix';
import type { ShareDef } from './mix';
import { FORWARD_DEFAULT_DAYS } from './periods';
import type { PeriodId } from './periods';

/**
 * EXPERIENCES DOMAIN HELPERS
 *
 * Every number shown on the Experiences dashboards (global, categories, regional, property) and in their drawers
 * is produced here from the portfolio engine (getPortfolioMetrics / getPropertyMetrics / getForwardWindowMetrics).
 * Category / model / segment tables are produced with splitByShares so they ALWAYS add up to the engine headline.
 * Only ratios (shares, indices, policy limits) are defined in this file - never absolute counts or revenue.
 */

export type ExperienceScope = PortfolioMetrics | PropertyMetrics;

/* ───────────────────────── ASSUMPTIONS (ratios / policy constants only) ───────────────────────── */

export const EXPERIENCE_NO_SHOW_PCT = 3.8;
/** Share of unique participants that are first-time guests (the rest are repeat guests). */
export const EXPERIENCE_FIRST_TIME_SHARE_PCT = 58.8;
export const EXPERIENCE_CERT_COVERAGE_PCT = 99.4;
export const EXPERIENCE_GEAR_READY_PCT = 97.4;
export const EXPERIENCE_PARTNER_CONFIRMED_PCT = 98.2;
/** Readiness threshold below which a resort is flagged on the qualification watchlist. */
export const EXPERIENCE_READINESS_TARGET_PCT = 95;
/** Sessions one certified guide can lead per operating day. */
const SESSIONS_PER_GUIDE_DAY = 3.2;
/** % of outdoor sessions disrupted by weather / sea-state, and % of those pivoted to indoor programmes. */
const OUTDOOR_WEATHER_IMPACT_PCT = 3.1;
const WEATHER_RETAINED_PCT = 89.4;
const NEAR_MISS_PER_1000_SESSIONS = 1.7;
/** Kids' Club policy: maximum children per certified supervisor and the planning ratio used for rostering. */
export const KIDS_CLUB_POLICY_MAX_RATIO = 6;
const KIDS_CLUB_TARGET_RATIO = 5;
const KIDS_CHECKED_IN_PCT = 78;
const KIDS_PENDING_COLLECTION_PCT = 14;
const KIDS_CARE_FLAG_PCT = 17;
/** Share of arriving stays that are families (tomorrow handover) and share of daily waitlist that are couples. */
const FAMILY_ARRIVAL_SHARE_PCT = 22;
const COUPLE_WAITLIST_SHARE_PCT = 40;

const OUTDOOR_CATEGORY_IDS = ['water', 'nature', 'signature'];

/** Year-over-year point changes of the rate KPIs are scaled from each resort's experience revenue growth. */
const YOY_PTS_FACTOR = {
  participation: 0.33,
  utilization: 0.28,
  fulfillment: 0.2,
  quality: 0.1,
  readiness: 0.12,
} as const;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const ratio = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);

export function getRegionName(regionId: RegionId): string {
  return MASTER_REGIONS.find((r) => r.id === regionId)?.name ?? regionId;
}

function propertyList(m: ExperienceScope): PropertyMetrics[] {
  return 'properties' in m ? m.properties : [m];
}

function idsOf(m: ExperienceScope): string[] {
  return 'propertyIds' in m ? m.propertyIds : [m.propertyId];
}

/** Attendance-weighted year-over-year point change for a rate KPI. */
function yoyPts(m: ExperienceScope, factor: number): number {
  const list = propertyList(m);
  const att = list.reduce((a, p) => a + p.experiences.attendances, 0);
  if (att <= 0) return 0;
  return list.reduce((a, p) => a + p.experiences.attendances * getPropertyProfile(p.propertyId).yoyExpPct * factor, 0) / att;
}

/* ───────────────────────── ACTIVITY CATEGORIES ───────────────────────── */

interface CategoryMeta {
  color: string;
  examples: string;
  audience: string;
  model: string;
  /** Capacity-utilisation index vs the portfolio average (renormalised so the aggregate always equals the engine value). */
  utilIdx: number;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  water: {
    color: '#0f172a',
    examples: 'Reef snorkeling, diving, catamaran sailing, kayaking',
    audience: 'Adults, Eligible Kids, Families',
    model: 'Comp Gear / Paid Excursions',
    utilIdx: 1.06,
  },
  yoga: {
    color: '#334155',
    examples: 'Sunrise cliff yoga, pranayama, sound meditation',
    audience: 'Adults, Families',
    model: 'Complimentary / Paid Private',
    utilIdx: 1.03,
  },
  nature: {
    color: '#475569',
    examples: 'Guided canopy walks, alpine trekking, canyon hikes, coral conservation',
    audience: 'All Ages, Families, Teens',
    model: 'Complimentary / Paid Guided',
    utilIdx: 1.0,
  },
  culture: {
    color: '#64748b',
    examples: 'Temple purification, artisan visits, heritage walks, tea immersion',
    audience: 'Adults, Families',
    model: 'Paid / Package-Included',
    utilIdx: 0.92,
  },
  kids: {
    color: '#94a3b8',
    examples: 'Junior marine biologist, nature crafts, family scavenger hunts',
    audience: 'Children (4–7, 8–12), Families',
    model: 'Complimentary / Paid Camp',
    utilIdx: 0.96,
  },
  signature: {
    color: '#cbd5e1',
    examples: 'Dhow cruise, helicopter glacier tour, private yacht charter',
    audience: 'Couples, Private Groups',
    model: 'High-Ticket Paid Bespoke',
    utilIdx: 1.1,
  },
};

export interface ExperienceCategoryRow {
  id: string;
  name: string;
  color: string;
  examples: string;
  audience: string;
  model: string;
  /** Nominal attendance share of the category table, %. */
  sharePct: number;
  attendances: number;
  revenue: number;
  revenueSharePct: number;
  capacity: number;
  utilPct: number;
}

/**
 * Activity categories. Attendances sum to experiences.attendances, revenue sums to experienceRevenue (paid revenue),
 * capacity sums to experiences.capacityOffered, so the aggregate utilisation equals the engine value.
 */
export function getExperienceCategoryRows(m: ExperienceScope): ExperienceCategoryRow[] {
  const att = splitByShares(m.experiences.attendances, EXPERIENCE_CATEGORY_SHARES);
  const rev = splitByShares(m.experienceRevenue, EXPERIENCE_CATEGORY_REVENUE_SHARES);
  const capShares: ShareDef[] = EXPERIENCE_CATEGORY_SHARES.map((d) => ({ ...d, share: d.share / CATEGORY_META[d.id].utilIdx }));
  const cap = splitByShares(m.experiences.capacityOffered, capShares);
  return att.map((a, i) => {
    const meta = CATEGORY_META[a.id];
    return {
      id: a.id,
      name: a.name,
      color: meta.color,
      examples: meta.examples,
      audience: meta.audience,
      model: meta.model,
      sharePct: a.share,
      attendances: a.value,
      revenue: rev[i].value,
      revenueSharePct: ratio(rev[i].value, m.experienceRevenue),
      capacity: cap[i].value,
      utilPct: clamp(ratio(a.value, cap[i].value), 0, 100),
    };
  });
}

/** Share (%) of attendances that happens outdoors / on the water (derived from the category shares). */
export function getOutdoorSharePct(): number {
  return EXPERIENCE_CATEGORY_SHARES.filter((d) => OUTDOOR_CATEGORY_IDS.includes(d.id)).reduce((a, d) => a + d.share, 0);
}

/* ───────────────────────── COMMERCIAL MODELS (COMPLIMENTARY vs PAID) ───────────────────────── */

/** Attendance share of each paid model (revenue shares live in mix.ts). Private is few guests / high ticket. */
const PAID_MODEL_ATTENDANCE_SHARES: ShareDef[] = [
  { id: 'private', name: 'Paid Private & Bespoke Experiences', share: 18 },
  { id: 'group', name: 'Paid Group & Guided Adventures', share: 42 },
  { id: 'partner', name: 'External Partner Excursions', share: 22 },
  { id: 'package', name: 'Package-Included & Paid Upgrades', share: 18 },
];

const MODEL_META: Record<string, { color: string; role: string }> = {
  complimentary: { color: '#0f172a', role: 'Core Stay Enrichment & Retention' },
  private: { color: '#334155', role: 'High-Margin Incremental Yield' },
  group: { color: '#64748b', role: 'Specialist Guide & Vessel Recovery' },
  partner: { color: '#94a3b8', role: 'Commission / Net Margin Share' },
  package: { color: '#cbd5e1', role: 'Room Package Conversion Driver' },
};

export interface ExperienceModelRow {
  id: string;
  name: string;
  color: string;
  role: string;
  isComplimentary: boolean;
  sessions: number;
  attendances: number;
  attendanceSharePct: number;
  /** Paid revenue of the model (0 for complimentary programmes). */
  revenue: number;
  /** Share of paid revenue, % (0 for complimentary). */
  revenueSharePct: number;
  /** Revenue per attendance for paid models. */
  perGuest: number;
}

/**
 * Complimentary + 4 paid commercial models. Attendances sum to experiences.attendances (complimentary row ==
 * complimentaryAttendances), revenue sums to experienceRevenue and sessions sum to experiences.sessions.
 */
export function getExperienceModelRows(m: ExperienceScope): ExperienceModelRow[] {
  const e = m.experiences;
  const paidAtt = splitByShares(e.paidAttendances, PAID_MODEL_ATTENDANCE_SHARES);
  const paidRev = splitByShares(m.experienceRevenue, EXPERIENCE_PAID_MODEL_REVENUE_SHARES);
  const attValues = [e.complimentaryAttendances, ...paidAtt.map((p) => p.value)];
  const sessions = splitByShares(
    e.sessions,
    attValues.map((v, i) => ({ id: String(i), name: '', share: v }))
  );
  const rows: ExperienceModelRow[] = [
    {
      id: 'complimentary',
      name: 'Complimentary Resort Programs',
      color: MODEL_META.complimentary.color,
      role: MODEL_META.complimentary.role,
      isComplimentary: true,
      sessions: sessions[0].value,
      attendances: e.complimentaryAttendances,
      attendanceSharePct: ratio(e.complimentaryAttendances, e.attendances),
      revenue: 0,
      revenueSharePct: 0,
      perGuest: 0,
    },
  ];
  paidAtt.forEach((p, i) => {
    const meta = MODEL_META[p.id];
    rows.push({
      id: p.id,
      name: p.name,
      color: meta.color,
      role: meta.role,
      isComplimentary: false,
      sessions: sessions[i + 1].value,
      attendances: p.value,
      attendanceSharePct: ratio(p.value, e.attendances),
      revenue: paidRev[i].value,
      revenueSharePct: ratio(paidRev[i].value, m.experienceRevenue),
      perGuest: p.value > 0 ? paidRev[i].value / p.value : 0,
    });
  });
  return rows;
}

/* ───────────────────────── GUEST SEGMENTS & PARTICIPATION ───────────────────────── */

interface SegmentDef {
  id: string;
  name: string;
  /** Share of eligible stays, %. */
  eligibleShare: number;
  /** Participation index vs portfolio average (renormalised). */
  partIdx: number;
  /** Activities-per-stay index vs portfolio average (renormalised). */
  freqIdx: number;
  pref: string;
}

const SEGMENT_DEFS: SegmentDef[] = [
  { id: 'families', name: 'Families with Children', eligibleShare: 22, partIdx: 1.2, freqIdx: 1.18, pref: "Kids' Club, Snorkeling, Nature" },
  { id: 'couples', name: 'Couples & Honeymoon', eligibleShare: 36, partIdx: 0.92, freqIdx: 0.92, pref: 'Sunrise Yoga, Private Sailing' },
  { id: 'solo', name: 'Solo & Longevity Seekers', eligibleShare: 14, partIdx: 1.08, freqIdx: 1.28, pref: 'Meditation, Guided Hikes, Culture' },
  { id: 'children', name: 'Children (Ages 4–12)', eligibleShare: 14, partIdx: 1.12, freqIdx: 1.4, pref: 'Junior Marine Bio, Eco-Crafts' },
  { id: 'groups', name: 'Private & Celebration Groups', eligibleShare: 14, partIdx: 0.78, freqIdx: 0.72, pref: 'Yacht Charter, Bespoke Expeditions' },
];

export interface ExperienceSegmentRow {
  id: string;
  name: string;
  pref: string;
  eligible: number;
  participants: number;
  attendances: number;
  partRatePct: number;
  activitiesPerStay: number;
}

/** Eligible stays / unique participants / attendances per segment; every column sums to the engine headline. */
export function getExperienceSegmentRows(m: ExperienceScope): ExperienceSegmentRow[] {
  const e = m.experiences;
  const eligible = splitByShares(
    m.stays,
    SEGMENT_DEFS.map((s) => ({ id: s.id, name: s.name, share: s.eligibleShare }))
  );
  const unique = splitByShares(
    e.uniqueParticipants,
    SEGMENT_DEFS.map((s) => ({ id: s.id, name: s.name, share: s.eligibleShare * s.partIdx }))
  );
  const attendances = splitByShares(
    e.attendances,
    SEGMENT_DEFS.map((s, i) => ({ id: s.id, name: s.name, share: unique[i].value * s.freqIdx }))
  );
  return SEGMENT_DEFS.map((s, i) => ({
    id: s.id,
    name: s.name,
    pref: s.pref,
    eligible: eligible[i].value,
    participants: unique[i].value,
    attendances: attendances[i].value,
    partRatePct: ratio(unique[i].value, eligible[i].value),
    activitiesPerStay: unique[i].value > 0 ? attendances[i].value / unique[i].value : 0,
  }));
}

export interface ExperienceCohortSplit {
  firstTimeParticipants: number;
  repeatParticipants: number;
  firstTimeSharePct: number;
  repeatSharePct: number;
}

export function getExperienceCohortSplit(m: ExperienceScope): ExperienceCohortSplit {
  const u = m.experiences.uniqueParticipants;
  const first = Math.round((u * EXPERIENCE_FIRST_TIME_SHARE_PCT) / 100);
  return {
    firstTimeParticipants: first,
    repeatParticipants: u - first,
    firstTimeSharePct: ratio(first, u),
    repeatSharePct: ratio(u - first, u),
  };
}

/* ───────────────────────── CAPACITY CONSTRAINTS ───────────────────────── */

interface BottleneckDef {
  activity: string;
  fix: string;
  /** Share of the resort's unmet demand sitting on this programme, %. */
  sharePct: number;
}

/** Lead capacity-constrained programmes per resort (at most 65% of a resort's unmet demand in total). */
const BOTTLENECK_PROGRAMS: Record<string, BottleneckDef[]> = {
  'sosei-andermatt': [
    { activity: 'Gotthard Glacier Heli-Ski & Hike', fix: '2nd Partner Helicopter Contract', sharePct: 40 },
    { activity: 'Alpine Thermal Breathwork', fix: 'Add Chalet Studio Session', sharePct: 25 },
  ],
  'sosei-el-gouna': [
    { activity: 'Red Sea Coral Reef Dive Charter', fix: 'Add Morning Yacht Departure', sharePct: 40 },
    { activity: 'Desert Lagoon Kitesurf Clinic', fix: 'Certify 2 Additional Instructors', sharePct: 25 },
  ],
  'sosei-auh': [
    { activity: 'Saadiyat Private Dhow Sunset Cruise', fix: 'Second Dhow Vessel Charter', sharePct: 40 },
    { activity: 'Hawksbill Turtle Conservation Walk', fix: 'Add Dawn Marine Biologist Slot', sharePct: 25 },
  ],
  'sosei-melides': [
    { activity: 'Alentejo Dune Horseback Expedition', fix: 'Expand Equestrian Guide Roster', sharePct: 40 },
    { activity: 'Atlantic Surf & Lagoon Paddle', fix: 'Add Afternoon Tide Session', sharePct: 25 },
  ],
  'sosei-umbria': [
    { activity: 'Private White Truffle Foraging', fix: 'Partner with 2nd Truffle Hunter', sharePct: 40 },
    { activity: 'Medieval Vineyard Cycling Tour', fix: 'Expand E-Bike Fleet & Guide Slot', sharePct: 25 },
  ],
  'sosei-tinos': [
    { activity: 'Cycladic Marble Sculpting Workshop', fix: 'Add Second Artisan Studio Slot', sharePct: 40 },
    { activity: 'Aegean Private Catamaran Hopping', fix: 'Second Vessel Departure', sharePct: 25 },
  ],
  'sosei-barcelona': [
    { activity: 'Private Architect Sail', fix: 'Charter Second Yacht', sharePct: 40 },
    { activity: 'Gothic Quarter Art Walk', fix: 'Add Evening Departure', sharePct: 25 },
  ],
  'sosei-osa': [
    { activity: 'Corcovado Night Wildlife Expedition', fix: 'Certify 2 Additional Naturalists', sharePct: 40 },
    { activity: 'Golfo Dulce Outrigger Voyage', fix: 'Extend Afternoon Window', sharePct: 25 },
  ],
  'sosei-bali': [
    { activity: 'Uluwatu Cliff Sunrise Pranayama', fix: 'Expand Cliff Deck Capacity', sharePct: 40 },
    { activity: 'Melukat Water Blessing', fix: 'Add Dawn Priest Rotation', sharePct: 25 },
  ],
};

/** Program-level utilisation runs above, and fulfilment below, the resort average (points). */
const BOTTLENECK_UTIL_UPLIFT_PTS = 10;
const BOTTLENECK_FULFILL_GAP_PTS = 11;

export interface ExperienceBottleneck {
  propertyId: string;
  propertyName: string;
  activity: string;
  fix: string;
  utilPct: number;
  fulfillPct: number;
  waitlist: number;
}

/** Top capacity-constrained programmes for a selection; the waitlists add up to <= engine unmetDemand. */
export function getExperienceBottlenecks(
  propertyIds: string[] | undefined,
  period: PeriodId,
  limit = 4
): ExperienceBottleneck[] {
  const list = getPropertyMetricsList(propertyIds, period);
  const rows: ExperienceBottleneck[] = [];
  list.forEach((p) => {
    (BOTTLENECK_PROGRAMS[p.propertyId] ?? []).forEach((d) => {
      rows.push({
        propertyId: p.propertyId,
        propertyName: p.name,
        activity: d.activity,
        fix: d.fix,
        utilPct: Math.min(99.5, p.experiences.capacityUtilPct + BOTTLENECK_UTIL_UPLIFT_PTS),
        fulfillPct: Math.max(0, p.experiences.demandFulfillmentPct - BOTTLENECK_FULFILL_GAP_PTS),
        waitlist: Math.floor((p.experiences.unmetDemand * d.sharePct) / 100),
      });
    });
  });
  return rows.sort((a, b) => b.waitlist - a.waitlist).slice(0, limit);
}

/** Estimated paid revenue lost to unmet demand: unmet x paid share x revenue per paid participant. */
export function getUncapturedRevenue(m: ExperienceScope): number {
  const e = m.experiences;
  return e.unmetDemand * (1 - e.compSharePct / 100) * e.revenuePerPaidParticipant;
}

/* ───────────────────────── STAFFING, SAFETY & WEATHER ───────────────────────── */

export interface ExperienceStaffing {
  sessions: number;
  verifiedSessions: number;
  activeGuides: number;
  certifiedGuides: number;
  certCoveragePct: number;
  weatherImpacted: number;
  weatherPivoted: number;
  weatherRetainedPct: number;
  sessionsAtRisk: number;
  nearMisses: number;
  /** Resorts below the readiness target. */
  watchlist: { name: string; readinessPct: number }[];
}

export function getExperienceStaffing(m: ExperienceScope): ExperienceStaffing {
  const e = m.experiences;
  const days = Math.max(1, m.days);
  const activeGuides = Math.max(1, Math.ceil(e.sessions / days / SESSIONS_PER_GUIDE_DAY));
  const certifiedGuides = Math.min(activeGuides, Math.round((activeGuides * EXPERIENCE_CERT_COVERAGE_PCT) / 100));
  const impacted = Math.round((e.sessions * getOutdoorSharePct() * OUTDOOR_WEATHER_IMPACT_PCT) / 10000);
  const pivoted = Math.round((impacted * WEATHER_RETAINED_PCT) / 100);
  return {
    sessions: e.sessions,
    verifiedSessions: e.sessions,
    activeGuides,
    certifiedGuides,
    certCoveragePct: ratio(certifiedGuides, activeGuides),
    weatherImpacted: impacted,
    weatherPivoted: pivoted,
    weatherRetainedPct: impacted > 0 ? ratio(pivoted, impacted) : 100,
    sessionsAtRisk: Math.round((e.sessions * (100 - e.readinessPct)) / 100),
    nearMisses: Math.round((e.sessions * NEAR_MISS_PER_1000_SESSIONS) / 1000),
    watchlist: propertyList(m)
      .filter((p) => p.experiences.readinessPct < EXPERIENCE_READINESS_TARGET_PCT)
      .map((p) => ({ name: p.name, readinessPct: p.experiences.readinessPct })),
  };
}

/* ───────────────────────── FORWARD OUTLOOK ───────────────────────── */

export interface ExperienceForwardWindow {
  windowDays: number;
  /** Expected attendances over the window (forecast). */
  expectedAttendances: number;
  /** Attendances already pre-booked (on the books). */
  otbAttendances: number;
  preBookedPct: number;
  /** Paid experience revenue on the books. */
  otbRevenue: number;
  /** Capacity needed to deliver the forecast attendances at the resort utilisation. */
  forecastCapacity: number;
  capacityCommittedPct: number;
}

export const EXPERIENCE_FORWARD_WINDOWS = [7, 30, 90] as const;

export function getExperienceForwardWindow(propertyIds: string[] | undefined, windowDays: number): ExperienceForwardWindow {
  const fw = getForwardWindowMetrics(propertyIds, windowDays);
  const forecastCapacity = fw.properties.reduce(
    (a, p) => a + Math.round(p.forecastAttendances / (getPropertyProfile(p.propertyId).exp.capacityUtilPct / 100)),
    0
  );
  return {
    windowDays,
    expectedAttendances: fw.forecastAttendances,
    otbAttendances: fw.otbAttendances,
    preBookedPct: ratio(fw.otbAttendances, fw.forecastAttendances),
    otbRevenue: fw.otbExperienceRevenue,
    forecastCapacity,
    capacityCommittedPct: ratio(fw.otbAttendances, forecastCapacity),
  };
}

export function getExperienceForwardOutlook(propertyIds: string[] | undefined): ExperienceForwardWindow[] {
  return EXPERIENCE_FORWARD_WINDOWS.map((w) => getExperienceForwardWindow(propertyIds, w));
}

/* ───────────────────────── STAY CONTRIBUTION (COHORT ASSOCIATION) ───────────────────────── */

const COHORT_DEFS = [
  { id: 'none', label: '0 Activities (Non-Participant)', stayIdx: 0.86, nps: 88.4, repeatPct: 28 },
  { id: 'one', label: '1 Complimentary Activity', stayIdx: 1.04, nps: 92.8, repeatPct: 39 },
  { id: 'multi', label: '2+ Activities (Comp + Paid)', stayIdx: 1.16, nps: 96.6, repeatPct: 51 },
] as const;
/** Bespoke / private experience guests are a subset of the 2+ activity cohort. */
const BESPOKE_STAY_IDX_VS_MULTI = 1.1;
const BESPOKE_SHARE_OF_MULTI = 0.28;
const BESPOKE_NPS = 98.2;
const BESPOKE_REPEAT_PCT = 62;
/** Split of participating stays by number of activities. */
const SINGLE_ACTIVITY_SHARE_OF_PARTICIPANTS = 0.42;

export interface ExperienceStayCohort {
  id: string;
  label: string;
  stays: number;
  avgStayNights: number;
  nps: number;
  repeatPct: number;
}

export interface ExperienceStayContribution {
  /** Guest-nights per guest stay from the engine. */
  avgStayNights: number;
  cohorts: ExperienceStayCohort[];
  /** Stay-length difference between 2+ activity guests and non-participants (nights). */
  stayUpliftNights: number;
  npsUpliftPts: number;
}

/** Cohort average stays are renormalised so the stay-weighted average equals the engine average length of stay. */
export function getExperienceStayContribution(m: ExperienceScope): ExperienceStayContribution {
  const avgStay = m.stays > 0 ? m.guestNights / m.stays : 0;
  const p = m.stays > 0 ? m.experiences.uniqueParticipants / m.stays : 0;
  const weights = [1 - p, p * SINGLE_ACTIVITY_SHARE_OF_PARTICIPANTS, p * (1 - SINGLE_ACTIVITY_SHARE_OF_PARTICIPANTS)];
  const k = 1 / COHORT_DEFS.reduce((a, d, i) => a + weights[i] * d.stayIdx, 0);
  const stays = splitByShares(
    m.stays,
    COHORT_DEFS.map((d, i) => ({ id: d.id, name: d.label, share: weights[i] }))
  );
  const cohorts: ExperienceStayCohort[] = COHORT_DEFS.map((d, i) => ({
    id: d.id,
    label: d.label,
    stays: stays[i].value,
    avgStayNights: avgStay * d.stayIdx * k,
    nps: d.nps,
    repeatPct: d.repeatPct,
  }));
  const multi = cohorts[2];
  cohorts.push({
    id: 'bespoke',
    label: 'Bespoke / Private Experience',
    stays: Math.round(multi.stays * BESPOKE_SHARE_OF_MULTI),
    avgStayNights: multi.avgStayNights * BESPOKE_STAY_IDX_VS_MULTI,
    nps: BESPOKE_NPS,
    repeatPct: BESPOKE_REPEAT_PCT,
  });
  return {
    avgStayNights: avgStay,
    cohorts,
    stayUpliftNights: multi.avgStayNights - cohorts[0].avgStayNights,
    npsUpliftPts: COHORT_DEFS[2].nps - COHORT_DEFS[0].nps,
  };
}

/* ───────────────────────── HEADLINE KPIs ───────────────────────── */

export interface ExperienceKpiData {
  id: string;
  label: string;
  tooltip: string;
  value: string;
  vsLy: string;
  vsLyPos: boolean;
  sub1: string;
  sub2: string;
}

/**
 * Six headline KPIs for a period. Works for a portfolio selection or a single property.
 * Forward = on-the-books only (labels switch to their pre-booked variants).
 */
export function buildExperienceKpis(m: ExperienceScope, period: PeriodId): ExperienceKpiData[] {
  const e = m.experiences;
  const forward = period === 'forward';
  const pts = (factor: number) => yoyPts(m, factor);
  const ptsLabel = (v: number) => `${fmtSignedPts(v)} vs LY`;
  const staffing = getExperienceStaffing(m);
  const cohort = getExperienceCohortSplit(m);
  const revYoy = m.vsLy.experienceRevenuePct;
  const csat = (e.qualityPct / 100) * 5;
  const modelRows = getExperienceModelRows(m);
  const privateRow = modelRows.find((r) => r.id === 'private');

  let fwd: { otb: number; forecast: number; capacity: number } | null = null;
  if (forward) {
    const fw = getExperienceForwardWindow(idsOf(m), FORWARD_DEFAULT_DAYS);
    fwd = { otb: fw.otbAttendances, forecast: fw.expectedAttendances, capacity: fw.forecastCapacity };
  }
  const constrained = propertyList(m).filter((p) => p.experiences.demandFulfillmentPct < 88).length;

  const partV = pts(YOY_PTS_FACTOR.participation);
  const utilV = pts(YOY_PTS_FACTOR.utilization);
  const fulV = pts(YOY_PTS_FACTOR.fulfillment);
  const qualV = pts(YOY_PTS_FACTOR.quality);
  const readV = pts(YOY_PTS_FACTOR.readiness);

  return [
    {
      id: 'participation',
      label: forward ? 'PRE-BOOKED PARTICIPATION' : 'GUEST PARTICIPATION RATE',
      tooltip: forward
        ? 'In-house arrivals over the next 90 days with at least one pre-reserved experience (on the books only).'
        : 'Unique eligible in-house guests participating in ≥1 activity ÷ eligible in-house guests.',
      value: fmtPct(e.participationRatePct),
      vsLy: ptsLabel(partV),
      vsLyPos: partV >= 0,
      sub1: forward
        ? `${fmtInt(e.uniqueParticipants)} Pre-Booked Guests`
        : `${fmtInt(e.uniqueParticipants)} / ${fmtInt(e.eligibleGuests)} Eligible`,
      sub2: `${e.activitiesPerStay.toFixed(2)} Act / Stay`,
    },
    {
      id: 'utilization',
      label: forward ? 'FORWARD CAPACITY COMMITTED' : 'CAPACITY UTILIZATION',
      tooltip: forward
        ? 'Pre-booked attendances ÷ capacity required to deliver the forecast attendances of the next 90 days.'
        : 'Actual attendees ÷ available participant capacity for delivered sessions.',
      value: fwd ? fmtPct(ratio(fwd.otb, fwd.capacity)) : fmtPct(e.capacityUtilPct),
      vsLy: ptsLabel(utilV),
      vsLyPos: utilV >= 0,
      sub1: fwd ? `${fmtInt(fwd.otb)} / ${fmtInt(fwd.capacity)} Places OTB` : `${fmtInt(e.attendances)} / ${fmtInt(e.capacityOffered)} Places`,
      sub2: forward ? `${fmtInt(e.sessions)} Sessions Scheduled` : `${fmtInt(e.sessions)} Sessions`,
    },
    {
      id: 'fulfillment',
      label: forward ? 'FORWARD WAITLIST PRESSURE' : 'DEMAND FULFILLMENT',
      tooltip: forward
        ? 'Forward requests confirmed vs held on waitlist due to guide / vessel limits.'
        : 'Bookings accommodated ÷ total valid demand (including waitlists and full-session turnaways).',
      value: fmtPct(e.demandFulfillmentPct),
      vsLy: ptsLabel(fulV),
      vsLyPos: fulV >= 0,
      sub1: `${fmtInt(e.unmetDemand)} ${forward ? 'Forward Waitlist' : 'Unmet / Waitlist'}`,
      sub2: forward ? `${constrained} Constrained ${constrained === 1 ? 'Resort' : 'Resorts'}` : `${fmtPct(EXPERIENCE_NO_SHOW_PCT)} No-Show`,
    },
    {
      id: 'quality',
      label: forward ? 'PRE-ARRIVAL EXPERIENCE QUALITY' : 'EXPERIENCE QUALITY',
      tooltip: 'Guest satisfaction score, repeat participation rate, and complaint incidence.',
      value: fmtPct(e.qualityPct),
      vsLy: ptsLabel(qualV),
      vsLyPos: qualV >= 0,
      sub1: forward && privateRow ? `${fmtInt(privateRow.attendances)} Bespoke Itineraries` : `${csat.toFixed(2)} / 5.0 CSAT`,
      sub2: `${fmtPct(cohort.repeatSharePct)} Repeat`,
    },
    {
      id: 'readiness',
      label: forward ? 'FORWARD ROSTER & GEAR READY' : 'STAFF & SESSION READINESS',
      tooltip: forward
        ? 'Forward sessions matched with certified guides, vessels, and third-party operators.'
        : 'Percentage of scheduled sessions deliverable with qualified staff, equipment, and safe conditions.',
      value: fmtPct(e.readinessPct),
      vsLy: ptsLabel(readV),
      vsLyPos: readV >= 0,
      sub1: forward ? `${fmtInt(staffing.sessionsAtRisk)} Sessions At Risk` : `${fmtPct(EXPERIENCE_CERT_COVERAGE_PCT)} Cert Coverage`,
      sub2: forward ? `${fmtPct(EXPERIENCE_PARTNER_CONFIRMED_PCT)} Partner Confirmed` : `${fmtPct(EXPERIENCE_GEAR_READY_PCT)} Gear Ready`,
    },
    {
      id: 'contribution',
      label: forward ? 'FORWARD EXPERIENCE REV OTB' : 'PORTFOLIO CONTRIBUTION',
      tooltip: forward
        ? 'Contracted & pre-reserved paid experience revenue on the books for the next 90 days.'
        : 'Commercial paid experience revenue alongside complimentary stay-enriching participation.',
      value: fmtUsd(m.experienceRevenue),
      vsLy: `${fmtSignedPct(revYoy)} vs LY`,
      vsLyPos: revYoy >= 0,
      sub1: forward && privateRow
        ? `${fmtPct(privateRow.revenueSharePct, 0)} Private / Bespoke`
        : `${fmtPct(e.compSharePct, 0)} Comp / ${fmtPct(100 - e.compSharePct, 0)} Paid`,
      sub2: forward ? `${fmtUsdFull(e.revenuePerPaidParticipant)} Avg OTB Spend` : `${fmtUsdFull(e.revenuePerPaidParticipant)} / Paid Guest`,
    },
  ];
}

/* ───────────────────────── PROPERTY RECORD ───────────────────────── */

export interface ExperiencePropertyRecord {
  id: string;
  name: string;
  categoryName: string;
  regionId: RegionId;
  regionName: string;
  location: string;
  rooms: number;
  status: PropertyMetrics['status'];
  programs: number;
  sessions: number;
  attendances: number;
  uniqueParticipants: number;
  capacity: number;
  /** Unmet / waitlisted demand. */
  waitlist: number;
  participationRate: number;
  capacityUtil: number;
  demandFulfillment: number;
  quality: number;
  readiness: number;
  paidRev: number;
  compSharePct: number;
  /** Paid experience revenue growth vs last year, %. */
  lflGrowth: number;
  metrics: PropertyMetrics;
}

/** All Experiences figures of one resort for a period, straight from the engine. */
export function getExperiencePropertyRecord(propertyId: string, period: PeriodId): ExperiencePropertyRecord {
  const m = getPropertyMetrics(propertyId, period);
  const e = m.experiences;
  return {
    id: m.propertyId,
    name: m.name,
    categoryName: m.categoryName,
    regionId: m.regionId,
    regionName: getRegionName(m.regionId),
    location: m.location,
    rooms: m.rooms,
    status: m.status,
    programs: e.programs,
    sessions: e.sessions,
    attendances: e.attendances,
    uniqueParticipants: e.uniqueParticipants,
    capacity: e.capacityOffered,
    waitlist: e.unmetDemand,
    participationRate: e.participationRatePct,
    capacityUtil: e.capacityUtilPct,
    demandFulfillment: e.demandFulfillmentPct,
    quality: e.qualityPct,
    readiness: e.readinessPct,
    paidRev: m.experienceRevenue,
    compSharePct: e.compSharePct,
    lflGrowth: m.vsLy.experienceRevenuePct,
    metrics: m,
  };
}

/* ───────────────────────── REGIONS ───────────────────────── */

export interface ExperienceRegionRow {
  regionId: RegionId;
  region: string;
  properties: number;
  attendances: number;
  attendanceSharePct: number;
  participationPct: number;
  revenue: number;
}

export const EXPERIENCE_REGION_ORDER: RegionId[] = ['asia-pacific', 'europe', 'america', 'middle-east', 'africa'];

/** Regions of the selected resorts; attendance and revenue add up to the portfolio totals. */
export function getExperienceRegionRows(m: PortfolioMetrics): ExperienceRegionRow[] {
  return EXPERIENCE_REGION_ORDER.map((regionId) => {
    const props = m.properties.filter((p) => p.regionId === regionId);
    const att = props.reduce((a, p) => a + p.experiences.attendances, 0);
    const unique = props.reduce((a, p) => a + p.experiences.uniqueParticipants, 0);
    const stays = props.reduce((a, p) => a + p.stays, 0);
    return {
      regionId,
      region: getRegionName(regionId),
      properties: props.length,
      attendances: att,
      attendanceSharePct: ratio(att, m.experiences.attendances),
      participationPct: ratio(unique, stays),
      revenue: props.reduce((a, p) => a + p.experienceRevenue, 0),
    };
  });
}

/* ───────────────────────── KIDS' CLUB (TODAY) ───────────────────────── */

export interface KidsClubControl {
  registered: number;
  checkedIn: number;
  staffAssigned: number;
  /** Children per certified supervisor (policy max is KIDS_CLUB_POLICY_MAX_RATIO). */
  effectiveRatio: number;
  collectionPending: number;
  careFlags: number;
}

/** Kids' Club control view: defaults to TODAY, or scales with the requested period from the kids category attendance. */
export function getKidsClubControl(propertyIds: string[] | undefined, period: PeriodId = 'today'): KidsClubControl {
  const m = getPortfolioMetrics(propertyIds, period);
  const days = Math.max(1, m.days);
  const kids = getExperienceCategoryRows(m).find((c) => c.id === 'kids');
  const registered = kids?.attendances ?? 0;
  const checkedIn = Math.round((registered * KIDS_CHECKED_IN_PCT) / 100);
  const dailyCheckedIn = checkedIn / days;
  const staffAssigned = registered > 0 ? Math.max(1, Math.ceil(dailyCheckedIn / KIDS_CLUB_TARGET_RATIO)) : 0;
  return {
    registered,
    checkedIn,
    staffAssigned,
    effectiveRatio: staffAssigned > 0 ? dailyCheckedIn / staffAssigned : 0,
    collectionPending: Math.round((checkedIn * KIDS_PENDING_COLLECTION_PCT) / 100),
    careFlags: Math.round((registered * KIDS_CARE_FLAG_PCT) / 100),
  };
}

/* ───────────────────────── PROPERTY DAILY SESSION MATRIX ───────────────────────── */

interface ScheduleBlockDef {
  id: 'yoga' | 'expedition' | 'kids' | 'private' | 'sound';
  time: string;
  /** Weight of the period's attendances (kids is taken straight from the kids category). */
  weight: number;
  fillIdx: number;
  staffPerSession: number;
  /** Share of the period's unmet demand waitlisted on this block when it runs at capacity. */
  waitShare: number;
}

const SCHEDULE_BLOCKS: ScheduleBlockDef[] = [
  { id: 'yoga', time: '06:30', weight: 24, fillIdx: 1.0, staffPerSession: 1, waitShare: 0.15 },
  { id: 'expedition', time: '09:00', weight: 30, fillIdx: 1.08, staffPerSession: 3, waitShare: 0.45 },
  { id: 'kids', time: '10:00', weight: 13, fillIdx: 1.0, staffPerSession: 1, waitShare: 0.05 },
  { id: 'private', time: '16:00', weight: 11, fillIdx: 0.95, staffPerSession: 2, waitShare: 0.2 },
  { id: 'sound', time: '17:30', weight: 22, fillIdx: 0.78, staffPerSession: 1, waitShare: 0 },
];

export interface SessionMatrixRow {
  id: ScheduleBlockDef['id'];
  time: string;
  sessions: number;
  demand: number;
  capacity: number;
  waitlist: number;
  fillPct: number;
  staffRequired: number;
  /** Staff actually assigned (one short on the private block when the resort is below the readiness target). */
  staffAssigned: number;
  state: 'ready' | 'constrained' | 'at_risk' | 'low_demand';
}

export interface PropertySessionMatrix {
  rows: SessionMatrixRow[];
  attendances: number;
  capacity: number;
  sessions: number;
  waitlist: number;
  revenuePerPaid: number;
  readinessPct: number;
  capacityUtilPct: number;
  kids: KidsClubControl;
  arrivalsTomorrow: number;
  familiesArriving: number;
  waitlistedCouples: number;
  upsellOpportunity: number;
}

/** Session blocks of ONE resort for a given period (defaults to 'today'). Demand / capacity / sessions sum to the engine figures. */
export function getPropertySessionMatrix(propertyId: string, period: PeriodId = 'today'): PropertySessionMatrix {
  const m = getPropertyMetrics(propertyId, period);
  const e = m.experiences;
  const days = Math.max(1, m.days);
  const kids = getKidsClubControl([propertyId], period);
  const others = SCHEDULE_BLOCKS.filter((b) => b.id !== 'kids');
  const otherDemand = splitByShares(
    Math.max(0, e.attendances - kids.registered),
    others.map((b) => ({ id: b.id, name: b.id, share: b.weight }))
  );
  const demand = SCHEDULE_BLOCKS.map((b) => (b.id === 'kids' ? kids.registered : otherDemand[others.findIndex((o) => o.id === b.id)].value));
  const sessions = splitByShares(
    e.sessions,
    SCHEDULE_BLOCKS.map((b, i) => ({ id: b.id, name: b.id, share: demand[i] }))
  );
  const capacity = splitByShares(
    e.capacityOffered,
    SCHEDULE_BLOCKS.map((b, i) => ({ id: b.id, name: b.id, share: demand[i] / b.fillIdx }))
  );
  const waitSplits = splitByShares(
    e.unmetDemand,
    SCHEDULE_BLOCKS.map((b) => ({ id: b.id, name: b.id, share: b.waitShare }))
  );
  const rows: SessionMatrixRow[] = SCHEDULE_BLOCKS.map((b, i) => {
    const fill = clamp(ratio(demand[i], capacity[i].value), 0, 100);
    const dailySessions = Math.max(1, Math.round(sessions[i].value / days));
    const staffRequired = dailySessions * b.staffPerSession;
    const atRisk = b.id === 'private' && e.readinessPct < EXPERIENCE_READINESS_TARGET_PCT;
    const state: SessionMatrixRow['state'] = atRisk
      ? 'at_risk'
      : fill >= 92 || waitSplits[i].value > 0
        ? 'constrained'
        : fill < e.capacityUtilPct * 0.85
          ? 'low_demand'
          : 'ready';
    return {
      id: b.id,
      time: b.time,
      sessions: sessions[i].value,
      demand: demand[i],
      capacity: capacity[i].value,
      waitlist: waitSplits[i].value,
      fillPct: fill,
      staffRequired,
      staffAssigned: atRisk ? Math.max(0, staffRequired - 1) : staffRequired,
      state,
    };
  });
  const arrivals = Math.round(m.stays);
  const waitlistedCouples = Math.round((e.unmetDemand * COUPLE_WAITLIST_SHARE_PCT) / 100);
  return {
    rows,
    attendances: e.attendances,
    capacity: e.capacityOffered,
    sessions: e.sessions,
    waitlist: e.unmetDemand,
    revenuePerPaid: e.revenuePerPaidParticipant,
    readinessPct: e.readinessPct,
    capacityUtilPct: e.capacityUtilPct,
    kids,
    arrivalsTomorrow: arrivals,
    familiesArriving: Math.round((arrivals * FAMILY_ARRIVAL_SHARE_PCT) / 100),
    waitlistedCouples,
    upsellOpportunity: Math.round(waitlistedCouples * e.revenuePerPaidParticipant),
  };
}
