import { useMemo, useState } from 'react';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import { ReservationCalendar } from '../components/ReservationCalendar';
import { ReservationKanban, type KanbanColumnDef } from '../components/ReservationKanban';
import {
  ReservationDashboardHeader,
  ReservationKpiStrip,
  type KpiItem,
} from '../components/ReservationDashboardShared';
import {
  addDays,
  diffDays,
  filterByHotel,
  getBookingEvents,
  getAllReservationEvents,
  startOfDay,
} from '../utils/reservationEvents';

const COLUMNS: KanbanColumnDef[] = [
  { id: 'confirmed', label: 'Arriving', group: 'Confirmed bookings', tone: 'dark' },
  { id: 'in-house', label: 'In House', group: 'Currently staying', tone: 'positive' },
  { id: 'departed', label: 'Departed', group: 'Checked out', tone: 'neutral' },
  { id: 'lost', label: 'Cancelled', group: 'Cancelled', tone: 'negative' },
];

export function FrontOfficeDashboardPage() {
  const [hotel, setHotel] = useState('all');
  const bookings = useMemo(() => filterByHotel(getBookingEvents(), hotel), [hotel]);
  const allEvents = useMemo(() => filterByHotel(getAllReservationEvents(), hotel), [hotel]);

  const kpis = useMemo<KpiItem[]>(() => {
    const today = startOfDay(new Date());
    const active = bookings.filter((b) => b.columnId !== 'lost');
    const arrivalsToday = active.filter((b) => diffDays(today, b.start) === 0).length;
    const departuresToday = active.filter((b) => diffDays(today, b.end) === 0).length;
    const arriving7 = active.filter(
      (b) => b.columnId === 'confirmed' && b.start >= today && b.start <= addDays(today, 7),
    ).length;
    const inHouse = bookings.filter((b) => b.columnId === 'in-house');
    const nights = inHouse.reduce((s, b) => s + b.nights, 0);
    const revenue = active
      .filter((b) => b.columnId === 'confirmed' || b.columnId === 'in-house')
      .reduce((s, b) => s + b.value, 0);
    return [
      { label: 'Arrivals Today', value: String(arrivalsToday), hint: `${arriving7} arriving in next 7 days` },
      { label: 'Departures Today', value: String(departuresToday), hint: 'Scheduled check-outs' },
      { label: 'In House', value: String(inHouse.length), hint: `${nights} room nights`, tone: 'positive' },
      { label: 'Upcoming Arrivals', value: String(bookings.filter((b) => b.columnId === 'confirmed').length), hint: 'Confirmed, awaiting check-in' },
      { label: 'Revenue On Books', value: formatCompactCurrency(revenue), hint: 'Arriving + in house', tone: 'positive' },
    ];
  }, [bookings]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col pt-4 lg:pt-6 pb-8">
      <ReservationDashboardHeader
        title="Front Office Dashboard"
        subtitle="Arrivals, in-house guests and departures at a glance"
        hotel={hotel}
        onHotelChange={setHotel}
      />

      <div className="flex flex-col gap-8 lg:gap-10">
        <ReservationKpiStrip items={kpis} />

        <div className="px-2 lg:px-3">
          <ReservationCalendar
            events={allEvents}
            title="Arrivals & Departures Calendar"
            subtitle={`Guest stays and pipeline leads by check-in date · ${hotel === 'all' ? 'All properties' : hotel}`}
            showKindFilter={true}
          />
        </div>

        <div className="px-2 lg:px-3">
          <ReservationKanban
            title="Guest Flow Board"
            subtitle="Booking status from arrival to departure"
            columns={COLUMNS}
            events={bookings}
          />
        </div>
      </div>
    </div>
  );
}
