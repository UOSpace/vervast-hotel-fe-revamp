import { useNavigate } from 'react-router-dom';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import type { ReservationEvent } from '../utils/reservationEvents';

export type KanbanTone = 'neutral' | 'positive' | 'negative' | 'dark';

export interface KanbanColumnDef {
  id: string;
  label: string;
  tone?: KanbanTone;
  /** Small group caption shown above the label (e.g. Leads / Bookings). */
  group?: string;
}

const DOT: Record<KanbanTone, string> = {
  neutral: 'bg-zinc-400',
  positive: 'bg-[#14532d]',
  negative: 'bg-[#800020]',
  dark: 'bg-zinc-900',
};

const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const dateRange = (e: ReservationEvent) =>
  `${DATE_FMT.format(e.start)} – ${DATE_FMT.format(e.end)}, ${e.end.getFullYear()}`;

interface ReservationKanbanProps {
  title: string;
  subtitle?: string;
  columns: KanbanColumnDef[];
  events: ReservationEvent[];
}

export function ReservationKanban({ title, subtitle, columns, events }: ReservationKanbanProps) {
  const navigate = useNavigate();

  return (
    <div className="p-1 flex flex-col animate-card-enter" id="reservation-kanban">
      <div className="mb-3 shrink-0">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{title}</h3>
        {subtitle && <p className="text-[9.5px] text-zinc-500 font-medium mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {columns.map((col) => {
          const items = events.filter((e) => e.columnId === col.id);
          const total = items.reduce((sum, e) => sum + e.value, 0);
          return (
            <section
              key={col.id}
              className="flex-1 min-w-[210px] flex flex-col"
            >
              <header className="px-1 pt-2 pb-2 border-b border-zinc-100">
                {col.group && (
                  <p className="text-[8.5px] font-medium text-zinc-400 mb-1">{col.group}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <i className={`w-1.5 h-1.5 rounded-full ${DOT[col.tone ?? 'neutral']}`} />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-900">
                      {col.label}
                    </h4>
                  </div>
                  <span className="text-[9.5px] font-medium text-zinc-500 rounded-full px-1.5 py-px">
                    {items.length}
                  </span>
                </div>
                <p className="text-[9px] text-zinc-400 font-normal mt-1">
                  {formatCompactCurrency(total)} total value
                </p>
              </header>

              <div className="py-2 flex flex-col gap-2 max-h-[420px] overflow-y-auto custom-scrollbar">
                {items.length === 0 && (
                  <p className="text-[9.5px] text-zinc-400 text-center py-6">No reservations</p>
                )}
                {items.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => navigate(e.href)}
                    className="text-left bg-zinc-50/80 rounded-lg p-2.5 transition-all duration-200 hover:bg-zinc-100/90 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[8.5px] text-zinc-400">{e.id}</span>
                      <span
                        className={`text-[8.5px] font-medium px-1.5 py-0.5 rounded border ${
                          e.kind === 'booking'
                            ? 'bg-zinc-900 text-white border-zinc-900'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200/80'
                        }`}
                      >
                        {e.kind === 'booking' ? 'Booking' : 'Lead'}
                      </span>
                    </div>
                    <p className="text-[10.5px] font-medium text-zinc-900 leading-snug line-clamp-2">
                      {e.title}
                    </p>
                    <p className="text-[9px] text-zinc-500 mt-1">{e.hotel}</p>
                    <p className="text-[9px] text-zinc-400">{dateRange(e)}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                      <span className="text-[9px] text-zinc-500 truncate">{e.owner}</span>
                      <span className="text-[10px] font-medium text-zinc-900">
                        {formatCompactCurrency(e.value)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
