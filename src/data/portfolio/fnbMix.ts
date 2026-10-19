import { MASTER_PROPERTIES } from '@/constants/categories';
import type { HotelCategoryId } from '@/constants/categories';
import { MASTER_REGIONS } from '@/constants/regions';
import type { RegionId } from '@/constants/regions';
import {
  getForwardWindowMetrics,
  getPortfolioMetrics,
  getPropertyMetrics,
  getPropertyMetricsList,
  getPropertyProfile,
} from './engine';
import type { MetricsCore, PropertyMetrics, RevenueSnapshot } from './engine';
import type { PeriodId } from './periods';
import {
  FNB_CUISINE_SHARES,
  FNB_DEMAND_SOURCE_SHARES,
  FNB_REVENUE_CENTRE_CHECK_INDEX,
  FNB_REVENUE_CENTRE_SHARES,
  splitByShares,
} from './mix';
import type { ShareDef } from './mix';
import {
  fmtCompactInt,
  fmtInt,
  fmtPct,
  fmtSignedPct,
  fmtSignedPts,
  fmtSignedUsd,
  fmtUsd,
  fmtUsdFull,
} from './format';

/**
 * F&B DOMAIN LAYER - everything the four F&B dashboards (Global, Categories, Regional, Property) and their
 * drawers need, derived from the portfolio engine. Revenue-centre / cuisine / demand-source / origin / daypart /
 * outlet tables are produced with splitByShares, so every table sums EXACTLY to the engine headline
 * (m.fnbRevenue / m.fnb.covers) it belongs to. Only percentage / index assumptions live in this file.
 */

/* ───────────────────────── ASSUMPTIONS (percent / ratio only) ───────────────────────── */

/** Seat sittings a seat can serve per day across all dayparts (capacity in covers = seat-days x sittings). */
export const FNB_SEAT_SITTINGS_PER_DAY = 1.8;
/** Covers per POS check (party size at the table). */
export const FNB_COVERS_PER_CHECK = 2.1;
/** Average party size of a private dining / banquet booking. */
export const FNB_EVENT_PARTY_SIZE = 24;
/** Trading hours per day of a bar / lounge. */
export const FNB_BAR_TRADING_HOURS = 10;
/** Qualitative service constants (no revenue meaning). */
export const FNB_SERVICE_SIGNALS = {
  villaSlaMinutes: 23.4,
  villaSlaBreachPct: 11.4,
  pairingGapPct: 14,
  waitlistUpliftPct: 8,
  sommelierUpliftPct: 3.5,
} as const;
/** Qualitative guest-experience scores (CSAT-style, not driven by trading volume). */
export const FNB_GUEST_EXPERIENCE = {
  scorePct: 94.8,
  csat: 4.82,
  complaintRatePct: 0.8,
  recoveryMinutes: 14,
  recoverySlaPct: 96.4,
  vsLyPts: 1.4,
  vsTargetPts: 0.8,
  bevAttachPct: 43.8,
} as const;
/** Property cost benchmarks (percent of F&B revenue). */
export const FNB_COST_PROFILE = {
  targetFoodPct: 28,
  targetBevPct: 22,
  labourPct: 29.4,
  byStatus: {
    attention: { foodPct: 30.2, bevPct: 23.4, sentiment: 89.8 },
    on_plan: { foodPct: 26.8, bevPct: 20.6, sentiment: 94.1 },
    above_plan: { foodPct: 26.8, bevPct: 20.6, sentiment: 96.2 },
  },
} as const;

export const FNB_PALETTE = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'] as const;

/** Short label used next to money amounts that belong to the selected period. */
export const FNB_PERIOD_SUFFIX: Record<PeriodId, string> = {
  today: 'today',
  mtd: 'MTD',
  ytd: 'YTD',
  forward: 'OTB 90D',
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const ratio = (num: number, den: number) => (den > 0 ? num / den : 0);

/* ───────────────────────── SPLIT HELPERS ───────────────────────── */

export interface FnbSplitRow {
  id: string;
  name: string;
  sharePct: number;
  revenue: number;
  covers: number;
  avgCheck: number;
  color: string;
}

/** Splits revenue by share and covers by share/checkIndex so that avgCheck_i = revenue_i / covers_i and both sum to the totals. */
function buildSplitRows(
  revenueTotal: number,
  coversTotal: number,
  defs: ShareDef[],
  checkIndex: Record<string, number>,
  palette: readonly string[]
): FnbSplitRow[] {
  const rev = splitByShares(Math.round(revenueTotal), defs);
  const cov = splitByShares(
    Math.round(coversTotal),
    defs.map((d) => ({ ...d, share: d.share / (checkIndex[d.id] ?? 1) }))
  );
  const totalShare = defs.reduce((a, d) => a + d.share, 0) || 1;
  return defs.map((d, i) => ({
    id: d.id,
    name: d.name,
    sharePct: (d.share / totalShare) * 100,
    revenue: rev[i].value,
    covers: cov[i].value,
    avgCheck: ratio(rev[i].value, cov[i].value),
    color: palette[i % palette.length],
  }));
}

/** Weighted mean of offsets (weights = share) is removed so category growth is centred on the headline LFL. */
function centredOffsets(defs: ShareDef[], offsets: Record<string, number>): Record<string, number> {
  const total = defs.reduce((a, d) => a + d.share, 0) || 1;
  const mean = defs.reduce((a, d) => a + (d.share / total) * (offsets[d.id] ?? 0), 0);
  const out: Record<string, number> = {};
  defs.forEach((d) => {
    out[d.id] = (offsets[d.id] ?? 0) - mean;
  });
  return out;
}

/* ───────────────────────── REVENUE CENTRES ───────────────────────── */

const CENTRE_GROWTH_OFFSET_PTS: Record<string, number> = {
  fine: 1.2,
  allday: -3.0,
  bars: 0.6,
  inVilla: 2.8,
  pool: -3.4,
  banquet: 2.0,
};

export interface FnbCentreRow extends FnbSplitRow {
  growthPct: number;
}

export function getFnbCentres(m: MetricsCore): FnbCentreRow[] {
  const rows = buildSplitRows(m.fnbRevenue, m.fnb.covers, FNB_REVENUE_CENTRE_SHARES, FNB_REVENUE_CENTRE_CHECK_INDEX, FNB_PALETTE);
  const off = centredOffsets(FNB_REVENUE_CENTRE_SHARES, CENTRE_GROWTH_OFFSET_PTS);
  return rows.map((r) => ({ ...r, growthPct: m.vsLy.fnbRevenuePct + (off[r.id] ?? 0) }));
}

/** Covers per revenue centre for any covers total (used for forward windows). */
export function coversByCentre(covers: number): Record<string, number> {
  const split = splitByShares(
    Math.round(covers),
    FNB_REVENUE_CENTRE_SHARES.map((d) => ({ ...d, share: d.share / (FNB_REVENUE_CENTRE_CHECK_INDEX[d.id] ?? 1) }))
  );
  const out: Record<string, number> = {};
  split.forEach((s) => {
    out[s.id] = s.value;
  });
  return out;
}

/* ───────────────────────── CUISINES ───────────────────────── */

const CUISINE_META: Record<string, { checkIdx: number; bevIdx: number; marginPct: number; growthOffsetPts: number }> = {
  japanese: { checkIdx: 1.45, bevIdx: 1.12, marginPct: 74.2, growthOffsetPts: 3.6 },
  italian: { checkIdx: 1.0, bevIdx: 1.02, marginPct: 76.8, growthOffsetPts: -0.4 },
  western: { checkIdx: 1.15, bevIdx: 1.14, marginPct: 69.4, growthOffsetPts: -2.6 },
  korean: { checkIdx: 1.05, bevIdx: 0.92, marginPct: 73.5, growthOffsetPts: 7.0 },
  heritage: { checkIdx: 0.92, bevIdx: 0.82, marginPct: 78.1, growthOffsetPts: -1.8 },
  wellness: { checkIdx: 0.85, bevIdx: 0.68, marginPct: 79.6, growthOffsetPts: 3.0 },
};

export interface FnbCuisineRow extends FnbSplitRow {
  outlets: number;
  bevSharePct: number;
  foodRevenue: number;
  bevRevenue: number;
  marginPct: number;
  growthPct: number;
}

export function getFnbCuisines(m: MetricsCore): FnbCuisineRow[] {
  const checkIdx: Record<string, number> = {};
  Object.entries(CUISINE_META).forEach(([k, v]) => {
    checkIdx[k] = v.checkIdx;
  });
  const rows = buildSplitRows(m.fnbRevenue, m.fnb.covers, FNB_CUISINE_SHARES, checkIdx, FNB_PALETTE);
  const outlets = splitByShares(m.fnb.outlets, FNB_CUISINE_SHARES);
  const totalShare = FNB_CUISINE_SHARES.reduce((a, d) => a + d.share, 0) || 1;
  const weightedBevIdx = FNB_CUISINE_SHARES.reduce((a, d) => a + (d.share / totalShare) * CUISINE_META[d.id].bevIdx, 0) || 1;
  const off = centredOffsets(
    FNB_CUISINE_SHARES,
    Object.fromEntries(Object.entries(CUISINE_META).map(([k, v]) => [k, v.growthOffsetPts]))
  );
  return rows.map((r, i) => {
    const bevSharePct = clamp((m.fnb.bevSharePct * CUISINE_META[r.id].bevIdx) / weightedBevIdx, 0, 95);
    const bevRevenue = Math.round((r.revenue * bevSharePct) / 100);
    const foodRevenue = Math.max(0, Math.round(r.revenue) - bevRevenue);
    return {
      ...r,
      outlets: outlets[i].value,
      bevSharePct,
      foodRevenue,
      bevRevenue,
      marginPct: CUISINE_META[r.id].marginPct,
      growthPct: m.vsLy.fnbRevenuePct + (off[r.id] ?? 0),
    };
  });
}

/* ───────────────────────── DEMAND SOURCES ───────────────────────── */

const DEMAND_SOURCE_CHECK_INDEX: Record<string, number> = {
  alacarte: 1.12,
  mealplan: 0.86,
  private: 1.54,
  external: 1.05,
  inVilla: 0.78,
};

export function getFnbDemandSources(m: MetricsCore): FnbSplitRow[] {
  return buildSplitRows(m.fnbRevenue, m.fnb.covers, FNB_DEMAND_SOURCE_SHARES, DEMAND_SOURCE_CHECK_INDEX, FNB_PALETTE);
}

/* ───────────────────────── GUEST ORIGIN MARKETS ───────────────────────── */

interface OriginDef extends ShareDef {
  captureIdx: number;
  spendIdx: number;
  bevIdx: number;
  behaviour: string;
}

const ORIGIN_DEFS: OriginDef[] = [
  { id: 'asia-pacific', name: 'Asia Pacific', share: 35, captureIdx: 1.0, spendIdx: 1.08, bevIdx: 1.04, behaviour: 'Strong Omakase, Tasting Menu & Vintage Wine/Whisky flight conversion (JP, SG, AU)' },
  { id: 'europe', name: 'Europe', share: 25, captureIdx: 0.94, spendIdx: 0.96, bevIdx: 1.12, behaviour: 'High Half-Board utilization + Coastal Mediterranean & Wine Cellar uptake (UK, CH, FR)' },
  { id: 'america', name: 'America', share: 20, captureIdx: 1.04, spendIdx: 1.12, bevIdx: 1.08, behaviour: 'High Prime Grill, Sunset Cocktails & In-Villa Dining attachment (US, CA, BR)' },
  { id: 'middle-east', name: 'Middle East', share: 12, captureIdx: 1.16, spendIdx: 1.38, bevIdx: 0.78, behaviour: 'Highest Private Sandbank Dining, In-Villa BBQ & Zero-Proof Elixir spend (UAE, KSA, QA)' },
  { id: 'africa', name: 'Africa', share: 8, captureIdx: 0.88, spendIdx: 0.86, bevIdx: 0.92, behaviour: 'Strong Beach Club, Restorative Wellness Grazing & Chef Table participation (ZA, EG, MA)' },
];

export interface FnbOriginRow {
  id: string;
  name: string;
  guestNights: number;
  guestSharePct: number;
  capturePct: number;
  covers: number;
  coversSharePct: number;
  avgCheck: number;
  revenue: number;
  foodRevenue: number;
  bevRevenue: number;
  spendPerGuestNight: number;
  behaviour: string;
}

export function getFnbOrigins(m: MetricsCore): FnbOriginRow[] {
  const gn = splitByShares(m.guestNights, ORIGIN_DEFS);
  const totalShare = ORIGIN_DEFS.reduce((a, d) => a + d.share, 0) || 1;
  const weightedCapIdx = ORIGIN_DEFS.reduce((a, d) => a + (d.share / totalShare) * d.captureIdx, 0) || 1;
  const weightedBevIdx = ORIGIN_DEFS.reduce((a, d) => a + (d.share / totalShare) * d.bevIdx, 0) || 1;
  const capture = ORIGIN_DEFS.map((d) => clamp((m.fnb.captureRatePct * d.captureIdx) / weightedCapIdx, 0, 98));
  const covers = splitByShares(
    m.fnb.covers,
    ORIGIN_DEFS.map((d, i) => ({ ...d, share: gn[i].value * capture[i] }))
  );
  const rev = splitByShares(
    m.fnbRevenue,
    ORIGIN_DEFS.map((d, i) => ({ ...d, share: covers[i].value * d.spendIdx }))
  );
  return ORIGIN_DEFS.map((d, i) => {
    const revenue = rev[i].value;
    const bevSharePct = clamp((m.fnb.bevSharePct * d.bevIdx) / weightedBevIdx, 10, 60);
    const bevRevenue = Math.round((revenue * bevSharePct) / 100);
    const foodRevenue = Math.max(0, Math.round(revenue) - bevRevenue);
    return {
      id: d.id,
      name: d.name,
      guestNights: gn[i].value,
      guestSharePct: (d.share / totalShare) * 100,
      capturePct: capture[i],
      covers: covers[i].value,
      coversSharePct: ratio(covers[i].value, m.fnb.covers) * 100,
      avgCheck: ratio(revenue, covers[i].value),
      revenue,
      foodRevenue,
      bevRevenue,
      spendPerGuestNight: ratio(revenue, gn[i].value),
      behaviour: d.behaviour,
    };
  });
}

/* ───────────────────────── DAYPARTS ───────────────────────── */

interface DaypartDef {
  id: string;
  name: string;
  window: string;
  checkIdx: number;
  seatShare: number;
  sla: string;
}

const DAYPART_DEFS: DaypartDef[] = [
  { id: 'bfast', name: 'Breakfast & Morning Ritual', window: '06:30 – 11:00', checkIdx: 0.6, seatShare: 28, sla: '96.4% < 14m' },
  { id: 'lunch', name: 'Lunch & Terrace Dining', window: '12:00 – 15:30', checkIdx: 0.95, seatShare: 22, sla: '94.8% < 18m' },
  { id: 'sunset', name: 'Sunset & Aperitif Hour', window: '16:30 – 19:00', checkIdx: 0.85, seatShare: 16, sla: '98.1% < 8m' },
  { id: 'dinner', name: 'Prime Dinner Service', window: '19:00 – 22:30', checkIdx: 1.5, seatShare: 22, sla: '93.2% On-Pace' },
  { id: 'late', name: 'In-Villa & Late Night', window: '22:30 – 06:00', checkIdx: 0.9, seatShare: 12, sla: `${FNB_SERVICE_SIGNALS.villaSlaMinutes}m Avg Delivery` },
];

/** Revenue share per daypart (sums to 100). Beach / nature resorts lean on breakfast, urban on lunch. */
function daypartShares(categoryId?: HotelCategoryId): Record<string, number> {
  const bfast = categoryId === 'beach-resort' || categoryId === 'nature' ? 22 : 16;
  const lunch = categoryId === 'urban' ? 22 : 20;
  const sunset = 14;
  const late = 8;
  return { bfast, lunch, sunset, late, dinner: 100 - bfast - lunch - sunset - late };
}

export interface FnbDaypartRow {
  id: string;
  name: string;
  window: string;
  sharePct: number;
  revenue: number;
  covers: number;
  revpash: number;
  sla: string;
}

export function getFnbDayparts(m: MetricsCore, categoryId?: HotelCategoryId): FnbDaypartRow[] {
  const shares = daypartShares(categoryId);
  const defs: ShareDef[] = DAYPART_DEFS.map((d) => ({ id: d.id, name: d.name, share: shares[d.id] }));
  const rev = splitByShares(Math.round(m.fnbRevenue), defs);
  const cov = splitByShares(
    Math.round(m.fnb.covers),
    DAYPART_DEFS.map((d) => ({ id: d.id, name: d.name, share: shares[d.id] / d.checkIdx }))
  );
  return DAYPART_DEFS.map((d, i) => ({
    id: d.id,
    name: d.name,
    window: d.window,
    sharePct: shares[d.id],
    revenue: rev[i].value,
    covers: cov[i].value,
    revpash: ratio(rev[i].value, (m.fnb.seatHours * d.seatShare) / 100),
    sla: d.sla,
  }));
}

/* ───────────────────────── OUTLET GROUPS (property trading board) ───────────────────────── */

interface OutletGroupDef {
  id: string;
  centres: string[];
  seatShare: number;
  status: string;
}

const OUTLET_GROUP_DEFS: OutletGroupDef[] = [
  { id: 'signature', centres: ['fine'], seatShare: 26, status: 'Peak Demand' },
  { id: 'allday', centres: ['allday', 'bars', 'pool'], seatShare: 44, status: 'On Plan' },
  { id: 'ivd', centres: ['inVilla'], seatShare: 18, status: `${FNB_SERVICE_SIGNALS.villaSlaMinutes}m Avg SLA` },
  { id: 'banquet', centres: ['banquet'], seatShare: 12, status: 'Contracted Events' },
];

export interface FnbOutletGroupRow {
  id: string;
  sharePct: number;
  revenue: number;
  covers: number;
  avgCheck: number;
  revpash: number;
  status: string;
  centreIds: string[];
}

/** Outlet groups are sums of the 6 revenue centres, so they add up to the property headline exactly. */
export function getFnbOutletGroups(m: MetricsCore): FnbOutletGroupRow[] {
  const centres = getFnbCentres(m);
  return OUTLET_GROUP_DEFS.map((g) => {
    const rows = centres.filter((c) => g.centres.includes(c.id));
    const revenue = rows.reduce((a, c) => a + c.revenue, 0);
    const covers = rows.reduce((a, c) => a + c.covers, 0);
    return {
      id: g.id,
      sharePct: ratio(revenue, m.fnbRevenue) * 100,
      revenue,
      covers,
      avgCheck: ratio(revenue, covers),
      revpash: ratio(revenue, (m.fnb.seatHours * g.seatShare) / 100),
      status: g.status,
      centreIds: g.centres,
    };
  });
}

/* ───────────────────────── CAPACITY & SPEND VS REFERENCE ───────────────────────── */

export function getFnbCapacity(m: MetricsCore) {
  const capacityCovers = Math.round(m.fnb.seatDays * FNB_SEAT_SITTINGS_PER_DAY);
  return { capacityCovers, loadPct: ratio(m.fnb.covers, capacityCovers) * 100 };
}

/** F&B spend per guest-night of a reference snapshot (LY / Budget / Forecast) using the same guests-per-room. */
export function spendPerGuestNightOf(ref: RevenueSnapshot, m: MetricsCore): number {
  const gpr = ratio(m.guestNights, m.roomsSold);
  return ratio(ref.fnbRevenue, ref.roomsSold * gpr);
}

/** Average check of a reference snapshot; covers scale with rooms sold. */
export function avgCheckOf(ref: RevenueSnapshot, m: MetricsCore): number {
  return ratio(ref.fnbRevenue, m.fnb.covers * ratio(ref.roomsSold, m.roomsSold));
}

export function diningGuestNights(m: MetricsCore): number {
  return Math.round((m.guestNights * m.fnb.captureRatePct) / 100);
}

export function fnbChecks(m: MetricsCore): number {
  return Math.round(m.fnb.covers / FNB_COVERS_PER_CHECK);
}

/** Seats are independent of the period - read from the 'today' snapshot. */
export function getFnbSeats(ids: string[] | undefined): number {
  return getPortfolioMetrics(ids, 'today').fnb.seats;
}

/* ───────────────────────── PROPERTY RECORDS ───────────────────────── */

const FNB_PROPERTY_DESCRIPTORS: Record<string, { signatureOutlets: string; cuisineLead: string }> = {
  'sosei-andermatt': { signatureOutlets: 'Le Sommet Alpine Gastronomy · Gotthard Glacier Cellar', cuisineLead: 'French & Alpine Haute' },
  'sosei-el-gouna': { signatureOutlets: 'Marassi Red Sea Grill · Coral Lagoon Sunset Lounge', cuisineLead: 'Eastern Med & Coastal Grill' },
  'sosei-auh': { signatureOutlets: 'Saadiyat Pearl Omakase · Al-Bahr Beachfront Club', cuisineLead: 'Japanese & Levantine Coastal' },
  'sosei-melides': { signatureOutlets: 'Comporta Woodfire Hearth · Atlantic Dune Wine Bar', cuisineLead: 'Portuguese Coastal & Woodfire' },
  'sosei-umbria': { signatureOutlets: 'Tartufo Castello Table · Cantina Storica Cellar', cuisineLead: 'Umbrian Truffle & Estate Wine' },
  'sosei-tinos': { signatureOutlets: 'Thalassa Aegean Raw Bar · Cycladic Marble Terrace', cuisineLead: 'Greek Island Seafood & Mezze' },
  'sosei-barcelona': { signatureOutlets: 'Asador Catalán · El Mirador Tapas & Wine Bar', cuisineLead: 'Spanish & Med Tapas' },
  'sosei-osa': { signatureOutlets: 'Fuego Canopy Grill · Botanical Raw Bar', cuisineLead: 'Latin Woodfire & Botanical' },
  'sosei-bali': { signatureOutlets: 'Uluwatu Cliff Grill · Tirta Longevity Botanical Kitchen', cuisineLead: 'Holistic Wellness & Coastal Grill' },
};

/** Static descriptors only - no number lives here. All trading numbers come from getFnbPropertyRecord(). */
export interface FnbPropertyStatic {
  id: string;
  name: string;
  categoryId: HotelCategoryId;
  categoryName: string;
  regionId: RegionId;
  regionName: string;
  location: string;
  signatureOutlets: string;
  cuisineLead: string;
  status: 'above_plan' | 'on_plan' | 'attention';
}

export const FNB_PROPERTY_STATIC: FnbPropertyStatic[] = MASTER_PROPERTIES.map((p) => {
  const profile = getPropertyProfile(p.id);
  const desc = FNB_PROPERTY_DESCRIPTORS[p.id];
  return {
    id: p.id,
    name: p.name,
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    regionId: profile.regionId,
    regionName: MASTER_REGIONS.find((r) => r.id === profile.regionId)?.name ?? profile.regionId,
    location: p.location,
    signatureOutlets: desc?.signatureOutlets ?? '',
    cuisineLead: desc?.cuisineLead ?? '',
    status: p.status,
  };
});

export interface FnbPropertyRecord extends FnbPropertyStatic {
  /** Engine metrics of the property for the requested period. */
  m: PropertyMetrics;
}

export function getFnbPropertyRecord(id: string, period: PeriodId): FnbPropertyRecord {
  const base = FNB_PROPERTY_STATIC.find((p) => p.id === id) ?? FNB_PROPERTY_STATIC[0];
  return { ...base, m: getPropertyMetrics(base.id, period) };
}

/* ───────────────────────── HEADLINE KPIs (global page + drawer) ───────────────────────── */

export interface FnbHeadlineKpi {
  id: string;
  label: string;
  value: string;
  vsLy: string;
  vsLyPos: boolean;
  vsBudget: string;
  vsForecast: string;
  vsTarget: string;
  vsTargetPos: boolean;
  context: string;
  boxLabel: string;
  boxSub: string;
}

export function getFnbHeadlineKpis(ids: string[] | undefined, period: PeriodId): FnbHeadlineKpi[] {
  const m = getPortfolioMetrics(ids, period);
  const forward = period === 'forward';
  const cap = getFnbCapacity(m);

  const spendLy = spendPerGuestNightOf(m.ly, m);
  const spendBudget = spendPerGuestNightOf(m.budget, m);
  const spendForecast = spendPerGuestNightOf(m.forecast, m);
  const spendLyAbs = m.fnb.spendPerGuestNight - spendLy;
  const spendBudgetAbs = m.fnb.spendPerGuestNight - spendBudget;
  const spendForecastAbs = m.fnb.spendPerGuestNight - spendForecast;

  const captureLyPts = m.vsLy.occupancyPts * 0.75;
  const captureBudgetPts = m.vsBudget.occupancyPts * 0.75;
  const captureForecastPts = m.vsForecast.occupancyPts * 0.75;

  const roomsBase = Math.max(1, m.roomsSold);
  const loadLyPts = cap.loadPct * (1 - m.ly.roomsSold / roomsBase);
  const loadBudgetPts = cap.loadPct * (1 - m.budget.roomsSold / roomsBase);
  const loadForecastPts = cap.loadPct * (1 - m.forecast.roomsSold / roomsBase);

  const revenueVsLy = `${fmtSignedPct(m.vsLy.fnbRevenuePct)} ${forward ? 'vs STLY' : 'vs LY'}`;
  const revenueVsBudget = `${fmtSignedPct(m.vsBudget.fnbRevenuePct)} vs Budget`;
  const revenueVsForecast = `${fmtSignedPct(m.vsForecast.fnbRevenuePct)} vs Forecast`;
  const dining = diningGuestNights(m);

  return [
    {
      id: 'revenue',
      label: forward ? 'FORWARD F&B REVENUE OTB (90D)' : 'F&B REVENUE',
      value: fmtUsd(m.fnbRevenue),
      vsLy: revenueVsLy,
      vsLyPos: m.vsLy.fnbRevenuePct >= 0,
      vsBudget: revenueVsBudget,
      vsForecast: revenueVsForecast,
      vsTarget: forward ? revenueVsForecast : revenueVsBudget,
      vsTargetPos: (forward ? m.vsForecast.fnbRevenuePct : m.vsBudget.fnbRevenuePct) >= 0,
      context: `${m.fnb.outlets} Operating Outlets · ${m.propertyCount} ${m.propertyCount === 1 ? 'Resort' : 'Resorts'}`,
      boxLabel: 'F&B REVENUE',
      boxSub: revenueVsLy,
    },
    {
      id: 'spend',
      label: forward ? 'PROJECTED SPEND / GUEST-NIGHT' : 'F&B SPEND / IN-HOUSE GUEST NIGHT',
      value: fmtUsdFull(m.fnb.spendPerGuestNight),
      vsLy: `${fmtSignedUsd(spendLyAbs)} vs ${forward ? 'STLY' : 'LY'}`,
      vsLyPos: spendLyAbs >= 0,
      vsBudget: `${fmtSignedUsd(spendBudgetAbs)} vs Budget`,
      vsForecast: `${fmtSignedUsd(spendForecastAbs)} vs Forecast`,
      vsTarget: `${fmtSignedUsd(spendBudgetAbs)} vs Budget`,
      vsTargetPos: spendBudgetAbs >= 0,
      context: `${fmtUsdFull(ratio(m.fnbRevenue, m.roomsSold))} F&B / Occupied Room · ${fmtCompactInt(m.guestNights)} Guest Nights`,
      boxLabel: 'SPEND / IN-HOUSE GUEST NIGHT',
      boxSub: `${fmtUsdFull(ratio(m.fnbRevenue, m.roomsSold))} F&B / Occupied Room`,
    },
    {
      id: 'capture',
      label: forward ? 'EXPECTED GUEST CAPTURE (OTB)' : 'F&B GUEST CAPTURE RATE',
      value: fmtPct(m.fnb.captureRatePct),
      vsLy: `${fmtSignedPts(captureLyPts)} vs ${forward ? 'STLY' : 'LY'}`,
      vsLyPos: captureLyPts >= 0,
      vsBudget: `${fmtSignedPts(captureBudgetPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(captureForecastPts)} vs Forecast`,
      vsTarget: `${fmtSignedPts(captureBudgetPts)} vs Budget`,
      vsTargetPos: captureBudgetPts >= 0,
      context: `${fmtCompactInt(dining)} Dining Guest-Nights of ${fmtCompactInt(m.guestNights)}`,
      boxLabel: 'GUEST CAPTURE RATE',
      boxSub: `${ratio(m.fnb.covers, m.guestNights).toFixed(2)} Covers / Guest-Night`,
    },
    {
      id: 'forward',
      label: forward ? 'OTB COVERS VS SEAT CAPACITY' : period === 'today' ? 'TODAY COVERS VS CAPACITY' : 'COVERS VS SEAT CAPACITY',
      value: fmtPct(cap.loadPct),
      vsLy: `${fmtSignedPts(loadLyPts)} vs ${forward ? 'STLY' : 'LY'}`,
      vsLyPos: loadLyPts >= 0,
      vsBudget: `${fmtSignedPts(loadBudgetPts)} vs Budget`,
      vsForecast: `${fmtSignedPts(loadForecastPts)} vs Forecast`,
      vsTarget: `${fmtSignedPts(loadBudgetPts)} vs Budget`,
      vsTargetPos: loadBudgetPts >= 0,
      context: `${fmtInt(m.fnb.covers)} Covers vs ${fmtInt(cap.capacityCovers)} Seat Capacity`,
      boxLabel: forward ? 'OTB VS CAPACITY' : 'COVERS VS CAPACITY',
      boxSub: `${fmtCompactInt(m.fnb.covers)} Covers · ${m.fnb.seatTurn.toFixed(2)}x Turn`,
    },
    forward
      ? {
          id: 'experience',
          label: 'VIP & SPECIAL REQUEST READINESS',
          value: fmtPct(m.experiences.readinessPct),
          vsLy: '+1.8 pts vs STLY',
          vsLyPos: true,
          vsBudget: '+0.9 pts vs Budget',
          vsForecast: '+0.4 pts vs Forecast',
          vsTarget: '+0.9 pts vs Budget',
          vsTargetPos: true,
          context: 'Dietary & bespoke profiles synced to kitchens',
          boxLabel: 'GUEST READINESS',
          boxSub: `${fmtInt(m.stays)} Stays Profiled`,
        }
      : {
          id: 'experience',
          label: 'F&B GUEST EXPERIENCE',
          value: fmtPct(FNB_GUEST_EXPERIENCE.scorePct),
          vsLy: `+${FNB_GUEST_EXPERIENCE.vsLyPts.toFixed(1)} pts vs LY`,
          vsLyPos: true,
          vsBudget: `+${FNB_GUEST_EXPERIENCE.vsTargetPts.toFixed(1)} pts vs Budget`,
          vsForecast: '+0.4 pts vs Forecast',
          vsTarget: `+${FNB_GUEST_EXPERIENCE.vsTargetPts.toFixed(1)} pts vs Budget`,
          vsTargetPos: true,
          context: `${FNB_GUEST_EXPERIENCE.csat.toFixed(2)} / 5.0 CSAT · ${fmtPct(FNB_GUEST_EXPERIENCE.complaintRatePct)} Complaint Rate`,
          boxLabel: 'GUEST EXPERIENCE',
          boxSub: `${FNB_GUEST_EXPERIENCE.csat.toFixed(2)} CSAT · ${FNB_GUEST_EXPERIENCE.recoveryMinutes}m Recovery`,
        },
  ];
}

/** Header context line: occupancy and guest nights of the selected period. */
export function getFnbHeaderContext(ids: string[] | undefined, period: PeriodId): string {
  const m = getPortfolioMetrics(ids, period);
  if (period === 'today') return `${fmtPct(m.occupancyPct)} Portfolio Occ · ${fmtInt(m.avgDailyInHouseGuests)} In-House Guests`;
  if (period === 'forward') return `${fmtPct(m.occupancyPct)} OTB Occ · ${fmtCompactInt(m.guestNights)} Expected Guest Nights`;
  return `${fmtPct(m.occupancyPct)} Portfolio Occ · ${fmtCompactInt(m.guestNights)} Guest Nights`;
}

/* ───────────────────────── RESORT RANKING ───────────────────────── */

export interface FnbResortRow {
  propertyId: string;
  name: string;
  categoryName: string;
  status: 'above_plan' | 'on_plan' | 'attention';
  revenue: number;
  foodRevenue: number;
  bevRevenue: number;
  avgCheck: number;
  lflPct: number;
  revpor: number;
  spendPerGuestNight: number;
  capturePct: number;
  seatLoadPct: number;
  csat: number;
}

export function getFnbResortRanking(ids: string[] | undefined, period: PeriodId): FnbResortRow[] {
  return getPropertyMetricsList(ids, period)
    .map((p) => {
      const bevRevenue = Math.round((p.fnbRevenue * p.fnb.bevSharePct) / 100);
      const foodRevenue = Math.max(0, Math.round(p.fnbRevenue) - bevRevenue);
      return {
        propertyId: p.propertyId,
        name: p.name,
        categoryName: p.categoryName,
        status: p.status,
        revenue: p.fnbRevenue,
        foodRevenue,
        bevRevenue,
        avgCheck: p.fnb.avgCheck,
        lflPct: p.vsLy.fnbRevenuePct,
        revpor: ratio(p.fnbRevenue, p.roomsSold),
        spendPerGuestNight: p.fnb.spendPerGuestNight,
        capturePct: p.fnb.captureRatePct,
        seatLoadPct: getFnbCapacity(p).loadPct,
        csat: (p.experiences.qualityPct / 100) * 5,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

/* ───────────────────────── PENETRATION ROWS (Demand Conversion & Capture) ───────────────────────── */

export interface FnbPenetrationRow {
  label: string;
  value: string;
  pct: number;
  sub: string;
}

export function getFnbPenetrationRows(m: MetricsCore): FnbPenetrationRow[] {
  const cap = m.fnb.captureRatePct;
  const centres = getFnbCentres(m);
  const byId = (id: string) => centres.find((c) => c.id === id);
  const bars = byId('bars');
  const inVilla = byId('inVilla');
  const fine = byId('fine');
  const breakfast = clamp(cap * 1.35, 0, 97);
  const specialty = clamp(cap * 0.92, 0, 97);
  const sunset = clamp(cap * 0.8, 0, 97);
  const villa = clamp(cap * 0.6, 0, 97);
  const experiences = clamp(m.experiences.participationRatePct * 0.45, 0, 97);
  return [
    { label: 'Breakfast In-House Participation', value: fmtPct(breakfast), pct: breakfast, sub: 'Included + Paid' },
    { label: 'Specialty & Fine Dining Penetration', value: fmtPct(specialty), pct: specialty, sub: `${fmtUsdFull(fine?.avgCheck ?? 0)} Avg Check` },
    { label: 'Sunset Bar & Lounge Capture', value: fmtPct(sunset), pct: sunset, sub: `${fmtUsdFull(bars?.avgCheck ?? 0)} Avg Spend` },
    {
      label: 'In-Villa / Room Service Penetration',
      value: fmtPct(villa),
      pct: villa,
      sub: `${ratio(inVilla?.covers ?? 0, m.roomsSold).toFixed(2)} Ord / Rm`,
    },
    { label: 'Paid Culinary Experiences Uptake', value: fmtPct(experiences), pct: experiences, sub: `${fmtPct(m.experiences.participationRatePct)} Guest Participation` },
  ];
}

/* ───────────────────────── SIGNATURE DISHES ───────────────────────── */

export const FNB_SIGNATURE_DISHES = [
  { name: 'A5 Miyazaki Wagyu Striploin & Truffle Jus', short: 'A5 Miyazaki Wagyu & Truffle Jus', cat: 'Japanese / Grill', price: 145, marginPct: 72, pair: '64% Red/Saké', coverSharePct: 1.35 },
  { name: '12-Course Chef Omakase & Rare Saké Flight', short: '12-Course Chef Omakase & Saké Flight', cat: 'Japanese Omakase', price: 260, marginPct: 76, pair: '82% Flight', coverSharePct: 0.95 },
  { name: 'White Truffle Tagliolini & Aged Parmigiano', short: 'White Truffle Tagliolini (Bellavista)', cat: 'Italian Coastal', price: 78, marginPct: 84, pair: '54% Barolo', coverSharePct: 1.45 },
  { name: 'Patagonian Toothfish & Yuzu Miso Glaze', short: 'Patagonian Toothfish Yuzu Miso', cat: 'Pan-Asian / Japanese', price: 92, marginPct: 75, pair: '49% White', coverSharePct: 1.2 },
  { name: 'Jeju Black Pork & Hanwoo Galbi Tasting', short: 'Jeju Black Pork & Hanwoo Galbi', cat: 'Korean Fine Grill', price: 138, marginPct: 74, pair: '58% Soju/Wine', coverSharePct: 1.0 },
] as const;

export function getFnbSignatureDishes(m: MetricsCore) {
  return FNB_SIGNATURE_DISHES.map((d) => ({ ...d, orders: Math.round((m.fnb.covers * d.coverSharePct) / 100) }));
}

/* ───────────────────────── OPERATIONAL SIGNALS ───────────────────────── */

export interface FnbSignal {
  id: string;
  type: 'risk' | 'opportunity';
  title: string;
  detail: string;
  confidence: string;
  owner: string;
  exposure: string;
  exposureValue: number;
}

export function getFnbOperationalSignals(ids: string[] | undefined, period: PeriodId): { signals: FnbSignal[]; pipelineValue: number } {
  const m = getPortfolioMetrics(ids, period);
  const list = m.properties;
  const suffix = FNB_PERIOD_SUFFIX[period];
  const centres = getFnbCentres(m);
  const cuisines = getFnbCuisines(m);
  const centre = (id: string) => centres.find((c) => c.id === id);

  // 1. Lowest guest capture property
  const lowest = [...list].sort((a, b) => a.fnb.captureRatePct - b.fnb.captureRatePct)[0];
  const peers = list.filter((p) => p.propertyId !== lowest.propertyId);
  const peerGn = peers.reduce((a, p) => a + p.guestNights, 0);
  const peerCapture =
    peerGn > 0 ? peers.reduce((a, p) => a + p.fnb.captureRatePct * p.guestNights, 0) / peerGn : m.fnb.captureRatePct;
  const gap = Math.max(0, peerCapture - lowest.fnb.captureRatePct);
  const sig1Value = lowest.fnbRevenue * ratio(gap, Math.max(1, lowest.fnb.captureRatePct));
  const lowestRegion = FNB_PROPERTY_STATIC.find((p) => p.id === lowest.propertyId)?.regionName ?? '';

  // 2. Japanese + Korean concepts capacity constrained
  const jpKr = cuisines.filter((c) => c.id === 'japanese' || c.id === 'korean');
  const jpKrRev = jpKr.reduce((a, c) => a + c.revenue, 0);
  const jpKrShare = ratio(jpKrRev, m.fnbRevenue) * 100;
  const topTurn = [...list].sort((a, b) => b.fnb.seatTurn - a.fnb.seatTurn).slice(0, 2);
  const sig2Value = (jpKrRev * FNB_SERVICE_SIGNALS.waitlistUpliftPct) / 100;

  // 3. Beverage & Sommelier Pairing Under-Index at lowest beverage share properties
  const lowBevProps = [...list].sort((a, b) => a.fnb.bevSharePct - b.fnb.bevSharePct).slice(0, 2);
  const lowBevGapPts = Math.max(2, Math.round(m.fnb.bevSharePct - (lowBevProps[0]?.fnb.bevSharePct ?? m.fnb.bevSharePct)));
  const lowBevRevSum = lowBevProps.reduce((a, p) => a + p.fnbRevenue, 0);
  const sig3Value = (lowBevRevSum * lowBevGapPts) / 100;

  // 4. Sunset bar & private dining upsell at top revenue properties
  const topRev = [...list].sort((a, b) => b.fnbRevenue - a.fnbRevenue).slice(0, 2);
  const bars = centre('bars');
  const sig4Value = ((bars?.revenue ?? 0) * FNB_SERVICE_SIGNALS.sommelierUpliftPct) / 100;

  const signals: FnbSignal[] = [
    {
      id: 'sig-1',
      type: 'risk',
      title: `Dinner Capture Leakage (${fmtPct(lowest.fnb.captureRatePct, 0)} vs ${fmtPct(peerCapture, 0)} Peer Avg) — ${lowest.name}`,
      detail: `${fmtInt((lowest.guestNights * gap) / 100)} in-house guest-nights dined off-property (${suffix}) at ${lowest.name} despite ${fmtPct(lowest.occupancyPct, 0)} room occupancy.`,
      confidence: `Confirmed · Peer Gap -${gap.toFixed(0)} pts`,
      owner: `Regional F&B Dir (${lowestRegion})`,
      exposure: `${fmtUsd(sig1Value)} ${suffix}`,
      exposureValue: sig1Value,
    },
    {
      id: 'sig-2',
      type: 'opportunity',
      title: `Omakase & Fine Grill Second-Seating Expansion (${fmtPct(jpKrShare, 0)} of F&B) — ${topTurn.map((p) => p.name).join(' & ')}`,
      detail: `Waitlist spillover at ${topTurn.map((p) => p.name).join(' and ')} — seat turn ${topTurn[0].fnb.seatTurn.toFixed(2)}x vs ${m.fnb.seatTurn.toFixed(2)}x portfolio average.`,
      confidence: `High Confidence · ${topTurn.length} Resorts`,
      owner: 'Group Concept & Culinary',
      exposure: `+${fmtUsd(sig2Value)} ${suffix}`,
      exposureValue: sig2Value,
    },
    {
      id: 'sig-3',
      type: 'risk',
      title: `Beverage & Sommelier Pairing Under-Index (-${lowBevGapPts} pts vs Portfolio) — ${lowBevProps.map((p) => p.name).join(' & ')}`,
      detail: `Beverage share at ${lowBevProps.map((p) => `${p.name} (${fmtPct(p.fnb.bevSharePct, 0)})`).join(' & ')} trails the ${fmtPct(m.fnb.bevSharePct, 0)} portfolio benchmark across prime dinner seatings.`,
      confidence: 'Confirmed · Portfolio POS Audit',
      owner: 'Group Beverage Director',
      exposure: `${fmtUsd(sig3Value)} ${suffix}`,
      exposureValue: sig3Value,
    },
    {
      id: 'sig-4',
      type: 'opportunity',
      title: `Sunset Aperitif & Wine Flight Attachment Uplift — ${topRev.map((p) => p.name).join(' & ')}`,
      detail: `${fmtCompactInt(bars?.covers ?? 0)} bar & terrace covers (${fmtUsd(bars?.revenue ?? 0)}) with ${FNB_SERVICE_SIGNALS.pairingGapPct}% untapped sommelier flight conversion at ${topRev.map((p) => p.name).join(' and ')}.`,
      confidence: 'High Confidence · Menu Engineering',
      owner: 'VP F&B Operations',
      exposure: `+${fmtUsd(sig4Value)} ${suffix}`,
      exposureValue: sig4Value,
    },
  ];
  return { signals, pipelineValue: sig2Value + sig4Value };
}

/* ───────────────────────── FORWARD OUTLOOK ───────────────────────── */

export type FnbForwardWindow = 7 | 30 | 90;

const FORWARD_BUCKET_EDGES: Record<FnbForwardWindow, number[]> = {
  7: [0, 2, 5, 7],
  30: [0, 14, 21, 30],
  90: [0, 30, 60, 90],
};

const FORWARD_BUCKET_LABELS: Record<FnbForwardWindow, string[]> = {
  7: ['D1–D2', 'D3–D5', 'D6–D7'],
  30: ['Wk 1–2', 'Wk 3', 'Wk 4+'],
  90: ['D1–D30', 'D31–D60', 'D61–D90'],
};

export interface FnbForwardBucket {
  label: string;
  days: number;
  forecastCovers: number;
  otbCovers: number;
  capacityCovers: number;
  otbPct: number;
  walkPct: number;
  loadPct: number;
}

export interface FnbForwardOutlook {
  windowDays: FnbForwardWindow;
  expectedCovers: number;
  otbCovers: number;
  capacityCovers: number;
  otbCapPct: number;
  forecastCapPct: number;
  walkInPct: number;
  forecastOccPct: number;
  otbOccPct: number;
  paceVsLyPct: number;
  events: number;
  eventRevenue: number;
  villaOrders: number;
  villaSharePct: number;
  expectedGuestNights: number;
  otbFnbRevenue: number;
  forecastFnbRevenue: number;
  buckets: FnbForwardBucket[];
}

export function getFnbForwardOutlook(ids: string[] | undefined, windowDays: FnbForwardWindow): FnbForwardOutlook {
  const seats = getFnbSeats(ids);
  const w = getForwardWindowMetrics(ids, windowDays);
  const edges = FORWARD_BUCKET_EDGES[windowDays];
  const labels = FORWARD_BUCKET_LABELS[windowDays];
  const edgeMetrics = edges.map((e) => (e === 0 ? null : getForwardWindowMetrics(ids, e)));

  const buckets: FnbForwardBucket[] = labels.map((label, i) => {
    const hi = edgeMetrics[i + 1];
    const lo = edgeMetrics[i];
    const days = edges[i + 1] - edges[i];
    const forecast = (hi?.forecastCovers ?? 0) - (lo?.forecastCovers ?? 0);
    const otb = (hi?.otbCovers ?? 0) - (lo?.otbCovers ?? 0);
    const capacityCovers = Math.round(seats * days * FNB_SEAT_SITTINGS_PER_DAY);
    const otbPct = clamp(ratio(otb, capacityCovers) * 100, 0, 100);
    const loadPct = clamp(ratio(forecast, capacityCovers) * 100, 0, 100);
    return {
      label,
      days,
      forecastCovers: forecast,
      otbCovers: otb,
      capacityCovers,
      otbPct,
      walkPct: Math.max(0, loadPct - otbPct),
      loadPct,
    };
  });

  const capacityCovers = Math.round(seats * windowDays * FNB_SEAT_SITTINGS_PER_DAY);
  const eventRevenue = splitByShares(w.otbFnbRevenue, FNB_REVENUE_CENTRE_SHARES).find((s) => s.id === 'banquet')?.value ?? 0;
  const otbCentreCovers = coversByCentre(w.otbCovers);
  const fcCentreCovers = coversByCentre(w.forecastCovers);
  const expectedGuestNights = w.properties.reduce(
    (a, p) => a + Math.round(p.forecastRoomsSold * getPropertyProfile(p.propertyId).guestsPerRoom),
    0
  );
  const forecastFnbRevenue = w.properties.reduce((a, p) => {
    const profile = getPropertyProfile(p.propertyId);
    return a + Math.round(p.forecastRoomRevenue * profile.fnbPct);
  }, 0);

  return {
    windowDays,
    expectedCovers: w.forecastCovers,
    otbCovers: w.otbCovers,
    capacityCovers,
    otbCapPct: ratio(w.otbCovers, capacityCovers) * 100,
    forecastCapPct: ratio(w.forecastCovers, capacityCovers) * 100,
    walkInPct: w.forecastCovers > 0 ? ratio(w.forecastCovers - w.otbCovers, w.forecastCovers) * 100 : 0,
    forecastOccPct: w.forecastOccupancyPct,
    otbOccPct: w.otbOccupancyPct,
    paceVsLyPct: w.paceVsLyPct,
    events: Math.round((otbCentreCovers.banquet ?? 0) / FNB_EVENT_PARTY_SIZE),
    eventRevenue,
    villaOrders: fcCentreCovers.inVilla ?? 0,
    villaSharePct: ratio(fcCentreCovers.inVilla ?? 0, w.forecastCovers) * 100,
    expectedGuestNights,
    otbFnbRevenue: w.otbFnbRevenue,
    forecastFnbRevenue,
    buckets,
  };
}

/* ───────────────────────── ALL RESTAURANTS & BARS PORTFOLIO ───────────────────────── */

export type FnbOutletGroupFilter = 'all' | 'restaurant' | 'bar' | 'property';

export interface FnbPortfolioOutletRow {
  id: string;
  outletName: string;
  outletType: 'restaurant' | 'bar';
  typeLabel: 'Fine Dining' | 'All-Day Brasserie' | 'Bar & Lounge' | 'Pool & Beach';
  propertyId: string;
  propertyName: string;
  covers: number;
  avgCheck: number;
  revenue: number;
  foodRevenue: number;
  bevRevenue: number;
  vsLyPct: number;
}

const PROPERTY_OUTLET_CATALOG: {
  id: string;
  propertyId: string;
  outletName: string;
  outletType: 'restaurant' | 'bar';
  typeLabel: 'Fine Dining' | 'All-Day Brasserie' | 'Bar & Lounge' | 'Pool & Beach';
  centreId: string;
  vsLyDelta: number;
}[] = [
  { id: 'out-bcn-1', propertyId: 'sosei-barcelona', outletName: 'Asador Catalán', outletType: 'restaurant', typeLabel: 'Fine Dining', centreId: 'fine', vsLyDelta: 2.1 },
  { id: 'out-and-1', propertyId: 'sosei-andermatt', outletName: 'Le Sommet Alpine Gastronomy', outletType: 'restaurant', typeLabel: 'Fine Dining', centreId: 'fine', vsLyDelta: 1.8 },
  { id: 'out-auh-1', propertyId: 'sosei-auh', outletName: 'Saadiyat Pearl Omakase', outletType: 'restaurant', typeLabel: 'Fine Dining', centreId: 'fine', vsLyDelta: 2.4 },
  { id: 'out-bal-1', propertyId: 'sosei-bali', outletName: 'Uluwatu Cliff Grill', outletType: 'restaurant', typeLabel: 'Fine Dining', centreId: 'fine', vsLyDelta: 1.5 },
  { id: 'out-tin-1', propertyId: 'sosei-tinos', outletName: 'Thalassa Aegean Raw Bar', outletType: 'restaurant', typeLabel: 'Fine Dining', centreId: 'fine', vsLyDelta: 1.4 },
  { id: 'out-mel-1', propertyId: 'sosei-melides', outletName: 'Comporta Woodfire Hearth', outletType: 'restaurant', typeLabel: 'All-Day Brasserie', centreId: 'allday', vsLyDelta: 0.9 },
  { id: 'out-umb-1', propertyId: 'sosei-umbria', outletName: 'Tartufo Castello Table', outletType: 'restaurant', typeLabel: 'Fine Dining', centreId: 'fine', vsLyDelta: 1.2 },
  { id: 'out-bcn-2', propertyId: 'sosei-barcelona', outletName: 'El Mirador Tapas & Wine Bar', outletType: 'bar', typeLabel: 'Bar & Lounge', centreId: 'bars', vsLyDelta: 1.6 },
  { id: 'out-and-2', propertyId: 'sosei-andermatt', outletName: 'Gotthard Glacier Cellar', outletType: 'bar', typeLabel: 'Bar & Lounge', centreId: 'bars', vsLyDelta: 1.1 },
  { id: 'out-auh-2', propertyId: 'sosei-auh', outletName: 'Al-Bahr Beachfront Club', outletType: 'bar', typeLabel: 'Pool & Beach', centreId: 'pool', vsLyDelta: 1.9 },
  { id: 'out-elg-1', propertyId: 'sosei-el-gouna', outletName: 'Coral Lagoon Sunset Lounge', outletType: 'bar', typeLabel: 'Bar & Lounge', centreId: 'bars', vsLyDelta: -0.8 },
  { id: 'out-osa-1', propertyId: 'sosei-osa', outletName: 'Fuego Canopy Grill', outletType: 'restaurant', typeLabel: 'All-Day Brasserie', centreId: 'allday', vsLyDelta: 0.7 },
];

export function getFnbPortfolioOutlets(ids: string[] | undefined, period: PeriodId): FnbPortfolioOutletRow[] {
  const props = getPropertyMetricsList(ids, period);
  const propMap = new Map(props.map((p) => [p.propertyId, p]));

  return PROPERTY_OUTLET_CATALOG.filter((item) => propMap.has(item.propertyId))
    .map((item) => {
      const p = propMap.get(item.propertyId)!;
      const centres = getFnbCentres(p);
      const c = centres.find((x) => x.id === item.centreId) ?? centres[0];
      const bevShare = item.outletType === 'bar' ? clamp(p.fnb.bevSharePct * 1.85, 45, 78) : clamp(p.fnb.bevSharePct * 0.88, 18, 42);
      const bevRevenue = Math.round((c.revenue * bevShare) / 100);
      const foodRevenue = Math.max(0, Math.round(c.revenue) - bevRevenue);
      return {
        id: item.id,
        outletName: item.outletName,
        outletType: item.outletType,
        typeLabel: item.typeLabel,
        propertyId: p.propertyId,
        propertyName: p.name,
        covers: c.covers,
        avgCheck: c.avgCheck,
        revenue: c.revenue,
        foodRevenue,
        bevRevenue,
        vsLyPct: p.vsLy.fnbRevenuePct + item.vsLyDelta,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

/* ───────────────────────── BIG GROUP EVENTS & WEDDINGS RADAR ───────────────────────── */

export interface FnbBigGroupEvent {
  id: string;
  eventName: string;
  eventType: 'Wedding' | 'Full Buyout' | 'Gala Dinner' | 'Private Summit';
  propertyId: string;
  propertyName: string;
  dateWindow: string;
  pax: number;
  revenue: number;
  spendPerPax: number;
  readinessStatus: 'Menu Locked' | 'VIP Prep' | 'Tasting Due' | 'BEO Confirmed';
  attentionNote: string;
}

const BIG_GROUP_EVENT_DEFS: (ShareDef & {
  eventType: FnbBigGroupEvent['eventType'];
  propertyId: string;
  propertyName: string;
  dateWindow: string;
  paxWeight: number;
  readinessStatus: FnbBigGroupEvent['readinessStatus'];
  attentionNote: string;
})[] = [
  {
    id: 'evt-1',
    name: 'Castello Estate Royal Wedding',
    share: 24,
    eventType: 'Wedding',
    propertyId: 'sosei-umbria',
    propertyName: 'SOSEI Umbria',
    dateWindow: 'Oct 24–26',
    paxWeight: 180,
    readinessStatus: 'Menu Locked',
    attentionNote: '7-course white truffle gala & 180-btl vintage Barolo allocation',
  },
  {
    id: 'evt-2',
    name: 'Saadiyat Beachfront Wedding Buyout',
    share: 22,
    eventType: 'Wedding',
    propertyId: 'sosei-auh',
    propertyName: 'SOSEI AUH',
    dateWindow: 'Oct 29–31',
    paxWeight: 220,
    readinessStatus: 'VIP Prep',
    attentionNote: 'Beach club closure 4 PM · Live omakase & caviar raw bar',
  },
  {
    id: 'evt-3',
    name: 'Global Luxury Summit Gala Dinner',
    share: 18,
    eventType: 'Gala Dinner',
    propertyId: 'sosei-barcelona',
    propertyName: 'SOSEI Barcelona',
    dateWindow: 'Nov 2',
    paxWeight: 240,
    readinessStatus: 'BEO Confirmed',
    attentionNote: 'Full ballroom + terrace buyout · 14 bespoke dietary VIP tables',
  },
  {
    id: 'evt-4',
    name: 'Gotthard Alpine Chalet Wedding',
    share: 14,
    eventType: 'Wedding',
    propertyId: 'sosei-andermatt',
    propertyName: 'SOSEI Andermatt',
    dateWindow: 'Nov 7–9',
    paxWeight: 140,
    readinessStatus: 'Tasting Due',
    attentionNote: 'Glacier cellar rare pairing · Late-night fondue & champagne',
  },
  {
    id: 'evt-5',
    name: 'Uluwatu Cliffside Wedding Reception',
    share: 12,
    eventType: 'Wedding',
    propertyId: 'sosei-bali',
    propertyName: 'SOSEI Bali',
    dateWindow: 'Nov 14–16',
    paxWeight: 160,
    readinessStatus: 'Menu Locked',
    attentionNote: 'Botanical tasting menu · Indoor pavilion weather backup ready',
  },
  {
    id: 'evt-6',
    name: 'Aegean Private Yacht & Villa Buyout',
    share: 10,
    eventType: 'Full Buyout',
    propertyId: 'sosei-tinos',
    propertyName: 'SOSEI Tinos',
    dateWindow: 'Nov 20–22',
    paxWeight: 130,
    readinessStatus: 'BEO Confirmed',
    attentionNote: 'Whole-fish woodfire feast & sunset terrace sommelier flight',
  },
];

export function getFnbBigGroupEvents(ids: string[] | undefined, period: PeriodId): {
  events: FnbBigGroupEvent[];
  totalRevenue: number;
  totalPax: number;
} {
  const m = getPortfolioMetrics(ids, period);
  // Group events & weddings represent Banqueting & Private Dining + contracted group dining (~18% of F&B revenue)
  const banquetCentre = getFnbCentres(m).find((c) => c.id === 'banquet');
  const eventPoolRevenue = Math.round((banquetCentre?.revenue ?? m.fnbRevenue * 0.08) * 1.65);
  const scalePax = period === 'today' ? 0.25 : period === 'ytd' ? 6.5 : 1;

  const revSplits = splitByShares(eventPoolRevenue, BIG_GROUP_EVENT_DEFS);
  const events: FnbBigGroupEvent[] = BIG_GROUP_EVENT_DEFS.map((d, i) => {
    const pax = Math.max(20, Math.round(d.paxWeight * scalePax));
    const revenue = revSplits[i].value;
    return {
      id: d.id,
      eventName: d.name,
      eventType: d.eventType,
      propertyId: d.propertyId,
      propertyName: d.propertyName,
      dateWindow: d.dateWindow,
      pax,
      revenue,
      spendPerPax: ratio(revenue, pax),
      readinessStatus: d.readinessStatus,
      attentionNote: d.attentionNote,
    };
  });

  const totalRevenue = events.reduce((a, e) => a + e.revenue, 0);
  const totalPax = events.reduce((a, e) => a + e.pax, 0);
  return { events, totalRevenue, totalPax };
}

