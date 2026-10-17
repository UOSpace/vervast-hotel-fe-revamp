import { LEADS } from '../data/leads';
import { BOOKINGS } from '../data/bookings';

export type ReservationKind = 'lead' | 'booking';

/** Unified shape consumed by the calendar & kanban (derived from leads + bookings). */
export interface ReservationEvent {
  id: string;
  kind: ReservationKind;
  title: string;
  hotel: string;
  start: Date;
  end: Date;
  /** Kanban column id (pipeline stage or booking status). */
  columnId: string;
  statusLabel: string;
  value: number;
  nights: number;
  owner: string;
  href: string;
}

export const parseMoney = (raw: string): number => {
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
};

const parseDate = (raw: string): Date => {
  const d = new Date(raw);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const startOfDay = (d: Date): Date => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

export const diffDays = (a: Date, b: Date): number =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);

export const addDays = (d: Date, n: number): Date => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

const BOOKING_COLUMN: Record<string, string> = {
  Confirmed: 'confirmed',
  'In House': 'in-house',
  Departed: 'departed',
  Cancelled: 'lost',
};

const STAGE_LABEL: Record<string, string> = {
  prospect: 'Prospect',
  'verbal-definite': 'Verbal Definite',
  tentative: 'Tentative',
  definite: 'Definite',
  'turned-down': 'Turned Down',
  cancelled: 'Cancelled',
  postponed: 'Postponed',
};

const LEAD_COLUMN: Record<string, string> = {
  prospect: 'prospect',
  'verbal-definite': 'verbal-definite',
  tentative: 'tentative',
  definite: 'definite',
  'turned-down': 'lost',
  cancelled: 'lost',
  postponed: 'lost',
};

export const getLeadEvents = (): ReservationEvent[] =>
  LEADS.map((l) => {
    const start = parseDate(l.arrivalDate);
    const end = parseDate(l.departureDate);
    return {
      id: l.id,
      kind: 'lead' as const,
      title: l.leadName,
      hotel: l.hotel,
      start,
      end,
      columnId: LEAD_COLUMN[l.stage] ?? 'prospect',
      statusLabel: STAGE_LABEL[l.stage] ?? l.stage,
      value: parseMoney(l.totalValue),
      nights: Math.max(1, diffDays(start, end)),
      owner: l.owner,
      href: `/dashboard/reservations/leads/${l.id}`,
    };
  });

export const getBookingEvents = (): ReservationEvent[] =>
  BOOKINGS.map((b) => {
    const start = parseDate(b.arrivalDate);
    const end = parseDate(b.departureDate);
    return {
      id: b.id,
      kind: 'booking' as const,
      title: b.bookingName,
      hotel: b.hotel,
      start,
      end,
      columnId: BOOKING_COLUMN[b.bookingStatus] ?? 'confirmed',
      statusLabel: b.bookingStatus,
      value: parseMoney(b.revenue),
      nights: b.nights,
      owner: b.bookingOwner,
      href: `/dashboard/reservations/bookings/${b.id}`,
    };
  });

export const getAllReservationEvents = (): ReservationEvent[] => [
  ...getLeadEvents(),
  ...getBookingEvents(),
];

export const SANCTUARY_HOTELS = [
  'SOSEI Andermatt',
  'SOSEI El Gouna',
  'SOSEI AUH',
  'SOSEI Melides',
  'SOSEI Umbria',
  'SOSEI Tinos',
  'SOSEI Barcelona',
  'SOSEI OSA',
  'SOSEI BALI',
] as const;

export const normalizeHotel = (raw?: string): string =>
  (raw || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export const matchHotel = (itemHotel: string, targetHotel: string): boolean => {
  if (!targetHotel || targetHotel === 'all') return true;
  return normalizeHotel(itemHotel) === normalizeHotel(targetHotel);
};

export const filterByHotel = (events: ReservationEvent[], hotel: string): ReservationEvent[] =>
  hotel === 'all' ? events : events.filter((e) => matchHotel(e.hotel, hotel));

