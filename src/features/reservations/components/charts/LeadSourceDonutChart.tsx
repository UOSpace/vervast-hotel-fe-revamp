import { useState, useMemo } from 'react';
import { formatCompactCurrency } from '@/utils/formatCurrency';
import { type LeadRecord } from '../../data/leads';
import { parseMoney } from '../../utils/reservationEvents';

interface SourceSlice {
  name: string;
  count: number;
  value: number;
  pct: number;
  color: string;
  offset: number;
  dash: number;
}

const SOURCE_COLORS = [
  '#09090b', // Zinc 950 (Corporate)
  '#27272a', // Zinc 800 (Direct)
  '#52525b', // Zinc 600 (Travel Agent)
  '#a1a1aa', // Zinc 400 (OTA)
];

export function LeadSourceDonutChart({ leads }: { leads: LeadRecord[] }) {
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  const sources = useMemo(() => ['Corporate', 'Direct', 'Travel Agent', 'OTA'] as const, []);

  const { slices, totalValue, totalCount } = useMemo(() => {
    const raw = sources.map((s, idx) => {
      const list = leads.filter((l) => l.source === s);
      const value = list.reduce((sum, l) => sum + parseMoney(l.totalValue), 0);
      return {
        name: s,
        count: list.length,
        value,
        color: SOURCE_COLORS[idx % SOURCE_COLORS.length],
      };
    });

    const totalV = raw.reduce((sum, item) => sum + item.value, 0);
    const totalC = raw.reduce((sum, item) => sum + item.count, 0);

    // SVG Donut geometry (radius 42 -> circumference 263.89)
    const C = 2 * Math.PI * 42;
    let accumulated = 0;

    const sliceList: SourceSlice[] = raw.map((item) => {
      const pct = totalV > 0 ? (item.value / totalV) * 100 : 25;
      const dash = (pct / 100) * C;
      const offset = -accumulated;
      accumulated += dash;
      return {
        ...item,
        pct: Math.round(pct),
        offset,
        dash,
      };
    });

    return { slices: sliceList, totalValue: totalV, totalCount: totalC };
  }, [leads, sources]);

  const activeSlice = hoveredSource
    ? slices.find((s) => s.name === hoveredSource) ?? null
    : null;

  return (
    <div className="relative py-2 flex flex-col justify-between h-full animate-card-enter">
      {/* Clean minimal executive header */}
      <div className="flex flex-col gap-2 mb-3 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Lead Source Mix</h3>
          <span className="text-[9px] font-medium text-zinc-400">{totalCount} leads</span>
        </div>

        <div className="flex items-baseline justify-between mt-0.5">
          <span className="text-[20px] font-normal text-zinc-900 leading-none tracking-tight">
            {formatCompactCurrency(totalValue)}
          </span>
          <span className="text-[8.5px] font-medium text-zinc-500">Channel Share</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 xl:gap-4">
        {/* Pure SVG Vector Donut Chart (Rule 5 AGENTS.md) */}
        <div className="relative w-[100px] h-[100px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="#f4f4f5"
              strokeWidth="14"
            />
            {/* Segments */}
            {slices.map((slice) => {
              const isHovered = hoveredSource === slice.name;
              return (
                <circle
                  key={slice.name}
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? 17 : 14}
                  strokeDasharray={`${slice.dash} 263.89`}
                  strokeDashoffset={slice.offset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSource(slice.name)}
                  onMouseLeave={() => setHoveredSource(null)}
                />
              );
            })}
          </svg>

          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
            <span className="text-[12px] font-semibold text-zinc-900 leading-none">
              {activeSlice ? `${activeSlice.pct}%` : formatCompactCurrency(totalValue)}
            </span>
            <span className="text-[8px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5 truncate max-w-[70px]">
              {activeSlice ? activeSlice.name : 'Total Mix'}
            </span>
          </div>
        </div>

        {/* Breakdown table on right side */}
        <div className="flex-1 w-full flex flex-col justify-center gap-2">
          {slices.map((slice) => {
            const isHovered = hoveredSource === slice.name;
            return (
              <div
                key={slice.name}
                onMouseEnter={() => setHoveredSource(slice.name)}
                onMouseLeave={() => setHoveredSource(null)}
                className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? 'bg-zinc-100/80' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-[10px] font-medium text-zinc-800">{slice.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9.5px] text-zinc-400 font-normal">{slice.count} leads</span>
                  <span className="text-[10px] font-medium text-zinc-900 w-14 text-right">
                    {formatCompactCurrency(slice.value)}
                  </span>
                  <span className="text-[9.5px] font-medium text-zinc-500 w-8 text-right">
                    {slice.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
