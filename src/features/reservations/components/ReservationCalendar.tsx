import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AltArrowLeft, AltArrowRight } from '@solar-icons/react';
import {
  addDays,
  diffDays,
  startOfDay,
  type ReservationEvent,
} from '../utils/reservationEvents';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LANE_H = 22;
const LANE_GAP = 3;
const DATE_HEADER = 26;

const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

type Filter = 'all' | 'lead' | 'booking';

interface PlacedBar {
  event: ReservationEvent;
  col: number;
  span: number;
  lane: number;
  clippedStart: boolean;
  clippedEnd: boolean;
}

function barClasses(e: ReservationEvent): string {
  if (e.columnId === 'lost') {
    return 'bg-[#fff1f2] text-[#800020] border border-[#fecdd3]/80 line-through decoration-[#800020]/40';
  }
  if (e.kind === 'booking') {
    return e.columnId === 'in-house'
      ? 'bg-zinc-900 text-white border border-zinc-900'
      : e.columnId === 'departed'
        ? 'bg-zinc-500 text-white border border-zinc-500'
        : 'bg-zinc-800 text-white border border-zinc-800';
  }
  return e.columnId === 'definite'
    ? 'bg-[#ecfdf5] text-[#14532d] border border-[#bbf7d0]/80'
    : 'bg-zinc-100 text-zinc-700 border border-dashed border-zinc-300';
}

function buildWeeks(month: Date): Date[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(first, -first.getDay());
  const lastOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const totalDays = diffDays(gridStart, lastOfMonth) + 1;
  const weekCount = Math.ceil(totalDays / 7);
  return Array.from({ length: weekCount }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)),
  );
}

function placeBars(week: Date[], events: ReservationEvent[]): { bars: PlacedBar[]; lanes: number } {
  const weekStart = week[0];
  const weekEnd = week[6];
  const inWeek = events
    .filter((e) => e.start <= weekEnd && addDays(e.end, -1) >= weekStart)
    .sort((a, b) => a.start.getTime() - b.start.getTime() || b.nights - a.nights);

  const laneEnds: number[] = [];
  const bars: PlacedBar[] = [];
  inWeek.forEach((event) => {
    // Stay occupies [start, end) — last occupied night is end - 1 (min 1 day).
    const lastDay = event.end > event.start ? addDays(event.end, -1) : event.start;
    const s = event.start < weekStart ? weekStart : event.start;
    const e = lastDay > weekEnd ? weekEnd : lastDay;
    const col = diffDays(weekStart, s);
    const span = diffDays(s, e) + 1;
    let lane = laneEnds.findIndex((end) => end < col);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(col + span - 1);
    } else {
      laneEnds[lane] = col + span - 1;
    }
    bars.push({
      event,
      col,
      span,
      lane,
      clippedStart: event.start < weekStart,
      clippedEnd: lastDay > weekEnd,
    });
  });
  return { bars, lanes: laneEnds.length };
}

interface ReservationCalendarProps {
  events: ReservationEvent[];
  title: string;
  subtitle?: string;
  /** Show the Leads / Bookings toggle (hide for booking-only calendars). */
  showKindFilter?: boolean;
}

export function ReservationCalendar({
  events,
  title,
  subtitle,
  showKindFilter = true,
}: ReservationCalendarProps) {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.kind === filter)),
    [events, filter],
  );
  const weeks = useMemo(() => buildWeeks(month), [month]);

  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const inMonthCount = visible.filter((e) => e.start <= monthEnd && e.end >= monthStart).length;

  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <div className="p-1 flex flex-col animate-card-enter" id="reservation-calendar">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{title}</h3>
          {subtitle && <p className="text-[9.5px] text-zinc-500 font-medium mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showKindFilter && (
            <div className="flex items-center bg-zinc-100 rounded-lg p-0.5">
              {(['all', 'lead', 'booking'] as Filter[]).map((f) => (
                <button
                  key={f}
                  id={`calendar-filter-${f}`}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                    filter === f ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'lead' ? 'Leads' : 'Bookings'}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              id="calendar-prev"
              type="button"
              onClick={() => shift(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <AltArrowLeft size={13} />
            </button>
            <span className="min-w-[116px] text-center text-[12px] font-medium text-zinc-900">
              {MONTH_FMT.format(month)}
            </span>
            <button
              id="calendar-next"
              type="button"
              onClick={() => shift(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <AltArrowRight size={13} />
            </button>
            <button
              id="calendar-today"
              type="button"
              onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="ml-1 h-7 px-2.5 rounded-lg border border-zinc-200 text-[10px] font-medium text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[9px] text-zinc-500 font-medium">
        <span className="flex items-center gap-1.5"><i className="w-3 h-2 rounded-sm bg-zinc-800" />Booking</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-2 rounded-sm bg-zinc-900 ring-1 ring-zinc-300" />In house</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-2 rounded-sm bg-zinc-100 border border-dashed border-zinc-300" />Open lead</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-2 rounded-sm bg-[#ecfdf5] border border-[#bbf7d0]" />Definite lead</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-2 rounded-sm bg-[#fff1f2] border border-[#fecdd3]" />Lost / cancelled</span>
        <span className="ml-auto text-zinc-400">{inMonthCount} reservations this month</span>
      </div>

      {/* Grid */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-7 border-b border-zinc-200/80">
          {WEEKDAYS.map((d) => (
            <div key={d} className="px-2.5 py-2 text-[9.5px] font-medium text-zinc-400">{d}</div>
          ))}
        </div>

        {weeks.map((week, wi) => {
          const { bars, lanes } = placeBars(week, visible);
          const minH = Math.max(112, DATE_HEADER + lanes * (LANE_H + LANE_GAP) + 8);
          return (
            <div
              key={wi}
              className="relative border-b border-zinc-100 last:border-b-0"
              style={{ minHeight: minH }}
            >
              {/* Day cells */}
              <div className="absolute inset-0 grid grid-cols-7">
                {week.map((day, di) => {
                  const inMonth = day.getMonth() === month.getMonth();
                  const isToday = day.getTime() === today.getTime();
                  return (
                    <div
                      key={di}
                      className="border-r border-zinc-100 last:border-r-0 px-2 pt-1.5"
                    >
                      <span
                        className={`inline-flex items-center justify-center text-[10px] font-medium h-[18px] min-w-[18px] px-1 rounded-full ${
                          isToday
                            ? 'bg-zinc-900 text-white'
                            : inMonth
                              ? 'text-zinc-700'
                              : 'text-zinc-300'
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Event bars */}
              <div
                className="relative grid grid-cols-7 px-1 pointer-events-none"
                style={{
                  paddingTop: DATE_HEADER,
                  gridAutoRows: LANE_H,
                  rowGap: LANE_GAP,
                }}
              >
                {bars.map(({ event, col, span, lane, clippedStart, clippedEnd }) => (
                  <button
                    key={`${event.id}-${wi}`}
                    type="button"
                    onClick={() => navigate(event.href)}
                    title={`${event.title}\n${event.hotel} · ${event.statusLabel}`}
                    className={`pointer-events-auto flex items-center gap-1.5 px-2 text-left text-[9.5px] font-medium truncate cursor-pointer transition-all hover:brightness-110 hover:shadow-md ${barClasses(event)} ${
                      clippedStart ? 'rounded-l-none' : 'rounded-l-md'
                    } ${clippedEnd ? 'rounded-r-none' : 'rounded-r-md'}`}
                    style={{ gridColumn: `${col + 1} / span ${span}`, gridRow: lane + 1 }}
                  >
                    <span className="opacity-70 font-mono text-[8.5px] shrink-0">{event.id}</span>
                    <span className="truncate">{event.title}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
