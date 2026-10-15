import { SANCTUARY_HOTELS } from '../utils/reservationEvents';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface KpiItem {
  label: string;
  value: string;
  hint: string;
  tone?: 'positive' | 'negative' | 'neutral';
}

/** Page header with title + property selector. */
export function ReservationDashboardHeader({
  title,
  subtitle,
  hotel,
  onHotelChange,
}: {
  title: string;
  subtitle: string;
  hotel: string;
  onHotelChange: (v: string) => void;
}) {
  const options = SANCTUARY_HOTELS;
  return (
    <header className="shrink-0 flex flex-wrap justify-between items-end gap-3 mb-6 pb-3 border-b border-zinc-200/80 px-4 lg:px-6 animate-card-enter">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-wide mb-0.5">{title}</h1>
        <p className="text-zinc-500 text-xs font-normal">{subtitle}</p>
      </div>
      <div className="w-56">
        <Select value={hotel} onValueChange={onHotelChange}>
          <SelectTrigger
            id="reservation-property-filter"
            className="w-full h-8.5 text-xs bg-white border border-zinc-200 rounded-lg px-3 text-zinc-800 cursor-pointer shadow-xs focus:ring-1 focus:ring-zinc-400"
          >
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Properties</SelectItem>
              {options.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}

const TONE: Record<NonNullable<KpiItem['tone']>, string> = {
  positive: 'text-[#14532d]',
  negative: 'text-[#800020]',
  neutral: 'text-zinc-500',
};

export function ReservationKpiStrip({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 px-4 lg:px-6 py-1">
      {items.map((k, i) => (
        <div
          key={k.label}
          className="py-1 flex flex-col justify-between animate-card-enter"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <p className="text-[10px] font-normal tracking-wider uppercase text-zinc-900">{k.label}</p>
          <p className="text-[22px] font-normal text-zinc-900 leading-tight mt-1.5">{k.value}</p>
          <p className={`text-[9.5px] font-medium mt-1 ${TONE[k.tone ?? 'neutral']}`}>{k.hint}</p>
        </div>
      ))}
    </div>
  );
}
