import type { MetricsCore } from './engine';

/**
 * SHARED MIX DEFINITIONS - fixed share tables used to split an engine total into categories.
 * A split ALWAYS sums exactly to the engine total it splits (largest-remainder rounding),
 * so a category table can never disagree with the headline number above it.
 */

export interface ShareDef {
  id: string;
  name: string;
  /** Share of the total, in %. Must sum to 100 inside one table. */
  share: number;
}

export interface SplitResult extends ShareDef {
  value: number;
}

/** Split an integer total across share definitions so the parts add up to the total exactly. */
export function splitByShares(total: number, defs: ShareDef[]): SplitResult[] {
  const sumShares = defs.reduce((a, d) => a + d.share, 0) || 1;
  const exact = defs.map((d) => (total * d.share) / sumShares);
  const floors = exact.map((v) => Math.floor(v));
  let remainder = Math.round(total) - floors.reduce((a, v) => a + v, 0);
  const order = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const values = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) values[order[k].i] += 1;
  return defs.map((d, i) => ({ ...d, value: values[i] }));
}

/* ───────────── F&B ───────────── */

/** F&B revenue by revenue centre (6 centres). */
export const FNB_REVENUE_CENTRE_SHARES: ShareDef[] = [
  { id: 'fine', name: 'Fine & Specialty Dining', share: 34.0 },
  { id: 'allday', name: 'All-Day Dining & Buffet', share: 20.6 },
  { id: 'bars', name: 'Bars & Sunset Lounges', share: 16.0 },
  { id: 'inVilla', name: 'In-Villa & Room Service', share: 12.0 },
  { id: 'pool', name: 'Pool, Beach & Minibar', share: 9.4 },
  { id: 'banquet', name: 'Banqueting & Private Dining', share: 8.0 },
];

/** Average-check index per revenue centre (1.00 = property average check). */
export const FNB_REVENUE_CENTRE_CHECK_INDEX: Record<string, number> = {
  fine: 1.55,
  allday: 0.62,
  bars: 0.78,
  inVilla: 1.1,
  pool: 0.66,
  banquet: 2.4,
};

/** F&B revenue by cuisine concept (AI categorised). */
export const FNB_CUISINE_SHARES: ShareDef[] = [
  { id: 'japanese', name: 'Japanese, Omakase & Robata', share: 28 },
  { id: 'italian', name: 'Italian & Coastal Mediterranean', share: 22 },
  { id: 'western', name: 'Contemporary Western & Grill', share: 18 },
  { id: 'korean', name: 'Korean Fine Grill & Pan-Asian', share: 14 },
  { id: 'heritage', name: 'Local Heritage & Indigenous', share: 10 },
  { id: 'wellness', name: 'Botanical & Longevity Cuisine', share: 8 },
];

/** F&B revenue by guest source. */
export const FNB_DEMAND_SOURCE_SHARES: ShareDef[] = [
  { id: 'alacarte', name: 'A La Carte In-House', share: 46 },
  { id: 'mealplan', name: 'Meal-Plan Package', share: 24 },
  { id: 'private', name: 'Private & Bespoke', share: 12 },
  { id: 'external', name: 'External / Walk-In', share: 10 },
  { id: 'inVilla', name: 'In-Villa / Room Service', share: 8 },
];

/* ───────────── EXPERIENCES ───────────── */

/** Attendances by activity category (Spa excluded). */
export const EXPERIENCE_CATEGORY_SHARES: ShareDef[] = [
  { id: 'water', name: 'Water & Marine', share: 24 },
  { id: 'yoga', name: 'Yoga & Meditation', share: 21 },
  { id: 'nature', name: 'Nature & Adventure', share: 19 },
  { id: 'culture', name: 'Culture & Workshops', share: 14 },
  { id: 'kids', name: "Kids' Club & Family", share: 13 },
  { id: 'signature', name: 'Signature & Excursions', share: 9 },
];

/** Paid-revenue share per activity category (differs from attendance share: signature is high ticket). */
export const EXPERIENCE_CATEGORY_REVENUE_SHARES: ShareDef[] = [
  { id: 'water', name: 'Water & Marine', share: 27 },
  { id: 'yoga', name: 'Yoga & Meditation', share: 8 },
  { id: 'nature', name: 'Nature & Adventure', share: 20 },
  { id: 'culture', name: 'Culture & Workshops', share: 10 },
  { id: 'kids', name: "Kids' Club & Family", share: 5 },
  { id: 'signature', name: 'Signature & Excursions', share: 30 },
];

/** Commercial role of experiences: share of paid REVENUE. Complimentary has no revenue by definition. */
export const EXPERIENCE_PAID_MODEL_REVENUE_SHARES: ShareDef[] = [
  { id: 'private', name: 'Paid Private & Bespoke Experiences', share: 46 },
  { id: 'group', name: 'Paid Group & Guided Adventures', share: 26 },
  { id: 'partner', name: 'External Partner Excursions', share: 20 },
  { id: 'package', name: 'Package-Included & Paid Upgrades', share: 8 },
];

/* ───────────── HOSPITALITY REVENUE & DEMAND MIX ───────────── */

/** Share of room revenue that is sold inside curated stay packages (shown as the "Packages" pillar). */
export const PACKAGE_SHARE_OF_ROOM_REVENUE = 0.045;
/** Share of Spa & Wellness revenue that is medical / longevity wellness (rest is spa). */
export const WELLNESS_SHARE_OF_SPA = 0.42;

export interface RevenuePillar {
  id: 'rooms' | 'fnb' | 'spa' | 'activities';
  name: string;
  value: number;
  sharePct: number;
}

/**
 * The 4 pillars of the Hospitality "Revenue & Demand Mix". They add up EXACTLY to metrics.totalRevenue:
 * Rooms + F&B + Spa + Activities = Total Revenue.
 */
export function getHospitalityRevenuePillars(m: Pick<MetricsCore, 'roomRevenue' | 'fnbRevenue' | 'spaRevenue' | 'experienceRevenue' | 'totalRevenue'>): RevenuePillar[] {
  const rows: Array<Omit<RevenuePillar, 'sharePct'>> = [
    { id: 'rooms', name: 'Rooms', value: m.roomRevenue },
    { id: 'fnb', name: 'F&B', value: m.fnbRevenue },
    { id: 'spa', name: 'Spa', value: m.spaRevenue },
    { id: 'activities', name: 'Activities', value: m.experienceRevenue },
  ];
  return rows.map((r) => ({ ...r, sharePct: m.totalRevenue > 0 ? (r.value / m.totalRevenue) * 100 : 0 }));
}
