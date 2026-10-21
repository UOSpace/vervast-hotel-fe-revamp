import { MASTER_REGIONS } from '@/constants/regions';
import {
  getForwardWindowMetrics,
  getPortfolioMetrics,
  getPropertyIdsByRegion,
  getPropertyMetrics,
  getPropertyProfile,
} from './engine';
import type { PropertyMetrics } from './engine';
import { splitByShares } from './mix';
import type { ShareDef } from './mix';
import type { PeriodId } from './periods';

/**
 * HOSPITALITY SUB-DASHBOARD MIX - share tables and builders used by the Property Categories, Regional and
 * Property views. Every absolute number is derived from the portfolio engine for the active period and the
 * active property selection, and every table is produced with `splitByShares`, so a table ALWAYS adds up to
 * the headline number above it (and the 10 property views add up to the Hospitality global totals).
 *
 * Only ratios / percentages (model assumptions) live in this file, never absolute amounts.
 */

/* ───────────────────────── SCOPE ───────────────────────── */

/** Property selection + period carried through widgets and drawers so a drawer recomputes the same figures. */
export interface HospitalityScope {
  propertyIds: string[];
  scopeName: string;
  period: PeriodId;
}

/* ───────────────────────── ROOM-NIGHT MIXES ───────────────────────── */

export interface RoomMixDef extends ShareDef {
  /** ADR relative to the selection ADR (revenue is re-weighted by share x adrFactor and still adds up). */
  adrFactor: number;
  color: string;
  /** Volume growth vs last year, %. */
  trendPct: number;
}

export interface RoomMixRow {
  id: string;
  name: string;
  color: string;
  trendPct: number;
  sharePct: number;
  nights: number;
  adr: number;
  revenue: number;
}

export const MARKET_SEGMENT_MIX: RoomMixDef[] = [
  { id: 'leisure', name: 'Leisure', share: 55, adrFactor: 0.92, color: '#0f172a', trendPct: 5 },
  { id: 'business', name: 'Business', share: 25, adrFactor: 1.09, color: '#334155', trendPct: 3 },
  { id: 'social', name: 'Social', share: 10, adrFactor: 0.68, color: '#64748b', trendPct: 2 },
  { id: 'mice', name: 'MICE', share: 7, adrFactor: 0.97, color: '#94a3b8', trendPct: 4 },
  { id: 'others', name: 'Others', share: 3, adrFactor: 0.61, color: '#cbd5e1', trendPct: -1 },
];

const PROPERTY_SEGMENT_SHARES: Record<string, [number, number, number, number, number]> = {
  'sosei-geneva': [42, 34, 9, 11, 4],
  'sosei-courchevel': [64, 16, 11, 6, 3],
  'sosei-niseko': [66, 15, 10, 6, 3],
  'sosei-aspen': [62, 18, 11, 6, 3],
  'sosei-marrakech': [68, 14, 10, 5, 3],
  'sosei-alula': [48, 28, 11, 9, 4],
  'sosei-los-cabos': [70, 12, 11, 4, 3],
  'sosei-sumba': [73, 10, 10, 4, 3],
  'sosei-amalfi': [62, 15, 14, 6, 3],
  'sosei-muscat': [72, 10, 11, 4, 3],
  'sosei-seychelles': [75, 9, 10, 3, 3],
  'sosei-patagonia': [74, 10, 9, 4, 3],
  'sosei-serengeti': [76, 9, 9, 3, 3],
  'sosei-kyoto': [66, 14, 12, 5, 3],
};

const PERIOD_SEGMENT_SHIFT: Record<PeriodId, [number, number, number, number, number]> = {
  today: [6, -4, 1, -2, -1],
  mtd: [0, 0, 0, 0, 0],
  ytd: [-5, 4, -1, 2, 0],
  forward: [4, -3, 1, -1, -1],
};

export function getPropertyMarketSegmentDefs(propertyId: string, period: PeriodId = 'mtd'): RoomMixDef[] {
  const base = PROPERTY_SEGMENT_SHARES[propertyId] ?? [55, 25, 10, 7, 3];
  const shift = PERIOD_SEGMENT_SHIFT[period] ?? [0, 0, 0, 0, 0];
  return MARKET_SEGMENT_MIX.map((def, idx) => ({
    ...def,
    share: Math.max(2, base[idx] + shift[idx]),
  }));
}

export const BOOKING_CHANNEL_MIX: RoomMixDef[] = [
  { id: 'direct', name: 'Direct', share: 33, adrFactor: 1.11, color: '#0f172a', trendPct: 6 },
  { id: 'ota', name: 'OTA', share: 28, adrFactor: 0.81, color: '#334155', trendPct: -2 },
  { id: 'consortia', name: 'Consortia', share: 15, adrFactor: 0.87, color: '#64748b', trendPct: 1 },
  { id: 'ownweb', name: 'Own Web', share: 11, adrFactor: 1.06, color: '#94a3b8', trendPct: 4 },
  { id: 'others', name: 'Others', share: 13, adrFactor: 0.71, color: '#cbd5e1', trendPct: -3 },
];

const PROPERTY_CHANNEL_SHARES: Record<string, [number, number, number, number, number]> = {
  'sosei-geneva': [34, 27, 15, 12, 12],
  'sosei-courchevel': [38, 22, 18, 12, 10],
  'sosei-niseko': [37, 23, 17, 13, 10],
  'sosei-aspen': [39, 21, 18, 12, 10],
  'sosei-marrakech': [30, 32, 14, 11, 13],
  'sosei-alula': [36, 24, 17, 12, 11],
  'sosei-los-cabos': [40, 21, 16, 13, 10],
  'sosei-sumba': [41, 20, 17, 12, 10],
  'sosei-amalfi': [37, 23, 18, 12, 10],
  'sosei-muscat': [32, 29, 15, 12, 12],
  'sosei-seychelles': [38, 22, 17, 13, 10],
  'sosei-patagonia': [42, 19, 18, 12, 9],
  'sosei-serengeti': [43, 18, 19, 11, 9],
  'sosei-kyoto': [35, 26, 16, 13, 10],
};

const PERIOD_CHANNEL_SHIFT: Record<PeriodId, [number, number, number, number, number]> = {
  today: [4, -3, 1, 1, -3],
  mtd: [0, 0, 0, 0, 0],
  ytd: [-3, 3, 1, -1, 0],
  forward: [5, -4, 1, 1, -3],
};

export function getPropertyBookingChannelDefs(propertyId: string, period: PeriodId = 'mtd'): RoomMixDef[] {
  const base = PROPERTY_CHANNEL_SHARES[propertyId] ?? [33, 28, 15, 11, 13];
  const shift = PERIOD_CHANNEL_SHIFT[period] ?? [0, 0, 0, 0, 0];
  return BOOKING_CHANNEL_MIX.map((def, idx) => ({
    ...def,
    share: Math.max(4, base[idx] + shift[idx]),
  }));
}

/** Guest origin markets (region of residence) used on the Property Categories view. */
export const GUEST_ORIGIN_MIX: RoomMixDef[] = [
  { id: 'asia-pacific', name: 'Asia Pacific', share: 35, adrFactor: 0.95, color: '#0f172a', trendPct: 7 },
  { id: 'europe', name: 'Europe', share: 25, adrFactor: 1.09, color: '#334155', trendPct: 4 },
  { id: 'america', name: 'America', share: 20, adrFactor: 0.86, color: '#64748b', trendPct: 5 },
  { id: 'middle-east', name: 'Middle East', share: 12, adrFactor: 0.77, color: '#94a3b8', trendPct: 3 },
  { id: 'africa', name: 'Africa', share: 8, adrFactor: 0.68, color: '#cbd5e1', trendPct: 1 },
];

/** Guest nationalities (property view). The first four are shown on the card; the drawer lists all. */
export const GUEST_NATIONALITY_MIX: RoomMixDef[] = [
  { id: 'us', name: 'United States', share: 18, adrFactor: 1.08, color: '#0f172a', trendPct: 2 },
  { id: 'uk', name: 'United Kingdom', share: 12, adrFactor: 1.02, color: '#334155', trendPct: 1 },
  { id: 'de', name: 'Germany', share: 9, adrFactor: 0.95, color: '#64748b', trendPct: -1 },
  { id: 'ch', name: 'Switzerland', share: 8, adrFactor: 1.12, color: '#94a3b8', trendPct: 3 },
  { id: 'fr', name: 'France', share: 7, adrFactor: 1.0, color: '#94a3b8', trendPct: 1 },
  { id: 'ae', name: 'United Arab Emirates', share: 6, adrFactor: 1.15, color: '#94a3b8', trendPct: 5 },
  { id: 'cn', name: 'China', share: 6, adrFactor: 1.05, color: '#94a3b8', trendPct: 6 },
  { id: 'jp', name: 'Japan', share: 5, adrFactor: 1.03, color: '#94a3b8', trendPct: 2 },
  { id: 'it', name: 'Italy', share: 5, adrFactor: 0.94, color: '#94a3b8', trendPct: 0 },
  { id: 'sa', name: 'Saudi Arabia', share: 4, adrFactor: 1.18, color: '#94a3b8', trendPct: 4 },
  { id: 'au', name: 'Australia', share: 4, adrFactor: 0.92, color: '#94a3b8', trendPct: 1 },
  { id: 'sg', name: 'Singapore', share: 3, adrFactor: 1.06, color: '#94a3b8', trendPct: 3 },
  { id: 'other', name: 'Other Markets', share: 13, adrFactor: 0.88, color: '#cbd5e1', trendPct: 2 },
];
export const GUEST_NATIONALITY_TOP_COUNT = 4;

/** Split room nights / room revenue across a mix. Nights and revenue each add up exactly to the totals. */
export function buildRoomMix(defs: RoomMixDef[], roomsSold: number, roomRevenue: number): RoomMixRow[] {
  const nights = splitByShares(roomsSold, defs);
  const revenue = splitByShares(
    roomRevenue,
    defs.map((d) => ({ id: d.id, name: d.name, share: d.share * d.adrFactor }))
  );
  return defs.map((d, i) => ({
    id: d.id,
    name: d.name,
    color: d.color,
    trendPct: d.trendPct,
    sharePct: roomsSold > 0 ? (nights[i].value / roomsSold) * 100 : 0,
    nights: nights[i].value,
    adr: nights[i].value > 0 ? revenue[i].value / nights[i].value : 0,
    revenue: revenue[i].value,
  }));
}

/** Night-weighted average trend of a set of mix rows. */
export function mixTrendPct(rows: RoomMixRow[]): number {
  const nights = rows.reduce((a, r) => a + r.nights, 0);
  if (nights <= 0) return 0;
  return rows.reduce((a, r) => a + r.trendPct * r.nights, 0) / nights;
}

export const fmtTrendArrow = (pct: number): string => `${pct >= 0 ? '↑' : '↓'} ${Math.abs(Math.round(pct))}%`;

/** Region rows (real sums of the properties of each region) for a property selection. */
export interface RegionRow {
  id: string;
  name: string;
  propertyCount: number;
  sharePct: number;
  nights: number;
  adr: number;
  revenue: number;
}

export function buildRegionRows(propertyIds: string[], period: PeriodId): RegionRow[] {
  const total = getPortfolioMetrics(propertyIds, period);
  const rows: RegionRow[] = [];
  MASTER_REGIONS.forEach((region) => {
    const ids = getPropertyIdsByRegion([region.id]).filter((id) => propertyIds.includes(id));
    if (ids.length === 0) return;
    const m = getPortfolioMetrics(ids, period);
    rows.push({
      id: region.id,
      name: region.name,
      propertyCount: ids.length,
      sharePct: total.roomsSold > 0 ? (m.roomsSold / total.roomsSold) * 100 : 0,
      nights: m.roomsSold,
      adr: m.adr,
      revenue: m.roomRevenue,
    });
  });
  return rows;
}

/* ───────────────────────── ROOM TYPES (property view) ───────────────────────── */

export interface RoomTierDef {
  name: string;
  /** Share of the property inventory (keys), %. */
  keyShare: number;
  /** Occupancy delta vs the property occupancy, in percentage points. */
  occDelta: number;
}

/** ADR index of each tier by position (tier 1 is the signature tier). */
const ROOM_TIER_ADR_INDEX = [1.18, 1.04, 0.92, 0.82];

export const PROPERTY_ROOM_TIERS: Record<string, RoomTierDef[]> = {
  'sosei-courchevel': [
    { name: 'Trois Vallées Chalet Suite', keyShare: 22, occDelta: 6 },
    { name: 'Savoie Alpine Signature Suite', keyShare: 20, occDelta: 1 },
    { name: 'Panorama Glacial Room', keyShare: 16, occDelta: -2 },
    { name: 'Thermal Spa Cabin', keyShare: 14, occDelta: -6 },
  ],
  'sosei-niseko': [
    { name: 'Mount Yotei Onsen Chalet', keyShare: 24, occDelta: 6 },
    { name: 'Hokkaido Powder Panorama Suite', keyShare: 22, occDelta: 1 },
    { name: 'Shirakaba Forest Pavilion', keyShare: 18, occDelta: -2 },
    { name: 'Tatami Thermal Studio', keyShare: 16, occDelta: -6 },
  ],
  'sosei-aspen': [
    { name: 'Ajax Mountain Summit Residence', keyShare: 24, occDelta: 6 },
    { name: 'Continental Divide Chalet Suite', keyShare: 22, occDelta: 1 },
    { name: 'Roaring Fork Alpine Room', keyShare: 20, occDelta: -2 },
    { name: 'Timberline Fireside Cabin', keyShare: 14, occDelta: -6 },
  ],
  'sosei-marrakech': [
    { name: 'Palmeraie Royal Riad Palace', keyShare: 24, occDelta: 6 },
    { name: 'Atlas Garden Pool Suite', keyShare: 22, occDelta: 2 },
    { name: 'Medina Courtyard Pavilion', keyShare: 18, occDelta: -2 },
    { name: 'Oasis Hammam Sanctuary Suite', keyShare: 16, occDelta: -8 },
  ],
  'sosei-alula': [
    { name: 'Ashar Valley Sandstone Villa', keyShare: 26, occDelta: 6 },
    { name: 'Hegra Stargazing Pool Suite', keyShare: 24, occDelta: 1 },
    { name: 'Nabataean Canyon Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Oasis Palm Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-los-cabos': [
    { name: 'Sea of Cortez Oceanfront Hacienda', keyShare: 26, occDelta: 6 },
    { name: 'Baja Cliffside Pool Suite', keyShare: 24, occDelta: 1 },
    { name: 'Desert Arroyo Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Agave Sanctuary Studio', keyShare: 15, occDelta: -7 },
  ],
  'sosei-sumba': [
    { name: 'Nihiwatu Oceanfront Cliff Villa', keyShare: 26, occDelta: 6 },
    { name: 'Marapu Surf View Pool Suite', keyShare: 24, occDelta: 2 },
    { name: 'Sandalwood Jungle Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Archipelago Beach House', keyShare: 15, occDelta: -7 },
  ],
  'sosei-amalfi': [
    { name: 'Tyrrhenian Cliffside Palazzo Suite', keyShare: 25, occDelta: 6 },
    { name: 'Ravello Lemon Grove Villa', keyShare: 25, occDelta: 2 },
    { name: 'Coastal Sea View Terrace Suite', keyShare: 20, occDelta: -2 },
    { name: 'Heritage Cloister Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-muscat': [
    { name: 'Al Hajar Cove Royal Villa', keyShare: 26, occDelta: 6 },
    { name: 'Gulf of Oman Pool Suite', keyShare: 24, occDelta: 1 },
    { name: 'Frankincense Cliff Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Lagoon Sanctuary Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-seychelles': [
    { name: 'Granite Boulder Ocean Villa', keyShare: 26, occDelta: 6 },
    { name: 'Mahé Coral Lagoon Pool Suite', keyShare: 24, occDelta: 2 },
    { name: 'Takamaka Canopy Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Island Cove Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-geneva': [
    { name: 'Lac Léman Diplomatic Penthouse', keyShare: 25, occDelta: 6 },
    { name: 'Rue du Rhône Deluxe Room', keyShare: 35, occDelta: 1 },
    { name: 'Mont-Blanc View Terrace Suite', keyShare: 30, occDelta: -2 },
    { name: 'Vieille-Ville Heritage Studio', keyShare: 20, occDelta: -6 },
  ],
  'sosei-patagonia': [
    { name: 'Paine Massif Glacier Estancia', keyShare: 26, occDelta: 6 },
    { name: 'Lake Sarmiento Horizon Villa', keyShare: 24, occDelta: 2 },
    { name: 'Lenga Forest Refuge Suite', keyShare: 20, occDelta: -2 },
    { name: 'Austral Pampa Pavilion', keyShare: 15, occDelta: -8 },
  ],
  'sosei-serengeti': [
    { name: 'Kopje Savannah Horizon Pavilion', keyShare: 26, occDelta: 6 },
    { name: 'Migration Plains Pool Villa', keyShare: 24, occDelta: 2 },
    { name: 'Acacia Wilderness Tent Suite', keyShare: 20, occDelta: -2 },
    { name: 'Riverbed Bush Sanctuary', keyShare: 15, occDelta: -7 },
  ],
  'sosei-kyoto': [
    { name: 'Arashiyama Bamboo Ryokan Villa', keyShare: 28, occDelta: 5 },
    { name: 'Katsura River Onsen Suite', keyShare: 24, occDelta: 1 },
    { name: 'Zen Moss Garden Pavilion', keyShare: 18, occDelta: -2 },
    { name: 'Longevity Tea House Residence', keyShare: 12, occDelta: -7 },
  ],
};

export interface RoomTierRow {
  name: string;
  keys: number;
  availableRn: number;
  occupiedRn: number;
  occPct: number;
  adr: number;
  revenue: number;
}

/**
 * Room-type table of ONE property for its period: keys split from the real inventory, occupied room nights
 * split from the engine rooms sold (weighted by tier occupancy), revenue split from the engine room revenue.
 * Occupied nights, available nights and revenue all add up to the property headline.
 */
export function buildRoomTiers(m: PropertyMetrics): RoomTierRow[] {
  const defs = PROPERTY_ROOM_TIERS[m.propertyId] ?? [];
  if (defs.length === 0) return [];
  const keys = splitByShares(m.rooms, defs.map((d) => ({ id: d.name, name: d.name, share: d.keyShare })));
  const occupied = splitByShares(
    m.roomsSold,
    defs.map((d, i) => ({ id: d.name, name: d.name, share: keys[i].value * Math.max(5, m.occupancyPct + d.occDelta) }))
  );
  const revenue = splitByShares(
    m.roomRevenue,
    defs.map((d, i) => ({
      id: d.name,
      name: d.name,
      share: occupied[i].value * (ROOM_TIER_ADR_INDEX[i] ?? 1),
    }))
  );
  return defs.map((d, i) => {
    const availableRn = keys[i].value * m.days;
    return {
      name: d.name,
      keys: keys[i].value,
      availableRn,
      occupiedRn: occupied[i].value,
      occPct: availableRn > 0 ? (occupied[i].value / availableRn) * 100 : 0,
      adr: occupied[i].value > 0 ? revenue[i].value / occupied[i].value : 0,
      revenue: revenue[i].value,
    };
  });
}

/* ───────────────────────── DEPARTMENT DETAIL (drawers) ───────────────────────── */

export interface DepartmentOutletRow {
  dept: string;
  outlet: string;
  value: number;
}

/** Outlet-level split of F&B, Spa & Wellness and Activities. Every group adds up to the engine department total. */
const FNB_OUTLET_SHARES: ShareDef[] = [
  { id: 'dining', name: 'Fine, Specialty & All-Day Dining', share: 54.6 },
  { id: 'bars', name: 'Bars, Lounges & Pool', share: 25.4 },
  { id: 'inVilla', name: 'In-Villa, Room Service & Banqueting', share: 20 },
];
const SPA_OUTLET_SHARES: ShareDef[] = [
  { id: 'spa', name: 'Thermal Spa & Healing Treatments', share: 58 },
  { id: 'wellness', name: 'Medical Wellness & Longevity', share: 42 },
];
const ACTIVITY_OUTLET_SHARES: ShareDef[] = [
  { id: 'signature', name: 'Signature Excursions & Private Guides', share: 57 },
  { id: 'group', name: 'Guided Group Experiences & Workshops', share: 43 },
];

export function buildDepartmentOutlets(m: {
  roomRevenue: number;
  fnbRevenue: number;
  spaRevenue: number;
  experienceRevenue: number;
}): DepartmentOutletRow[] {
  const rows: DepartmentOutletRow[] = [{ dept: 'Rooms', outlet: 'Suites, Villas & Residences', value: m.roomRevenue }];
  splitByShares(m.fnbRevenue, FNB_OUTLET_SHARES).forEach((r) => rows.push({ dept: 'F&B', outlet: r.name, value: r.value }));
  splitByShares(m.spaRevenue, SPA_OUTLET_SHARES).forEach((r) => rows.push({ dept: 'Spa & Wellness', outlet: r.name, value: r.value }));
  splitByShares(m.experienceRevenue, ACTIVITY_OUTLET_SHARES).forEach((r) => rows.push({ dept: 'Activities', outlet: r.name, value: r.value }));
  return rows;
}

/* ───────────────────────── GUEST ACTIVITY (always TODAY) ───────────────────────── */

/** VIP & VVIP share of the guests in house. */
export const VIP_SHARE_OF_IN_HOUSE = 0.11;
/** VIP share of today's arrivals. */
export const VIP_SHARE_OF_ARRIVALS = 0.3;
/** Share of today's arrivals that are still to check in. */
export const PENDING_CHECKIN_SHARE_OF_ARRIVALS = 0.35;
/** Departures per arrival (steady-state turnover of the stay cycle). */
export const DEPARTURES_PER_ARRIVAL = 1;
/** Share of today's departures already cleared at the desk. */
export const CLEARED_SHARE_OF_DEPARTURES = 0.78;

export interface PropertyGuestActivity {
  arrivals: number;
  departures: number;
  inHouse: number;
  vip: number;
  vipArrivals: number;
  keysOccupied: number;
  pendingCheckIn: number;
  cleared: number;
}

export function getPropertyGuestActivity(propertyId: string): PropertyGuestActivity {
  const t = getPropertyMetrics(propertyId, 'today');
  const arrivals = Math.round(t.avgDailyArrivals);
  const departures = Math.round(arrivals * DEPARTURES_PER_ARRIVAL);
  const inHouse = Math.round(t.avgDailyInHouseGuests);
  return {
    arrivals,
    departures,
    inHouse,
    vip: Math.round(inHouse * VIP_SHARE_OF_IN_HOUSE),
    vipArrivals: Math.max(1, Math.round(arrivals * VIP_SHARE_OF_ARRIVALS)),
    keysOccupied: t.roomsSold,
    pendingCheckIn: Math.round(arrivals * PENDING_CHECKIN_SHARE_OF_ARRIVALS),
    cleared: Math.round(departures * CLEARED_SHARE_OF_DEPARTURES),
  };
}

/** Average length of stay (nights) of a property: a property attribute, identical in every period. */
export const getPropertyLosNights = (propertyId: string): number => getPropertyProfile(propertyId).avgLosNights;

/* ───────────────────────── PROPERTY RHYTHM (property + period aware) ───────────────────────── */

interface RhythmDef {
  key: 'arrivals' | 'departures' | 'activity' | 'fnb' | 'spa' | 'housekeeping';
  department: string;
  peak: string;
  timeWindow: string;
  baseLoad: number;
  staffPerRoom: number;
  staffLabel: string;
  unitLabel: string;
  timeframeLoads: [number, number, number, number, number, number]; // [6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 9 PM]
}

const PROPERTY_SIGNATURE_RHYTHM: Record<
  string,
  {
    activityDept: string;
    activityPeak: string;
    activityWindow: string;
    activityProfile: [number, number, number, number, number, number];
    fnbDept: string;
    spaDept: string;
  }
> = {
  'sosei-courchevel': {
    activityDept: 'Alpine Ski & Heli-Pass',
    activityPeak: '8:30 AM – 3:30 PM',
    activityWindow: '08:30 – 15:30',
    activityProfile: [48, 96, 92, 86, 42, 22],
    fnbDept: 'F&B & Chalet Dining',
    spaDept: 'Thermal Spa & Cryo',
  },
  'sosei-niseko': {
    activityDept: 'Hokkaido Powder & Cat-Ski',
    activityPeak: '8:00 AM – 3:00 PM',
    activityWindow: '08:00 – 15:00',
    activityProfile: [54, 96, 90, 82, 46, 24],
    fnbDept: 'F&B & Robata Dining',
    spaDept: 'Volcanic Onsen & Spa',
  },
  'sosei-aspen': {
    activityDept: 'Rocky Mountain Ski & Heli',
    activityPeak: '8:30 AM – 3:30 PM',
    activityWindow: '08:30 – 15:30',
    activityProfile: [46, 95, 91, 85, 44, 24],
    fnbDept: 'F&B & Alpine Chophouse',
    spaDept: 'High-Altitude Recovery Spa',
  },
  'sosei-marrakech': {
    activityDept: 'Atlas Heli & Medina Curators',
    activityPeak: '9:00 AM – 4:00 PM',
    activityWindow: '09:00 – 16:00',
    activityProfile: [44, 92, 95, 84, 52, 26],
    fnbDept: 'F&B & Royal Riad Dining',
    spaDept: 'Imperial Hammam & Spa',
  },
  'sosei-alula': {
    activityDept: 'Canyon Safari & Stargazing',
    activityPeak: '3:00 PM – 8:00 PM',
    activityWindow: '15:00 – 20:00',
    activityProfile: [32, 68, 74, 94, 90, 46],
    fnbDept: 'F&B & Canyon Hearth',
    spaDept: 'Sandstone Sanctuary Spa',
  },
  'sosei-los-cabos': {
    activityDept: 'Cortez Yacht & Desert Trek',
    activityPeak: '9:00 AM – 1:00 PM',
    activityWindow: '09:00 – 13:00',
    activityProfile: [52, 94, 88, 76, 48, 24],
    fnbDept: 'F&B & Baja Woodfire',
    spaDept: 'Agave Desert Thalasso Spa',
  },
  'sosei-sumba': {
    activityDept: 'Surf Safari & Equestrian',
    activityPeak: '7:30 AM – 1:30 PM',
    activityWindow: '07:30 – 13:30',
    activityProfile: [68, 95, 89, 78, 50, 24],
    fnbDept: 'F&B & Cliffside Grill',
    spaDept: 'Jungle Cliff Wellness Spa',
  },
  'sosei-amalfi': {
    activityDept: 'Riva Yacht & Lemon Estates',
    activityPeak: '10:00 AM – 4:00 PM',
    activityWindow: '10:00 – 16:00',
    activityProfile: [28, 84, 92, 88, 64, 30],
    fnbDept: 'F&B & Terrazza Dining',
    spaDept: 'Roman Thermal Cliff Spa',
  },
  'sosei-muscat': {
    activityDept: 'Omani Dhow & Canyon Trek',
    activityPeak: '10:00 AM – 5:00 PM',
    activityWindow: '10:00 – 17:00',
    activityProfile: [34, 76, 94, 92, 68, 32],
    fnbDept: 'F&B & Cove Seafood',
    spaDept: 'Frankincense Sanctuary Spa',
  },
  'sosei-seychelles': {
    activityDept: 'Island Heli & Reef Diving',
    activityPeak: '9:30 AM – 4:30 PM',
    activityWindow: '09:30 – 16:30',
    activityProfile: [42, 88, 94, 88, 60, 28],
    fnbDept: 'F&B & Granite Cove Grill',
    spaDept: 'Ocean Boulder Sanctuary Spa',
  },
  'sosei-geneva': {
    activityDept: 'Horlogerie Ateliers & Riva',
    activityPeak: '10:00 AM – 4:00 PM',
    activityWindow: '10:00 – 16:00',
    activityProfile: [26, 78, 90, 88, 72, 44],
    fnbDept: 'F&B & Haute Gastronomy',
    spaDept: 'Lac Léman Longevity Spa',
  },
  'sosei-patagonia': {
    activityDept: 'Glacier Trek & Puma Safari',
    activityPeak: '6:30 AM – 1:00 PM',
    activityWindow: '06:30 – 13:00',
    activityProfile: [92, 96, 86, 68, 38, 20],
    fnbDept: 'F&B & Austral Asador',
    spaDept: 'Glacial Botanical Spa',
  },
  'sosei-serengeti': {
    activityDept: 'Balloon & Migration Safari',
    activityPeak: '6:00 AM – 12:30 PM',
    activityWindow: '06:00 – 12:30',
    activityProfile: [94, 96, 82, 70, 48, 22],
    fnbDept: 'F&B & Savannah Boma',
    spaDept: 'Kopje Bush Healing Spa',
  },
  'sosei-kyoto': {
    activityDept: 'Zen Temple & Tea Ceremony',
    activityPeak: '8:00 AM – 2:00 PM',
    activityWindow: '08:00 – 14:00',
    activityProfile: [78, 94, 90, 74, 52, 28],
    fnbDept: 'F&B & Kaiseki Ryokan',
    spaDept: 'Arashiyama Onsen & Longevity',
  },
};

function getRhythmDefsForProperty(propertyId: string): RhythmDef[] {
  const sig = PROPERTY_SIGNATURE_RHYTHM[propertyId] ?? PROPERTY_SIGNATURE_RHYTHM['sosei-geneva'];
  return [
    {
      key: 'arrivals',
      department: 'Arrivals',
      peak: '2:00 PM – 5:00 PM',
      timeWindow: '14:00 – 17:00',
      baseLoad: 88,
      staffPerRoom: 0.06,
      staffLabel: 'Butlers / Valet Reception',
      unitLabel: 'Check-ins',
      timeframeLoads: [24, 46, 68, 94, 78, 34],
    },
    {
      key: 'departures',
      department: 'Departures',
      peak: '9:00 AM – 12:00 PM',
      timeWindow: '09:00 – 12:00',
      baseLoad: 86,
      staffPerRoom: 0.055,
      staffLabel: 'Bell Desk / Guest Relations',
      unitLabel: 'Check-outs',
      timeframeLoads: [44, 92, 94, 54, 32, 20],
    },
    {
      key: 'activity',
      department: sig.activityDept,
      peak: sig.activityPeak,
      timeWindow: sig.activityWindow,
      baseLoad: 89,
      staffPerRoom: 0.065,
      staffLabel: 'Guides & Experience Hosts',
      unitLabel: 'Participants',
      timeframeLoads: sig.activityProfile,
    },
    {
      key: 'fnb',
      department: sig.fnbDept,
      peak: '7:00 PM – 9:30 PM',
      timeWindow: '19:00 – 21:30',
      baseLoad: 92,
      staffPerRoom: 0.13,
      staffLabel: 'Culinary & Sommeliers',
      unitLabel: 'Covers',
      timeframeLoads: [42, 82, 76, 48, 96, 90],
    },
    {
      key: 'spa',
      department: sig.spaDept,
      peak: '3:00 PM – 6:00 PM',
      timeWindow: '15:00 – 18:00',
      baseLoad: 78,
      staffPerRoom: 0.055,
      staffLabel: 'Therapists & Practitioners',
      unitLabel: 'Treatments',
      timeframeLoads: [22, 54, 72, 92, 84, 34],
    },
    {
      key: 'housekeeping',
      department: 'Housekeeping & Turn-down',
      peak: '10:00 AM – 1:00 PM',
      timeWindow: '10:00 – 13:00',
      baseLoad: 90,
      staffPerRoom: 0.11,
      staffLabel: 'Attendants & Supervisors',
      unitLabel: 'Rooms',
      timeframeLoads: [38, 92, 95, 62, 86, 30],
    },
  ];
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export const rhythmStatus = (load: number): string =>
  load >= 90 ? 'Peak Load' : load >= 80 ? 'High Volume' : load >= 70 ? 'Active' : 'Wind Down';

/** Property occupancy for the active period relative to portfolio occupancy: busier property/period => higher load. */
function loadIndex(propertyId: string, period: PeriodId = 'today'): number {
  const propMetrics = getPropertyMetrics(propertyId, period);
  const portfolio = getPortfolioMetrics(undefined, period);
  const periodBoost = period === 'today' ? 0.96 : period === 'mtd' ? 1.0 : 1.04;
  return (portfolio.occupancyPct > 0 ? propMetrics.occupancyPct / portfolio.occupancyPct : 1) * periodBoost;
}

export interface RhythmRow {
  department: string;
  peak: string;
  timeWindow: string;
  activeDemand: number;
  totalCapacity: number;
  unitLabel: string;
  load: number;
  status: string;
  staff: string;
  timeframeLoads: number[];
}

const PERIOD_TIMEFRAME_OFFSET: Record<PeriodId, [number, number, number, number, number, number]> = {
  today: [-8, -6, 6, 8, -4, -10],
  mtd: [0, 0, 0, 0, 0, 0],
  ytd: [8, 6, -4, -6, 6, 8],
  forward: [4, 8, -6, 4, -4, 6],
};

export function getPropertyRhythm(propertyId: string, period: PeriodId = 'mtd'): RhythmRow[] {
  const t = getPropertyMetrics(propertyId, period);
  const todayM = getPropertyMetrics(propertyId, 'today');
  const idx = loadIndex(propertyId, period);
  const defs = getRhythmDefsForProperty(propertyId);
  const periodOffset = PERIOD_TIMEFRAME_OFFSET[period] ?? [0, 0, 0, 0, 0, 0];

  return defs.map((d) => {
    const targetLoad = clamp(Math.round(d.baseLoad * idx) || 85, 40, 98);
    let rawDemand = 30;
    if (d.key === 'arrivals') rawDemand = Math.round(todayM.avgDailyArrivals);
    else if (d.key === 'departures') rawDemand = Math.round((todayM.avgDailyArrivals || 20) * DEPARTURES_PER_ARRIVAL);
    else if (d.key === 'activity') rawDemand = Math.round(todayM.experiences.attendances);
    else if (d.key === 'fnb') rawDemand = Math.round(todayM.fnb.covers * 0.55);
    else if (d.key === 'spa') rawDemand = Math.round(todayM.spa.treatments);
    else if (d.key === 'housekeeping') rawDemand = Math.round(todayM.roomsSold);

    const activeDemand = Math.max(8, Number.isFinite(rawDemand) ? rawDemand : 24);
    const totalCapacity = Math.max(activeDemand + 1, Math.round(activeDemand / (targetLoad / 100)));
    const exactLoad = clamp(Math.round((activeDemand / totalCapacity) * 100), 40, 98);

    const timeframeLoads = d.timeframeLoads.map((slot, tIdx) =>
      clamp(Math.round(slot * idx + periodOffset[tIdx]), 18, 98)
    );
    return {
      department: d.department,
      peak: d.peak,
      timeWindow: d.timeWindow,
      activeDemand,
      totalCapacity,
      unitLabel: d.unitLabel,
      load: exactLoad,
      status: rhythmStatus(exactLoad),
      staff: `${Math.max(2, Math.round(t.rooms * d.staffPerRoom))} ${d.staffLabel}`,
      timeframeLoads,
    };
  });
}

export interface HourlyRow {
  time: string;
  dept: string;
  activeDemand: number;
  totalCapacity: number;
  unitLabel: string;
  load: number;
  staff: string;
  status: string;
  timeframeLoads: number[];
}

export function getPropertyHourlyTimeline(propertyId: string, period: PeriodId = 'mtd'): HourlyRow[] {
  const rows = getPropertyRhythm(propertyId, period);
  return rows.map((r) => ({
    time: r.timeWindow,
    dept: r.department,
    activeDemand: r.activeDemand,
    totalCapacity: r.totalCapacity,
    unitLabel: r.unitLabel,
    load: r.load,
    staff: r.staff,
    status: r.status,
    timeframeLoads: r.timeframeLoads,
  }));
}

/* ───────────────────────── EVENTS (forward OTB) ───────────────────────── */

interface EventDef {
  title: string;
  date: string;
  category: string;
  /** Contracted or pipeline revenue as a share of the property's forward OTB total revenue, %. */
  revenueSharePct: number;
  /** Attendees as a share of the property's forward stays, %. */
  attendeeSharePct: number;
  targetType: 'booking' | 'lead';
  targetId: string;
  stage: 'Confirmed OTB' | 'Definite' | 'Verbal Definite' | 'Tentative' | 'Prospect';
  client: string;
  keysBlocked: number;
  venue: string;
}

const DEFAULT_EVENT_DEFS: EventDef[] = [
  { title: 'Exclusive Estate & Villa Buyout', date: 'Oct 20 – Oct 26, 2026', category: 'Private Buyout', revenueSharePct: 1.8, attendeeSharePct: 1.4, targetType: 'booking', targetId: 'BK-007', stage: 'Confirmed OTB', client: 'Atlantic Coastal Club', keysBlocked: 18, venue: 'Full Coastal Wing & Private Pavilion' },
  { title: 'Bespoke Curated Longevity Retreat', date: 'Oct 23 – Oct 29, 2026', category: 'Wellness Retreat', revenueSharePct: 1.1, attendeeSharePct: 0.9, targetType: 'booking', targetId: 'BK-006', stage: 'Confirmed OTB', client: 'Holistic Journeys International', keysBlocked: 12, venue: 'Thermal Sanctuary & Healing Deck' },
  { title: 'Signature Culinary & Sommelier Table', date: 'Nov 04 – Nov 07, 2026', category: 'Culinary Gala', revenueSharePct: 0.6, attendeeSharePct: 1.1, targetType: 'lead', targetId: 'LD-010', stage: 'Definite', client: 'Virtuoso Consortium Circle', keysBlocked: 10, venue: 'Private Cellar & Tasting Pavilion' },
  { title: 'Executive Partners Strategy Offsite', date: 'Nov 12 – Nov 16, 2026', category: 'Corporate Buyout', revenueSharePct: 1.5, attendeeSharePct: 1.3, targetType: 'lead', targetId: 'LD-007', stage: 'Tentative', client: 'Northwind Capital Partners', keysBlocked: 20, venue: 'Executive Boardroom & Terrace Suites' },
  { title: 'Autumn Art & Architecture Immersion', date: 'Nov 19 – Nov 23, 2026', category: 'Cultural Salon', revenueSharePct: 0.9, attendeeSharePct: 1.0, targetType: 'lead', targetId: 'LD-021', stage: 'Verbal Definite', client: 'Mori Art Foundation', keysBlocked: 14, venue: 'Gallery Wing & Courtyard' },
  { title: 'Private Family Heritage Gathering', date: 'Dec 02 – Dec 07, 2026', category: 'Private Event', revenueSharePct: 1.2, attendeeSharePct: 1.2, targetType: 'lead', targetId: 'LD-002', stage: 'Prospect', client: 'Smith Family Office', keysBlocked: 15, venue: 'Signature Residences Block' },
];

const PROPERTY_EVENT_DEFS: Record<string, EventDef[]> = {
  'sosei-geneva': [
    { title: 'Swiss Diplomatic & Longevity Forum', date: 'Oct 18 – Oct 21, 2026', category: 'Executive Forum', revenueSharePct: 1.4, attendeeSharePct: 1.2, targetType: 'booking', targetId: 'BK-003', stage: 'Confirmed OTB', client: 'Oxford Medical Congress', keysBlocked: 16, venue: 'Lac Léman Grand Salon & Terrace' },
    { title: 'Rive Droite Lakefront Rooftop Buyout', date: 'Oct 24 – Oct 29, 2026', category: 'Wedding Buyout', revenueSharePct: 2.4, attendeeSharePct: 1.7, targetType: 'lead', targetId: 'LD-015', stage: 'Verbal Definite', client: 'Bella Union Weddings', keysBlocked: 28, venue: 'Courtyard & Mont-Blanc Mirador' },
    { title: 'Haute Horlogerie & Sommelier Summit', date: 'Nov 03 – Nov 07, 2026', category: 'Culinary Gala', revenueSharePct: 1.2, attendeeSharePct: 1.5, targetType: 'lead', targetId: 'LD-022', stage: 'Tentative', client: 'European Epicure Guild', keysBlocked: 14, venue: 'L’Horloge Culinary Lab & Cellar' },
    { title: 'Global Private Banking Board Retreat', date: 'Nov 11 – Nov 15, 2026', category: 'Corporate Offsite', revenueSharePct: 0.9, attendeeSharePct: 0.8, targetType: 'lead', targetId: 'LD-005', stage: 'Prospect', client: 'Global Finance Inc.', keysBlocked: 12, venue: 'Encrypted Penthouse Boardroom' },
    { title: 'Contemporary Art & Biodynamic Cellar Salon', date: 'Nov 20 – Nov 24, 2026', category: 'Private Showcase', revenueSharePct: 0.8, attendeeSharePct: 0.9, targetType: 'booking', targetId: 'BK-JA-03', stage: 'Confirmed OTB', client: 'Amex Fine Hotels & Resorts', keysBlocked: 10, venue: 'Rue du Rhône Grand Suite Wing' },
    { title: 'Lake Geneva Collectors Winter Gala', date: 'Dec 04 – Dec 08, 2026', category: 'Private Buyout', revenueSharePct: 1.7, attendeeSharePct: 1.4, targetType: 'lead', targetId: 'LD-021', stage: 'Definite', client: 'Contemporary Art Foundation', keysBlocked: 22, venue: 'Full Heritage Floor & Gallery' },
  ],
  'sosei-courchevel': [
    { title: 'Trois Vallées Glacier Chalet Syndicate', date: 'Oct 19 – Oct 25, 2026', category: 'Corporate Buyout', revenueSharePct: 2.1, attendeeSharePct: 1.4, targetType: 'lead', targetId: 'LD-024', stage: 'Definite', client: 'Alpine Capital Partners', keysBlocked: 18, venue: 'Trois Vallées Chalet Wing & Heli-Pad' },
    { title: 'Helvetica Haute Horlogerie Exhibition', date: 'Oct 26 – Oct 31, 2026', category: 'Brand Launch', revenueSharePct: 2.5, attendeeSharePct: 1.8, targetType: 'lead', targetId: 'LD-013', stage: 'Tentative', client: 'Helvetica Watches AG', keysBlocked: 32, venue: 'Summit Penthouse & Private Atrium' },
    { title: 'Savoie Private Ski & Thermal Retreat', date: 'Nov 02 – Nov 08, 2026', category: 'Alpine Retreat', revenueSharePct: 1.1, attendeeSharePct: 1.0, targetType: 'booking', targetId: 'BK-002', stage: 'Confirmed OTB', client: 'Skyline Tours Europe', keysBlocked: 12, venue: 'Thermal Spa & Chalet Suites' },
    { title: 'Smith Family Office Chalet Block', date: 'Nov 14 – Nov 19, 2026', category: 'Family Buyout', revenueSharePct: 0.9, attendeeSharePct: 0.9, targetType: 'lead', targetId: 'LD-002', stage: 'Verbal Definite', client: 'Smith Family Office', keysBlocked: 10, venue: 'Private Alpine Chalet Cluster' },
    { title: 'Courchevel 1850 Sommeliers & Truffle Fondue', date: 'Nov 25 – Nov 29, 2026', category: 'Culinary Gala', revenueSharePct: 0.7, attendeeSharePct: 1.1, targetType: 'booking', targetId: 'BK-JA-02', stage: 'Confirmed OTB', client: 'Virtuoso Luxury Travel', keysBlocked: 8, venue: 'High-Altitude Glass Cellar' },
    { title: 'European Private Equity Winter Forum', date: 'Dec 06 – Dec 11, 2026', category: 'Executive Forum', revenueSharePct: 1.9, attendeeSharePct: 1.5, targetType: 'lead', targetId: 'LD-007', stage: 'Prospect', client: 'Northwind Capital', keysBlocked: 24, venue: 'Full Alpine Wing Buyout' },
  ],
  'sosei-alula': [
    { title: 'TechCorp Ashar Canyon Villa Buyout', date: 'Oct 19 – Oct 25, 2026', category: 'Corporate Buyout', revenueSharePct: 2.2, attendeeSharePct: 1.5, targetType: 'lead', targetId: 'LD-001', stage: 'Tentative', client: 'TechCorp Headquarters', keysBlocked: 25, venue: 'Sandstone Canyon Wing' },
    { title: 'Hegra Stargazing & Canyon Hearth Gathering', date: 'Oct 28 – Nov 03, 2026', category: 'VIP Sanctuary', revenueSharePct: 1.4, attendeeSharePct: 1.0, targetType: 'booking', targetId: 'BK-JA-01', stage: 'Confirmed OTB', client: 'Virtuoso / Amex FHR', keysBlocked: 12, venue: 'Hegra Oasis Villas & Terrace' },
    { title: 'Nabataean Oasis Luxury Partner Showcase', date: 'Nov 08 – Nov 14, 2026', category: 'Partner Showcase', revenueSharePct: 1.1, attendeeSharePct: 0.9, targetType: 'lead', targetId: 'LD-011', stage: 'Prospect', client: 'Booking.com Luxury Desk', keysBlocked: 10, venue: 'Private Oasis Residences' },
    { title: 'Desert Sound Bath & Longevity Retreat', date: 'Nov 18 – Nov 24, 2026', category: 'Wellness Retreat', revenueSharePct: 1.3, attendeeSharePct: 1.1, targetType: 'booking', targetId: 'BK-001', stage: 'Confirmed OTB', client: 'Virtuoso Luxury Travel', keysBlocked: 14, venue: 'Sandstone Sanctuary & Acoustic Dome' },
    { title: 'Gulf Sovereign Wealth Executive Dialogue', date: 'Dec 01 – Dec 05, 2026', category: 'Diplomatic Forum', revenueSharePct: 2.6, attendeeSharePct: 1.7, targetType: 'lead', targetId: 'LD-017', stage: 'Verbal Definite', client: 'Gulf Luxury Travel Desk', keysBlocked: 30, venue: 'Royal Canyon Pavilion Estate' },
  ],
  'sosei-kyoto': [
    { title: 'Virtuoso Arashiyama Ryokan Full Buyout', date: 'Oct 20 – Oct 26, 2026', category: 'Private Buyout', revenueSharePct: 2.6, attendeeSharePct: 1.8, targetType: 'lead', targetId: 'LD-003', stage: 'Definite', client: 'Virtuoso Travel Consortium', keysBlocked: 34, venue: 'Full Bamboo Sanctuary Wing' },
    { title: 'Katsura River Kampo & Longevity Week', date: 'Oct 23 – Oct 29, 2026', category: 'Wellness Retreat', revenueSharePct: 1.4, attendeeSharePct: 1.1, targetType: 'booking', targetId: 'BK-006', stage: 'Confirmed OTB', client: 'Holistic Journeys International', keysBlocked: 14, venue: 'Katsura River Onsen Suites' },
    { title: 'Kyoto Zen Temple Sound & Tea Immersion', date: 'Nov 05 – Nov 11, 2026', category: 'Mindfulness', revenueSharePct: 1.2, attendeeSharePct: 1.2, targetType: 'lead', targetId: 'LD-023', stage: 'Verbal Definite', client: 'Sanctuary Mindfulness Collective', keysBlocked: 16, venue: 'Zen Moss Garden & Chashitsu' },
    { title: 'Lotus Alliance Hinoki Pavilion Retreat', date: 'Nov 16 – Nov 21, 2026', category: 'Yoga & Healing', revenueSharePct: 0.9, attendeeSharePct: 0.9, targetType: 'lead', targetId: 'LD-012', stage: 'Prospect', client: 'Lotus Yoga Alliance', keysBlocked: 10, venue: 'Bamboo Pavilions & Onsen Spa' },
    { title: 'Autumn Momiji Kaiseki & Botanical Retreat', date: 'Nov 28 – Dec 04, 2026', category: 'Wellness Retreat', revenueSharePct: 1.5, attendeeSharePct: 1.3, targetType: 'lead', targetId: 'LD-006', stage: 'Tentative', client: 'Serenity Wellness Collective', keysBlocked: 18, venue: 'Arashiyama Ryokan Villas' },
  ],
  'sosei-muscat': [
    { title: 'Royal Al Hajar Cove Pavilion Charter', date: 'Oct 26 – Oct 31, 2026', category: 'Royal Delegation', revenueSharePct: 2.3, attendeeSharePct: 1.5, targetType: 'booking', targetId: 'BK-008', stage: 'Confirmed OTB', client: 'Gulf Royal Consular Office', keysBlocked: 22, venue: 'Royal Al Hajar Reserve Wing' },
    { title: 'Maison Aoki Arabian Gulf Design Residency', date: 'Nov 03 – Nov 09, 2026', category: 'Fashion & Art', revenueSharePct: 1.9, attendeeSharePct: 1.4, targetType: 'lead', targetId: 'LD-014', stage: 'Definite', client: 'Maison Aoki Group', keysBlocked: 20, venue: 'Gulf of Oman Pool Suites' },
    { title: 'Al Mansoori Private Cove Sanctuary', date: 'Nov 14 – Nov 20, 2026', category: 'Private Buyout', revenueSharePct: 1.4, attendeeSharePct: 1.0, targetType: 'lead', targetId: 'LD-008', stage: 'Verbal Definite', client: 'Al Mansoori Family Office', keysBlocked: 14, venue: 'Frankincense Cliff Pavilions' },
    { title: 'Diplomatic Security Wing Reserve Inquiry', date: 'Nov 25 – Nov 30, 2026', category: 'Diplomatic Buyout', revenueSharePct: 2.5, attendeeSharePct: 1.6, targetType: 'lead', targetId: 'LD-017', stage: 'Prospect', client: 'Gulf Luxury Travel', keysBlocked: 28, venue: 'Entire Cove Sanctuary Wing' },
    { title: 'Omani Dhow & Frankincense Astronomy Salon', date: 'Dec 03 – Dec 09, 2026', category: 'Cultural Salon', revenueSharePct: 1.1, attendeeSharePct: 0.9, targetType: 'booking', targetId: 'BK-JA-04', stage: 'Confirmed OTB', client: 'Virtuoso Advisor', keysBlocked: 10, venue: 'Al Hajar Sanctuary Penthouse' },
  ],
  'sosei-marrakech': [
    { title: 'Abercrombie & Kent Atlas Heritage Group', date: 'Oct 27 – Nov 02, 2026', category: 'Expedition Buyout', revenueSharePct: 2.1, attendeeSharePct: 1.6, targetType: 'lead', targetId: 'LD-009', stage: 'Tentative', client: 'Abercrombie & Kent', keysBlocked: 22, venue: 'Palmeraie Royal Riads' },
    { title: 'Twilight Palmeraie & Medina Gala Buyout', date: 'Nov 06 – Nov 11, 2026', category: 'Private Gala', revenueSharePct: 1.3, attendeeSharePct: 1.2, targetType: 'lead', targetId: 'LD-018', stage: 'Verbal Definite', client: 'Expedia Luxury Events', keysBlocked: 16, venue: 'Medina Courtyard Pavilion & Terrace' },
    { title: 'Mayfair Imperial Riad & Atlas Heli Charter', date: 'Jan 14 – Jan 21, 2027', category: 'Private Charter', revenueSharePct: 1.8, attendeeSharePct: 1.1, targetType: 'booking', targetId: 'BK-009', stage: 'Confirmed OTB', client: 'Abercrombie & Kent UK', keysBlocked: 12, venue: 'Royal Riad Palace Suites' },
    { title: 'Moroccan Botanical & Hammam Longevity Forum', date: 'Nov 19 – Nov 24, 2026', category: 'Wellness Forum', revenueSharePct: 1.0, attendeeSharePct: 0.9, targetType: 'lead', targetId: 'LD-025', stage: 'Prospect', client: 'Vanguard Biome Research', keysBlocked: 12, venue: 'Oasis Hammam Sanctuary Wing' },
  ],
  'sosei-los-cabos': [
    { title: 'Sea of Cortez Yacht & Equestrian Buyout', date: 'Oct 20 – Oct 26, 2026', category: 'Coastal Buyout', revenueSharePct: 1.9, attendeeSharePct: 1.4, targetType: 'booking', targetId: 'BK-007', stage: 'Confirmed OTB', client: 'Pacific Coastal Club', keysBlocked: 18, venue: 'Sea of Cortez Oceanfront Haciendas' },
    { title: 'Northwind Capital Partners Baja Retreat', date: 'Oct 28 – Nov 02, 2026', category: 'Corporate Buyout', revenueSharePct: 2.3, attendeeSharePct: 1.6, targetType: 'lead', targetId: 'LD-007', stage: 'Tentative', client: 'Northwind Capital', keysBlocked: 24, venue: 'Desert Arroyo Pavilions & Estate' },
    { title: 'Whitaker Family Office Hacienda Gathering', date: 'Nov 09 – Nov 15, 2026', category: 'Family Buyout', revenueSharePct: 1.2, attendeeSharePct: 1.0, targetType: 'lead', targetId: 'LD-019', stage: 'Definite', client: 'Whitaker Family Office', keysBlocked: 12, venue: 'Baja Cliffside Pool Suites' },
    { title: 'Baja Reserve Agave & Mezcal Harvest', date: 'Nov 21 – Nov 26, 2026', category: 'Culinary Gala', revenueSharePct: 1.0, attendeeSharePct: 1.1, targetType: 'lead', targetId: 'LD-022', stage: 'Verbal Definite', client: 'Americas Epicure Guild', keysBlocked: 14, venue: 'Agave Cellar & Cliffside Pavilion' },
  ],
  'sosei-amalfi': [
    { title: 'Ravello Cliffside Crudo & Cellar Buyout', date: 'Oct 28 – Nov 03, 2026', category: 'Culinary Buyout', revenueSharePct: 2.0, attendeeSharePct: 1.5, targetType: 'lead', targetId: 'LD-010', stage: 'Definite', client: 'Virtuoso Consortium Circle', keysBlocked: 20, venue: 'Tyrrhenian Cliffside Palazzo Wing' },
    { title: 'Tokyo Capital Lemon Grove Sanctuary', date: 'Apr 04 – Apr 09, 2027', category: 'VIP Sanctuary', revenueSharePct: 1.3, attendeeSharePct: 1.0, targetType: 'booking', targetId: 'BK-004', stage: 'Confirmed OTB', client: 'Virtuoso Italy', keysBlocked: 10, venue: 'Ravello Lemon Grove Villas' },
    { title: 'Roman Thermal & Tyrrhenian Autumn Retreat', date: 'Nov 12 – Nov 17, 2026', category: 'Wellness Retreat', revenueSharePct: 1.4, attendeeSharePct: 1.1, targetType: 'lead', targetId: 'LD-020', stage: 'Prospect', client: 'Zen Journeys', keysBlocked: 15, venue: 'Roman Thermal Cliff Spa & Villas' },
    { title: 'Heritage Cloister Architecture Symposium', date: 'Nov 24 – Nov 29, 2026', category: 'Cultural Salon', revenueSharePct: 1.6, attendeeSharePct: 1.3, targetType: 'lead', targetId: 'LD-021', stage: 'Verbal Definite', client: 'Mori Art Foundation', keysBlocked: 16, venue: 'Heritage Cloister Residences' },
  ],
  'sosei-patagonia': [
    { title: 'Torres del Paine Glacier & Puma Expedition', date: 'Oct 16 – Oct 22, 2026', category: 'Eco Buyout', revenueSharePct: 1.6, attendeeSharePct: 1.3, targetType: 'booking', targetId: 'BK-005', stage: 'Confirmed OTB', client: 'Discovery Expeditions', keysBlocked: 14, venue: 'Paine Massif Glacier Estancias' },
    { title: 'Serenity Collective Austral Sound Retreat', date: 'Oct 25 – Oct 30, 2026', category: 'Wellness Retreat', revenueSharePct: 1.5, attendeeSharePct: 1.2, targetType: 'lead', targetId: 'LD-006', stage: 'Verbal Definite', client: 'Serenity Wellness Collective', keysBlocked: 12, venue: 'Glacial Botanical Spa Pavilion' },
    { title: 'Vanguard Biome Patagonian Steppe Symposium', date: 'Nov 06 – Nov 11, 2026', category: 'Research Forum', revenueSharePct: 1.4, attendeeSharePct: 1.1, targetType: 'lead', targetId: 'LD-025', stage: 'Prospect', client: 'Vanguard Biome Research', keysBlocked: 14, venue: 'Lenga Forest Refuge Suites' },
    { title: 'Grey Glacier Private Kayak & Asador Charter', date: 'Nov 18 – Nov 24, 2026', category: 'Private Charter', revenueSharePct: 1.8, attendeeSharePct: 1.2, targetType: 'lead', targetId: 'LD-009', stage: 'Tentative', client: 'Abercrombie & Kent', keysBlocked: 16, venue: 'Lake Sarmiento Horizon Villas' },
  ],
};

export interface PropertyEventRow {
  title: string;
  date: string;
  category: string;
  attendees: number;
  /** Contracted or pipeline revenue (USD, from the engine forward OTB). */
  revenueUsd: number;
  targetType: 'booking' | 'lead';
  targetId: string;
  stage: 'Confirmed OTB' | 'Definite' | 'Verbal Definite' | 'Tentative' | 'Prospect';
  client: string;
  keysBlocked: number;
  venue: string;
}

export function getPropertyEvents(propertyId: string): PropertyEventRow[] {
  const fwd = getPropertyMetrics(propertyId, 'forward');
  const defs = PROPERTY_EVENT_DEFS[propertyId] ?? DEFAULT_EVENT_DEFS;
  return defs.map((d) => ({
    title: d.title,
    date: d.date,
    category: d.category,
    attendees: Math.max(8, Math.round((fwd.stays * d.attendeeSharePct) / 100)),
    revenueUsd: Math.round((fwd.totalRevenue * d.revenueSharePct) / 100),
    targetType: d.targetType,
    targetId: d.targetId,
    stage: d.stage,
    client: d.client,
    keysBlocked: d.keysBlocked,
    venue: d.venue,
  }));
}

/* ───────────────────────── ALERTS ───────────────────────── */

export interface PropertyAlertRow {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  text: string;
  detail: string;
  tag: string;
}

export function getPropertyAlerts(propertyId: string, propertyName: string): PropertyAlertRow[] {
  const activity = getPropertyGuestActivity(propertyId);
  const today = getPropertyMetrics(propertyId, 'today');
  const pace = getForwardWindowMetrics([propertyId], 90).paceVsLyPct;
  const paceLabel = `${pace >= 0 ? '+' : '-'}${Math.abs(pace).toFixed(1)}%`;
  const vip = activity.vipArrivals;

  return [
    {
      id: 'alt-1',
      priority: 'High',
      title: `${vip} VIP Arrivals Scheduled Today`,
      text: `Ensure personalized welcome and suite amenity setup for ${propertyName}`,
      detail: `${vip} of ${activity.arrivals} guests arriving today are VIP / VVIP. The butler team has prepared bespoke welcome amenities and private check-in; ${activity.pendingCheckIn} arrivals are still to check in.`,
      tag: 'VIP Care',
    },
    {
      id: 'alt-2',
      priority: 'Medium',
      title: `Forward Booking Pace ${paceLabel} vs LY`,
      text: `Next 90 days: ${today.rooms} keys, review release strategy for the peak dates`,
      detail: `On-the-books room nights for the next 90 days are pacing ${paceLabel} versus the same time last year. Review rate fences and group allocation for peak weekends.`,
      tag: 'Revenue',
    },
    {
      id: 'alt-3',
      priority: 'Low',
      title: 'Scheduled Maintenance: Thermal Spa & Facilities',
      text: 'Routine thermal inspection scheduled at 2:00 PM today with Engineering',
      detail: 'Maintenance window: 14:00 – 15:30. Guest notice already published on the private digital concierge app.',
      tag: 'Facilities',
    },
  ];
}

/* ───────────────────────── GUEST SATISFACTION (non-financial) ───────────────────────── */

export const GUEST_SATISFACTION_SCORE = 4.8;
export const GUEST_SATISFACTION_DELTA = 0.3;
export const GUEST_SATISFACTION_DISTRIBUTION: Array<{ name: string; value: number; color: string }> = [
  { name: '5 Stars', value: 72, color: '#0f172a' },
  { name: '4 Stars', value: 20, color: '#334155' },
  { name: '3 Stars', value: 6, color: '#64748b' },
  { name: '< 3 Stars', value: 2, color: '#94a3b8' },
];

const PROPERTY_SATISFACTION_PROFILES: Record<string, { score: number; delta: number; fiveStar: number; fourStar: number; threeStar: number }> = {
  'sosei-geneva': { score: 4.8, delta: 0.3, fiveStar: 72, fourStar: 20, threeStar: 6 },
  'sosei-courchevel': { score: 4.9, delta: 0.4, fiveStar: 78, fourStar: 16, threeStar: 5 },
  'sosei-niseko': { score: 4.9, delta: 0.4, fiveStar: 79, fourStar: 16, threeStar: 4 },
  'sosei-aspen': { score: 4.9, delta: 0.3, fiveStar: 77, fourStar: 17, threeStar: 5 },
  'sosei-marrakech': { score: 4.7, delta: 0.2, fiveStar: 66, fourStar: 24, threeStar: 7 },
  'sosei-alula': { score: 4.9, delta: 0.3, fiveStar: 76, fourStar: 18, threeStar: 5 },
  'sosei-los-cabos': { score: 4.8, delta: 0.3, fiveStar: 74, fourStar: 19, threeStar: 5 },
  'sosei-sumba': { score: 4.9, delta: 0.4, fiveStar: 81, fourStar: 14, threeStar: 4 },
  'sosei-amalfi': { score: 4.9, delta: 0.4, fiveStar: 80, fourStar: 15, threeStar: 4 },
  'sosei-muscat': { score: 4.8, delta: 0.2, fiveStar: 71, fourStar: 21, threeStar: 6 },
  'sosei-seychelles': { score: 4.9, delta: 0.4, fiveStar: 78, fourStar: 17, threeStar: 4 },
  'sosei-patagonia': { score: 4.9, delta: 0.5, fiveStar: 82, fourStar: 13, threeStar: 4 },
  'sosei-serengeti': { score: 4.9, delta: 0.4, fiveStar: 81, fourStar: 14, threeStar: 4 },
  'sosei-kyoto': { score: 4.9, delta: 0.4, fiveStar: 79, fourStar: 16, threeStar: 4 },
};

export interface SatisfactionPillarRow {
  pillar: string;
  shortName: string;
  score: number;
  scoreLabel: string;
  benchmark: string;
  mentions: number;
  positivePct: number;
  trend: string;
  highlight: string;
}

export interface SatisfactionPlatformRow {
  platform: string;
  nativeRating: string;
  normalizedScore: string;
  reviews: number;
  sharePct: number;
  responseRate: string;
  trend: string;
  accolade: string;
}

export interface PropertyVerifiedReview {
  guest: string;
  suite: string;
  platform: 'TripAdvisor' | 'Google Reviews' | 'Booking.com' | 'Direct Survey';
  overallScore: string;
  cleanlinessScore: string;
  dateLabel: string;
  title: string;
  comment: string;
}

const PLATFORM_SHARES: ShareDef[] = [
  { id: 'tripadvisor', name: 'TripAdvisor', share: 32 },
  { id: 'google', name: 'Google Reviews', share: 26 },
  { id: 'booking', name: 'Booking.com', share: 18 },
  { id: 'direct', name: 'Direct Post-Stay Survey (PMS)', share: 14 },
  { id: 'forbes', name: 'Forbes & Virtuoso Advisors', share: 10 },
];

const PILLAR_SHARES: ShareDef[] = [
  { id: 'cleanliness', name: 'Cleanliness', share: 24 },
  { id: 'service', name: 'Service & Butler', share: 22 },
  { id: 'rooms', name: 'Rooms & Comfort', share: 19 },
  { id: 'sleep', name: 'Sleep Quality', share: 14 },
  { id: 'location', name: 'Location & Setting', share: 12 },
  { id: 'value', name: 'Value & Dining', share: 9 },
];

export function getPropertyGuestSatisfaction(propertyId: string, period: PeriodId = 'mtd') {
  const m = getPropertyMetrics(propertyId, period);
  const base = PROPERTY_SATISFACTION_PROFILES[propertyId] ?? PROPERTY_SATISFACTION_PROFILES['sosei-geneva'];
  const periodShift = period === 'today' ? 4 : period === 'mtd' ? 0 : -4;
  const five = clamp(base.fiveStar + periodShift, 55, 88);
  const four = clamp(base.fourStar - Math.round(periodShift * 0.7), 10, 32);
  const three = clamp(base.threeStar - (periodShift - Math.round(periodShift * 0.7)), 2, 12);
  const low = Math.max(1, 100 - (five + four + three));
  const scoreAdj = period === 'today' ? 0.05 : period === 'mtd' ? 0 : -0.05;
  const overallScore = Number(clamp(base.score + scoreAdj, 4.5, 5.0).toFixed(1));
  const cleanlinessScore = Number(clamp(overallScore + 0.1, 4.6, 5.0).toFixed(1));
  const totalReviews = Math.max(12, Math.round(m.stays * 0.62));
  const nps = clamp(Math.round((five - low) * 1.12), 72, 94);

  const pillarMentions = splitByShares(totalReviews, PILLAR_SHARES);
  const pillarDefs = [
    {
      pillar: 'Cleanliness & Hygiene',
      shortName: 'Cleanliness',
      offset: 0.1,
      bench: '4.8',
      trend: '+0.4',
      positivePct: clamp(five + four + 5, 92, 99),
      highlight: 'Immaculate suite housekeeping, twice-daily turndown & sterile spa sanitation',
    },
    {
      pillar: 'Service & Butler Excellence',
      shortName: 'Service & Butler',
      offset: 0.1,
      bench: '4.7',
      trend: '+0.4',
      positivePct: clamp(five + four + 4, 91, 99),
      highlight: 'Proactive 24/7 private butler care, seamless arrival & personalized concierge',
    },
    {
      pillar: 'Rooms, Suites & Comfort',
      shortName: 'Rooms & Comfort',
      offset: 0.0,
      bench: '4.8',
      trend: '+0.3',
      positivePct: clamp(five + four + 2, 89, 98),
      highlight: 'Architectural suite layout, bespoke linens & private terrace amenities',
    },
    {
      pillar: 'Sleep Quality & Privacy',
      shortName: 'Sleep Quality',
      offset: 0.0,
      bench: '4.7',
      trend: '+0.3',
      positivePct: clamp(five + four + 3, 90, 98),
      highlight: 'Acoustic insulation, custom pillow menu & complete estate seclusion',
    },
    {
      pillar: 'Location & Destination Setting',
      shortName: 'Location',
      offset: 0.1,
      bench: '4.8',
      trend: '+0.3',
      positivePct: clamp(five + four + 4, 92, 99),
      highlight: `Prime ${m.location} sanctuary with effortless access to signature experiences`,
    },
    {
      pillar: 'Value, Culinary & Spa',
      shortName: 'Value & Dining',
      offset: -0.1,
      bench: '4.6',
      trend: '+0.2',
      positivePct: clamp(five + four - 1, 86, 96),
      highlight: 'Michelin-caliber gastronomy, holistic wellness rituals & curated inclusions',
    },
  ];

  const pillars: SatisfactionPillarRow[] = pillarDefs.map((p, idx) => {
    const s = Number(clamp(overallScore + p.offset, 4.4, 5.0).toFixed(1));
    return {
      pillar: p.pillar,
      shortName: p.shortName,
      score: s,
      scoreLabel: `${s.toFixed(1)} / 5.0`,
      benchmark: p.bench,
      mentions: Math.max(2, pillarMentions[idx]?.value ?? 4),
      positivePct: p.positivePct,
      trend: `↑ ${p.trend}`,
      highlight: p.highlight,
    };
  });

  const platformReviewSplits = splitByShares(totalReviews, PLATFORM_SHARES);
  const taScore = Number(clamp(overallScore + 0.1, 4.6, 5.0).toFixed(1));
  const googleScore = Number(clamp(overallScore + 0.1, 4.6, 5.0).toFixed(1));
  const bookingNorm = Number(clamp(overallScore, 4.5, 5.0).toFixed(1));
  const bookingNative = (bookingNorm * 2).toFixed(1);
  const directScore = Number(clamp(overallScore, 4.5, 5.0).toFixed(1));
  const forbesScore = Number(clamp(overallScore + 0.1, 4.7, 5.0).toFixed(1));

  const platforms: SatisfactionPlatformRow[] = [
    {
      platform: 'TripAdvisor',
      nativeRating: `${taScore.toFixed(1)} / 5.0`,
      normalizedScore: `${taScore.toFixed(1)} / 5.0`,
      reviews: platformReviewSplits[0].value,
      sharePct: PLATFORM_SHARES[0].share,
      responseRate: '100%',
      trend: '↑ +0.3',
      accolade: `#1 Luxury Hotel in ${m.location.split(',')[0]} · Travelers' Choice`,
    },
    {
      platform: 'Google Reviews',
      nativeRating: `${googleScore.toFixed(1)} / 5.0`,
      normalizedScore: `${googleScore.toFixed(1)} / 5.0`,
      reviews: platformReviewSplits[1].value,
      sharePct: PLATFORM_SHARES[1].share,
      responseRate: '99%',
      trend: '↑ +0.3',
      accolade: 'Verified Guest & Local Guide Top Rated',
    },
    {
      platform: 'Booking.com',
      nativeRating: `${bookingNative} / 10`,
      normalizedScore: `${bookingNorm.toFixed(1)} / 5.0`,
      reviews: platformReviewSplits[2].value,
      sharePct: PLATFORM_SHARES[2].share,
      responseRate: '100%',
      trend: '↑ +0.2',
      accolade: 'Traveller Review Award · Cleanliness 9.8/10',
    },
    {
      platform: 'Direct Post-Stay Survey (PMS)',
      nativeRating: `${directScore.toFixed(1)} / 5.0`,
      normalizedScore: `${directScore.toFixed(1)} / 5.0`,
      reviews: platformReviewSplits[3].value,
      sharePct: PLATFORM_SHARES[3].share,
      responseRate: '100%',
      trend: '↑ +0.4',
      accolade: 'Verified Checkout & Butler Feedback',
    },
    {
      platform: 'Forbes & Virtuoso Advisors',
      nativeRating: `${forbesScore.toFixed(1)} / 5.0`,
      normalizedScore: `${forbesScore.toFixed(1)} / 5.0`,
      reviews: platformReviewSplits[4].value,
      sharePct: PLATFORM_SHARES[4].share,
      responseRate: '100%',
      trend: '↑ +0.3',
      accolade: 'Five-Star Inspector & Advisor Audits',
    },
  ];

  const now = new Date();
  const fmtRecentDate = (daysAgo: number) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tiers = PROPERTY_ROOM_TIERS[propertyId] ?? PROPERTY_ROOM_TIERS['sosei-geneva'];
  const recentReviews: PropertyVerifiedReview[] = [
    {
      guest: 'Lord & Lady Harrington',
      suite: tiers[0]?.name ?? 'Signature Penthouse Suite',
      platform: 'TripAdvisor',
      overallScore: '5.0 / 5.0',
      cleanlinessScore: '5.0 / 5.0',
      dateLabel: fmtRecentDate(1),
      title: `Flawless cleanliness and world-class butler service at ${m.name}`,
      comment: `Every corner of our ${tiers[0]?.name ?? 'suite'} was spotless. Housekeeping twice-daily turndown was invisible yet meticulous, and the private thermal spa hygiene exceeded every 5-star standard.`,
    },
    {
      guest: 'Dr. & Mrs. Kenji Sato',
      suite: tiers[1]?.name ?? 'Premier Terrace Suite',
      platform: 'Google Reviews',
      overallScore: `${cleanlinessScore.toFixed(1)} / 5.0`,
      cleanlinessScore: '5.0 / 5.0',
      dateLabel: fmtRecentDate(2),
      title: 'Pristine sanctuary, exceptional sleep quality & gastronomy',
      comment: `From arrival in ${m.location.split(',')[0]} to departure, cleanliness and room comfort were 10/10. Linens, bath amenities, and dining presentation were impeccable.`,
    },
    {
      guest: 'Countess Beatrix Von Berg',
      suite: tiers[2]?.name ?? 'Sanctuary Residence',
      platform: 'Booking.com',
      overallScore: '9.8 / 10',
      cleanlinessScore: '10 / 10',
      dateLabel: fmtRecentDate(3),
      title: 'Unmatched attention to detail and housekeeping perfection',
      comment: `Rated 10/10 on Cleanliness, Comfort, and Staff. Our butler anticipated every dietary and wellness preference before we even asked.`,
    },
    {
      guest: 'Mr. David Sterling',
      suite: tiers[0]?.name ?? 'Signature Villa',
      platform: 'Direct Survey',
      overallScore: `${overallScore.toFixed(1)} / 5.0`,
      cleanlinessScore: `${cleanlinessScore.toFixed(1)} / 5.0`,
      dateLabel: fmtRecentDate(4),
      title: 'Benchmark luxury hospitality and restorative privacy',
      comment: `Acoustic privacy, spotless wellness facilities, and seamless concierge coordination throughout our stay at ${m.name}.`,
    },
  ];

  return {
    score: overallScore,
    cleanlinessScore,
    delta: base.delta,
    totalReviews,
    nps,
    distribution: [
      { name: '5 Stars', value: five, color: '#0f172a' },
      { name: '4 Stars', value: four, color: '#334155' },
      { name: '3 Stars', value: three, color: '#64748b' },
      { name: '< 3 Stars', value: low, color: '#94a3b8' },
    ],
    pillars,
    platforms,
    recentReviews,
  };
}
