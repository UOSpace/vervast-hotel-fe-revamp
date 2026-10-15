import { useState, useMemo } from 'react';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import { type LeadRecord } from '../../data/leads';
import { type BookingRecord } from '../../data/bookings';
import { parseMoney } from '../../utils/reservationEvents';

interface PinItem {
  id: string;
  label: string;
  subLabel: string;
  actual: number;
  potential: number;
  count: number;
}

export function RevenueBreakdownPinChart({
  leads,
  bookings,
}: {
  leads: LeadRecord[];
  bookings: BookingRecord[];
}) {
  const [hoveredId, setHoveredId] = useState<string | null>('rooms');

  // Breakdown items derived from leads and bookings
  const pinData = useMemo<PinItem[]>(() => {
    // Stage breakdown & booking categories
    const prospectLeads = leads.filter((l) => l.stage === 'prospect');
    const verbalLeads = leads.filter((l) => l.stage === 'verbal-definite');
    const tentativeLeads = leads.filter((l) => l.stage === 'tentative');
    const definiteLeads = leads.filter((l) => l.stage === 'definite');
    const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed');
    const inHouseBookings = bookings.filter((b) => b.bookingStatus === 'In House');
    const departedBookings = bookings.filter((b) => b.bookingStatus === 'Departed');

    const sumVal = (arr: { totalValue: string }[]) =>
      arr.reduce((s, x) => s + parseMoney(x.totalValue), 0);
    const sumRev = (arr: { revenue: string }[]) =>
      arr.reduce((s, x) => s + parseMoney(x.revenue), 0);

    return [
      {
        id: 'prospect',
        label: 'Prospect',
        subLabel: 'Initial inquiry',
        actual: sumVal(prospectLeads),
        potential: sumVal(prospectLeads) * 1.25,
        count: prospectLeads.length,
      },
      {
        id: 'verbal',
        label: 'Verbal',
        subLabel: 'Agreed in principle',
        actual: sumVal(verbalLeads),
        potential: sumVal(verbalLeads) * 1.15,
        count: verbalLeads.length,
      },
      {
        id: 'tentative',
        label: 'Tentative',
        subLabel: 'Contract under review',
        actual: sumVal(tentativeLeads),
        potential: sumVal(tentativeLeads) * 1.1,
        count: tentativeLeads.length,
      },
      {
        id: 'definite',
        label: 'Definite',
        subLabel: 'Signed lead',
        actual: sumVal(definiteLeads),
        potential: sumVal(definiteLeads),
        count: definiteLeads.length,
      },
      {
        id: 'confirmed',
        label: 'Confirmed',
        subLabel: 'OTB Booking',
        actual: sumRev(confirmedBookings),
        potential: sumRev(confirmedBookings),
        count: confirmedBookings.length,
      },
      {
        id: 'in-house',
        label: 'In House',
        subLabel: 'Active stay',
        actual: sumRev(inHouseBookings),
        potential: sumRev(inHouseBookings),
        count: inHouseBookings.length,
      },
      {
        id: 'departed',
        label: 'Departed',
        subLabel: 'Completed stay',
        actual: sumRev(departedBookings),
        potential: sumRev(departedBookings),
        count: departedBookings.length,
      },
    ];
  }, [leads, bookings]);

  const totalBreakdown = useMemo(() => {
    return pinData.reduce((s, p) => s + p.actual, 0);
  }, [pinData]);

  const maxVal = useMemo(() => {
    return Math.max(1, ...pinData.map((p) => Math.max(p.actual, p.potential)));
  }, [pinData]);

  const yTicks = useMemo(() => {
    const steps = 4;
    const peak = maxVal > 0 ? maxVal : 50000;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = Math.round(((steps - i) / steps) * peak);
      return {
        value: val,
        label: formatCompactCurrency(val),
        topPct: (i / steps) * 100,
      };
    });
  }, [maxVal]);

  return (
    <div className="relative py-2 flex flex-col justify-between h-full animate-card-enter">
      {/* Clean minimal executive header */}
      <div className="flex flex-col gap-2 mb-3 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Revenue Breakdown</h3>
          <span className="text-[9px] font-medium text-zinc-400">Oct 2026</span>
        </div>

        <div className="flex items-baseline justify-between mt-0.5">
          <span className="text-[20px] font-normal text-zinc-900 leading-none tracking-tight">
            {formatCompactCurrency(totalBreakdown)}
          </span>
          <span className="text-[8.5px] font-medium text-zinc-500">Pipeline vs OTB</span>
        </div>
      </div>

      {/* Vertical Pin / Needle Chart Canvas with Y-Axis Legend and Grid Lines */}
      <div className="relative flex-1 min-h-[195px] flex items-stretch gap-2 pt-4 pb-1">
        {/* Left Y-Axis Scale / Legend */}
        <div className="relative w-8 shrink-0 flex flex-col justify-between pb-6 pr-1 select-none pointer-events-none">
          {yTicks.map((tick) => (
            <div key={tick.topPct} className="flex items-center justify-end">
              <span className="text-[8.5px] font-mono font-medium text-zinc-400 leading-none text-right">
                {tick.label}
              </span>
            </div>
          ))}
        </div>

        {/* Needle Chart Area */}
        <div className="relative flex-1 flex flex-col justify-end">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
            {yTicks.map((tick) => (
              <div
                key={tick.topPct}
                className="w-full border-b border-dashed border-zinc-200/90"
              />
            ))}
          </div>

          {/* Vertical Grid Columns */}
          <div
            className="absolute inset-x-0 top-0 bottom-6 flex justify-between pointer-events-none z-0 px-1"
          >
            {pinData.map((item) => (
              <div key={`grid-v-${item.id}`} className="flex-1 h-full flex justify-center">
                <div className="w-px h-full border-r border-dotted border-zinc-100" />
              </div>
            ))}
          </div>

          {/* Needle pins */}
          <div className="relative flex justify-between items-end gap-1.5 h-[168px] px-1 z-10">
            {pinData.map((item) => {
              const isHovered = hoveredId === item.id;
              const actualHeightPct = Math.max(4, Math.round((item.actual / maxVal) * 100));
              const potentialHeightPct = Math.max(6, Math.round((item.potential / maxVal) * 100));

              return (
                <div
                  key={item.id}
                  className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Popover on hover */}
                  {isHovered && (
                    <div className="absolute -top-16 z-30 bg-white/95 backdrop-blur-md border border-zinc-200 rounded-lg p-2 shadow-xl shadow-black/10 min-w-[124px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[9.5px] font-bold text-zinc-900 mb-0.5">{item.label}</p>
                      <p className="text-[8.5px] text-zinc-400 mb-1">{item.subLabel}</p>
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-zinc-500 font-medium">Value:</span>
                        <span className="font-semibold text-zinc-900">{formatCompactCurrency(item.actual)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] mt-0.5">
                        <span className="text-zinc-500 font-medium">Records:</span>
                        <span className="font-semibold text-zinc-700">{item.count}</span>
                      </div>
                    </div>
                  )}

                  {/* Needle construction: Background tall needle + solid black core bar */}
                  <div className="relative flex flex-col items-center justify-end w-full h-full pb-6">
                    {/* Pale background needle (potential target height) */}
                    <div
                      className="w-[1.5px] bg-zinc-200 transition-all duration-300"
                      style={{ height: `${potentialHeightPct}%` }}
                    >
                      {/* Top tick marker */}
                      <div className="w-2 -ml-[3.5px] h-[1.5px] bg-zinc-400 rounded-full" />
                    </div>

                    {/* Core solid black column (actual value) */}
                    <div
                      className={`absolute bottom-6 w-[5px] rounded-t-xs transition-all duration-300 ${isHovered ? 'bg-zinc-950 ring-2 ring-zinc-300' : 'bg-zinc-900'
                        }`}
                      style={{ height: `${actualHeightPct}%` }}
                    />
                  </div>

                  {/* X-axis Label */}
                  <span
                    className={`absolute bottom-0 text-[8.5px] truncate max-w-full text-center tracking-tight transition-colors duration-200 ${isHovered
                        ? 'font-bold text-zinc-900'
                        : 'font-medium text-zinc-400 group-hover:text-zinc-700'
                      }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
