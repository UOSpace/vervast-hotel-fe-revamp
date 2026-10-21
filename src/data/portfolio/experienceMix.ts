import { MASTER_CATEGORIES, type HotelCategoryId } from '@/constants/categories';
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
import { fmtInt, fmtPct, fmtSignedPct, fmtSignedPts, fmtSignedUsd, fmtUsd, fmtUsdFull } from './format';
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

interface CategorySpecificDef {
  id: string;
  name: string;
  attShare: number;
  revShare: number;
  color: string;
  examples: string;
  audience: string;
  model: string;
  utilIdx: number;
}

const CATEGORY_SPECIFIC_TAXONOMY: Record<HotelCategoryId, CategorySpecificDef[]> = {
  ski: [
    { id: 'heli_cat', name: 'Heli-Ski & Backcountry Cat-Ski', attShare: 18, revShare: 38, color: '#0f172a', examples: 'Glacier heli-skiing, Mt. Yotei cat-ski, backcountry powder', audience: 'Advanced Skiers, Private Groups', model: 'High-Ticket Paid Charter', utilIdx: 1.12 },
    { id: 'alpine_guide', name: 'Private Ski & Alpine Guiding', attShare: 32, revShare: 28, color: '#334155', examples: 'Private UIAGM ski instructor, off-piste carving, first-tracks', audience: 'Adults, Families, All Levels', model: 'Paid Private / Half & Full Day', utilIdx: 1.06 },
    { id: 'glacier_ice', name: 'Glacier Trek & Snow Adventure', attShare: 16, revShare: 14, color: '#475569', examples: 'Glacier ice walk, snowmobile expedition, snowshoeing', audience: 'All Ages, Families, Couples', model: 'Paid Guided / Comp Gear', utilIdx: 1.0 },
    { id: 'apres_recovery', name: 'Après-Ski & Thermal Recovery', attShare: 14, revShare: 8, color: '#64748b', examples: 'Alpine breathwork, volcanic onsen bath, chalet stretch', audience: 'Adults, Skiers', model: 'Complimentary / Paid Private', utilIdx: 0.98 },
    { id: 'kids', name: 'Junior Ski & Mountain Academy', attShare: 12, revShare: 7, color: '#94a3b8', examples: 'Children ski school, snow craft camp, junior avalanche lab', audience: 'Children (Ages 4–12)', model: 'Paid Academy / Comp Club', utilIdx: 0.96 },
    { id: 'mountain_culture', name: 'Alpine Heritage & Cellar Tours', attShare: 8, revShare: 5, color: '#cbd5e1', examples: 'Savoyard cheese farm visit, saké brewery tour, stargazing', audience: 'Adults, Families', model: 'Paid / Package-Included', utilIdx: 0.9 },
  ],
  'beach-resort': [
    { id: 'yacht_charter', name: 'Private Yacht & Boat Charters', attShare: 16, revShare: 38, color: '#0f172a', examples: 'Riva coastal yacht, sunset catamaran, private dhow cruise', audience: 'Couples, Families, VIP Groups', model: 'High-Ticket Paid Charter', utilIdx: 1.12 },
    { id: 'diving_reef', name: 'Scuba Diving & Reef Snorkeling', attShare: 28, revShare: 26, color: '#334155', examples: 'PADI boat dive, coral reef snorkeling, whale shark swim', audience: 'Adults, Certified Divers, Families', model: 'Paid Dive / Comp Snorkel Gear', utilIdx: 1.06 },
    { id: 'surf_ocean', name: 'Surf, Sailing & Ocean Sports', attShare: 20, revShare: 16, color: '#475569', examples: 'Reef surf safari, Hobie cat sailing, sea kayaking, foil board', audience: 'Adults, Teens, Active Guests', model: 'Paid Coaching / Comp Non-Motor', utilIdx: 1.02 },
    { id: 'coastal_island', name: 'Coastal & Island Expeditions', attShare: 14, revShare: 11, color: '#64748b', examples: 'Beach horseback ride, lemon grove walk, giant tortoise walk', audience: 'All Ages, Couples, Families', model: 'Paid Guided Excursion', utilIdx: 0.96 },
    { id: 'kids', name: 'Junior Marine & Coral Club', attShare: 12, revShare: 5, color: '#94a3b8', examples: 'Junior marine biologist, coral reef planting, tidepool explore', audience: 'Children (Ages 4–12)', model: 'Complimentary / Paid Camp', utilIdx: 0.95 },
    { id: 'cliff_mindful', name: 'Sunrise Cliff Yoga & Sound', attShare: 10, revShare: 4, color: '#cbd5e1', examples: 'Oceanfront sunrise yoga, beach pranayama, sunset meditation', audience: 'Adults, Couples', model: 'Complimentary / Paid Private', utilIdx: 0.92 },
  ],
  nature: [
    { id: 'safari_wildlife', name: 'Wildlife Safari & Game Drives', attShare: 30, revShare: 36, color: '#0f172a', examples: 'Big-Five 4x4 game drive, puma tracking, migration tracking', audience: 'All Ages, Couples, Families', model: 'Paid Private Vehicle / Guided', utilIdx: 1.1 },
    { id: 'aerial_expedition', name: 'Balloon & Heli Wilderness Safari', attShare: 14, revShare: 32, color: '#334155', examples: 'Dawn hot-air balloon safari, glacier & fjord helicopter tour', audience: 'Couples, VIP Groups', model: 'High-Ticket Paid Expedition', utilIdx: 1.12 },
    { id: 'trek_glacier', name: 'Glacier & Wilderness Trekking', attShare: 24, revShare: 16, color: '#475569', examples: 'Torres del Paine trek, Grey Glacier kayak, guided bush walk', audience: 'Adults, Active Teens', model: 'Complimentary / Paid Private Guide', utilIdx: 1.02 },
    { id: 'conservation', name: 'Conservation & Night Astronomy', attShare: 12, revShare: 8, color: '#64748b', examples: 'Predator collar telemetry, Southern Cross stargazing', audience: 'Adults, Families', model: 'Paid Philanthropy / Comp Talk', utilIdx: 0.95 },
    { id: 'kids', name: 'Junior Wildlife Ranger Camp', attShare: 10, revShare: 4, color: '#94a3b8', examples: 'Spoor tracking, bushcraft skills, junior naturalist logbook', audience: 'Children (Ages 5–12)', model: 'Complimentary / Paid Camp', utilIdx: 0.94 },
    { id: 'bush_mindful', name: 'Savanna & Steppe Mindful Yoga', attShare: 10, revShare: 4, color: '#cbd5e1', examples: 'Kopje sunrise stretch, Patagonian wind breathwork', audience: 'Adults', model: 'Complimentary / Paid Private', utilIdx: 0.9 },
  ],
  urban: [
    { id: 'private_atelier', name: 'Private Atelier & Horology Tours', attShare: 24, revShare: 36, color: '#0f172a', examples: 'Haute Horlogerie master watchmaker, private riad & museum', audience: 'Adults, Collectors, VIPs', model: 'High-Ticket Paid Bespoke', utilIdx: 1.1 },
    { id: 'lake_aviation', name: 'Lake Riva, Heli & Vintage Drive', attShare: 18, revShare: 32, color: '#334155', examples: 'Lake Geneva Riva cruise, Atlas Mountains heli-tour, classic car', audience: 'Couples, Private Groups', model: 'High-Ticket Paid Charter', utilIdx: 1.08 },
    { id: 'artisan_master', name: 'Culinary & Artisan Masterclasses', attShare: 22, revShare: 16, color: '#475569', examples: 'Swiss chocolatier lab, Moroccan perfumery & ceramic studio', audience: 'Adults, Families', model: 'Paid Masterclass', utilIdx: 1.0 },
    { id: 'heritage_curator', name: 'Curated Heritage & Art Walks', attShare: 16, revShare: 10, color: '#64748b', examples: 'Old Town historian walk, Majorelle & souk curator tour', audience: 'Adults, Families', model: 'Paid Private / Comp Morning Walk', utilIdx: 0.95 },
    { id: 'rooftop_mindful', name: 'Rooftop Yoga & Mindful Studio', attShare: 12, revShare: 4, color: '#94a3b8', examples: 'Lakeview morning yoga, courtyard sound meditation', audience: 'Adults', model: 'Complimentary / Paid Private', utilIdx: 0.92 },
    { id: 'kids', name: 'Junior Cultural Explorer', attShare: 8, revShare: 2, color: '#cbd5e1', examples: 'Junior watchmaker workshop, storytelling & calligraphy', audience: 'Children (Ages 4–12)', model: 'Complimentary / Paid Workshop', utilIdx: 0.9 },
  ],
  wellness: [
    { id: 'zen_sound', name: 'Zen Meditation & Canyon Sound', attShare: 28, revShare: 28, color: '#0f172a', examples: 'Arashiyama dawn Zen temple meditation, canyon acoustic bath', audience: 'Adults, Longevity Seekers', model: 'Complimentary / Paid Private Master', utilIdx: 1.08 },
    { id: 'heritage_ritual', name: 'Tea Master & Ancient Sanctuary', attShare: 22, revShare: 30, color: '#334155', examples: 'Private Uji chashitsu tea ceremony, Hegra Nabataean private tour', audience: 'Adults, Couples, Families', model: 'High-Ticket Paid Bespoke', utilIdx: 1.06 },
    { id: 'stargazing_desert', name: 'Astronomy & Desert / Forest Walk', attShare: 20, revShare: 20, color: '#475569', examples: 'Hegra desert stargazing, Arashiyama bamboo grove dawn walk', audience: 'All Ages, Couples', model: 'Paid Guided / Comp Dawn Walk', utilIdx: 1.02 },
    { id: 'botanical_craft', name: 'Botanical, Ikebana & Kintsugi', attShare: 14, revShare: 14, color: '#64748b', examples: 'Kintsugi gold-joinery, Ikebana floral art, desert oil alchemy', audience: 'Adults, Teens', model: 'Paid Studio Workshop', utilIdx: 0.96 },
    { id: 'breath_movement', name: 'Longevity Breathwork & Qigong', attShare: 10, revShare: 5, color: '#94a3b8', examples: 'Pranayama, forest bathing (Shinrin-yoku), somatic movement', audience: 'Adults', model: 'Complimentary / Paid Private', utilIdx: 0.94 },
    { id: 'kids', name: 'Junior Nature & Craft Studio', attShare: 6, revShare: 3, color: '#cbd5e1', examples: 'Origami & bamboo craft, junior desert astronomer', audience: 'Children (Ages 5–12)', model: 'Complimentary / Paid Studio', utilIdx: 0.9 },
  ],
};

/**
 * Activity categories. When scoped to a single resort category (e.g. Ski or Beach Resort),
 * returns logical category-specific activities (no diving in Ski, no snow ski in Beach Resort).
 * Attendances sum to experiences.attendances, revenue sums to experienceRevenue.
 */
export function getExperienceCategoryRows(m: ExperienceScope): ExperienceCategoryRow[] {
  const props = propertyList(m);
  const uniqueCats = Array.from(new Set(props.map((p) => p.categoryId)));
  const singleCategory = uniqueCats.length === 1 ? uniqueCats[0] : null;

  if (singleCategory && CATEGORY_SPECIFIC_TAXONOMY[singleCategory]) {
    const defs = CATEGORY_SPECIFIC_TAXONOMY[singleCategory];
    const attShares: ShareDef[] = defs.map((d) => ({ id: d.id, name: d.name, share: d.attShare }));
    const revShares: ShareDef[] = defs.map((d) => ({ id: d.id, name: d.name, share: d.revShare }));
    const capShares: ShareDef[] = defs.map((d) => ({ id: d.id, name: d.name, share: d.attShare / d.utilIdx }));

    const att = splitByShares(m.experiences.attendances, attShares);
    const rev = splitByShares(m.experienceRevenue, revShares);
    const cap = splitByShares(m.experiences.capacityOffered, capShares);

    return defs.map((d, i) => ({
      id: d.id,
      name: d.name,
      color: d.color,
      examples: d.examples,
      audience: d.audience,
      model: d.model,
      sharePct: d.attShare,
      attendances: att[i].value,
      revenue: rev[i].value,
      revenueSharePct: ratio(rev[i].value, m.experienceRevenue),
      capacity: cap[i].value,
      utilPct: clamp(ratio(att[i].value, cap[i].value), 0, 100),
    }));
  }

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
  'sosei-courchevel': [
    { activity: 'Trois Vallées Glacier Heli-Ski & Hike', fix: '2nd Partner Helicopter Contract', sharePct: 40 },
    { activity: 'Alpine Thermal Breathwork', fix: 'Add Chalet Studio Session', sharePct: 25 },
  ],
  'sosei-niseko': [
    { activity: 'Mount Yotei Backcountry Cat-Ski', fix: 'Add Second Snowcat Departure', sharePct: 40 },
    { activity: 'Volcanic Onsen Forest Bathing', fix: 'Extend Afternoon Guide Slot', sharePct: 25 },
  ],
  'sosei-aspen': [
    { activity: 'Continental Divide Heli-Powder Tour', fix: 'Add Morning Charter Slot', sharePct: 40 },
    { activity: 'High-Altitude Oxygen Recovery Lab', fix: 'Add 2nd Practitioner Suite', sharePct: 25 },
  ],
  'sosei-amalfi': [
    { activity: 'Capri & Positano Private Riva Charter', fix: 'Partner with 2nd Riva Yacht', sharePct: 40 },
    { activity: 'Ravello Cliffside Lemon Grove Walk', fix: 'Expand Agronomist Guide Slot', sharePct: 25 },
  ],
  'sosei-sumba': [
    { activity: 'Sumbanese Stallion Sunset Beach Ride', fix: 'Expand Equestrian Guide Roster', sharePct: 40 },
    { activity: 'Occy’s Left Reef Surf Safari', fix: 'Add Second Tropics Boat Transfer', sharePct: 25 },
  ],
  'sosei-los-cabos': [
    { activity: 'Sea of Cortez Whale Shark Sail', fix: 'Expand Catamaran Charter Fleet', sharePct: 40 },
    { activity: 'Baja Desert Arroyo Horseback Trek', fix: 'Add Late-Afternoon Tide Session', sharePct: 25 },
  ],
  'sosei-muscat': [
    { activity: 'Dimaniyat Islands Private Dhow Dive', fix: 'Add Second Dhow Vessel Departure', sharePct: 40 },
    { activity: 'Jebel Akhdar Canyon Via Ferrata', fix: 'Certify 2 Additional Mountaineers', sharePct: 25 },
  ],
  'sosei-seychelles': [
    { activity: 'Félicité & La Digue Helicopter Hop', fix: 'Second Island Heli Slot', sharePct: 40 },
    { activity: 'Aldabra Giant Tortoise Sanctuary Walk', fix: 'Add Dawn Naturalist Rotation', sharePct: 25 },
  ],
  'sosei-geneva': [
    { activity: 'Private Haute Horlogerie Atelier Tour', fix: 'Partner with 2nd Master Watchmaker', sharePct: 40 },
    { activity: 'Lake Geneva Classic Riva Cruise', fix: 'Add Sunset Departure', sharePct: 25 },
  ],
  'sosei-marrakech': [
    { activity: 'Atlas Mountains Private Heli-Trek', fix: 'Add Morning Helicopter Rotation', sharePct: 40 },
    { activity: 'Medina Artisan & Majorelle Curator Walk', fix: 'Certify 2 Additional Historians', sharePct: 25 },
  ],
  'sosei-patagonia': [
    { activity: 'Torres del Paine Puma Tracking Safari', fix: 'Certify 2 Additional Trackers', sharePct: 40 },
    { activity: 'Grey Glacier Ice-Hike & Kayak Voyage', fix: 'Extend Afternoon Expedition Window', sharePct: 25 },
  ],
  'sosei-serengeti': [
    { activity: 'Great Migration Dawn Balloon Safari', fix: 'Add Second Balloon Pilot Crew', sharePct: 40 },
    { activity: 'Kopje Lion & Leopard Conservation Drive', fix: 'Add 2nd Open-Top Land Cruiser', sharePct: 25 },
  ],
  'sosei-kyoto': [
    { activity: 'Arashiyama Dawn Zen Temple Meditation', fix: 'Expand Temple Garden Session', sharePct: 40 },
    { activity: 'Private Uji Tea Master Ceremony', fix: 'Add Afternoon Chashitsu Rotation', sharePct: 25 },
  ],
  'sosei-alula': [
    { activity: 'Hegra Nabataean Stargazing & Astronomy', fix: 'Add Second Telescope Deck', sharePct: 40 },
    { activity: 'Ashar Sandstone Canyon Sound Bath', fix: 'Add Twilight Acoustic Session', sharePct: 25 },
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

/* ───────────────────────── GLOBAL OVERVIEW REVAMP HELPERS (REVENUE & PEAK LOAD FOCUS) ───────────────────────── */

export interface ExperienceHeadlineKpi {
  id: string;
  label: string;
  value: string;
  vsLy: string;
  vsLyPos: boolean;
  vsBudget: string;
  vsForecast: string;
}

/**
 * 5 Uniform Headline KPIs for Global & Property Experience Views (aligned with FnbDashboardPage.tsx).
 * Focused on Experience Revenue, Spend per Paid Guest, Guest Participation, Peak Load Utilization, and Experience Score.
 */
export function getExperienceHeadlineKpis(
  ids: readonly string[] | undefined,
  period: PeriodId
): ExperienceHeadlineKpi[] {
  const m = getPortfolioMetrics(ids ? [...ids] : undefined, period);
  const e = m.experiences;
  const revLyPct = m.vsLy.experienceRevenuePct;
  const revBudgetPct = m.vsBudget.experienceRevenuePct;
  const revForecastPct = m.vsForecast.experienceRevenuePct;

  const spendPerPaid = e.revenuePerPaidParticipant;
  const spendLyDelta = Math.round(spendPerPaid * (revLyPct / 100) * 0.55);
  const spendBudgetDelta = Math.round(spendPerPaid * (revBudgetPct / 100) * 0.55);
  const spendForecastDelta = Math.round(spendPerPaid * (revForecastPct / 100) * 0.55);

  const partLyPts = yoyPts(m, YOY_PTS_FACTOR.participation);
  const partBudgetPts = partLyPts * 0.48;
  const partForecastPts = partLyPts * 0.22;

  const peakLoadPct = Math.min(98.4, e.capacityUtilPct + 6.2);
  const loadLyPts = yoyPts(m, YOY_PTS_FACTOR.utilization) * 1.15;
  const loadBudgetPts = loadLyPts * 0.45;
  const loadForecastPts = loadLyPts * 0.2;

  const qualLyPts = yoyPts(m, YOY_PTS_FACTOR.quality);

  return [
    {
      id: 'contribution',
      label: 'EXPERIENCE REVENUE',
      value: fmtUsd(m.experienceRevenue),
      vsLy: `${fmtSignedPct(revLyPct)} vs LY`,
      vsLyPos: revLyPct >= 0,
      vsBudget: `${fmtSignedPct(revBudgetPct)} vs Budget`,
      vsForecast: `${fmtSignedPct(revForecastPct)} vs Forecast`,
    },
    {
      id: 'spend',
      label: 'AVG SPEND / PAID PARTICIPANT',
      value: fmtUsdFull(spendPerPaid),
      vsLy: `${fmtSignedUsd(spendLyDelta)} vs LY`,
      vsLyPos: spendLyDelta >= 0,
      vsBudget: `${fmtSignedUsd(spendBudgetDelta)} vs Budget`,
      vsForecast: `${fmtSignedUsd(spendForecastDelta)} vs Forecast`,
    },
    {
      id: 'participation',
      label: 'GUEST PARTICIPATION RATE',
      value: fmtPct(e.participationRatePct),
      vsLy: `${fmtSignedPts(partLyPts)} vs LY`,
      vsLyPos: partLyPts >= 0,
      vsBudget: `${fmtSignedPts(partBudgetPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(partForecastPts)} vs Forecast`,
    },
    {
      id: 'utilization',
      label: 'PEAK LOAD & CAPACITY UTIL.',
      value: fmtPct(peakLoadPct),
      vsLy: `${fmtSignedPts(loadLyPts)} vs LY`,
      vsLyPos: loadLyPts >= 0,
      vsBudget: `${fmtSignedPts(loadBudgetPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(loadForecastPts)} vs Forecast`,
    },
    {
      id: 'quality',
      label: 'GUEST EXPERIENCE SCORE',
      value: fmtPct(e.qualityPct),
      vsLy: `${fmtSignedPts(qualLyPts)} vs LY`,
      vsLyPos: qualLyPts >= 0,
      vsBudget: '+0.8 pts vs Budget',
      vsForecast: '+0.4 pts vs Forecast',
    },
  ];
}

/** Logical property-specific signature activity descriptors (Ski has snow/glacier, Beach has ocean/yacht, etc.). */
export const PROPERTY_EXPERIENCE_DESCRIPTORS: Record<
  string,
  { signatureFocus: string; peakSlotLabel: string }
> = {
  'sosei-courchevel': {
    signatureFocus: 'Glacier Heli-Ski & Private Alpine Guide',
    peakSlotLabel: '09:00 First-Tracks Peak',
  },
  'sosei-niseko': {
    signatureFocus: 'Mt. Yotei Cat-Ski & Backcountry Powder',
    peakSlotLabel: '08:30 Powder Peak',
  },
  'sosei-aspen': {
    signatureFocus: 'Continental Divide Heli-Powder & Snowmobile',
    peakSlotLabel: '09:00 Alpine Peak',
  },
  'sosei-amalfi': {
    signatureFocus: 'Capri Riva Yacht Charter & Cliff Grove Walk',
    peakSlotLabel: '16:30 Sunset Yacht Peak',
  },
  'sosei-sumba': {
    signatureFocus: 'Occy’s Reef Surf Safari & Beach Stallion Ride',
    peakSlotLabel: '17:00 Sunset Stallion Peak',
  },
  'sosei-los-cabos': {
    signatureFocus: 'Sea of Cortez Catamaran & Whale Shark Dive',
    peakSlotLabel: '09:30 Marine Peak',
  },
  'sosei-muscat': {
    signatureFocus: 'Dimaniyat Private Dhow Dive & Canyon Ferrata',
    peakSlotLabel: '08:30 Dhow Dive Peak',
  },
  'sosei-seychelles': {
    signatureFocus: 'Félicité Island Heli-Hop & Granite Reef Sail',
    peakSlotLabel: '10:00 Island Charter Peak',
  },
  'sosei-geneva': {
    signatureFocus: 'Haute Horlogerie Atelier & Lake Riva Cruise',
    peakSlotLabel: '14:00 Private Atelier Peak',
  },
  'sosei-marrakech': {
    signatureFocus: 'Atlas Heli-Trek & Private Medina Curator',
    peakSlotLabel: '09:30 Atlas & Souk Peak',
  },
  'sosei-patagonia': {
    signatureFocus: 'Puma Tracking Safari & Grey Glacier Kayak',
    peakSlotLabel: '06:30 Dawn Tracker Peak',
  },
  'sosei-serengeti': {
    signatureFocus: 'Migration Balloon Safari & Big-Five Drive',
    peakSlotLabel: '06:00 Dawn Balloon Peak',
  },
  'sosei-kyoto': {
    signatureFocus: 'Arashiyama Dawn Zen Temple & Uji Tea Master',
    peakSlotLabel: '07:00 Zen & Tea Peak',
  },
  'sosei-alula': {
    signatureFocus: 'Hegra Nabataean Stargazing & Canyon Sound',
    peakSlotLabel: '19:30 Stargazing Peak',
  },
};

export interface ExperienceCollectionRow {
  categoryId: HotelCategoryId;
  name: string;
  signatureActivities: string;
  propertyCount: number;
  revenue: number;
  sharePct: number;
  paidAttendances: number;
  peakLoadPct: number;
  avgSpend: number;
}

const COLLECTION_ACTIVITY_LABELS: Record<HotelCategoryId, string> = {
  'beach-resort': 'Private Yachts, Scuba Diving, Surf & Reef Sailing',
  ski: 'Glacier Heli-Ski, Cat-Ski, Private Ski Guide & Ice Trek',
  nature: 'Big-Five Safari, Dawn Balloon, Puma Track & Glacier Kayak',
  urban: 'Horology Ateliers, Lake Riva Cruise, Atlas Heli & Curators',
  wellness: 'Dawn Zen Meditation, Uji Tea Master, Stargazing & Sound',
};

/**
 * Aggregates Experience Revenue & Peak Load across the 5 SOSEI Resort Collections
 * so each collection displays its own logical domain of activities.
 */
export function getExperienceCollectionSummary(period: PeriodId): ExperienceCollectionRow[] {
  const allPortfolio = getPortfolioMetrics(undefined, period);
  return MASTER_CATEGORIES.map((cat) => {
    const m = getPortfolioMetrics(cat.propertyIds, period);
    const e = m.experiences;
    const peakLoadPct = clamp(e.capacityUtilPct + 6.5, 72, 98.5);
    return {
      categoryId: cat.id,
      name: cat.name,
      signatureActivities: COLLECTION_ACTIVITY_LABELS[cat.id],
      propertyCount: cat.propertyIds.length,
      revenue: m.experienceRevenue,
      sharePct: ratio(m.experienceRevenue, allPortfolio.experienceRevenue),
      paidAttendances: e.paidAttendances,
      peakLoadPct,
      avgSpend: e.revenuePerPaidParticipant,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export interface ExperienceResortRow {
  propertyId: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  status: PropertyMetrics['status'];
  signatureFocus: string;
  peakSlotLabel: string;
  revenue: number;
  paidAttendances: number;
  attendances: number;
  participationPct: number;
  peakLoadPct: number;
  avgSpend: number;
  waitlist: number;
}

export function getExperienceResortRanking(
  ids: readonly string[] | undefined,
  period: PeriodId
): ExperienceResortRow[] {
  return getPropertyMetricsList(ids ? [...ids] : undefined, period)
    .map((p) => {
      const desc = PROPERTY_EXPERIENCE_DESCRIPTORS[p.propertyId] ?? {
        signatureFocus: 'Signature Guided Experiences',
        peakSlotLabel: '09:00 Morning Peak',
      };
      const peakLoadPct = clamp(p.experiences.capacityUtilPct + 6.8, 70, 98.8);
      return {
        propertyId: p.propertyId,
        name: p.name,
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        status: p.status,
        signatureFocus: desc.signatureFocus,
        peakSlotLabel: desc.peakSlotLabel,
        revenue: p.experienceRevenue,
        paidAttendances: p.experiences.paidAttendances,
        attendances: p.experiences.attendances,
        participationPct: p.experiences.participationRatePct,
        peakLoadPct,
        avgSpend: p.experiences.revenuePerPaidParticipant,
        waitlist: p.experiences.unmetDemand,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export interface ExperiencePeakWindowRow {
  id: string;
  windowLabel: string;
  timeRange: string;
  focusExamples: string;
  sessions: number;
  attendances: number;
  revenue: number;
  sharePct: number;
  peakLoadPct: number;
  waitlist: number;
  avgSpend: number;
}

const PEAK_WINDOW_DEFS = [
  {
    id: 'morning_prime',
    windowLabel: 'Morning Prime Peak',
    timeRange: '09:00 – 12:30',
    focusExamples: 'Heli-Ski, First-Tracks, Boat Dives & Island Charters',
    revShare: 38,
    attShare: 32,
    waitShare: 44,
    loadBoost: 11.5,
  },
  {
    id: 'sunset_golden',
    windowLabel: 'Sunset & Golden Hour Peak',
    timeRange: '16:00 – 19:00',
    focusExamples: 'Riva Sunset Yacht, Beach Stallion Ride & Sundowner Sail',
    revShare: 26,
    attShare: 22,
    waitShare: 28,
    loadBoost: 9.2,
  },
  {
    id: 'afternoon_atelier',
    windowLabel: 'Afternoon Excursion & Atelier',
    timeRange: '13:00 – 16:00',
    focusExamples: 'Horology Atelier, Glacier Kayak, Surf & Tea Ceremony',
    revShare: 18,
    attShare: 20,
    waitShare: 14,
    loadBoost: 2.4,
  },
  {
    id: 'dawn_expedition',
    windowLabel: 'Dawn Safari & Sunrise Mindful',
    timeRange: '06:00 – 09:00',
    focusExamples: 'Balloon Safari, Puma Tracking, Zen Temple & Cliff Yoga',
    revShare: 12,
    attShare: 18,
    waitShare: 10,
    loadBoost: 5.8,
  },
  {
    id: 'night_astronomy',
    windowLabel: 'Evening & Stargazing',
    timeRange: '19:30 – 22:00',
    focusExamples: 'Hegra Telescope Astronomy, Night Reef Dive & Sound Bath',
    revShare: 6,
    attShare: 8,
    waitShare: 4,
    loadBoost: -1.5,
  },
] as const;

/**
 * Breaks down Experience Revenue & Peak Load across the 5 operating time windows of the day.
 */
export function getExperiencePeakLoadWindows(m: ExperienceScope): ExperiencePeakWindowRow[] {
  const e = m.experiences;
  const revSplits = splitByShares(
    m.experienceRevenue,
    PEAK_WINDOW_DEFS.map((d) => ({ id: d.id, name: d.windowLabel, share: d.revShare }))
  );
  const attSplits = splitByShares(
    e.attendances,
    PEAK_WINDOW_DEFS.map((d) => ({ id: d.id, name: d.windowLabel, share: d.attShare }))
  );
  const sesSplits = splitByShares(
    e.sessions,
    PEAK_WINDOW_DEFS.map((d) => ({ id: d.id, name: d.windowLabel, share: d.attShare }))
  );
  const waitSplits = splitByShares(
    e.unmetDemand,
    PEAK_WINDOW_DEFS.map((d) => ({ id: d.id, name: d.windowLabel, share: d.waitShare }))
  );

  return PEAK_WINDOW_DEFS.map((d, i) => {
    const rev = revSplits[i].value;
    const att = attSplits[i].value;
    const paidAtt = Math.max(1, Math.round(att * (1 - e.compSharePct / 100)));
    return {
      id: d.id,
      windowLabel: d.windowLabel,
      timeRange: d.timeRange,
      focusExamples: d.focusExamples,
      sessions: sesSplits[i].value,
      attendances: att,
      revenue: rev,
      sharePct: d.revShare,
      peakLoadPct: clamp(e.capacityUtilPct + d.loadBoost, 68, 98.6),
      waitlist: waitSplits[i].value,
      avgSpend: rev / paidAtt,
    };
  });
}

export type ExperienceCategoryFilter = 'all' | 'ski' | 'beach-resort' | 'nature' | 'urban_wellness';

export interface ExperienceSignatureActivityRow {
  id: string;
  activityName: string;
  propertyId: string;
  propertyName: string;
  categoryId: HotelCategoryId;
  categoryLabel: 'Ski & Alpine' | 'Beach & Marine' | 'Nature & Safari' | 'Urban Atelier' | 'Wellness & Heritage';
  peakWindow: string;
  attendances: number;
  revenue: number;
  peakLoadPct: number;
  pricePerGuest: number;
}

const SIGNATURE_ACTIVITY_CATALOG: {
  id: string;
  propertyId: string;
  activityName: string;
  categoryLabel: ExperienceSignatureActivityRow['categoryLabel'];
  peakWindow: string;
  revShareOfProp: number;
  pricePerGuest: number;
  loadBoost: number;
}[] = [
  // Ski Collection (Snow, Heli-Ski, Cat-Ski, Glacier ONLY)
  {
    id: 'act-cou-1',
    propertyId: 'sosei-courchevel',
    activityName: 'Trois Vallées Glacier Heli-Ski & Private Guide',
    categoryLabel: 'Ski & Alpine',
    peakWindow: '09:00 Morning Peak',
    revShareOfProp: 0.36,
    pricePerGuest: 1450,
    loadBoost: 11.2,
  },
  {
    id: 'act-nis-1',
    propertyId: 'sosei-niseko',
    activityName: 'Mt. Yotei Backcountry Cat-Ski Expedition',
    categoryLabel: 'Ski & Alpine',
    peakWindow: '08:30 Powder Peak',
    revShareOfProp: 0.34,
    pricePerGuest: 980,
    loadBoost: 10.4,
  },
  {
    id: 'act-asp-1',
    propertyId: 'sosei-aspen',
    activityName: 'Continental Divide Heli-Powder & Snowmobile',
    categoryLabel: 'Ski & Alpine',
    peakWindow: '09:00 Alpine Peak',
    revShareOfProp: 0.33,
    pricePerGuest: 1280,
    loadBoost: 9.8,
  },
  // Beach Resort Collection (Yacht, Diving, Surf, Ocean ONLY)
  {
    id: 'act-ama-1',
    propertyId: 'sosei-amalfi',
    activityName: 'Capri & Positano Private Riva Yacht Charter',
    categoryLabel: 'Beach & Marine',
    peakWindow: '16:00 Sunset Peak',
    revShareOfProp: 0.38,
    pricePerGuest: 1350,
    loadBoost: 11.6,
  },
  {
    id: 'act-sey-1',
    propertyId: 'sosei-seychelles',
    activityName: 'Félicité & La Digue Helicopter & Reef Yacht',
    categoryLabel: 'Beach & Marine',
    peakWindow: '10:00 Island Peak',
    revShareOfProp: 0.36,
    pricePerGuest: 1190,
    loadBoost: 10.2,
  },
  {
    id: 'act-sum-1',
    propertyId: 'sosei-sumba',
    activityName: 'Occy’s Left Reef Surf Safari & Stallion Ride',
    categoryLabel: 'Beach & Marine',
    peakWindow: '16:30 Sunset Peak',
    revShareOfProp: 0.35,
    pricePerGuest: 640,
    loadBoost: 9.5,
  },
  {
    id: 'act-mct-1',
    propertyId: 'sosei-muscat',
    activityName: 'Dimaniyat Islands Private Dhow Scuba Dive',
    categoryLabel: 'Beach & Marine',
    peakWindow: '08:30 Marine Peak',
    revShareOfProp: 0.34,
    pricePerGuest: 720,
    loadBoost: 8.9,
  },
  {
    id: 'act-cab-1',
    propertyId: 'sosei-los-cabos',
    activityName: 'Sea of Cortez Private Catamaran & Whale Shark',
    categoryLabel: 'Beach & Marine',
    peakWindow: '09:30 Ocean Peak',
    revShareOfProp: 0.34,
    pricePerGuest: 860,
    loadBoost: 9.1,
  },
  // Nature Collection (Safari, Balloon, Puma Tracking, Glacier Trek ONLY)
  {
    id: 'act-ser-1',
    propertyId: 'sosei-serengeti',
    activityName: 'Great Migration Dawn Balloon & Big-Five Drive',
    categoryLabel: 'Nature & Safari',
    peakWindow: '06:00 Dawn Peak',
    revShareOfProp: 0.4,
    pricePerGuest: 1150,
    loadBoost: 11.8,
  },
  {
    id: 'act-pat-1',
    propertyId: 'sosei-patagonia',
    activityName: 'Torres del Paine Puma Tracking & Glacier Kayak',
    categoryLabel: 'Nature & Safari',
    peakWindow: '06:30 Dawn Peak',
    revShareOfProp: 0.37,
    pricePerGuest: 890,
    loadBoost: 10.1,
  },
  // Urban & Wellness Collections (Horology, Tea Ceremony, Stargazing, Atlas Heli)
  {
    id: 'act-gva-1',
    propertyId: 'sosei-geneva',
    activityName: 'Private Haute Horlogerie Master Watchmaker Tour',
    categoryLabel: 'Urban Atelier',
    peakWindow: '14:00 Atelier Peak',
    revShareOfProp: 0.38,
    pricePerGuest: 1120,
    loadBoost: 9.6,
  },
  {
    id: 'act-mar-1',
    propertyId: 'sosei-marrakech',
    activityName: 'Atlas Mountains Private Heli-Trek & Palace Curator',
    categoryLabel: 'Urban Atelier',
    peakWindow: '09:30 Morning Peak',
    revShareOfProp: 0.35,
    pricePerGuest: 780,
    loadBoost: 7.4,
  },
  {
    id: 'act-kyo-1',
    propertyId: 'sosei-kyoto',
    activityName: 'Arashiyama Dawn Zen Temple & Uji Tea Master',
    categoryLabel: 'Wellness & Heritage',
    peakWindow: '07:00 Dawn Peak',
    revShareOfProp: 0.36,
    pricePerGuest: 680,
    loadBoost: 9.9,
  },
  {
    id: 'act-alu-1',
    propertyId: 'sosei-alula',
    activityName: 'Hegra Private Stargazing & Canyon Sound Bath',
    categoryLabel: 'Wellness & Heritage',
    peakWindow: '19:30 Evening Peak',
    revShareOfProp: 0.37,
    pricePerGuest: 740,
    loadBoost: 10.3,
  },
];

export function getExperienceSignatureActivities(
  ids: readonly string[] | undefined,
  period: PeriodId
): ExperienceSignatureActivityRow[] {
  const props = getPropertyMetricsList(ids ? [...ids] : undefined, period);
  const propMap = new Map(props.map((p) => [p.propertyId, p]));

  return SIGNATURE_ACTIVITY_CATALOG.filter((item) => propMap.has(item.propertyId))
    .map((item) => {
      const p = propMap.get(item.propertyId)!;
      const revenue = Math.round(p.experienceRevenue * item.revShareOfProp);
      const attendances = Math.max(8, Math.round(revenue / item.pricePerGuest));
      return {
        id: item.id,
        activityName: item.activityName,
        propertyId: p.propertyId,
        propertyName: p.name,
        categoryId: p.categoryId,
        categoryLabel: item.categoryLabel,
        peakWindow: item.peakWindow,
        attendances,
        revenue,
        peakLoadPct: clamp(p.experiences.capacityUtilPct + item.loadBoost, 75, 99.2),
        pricePerGuest: item.pricePerGuest,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

/* ───────────────────────── HIGH-VALUE PRIVATE CHARTERS & EXPEDITIONS ───────────────────────── */

export interface ExperiencePrivateCharterRow {
  id: string;
  charterName: string;
  categoryLabel: string;
  propertyId: string;
  propertyName: string;
  dateWindow: string;
  pax: number;
  revenue: number;
  statusLabel: 'Peak Slot Locked' | 'Heli Confirmed' | 'Yacht Assigned' | 'Waitlist Priority';
  detailNote: string;
}

const PRIVATE_CHARTER_DEFS: (ShareDef & {
  categoryLabel: string;
  propertyId: string;
  propertyName: string;
  dateWindow: string;
  paxWeight: number;
  statusLabel: ExperiencePrivateCharterRow['statusLabel'];
  detailNote: string;
})[] = [
  {
    id: 'chr-1',
    name: 'Trois Vallées Twin-Heli Glacier Powder Buyout',
    share: 24,
    categoryLabel: 'Ski · Heli-Charter',
    propertyId: 'sosei-courchevel',
    propertyName: 'SOSEI Courchevel',
    dateWindow: 'Oct 24–26',
    paxWeight: 16,
    statusLabel: 'Heli Confirmed',
    detailNote: '2 private helicopters · UIAGM mountain guides & glacier mountain lunch',
  },
  {
    id: 'chr-2',
    name: 'Amalfi to Capri Riva Aquarama Fleet Charter',
    share: 22,
    categoryLabel: 'Beach · Yacht Charter',
    propertyId: 'sosei-amalfi',
    propertyName: 'SOSEI Amalfi',
    dateWindow: 'Oct 27–29',
    paxWeight: 24,
    statusLabel: 'Yacht Assigned',
    detailNote: '3 private Riva yachts · Blue Grotto morning entry & coastal sunset cruise',
  },
  {
    id: 'chr-3',
    name: 'Serengeti Kopje Private Balloon & Safari Expedition',
    share: 20,
    categoryLabel: 'Nature · Aerial Safari',
    propertyId: 'sosei-serengeti',
    propertyName: 'SOSEI Serengeti',
    dateWindow: 'Nov 1–3',
    paxWeight: 18,
    statusLabel: 'Peak Slot Locked',
    detailNote: 'Exclusive dawn balloon basket · 3 private Land Cruisers & bush breakfast',
  },
  {
    id: 'chr-4',
    name: 'Geneva Master Watchmaker & Lake Riva Private Tour',
    share: 18,
    categoryLabel: 'Urban · Private Atelier',
    propertyId: 'sosei-geneva',
    propertyName: 'SOSEI Geneva',
    dateWindow: 'Nov 5–6',
    paxWeight: 14,
    statusLabel: 'Peak Slot Locked',
    detailNote: 'Closed-door Grande Complication atelier access & private lake transfer',
  },
  {
    id: 'chr-5',
    name: 'Hegra Ancient Tomb & Private Astronomer Buyout',
    share: 16,
    categoryLabel: 'Wellness · Heritage',
    propertyId: 'sosei-alula',
    propertyName: 'SOSEI AlUla',
    dateWindow: 'Nov 10–12',
    paxWeight: 20,
    statusLabel: 'Waitlist Priority',
    detailNote: 'Private twilight canyon access · Deep-sky telescope deck & acoustic bath',
  },
];

export function getExperiencePrivateCharters(
  ids: readonly string[] | undefined,
  period: PeriodId
): {
  charters: ExperiencePrivateCharterRow[];
  totalRevenue: number;
  totalPax: number;
} {
  const m = getPortfolioMetrics(ids ? [...ids] : undefined, period);
  const privateModel = getExperienceModelRows(m).find((r) => r.id === 'private');
  const poolRev = Math.round(privateModel?.revenue ?? m.experienceRevenue * 0.38);
  const scalePax = period === 'today' ? 0.35 : period === 'ytd' ? 6.2 : 1;

  const revSplits = splitByShares(poolRev, PRIVATE_CHARTER_DEFS);
  const charters: ExperiencePrivateCharterRow[] = PRIVATE_CHARTER_DEFS.map((d, i) => {
    const pax = Math.max(4, Math.round(d.paxWeight * scalePax));
    const revenue = revSplits[i].value;
    return {
      id: d.id,
      charterName: d.name,
      categoryLabel: d.categoryLabel,
      propertyId: d.propertyId,
      propertyName: d.propertyName,
      dateWindow: d.dateWindow,
      pax,
      revenue,
      statusLabel: d.statusLabel,
      detailNote: d.detailNote,
    };
  });

  return {
    charters,
    totalRevenue: charters.reduce((a, c) => a + c.revenue, 0),
    totalPax: charters.reduce((a, c) => a + c.pax, 0),
  };
}

/* ───────────────────────── PEAK LOAD SIGNALS & COMMERCIAL OPPORTUNITIES ───────────────────────── */

export interface ExperienceSignalRow {
  id: string;
  type: 'risk' | 'opportunity';
  title: string;
  sub: string;
  exposure: string;
  exposureValue: number;
}

export function getExperienceOperationalSignals(
  ids: readonly string[] | undefined,
  period: PeriodId
): { signals: ExperienceSignalRow[]; pipelineValue: number } {
  const m = getPortfolioMetrics(ids ? [...ids] : undefined, period);
  const uncaptured = getUncapturedRevenue(m);
  const suffix = period === 'today' ? 'Yesterday' : period.toUpperCase();

  const skiRev = Math.round(uncaptured * 0.36);
  const beachRev = Math.round(uncaptured * 0.32);
  const safariRev = Math.round(uncaptured * 0.2);
  const atelierRev = Math.round(uncaptured * 0.18);

  const signals: ExperienceSignalRow[] = [
    {
      id: 'exp-sig-1',
      type: 'risk',
      title: '09:00 Morning Peak Load At 96% — Ski Heli & Cat-Ski Waitlist',
      sub: 'SOSEI Courchevel & SOSEI Niseko · Second helicopter & snowcat slot requested',
      exposure: `${fmtUsd(skiRev)} ${suffix}`,
      exposureValue: skiRev,
    },
    {
      id: 'exp-sig-2',
      type: 'opportunity',
      title: '16:30 Sunset Yacht & Dhow Peak Load Expansion — Beach Resorts',
      sub: 'SOSEI Amalfi, Seychelles & Muscat · High conversion on private coastal charters',
      exposure: `+${fmtUsd(beachRev)} ${suffix}`,
      exposureValue: beachRev,
    },
    {
      id: 'exp-sig-3',
      type: 'risk',
      title: '06:00 Dawn Safari & Puma Tracker Capacity Bottleneck',
      sub: 'SOSEI Serengeti & SOSEI Patagonia · Morning expedition slots 95% booked',
      exposure: `${fmtUsd(safariRev)} ${suffix}`,
      exposureValue: safariRev,
    },
    {
      id: 'exp-sig-4',
      type: 'opportunity',
      title: 'Private Atelier, Horology & Tea Master Pre-Arrival Upsell',
      sub: 'SOSEI Geneva, Kyoto & AlUla · +18% pre-arrival concierge package attachment',
      exposure: `+${fmtUsd(atelierRev)} ${suffix}`,
      exposureValue: atelierRev,
    },
  ];

  return {
    signals,
    pipelineValue: skiRev + beachRev + safariRev + atelierRev,
  };
}

