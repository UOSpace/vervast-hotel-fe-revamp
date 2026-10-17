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

export const BOOKING_CHANNEL_MIX: RoomMixDef[] = [
  { id: 'direct', name: 'Direct', share: 33, adrFactor: 1.11, color: '#0f172a', trendPct: 6 },
  { id: 'ota', name: 'OTA', share: 28, adrFactor: 0.81, color: '#334155', trendPct: -2 },
  { id: 'consortia', name: 'Consortia', share: 15, adrFactor: 0.87, color: '#64748b', trendPct: 1 },
  { id: 'ownweb', name: 'Own Web', share: 11, adrFactor: 1.06, color: '#94a3b8', trendPct: 4 },
  { id: 'others', name: 'Others', share: 13, adrFactor: 0.71, color: '#cbd5e1', trendPct: -3 },
];

/** Guest origin markets (region of residence) used on the Property Categories view. */
export const GUEST_ORIGIN_MIX: RoomMixDef[] = [
  { id: 'asia-pacific', name: 'Asia Pacific', share: 35, adrFactor: 0.95, color: '#0f172a', trendPct: 7 },
  { id: 'europe', name: 'Europe', share: 25, adrFactor: 1.09, color: '#334155', trendPct: 4 },
  { id: 'america', name: 'America', share: 20, adrFactor: 0.86, color: '#64748b', trendPct: 5 },
  { id: 'middle-east', name: 'Middle East', share: 12, adrFactor: 0.77, color: '#94a3b8', trendPct: 3 },
  { id: 'africa', name: 'Africa', share: 8, adrFactor: 0.68, color: '#cbd5e1', trendPct: 1 },
];

/** Guest nationalities (property view). The first four are the "Top 4" shown on the card. */
export const GUEST_NATIONALITY_MIX: RoomMixDef[] = [
  { id: 'us', name: 'United States', share: 24, adrFactor: 1.08, color: '#0f172a', trendPct: 2 },
  { id: 'uk', name: 'United Kingdom', share: 16, adrFactor: 1.02, color: '#334155', trendPct: 1 },
  { id: 'de', name: 'Germany', share: 12, adrFactor: 0.95, color: '#64748b', trendPct: -1 },
  { id: 'ch', name: 'Switzerland', share: 10, adrFactor: 1.12, color: '#94a3b8', trendPct: 3 },
  { id: 'other', name: 'Other Markets', share: 38, adrFactor: 0.9, color: '#cbd5e1', trendPct: 2 },
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
  'sosei-andermatt': [
    { name: 'Gotthard Chalet Suite', keyShare: 22, occDelta: 6 },
    { name: 'Alpine Signature Suite', keyShare: 20, occDelta: 1 },
    { name: 'Panorama Glacial Room', keyShare: 16, occDelta: -2 },
    { name: 'Thermal Spa Cabin', keyShare: 14, occDelta: -6 },
  ],
  'sosei-el-gouna': [
    { name: 'Red Sea Lagoon Villa', keyShare: 24, occDelta: 6 },
    { name: 'Coral Reef Pool Suite', keyShare: 22, occDelta: 2 },
    { name: 'Desert Coast Pavilion', keyShare: 18, occDelta: -2 },
    { name: 'Marina Sanctuary Suite', keyShare: 16, occDelta: -8 },
  ],
  'sosei-auh': [
    { name: 'Saadiyat Beachfront Villa', keyShare: 26, occDelta: 6 },
    { name: 'Arabian Gulf Pool Suite', keyShare: 24, occDelta: 1 },
    { name: 'Oceanfront Dune Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Private Island Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-melides': [
    { name: 'Alentejo Atlantic Dune Villa', keyShare: 26, occDelta: 6 },
    { name: 'Lagoon Terrace Suite', keyShare: 24, occDelta: 1 },
    { name: 'Cork Forest Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Coastal Sanctuary Studio', keyShare: 15, occDelta: -7 },
  ],
  'sosei-umbria': [
    { name: 'Castello Vineyard Palazzo Suite', keyShare: 25, occDelta: 6 },
    { name: 'Umbrian Hillside Villa', keyShare: 25, occDelta: 2 },
    { name: 'Olive Grove Terrace Suite', keyShare: 20, occDelta: -2 },
    { name: 'Heritage Stone Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-tinos': [
    { name: 'Aegean Cliffside Cycladic Villa', keyShare: 26, occDelta: 6 },
    { name: 'Marble Terrace Pool Suite', keyShare: 24, occDelta: 1 },
    { name: 'Aegean Sea View Pavilion', keyShare: 20, occDelta: -2 },
    { name: 'Island Sanctuary Residence', keyShare: 15, occDelta: -7 },
  ],
  'sosei-barcelona': [
    { name: 'Catalan Penthouse Suite', keyShare: 25, occDelta: 6 },
    { name: 'Passeig Deluxe Room', keyShare: 35, occDelta: 1 },
    { name: 'Mediterranean Terrace Suite', keyShare: 30, occDelta: -2 },
    { name: 'Gothic Quarter Studio', keyShare: 20, occDelta: -6 },
  ],
  'sosei-osa': [
    { name: 'Corcovado Canopy Suite', keyShare: 26, occDelta: 6 },
    { name: 'Golfo Dulce Ocean Villa', keyShare: 24, occDelta: 2 },
    { name: 'Rainforest Treehouse Haven', keyShare: 20, occDelta: -2 },
    { name: 'Pacific Wilderness Pavilion', keyShare: 15, occDelta: -8 },
  ],
  'sosei-bali': [
    { name: 'Holistic Cliffside Ocean Villa', keyShare: 28, occDelta: 5 },
    { name: 'Ayung River Wellness Suite', keyShare: 24, occDelta: 1 },
    { name: 'Sacred Jungle Pavilion', keyShare: 18, occDelta: -2 },
    { name: 'Longevity Pool Residence', keyShare: 12, occDelta: -7 },
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

/* ───────────────────────── PROPERTY RHYTHM (today) ───────────────────────── */

interface RhythmDef {
  department: string;
  peak: string;
  baseLoad: number;
  staffPerRoom: number;
  staffLabel: string;
}

const RHYTHM_DEFS: RhythmDef[] = [
  { department: 'Arrivals & Check-in', peak: '2:00 PM – 4:00 PM', baseLoad: 85, staffPerRoom: 0.07, staffLabel: 'Butlers / Front Desk' },
  { department: 'F&B & Fine Dining', peak: '7:00 PM – 9:30 PM', baseLoad: 92, staffPerRoom: 0.13, staffLabel: 'Culinary & Sommeliers' },
  { department: 'Spa & Wellness Center', peak: '3:00 PM – 6:00 PM', baseLoad: 75, staffPerRoom: 0.055, staffLabel: 'Therapists & Practitioners' },
  { department: 'Housekeeping & Turn-down', peak: '10:00 AM – 1:00 PM', baseLoad: 90, staffPerRoom: 0.11, staffLabel: 'Attendants & Supervisors' },
];

const HOURLY_DEFS: Array<RhythmDef & { time: string }> = [
  { time: '07:00 – 09:30', department: 'In-Room Breakfast & Dining', peak: '', baseLoad: 78, staffPerRoom: 0.09, staffLabel: 'Culinary / Waitstaff' },
  { time: '10:00 – 13:00', department: 'Housekeeping & Midday Turn-down', peak: '', baseLoad: 90, staffPerRoom: 0.11, staffLabel: 'Attendants & Supervisors' },
  { time: '14:00 – 16:00', department: 'Front Desk & Guest Arrivals', peak: '', baseLoad: 85, staffPerRoom: 0.07, staffLabel: 'Butlers / Valet Reception' },
  { time: '15:00 – 18:00', department: 'Thermal Spa & Recovery Center', peak: '', baseLoad: 75, staffPerRoom: 0.055, staffLabel: 'Therapists & Attendants' },
  { time: '19:00 – 21:30', department: 'F&B Fine Dining & Sommelier Bar', peak: '', baseLoad: 92, staffPerRoom: 0.13, staffLabel: 'Culinary & Sommeliers' },
  { time: '21:30 – 23:00', department: 'Evening Turn-down & Concierge Bar', peak: '', baseLoad: 60, staffPerRoom: 0.055, staffLabel: 'Night Concierge & Porters' },
];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export const rhythmStatus = (load: number): string => (load >= 90 ? 'Peak Load' : load >= 80 ? 'High Volume' : load >= 70 ? 'Active' : 'Wind Down');

/** Property occupancy today relative to the portfolio occupancy today: busier property => higher department load. */
function loadIndex(propertyId: string): number {
  const today = getPropertyMetrics(propertyId, 'today');
  const portfolio = getPortfolioMetrics(undefined, 'today');
  return portfolio.occupancyPct > 0 ? today.occupancyPct / portfolio.occupancyPct : 1;
}

export interface RhythmRow {
  department: string;
  peak: string;
  load: number;
  status: string;
  staff: string;
}

export function getPropertyRhythm(propertyId: string): RhythmRow[] {
  const t = getPropertyMetrics(propertyId, 'today');
  const idx = loadIndex(propertyId);
  return RHYTHM_DEFS.map((d) => {
    const load = clamp(Math.round(d.baseLoad * idx), 40, 98);
    return {
      department: d.department,
      peak: d.peak,
      load,
      status: rhythmStatus(load),
      staff: `${Math.max(2, Math.round(t.rooms * d.staffPerRoom))} ${d.staffLabel}`,
    };
  });
}

export interface HourlyRow {
  time: string;
  dept: string;
  load: number;
  staff: string;
  status: string;
}

export function getPropertyHourlyTimeline(propertyId: string): HourlyRow[] {
  const t = getPropertyMetrics(propertyId, 'today');
  const idx = loadIndex(propertyId);
  return HOURLY_DEFS.map((d) => {
    const load = clamp(Math.round(d.baseLoad * idx), 40, 98);
    return {
      time: d.time,
      dept: d.department,
      load,
      staff: `${Math.max(2, Math.round(t.rooms * d.staffPerRoom))} ${d.staffLabel}`,
      status: rhythmStatus(load),
    };
  });
}

/* ───────────────────────── EVENTS (forward OTB) ───────────────────────── */

interface EventDef {
  title: string;
  date: string;
  category: string;
  /** Contracted revenue as a share of the property's forward OTB total revenue, %. */
  revenueSharePct: number;
  /** Attendees as a share of the property's forward stays, %. */
  attendeeSharePct: number;
}

const DEFAULT_EVENT_DEFS: EventDef[] = [
  { title: 'Bespoke Curated Property Retreat', date: 'Oct 19 – Oct 22, 2026', category: 'Wellness Retreat', revenueSharePct: 1.1, attendeeSharePct: 0.9 },
  { title: 'Exclusive Estate Buyout', date: 'Oct 25 – Oct 28, 2026', category: 'Private Event', revenueSharePct: 1.8, attendeeSharePct: 1.4 },
  { title: 'Signature Culinary Masterclass', date: 'Nov 04, 2026', category: 'Culinary', revenueSharePct: 0.3, attendeeSharePct: 1.1 },
];

const PROPERTY_EVENT_DEFS: Record<string, EventDef[]> = {
  'sosei-barcelona': [
    { title: 'Catalan Architecture & Design Forum', date: 'Oct 18 – Oct 21, 2026', category: 'Executive Forum', revenueSharePct: 1.4, attendeeSharePct: 1.2 },
    { title: 'Gothic Quarter Private Rooftop Buyout', date: 'Oct 23 – Oct 26, 2026', category: 'Private Buyout', revenueSharePct: 2.4, attendeeSharePct: 1.7 },
    { title: 'Mediterranean Sommelier Grand Tasting', date: 'Nov 03, 2026', category: 'Culinary Gala', revenueSharePct: 0.4, attendeeSharePct: 1.9 },
  ],
  'sosei-andermatt': [
    { title: 'Alpine Peak Wellness Retreat', date: 'Oct 19 – Oct 22, 2026', category: 'Wellness Retreat', revenueSharePct: 1.1, attendeeSharePct: 0.9 },
    { title: 'Andermatt Private Chalet Buyout', date: 'Oct 24 – Oct 27, 2026', category: 'Corporate Buyout', revenueSharePct: 2.1, attendeeSharePct: 1.4 },
    { title: 'Gotthard Sommeliers Evening', date: 'Nov 02, 2026', category: 'Culinary Gala', revenueSharePct: 0.3, attendeeSharePct: 1.7 },
  ],
};

export interface PropertyEventRow {
  title: string;
  date: string;
  category: string;
  attendees: number;
  /** Contracted revenue (USD, from the engine forward OTB). */
  revenueUsd: number;
}

export function getPropertyEvents(propertyId: string): PropertyEventRow[] {
  const fwd = getPropertyMetrics(propertyId, 'forward');
  const defs = PROPERTY_EVENT_DEFS[propertyId] ?? DEFAULT_EVENT_DEFS;
  return defs.map((d) => ({
    title: d.title,
    date: d.date,
    category: d.category,
    attendees: Math.max(1, Math.round((fwd.stays * d.attendeeSharePct) / 100)),
    revenueUsd: Math.round((fwd.totalRevenue * d.revenueSharePct) / 100),
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
