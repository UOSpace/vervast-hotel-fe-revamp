import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import {
  getPropertyMetrics,
  fmtInt,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import {
  getPropertyMarketSegmentDefs,
  buildRoomMix,
} from '@/data/portfolio/hospitalitySubMix';

const SEGMENT_OCC_OFFSETS: Record<string, number> = {
  Leisure: 4.5,
  Business: -1.8,
  Social: -3.2,
  MICE: 2.4,
  Others: -6.0,
};

export function MarketSegmentMixWidget({
  propertyId: rawPropertyId = 'sosei-barcelona',
  propertyName = 'SOSEI Barcelona',
  period = 'mtd',
}: {
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const m = getPropertyMetrics(propertyId, period);
  const segmentDefs = getPropertyMarketSegmentDefs(propertyId, period);
  const rows = buildRoomMix(segmentDefs, m.roomsSold, m.roomRevenue);

  const segmentData = rows.map((row) => ({
    name: row.name,
    value: Math.round(row.sharePct),
    color: row.color || '#0f172a',
  }));

  // Derive structured table rows compatible with MarketSegmentDrawerContent and Regional Level card model
  const segmentTable = rows.map((row) => {
    const occOffset = SEGMENT_OCC_OFFSETS[row.name] ?? 0;
    const occPct = Math.min(98, Math.max(40, m.occupancyPct + occOffset));
    const revparUsd = Math.round(row.adr * (occPct / 100));
    return {
      segment: row.name,
      rnights: `${Math.round(row.sharePct)}%`,
      occupancy: fmtPct(occPct, 1),
      adr: fmtUsdFull(row.adr),
      revpar: fmtUsdFull(revparUsd),
      revenue: fmtUsd(row.revenue),
      isPositive: row.trendPct >= 0,
    };
  });

  segmentTable.push({
    segment: 'Total',
    rnights: '100%',
    occupancy: fmtPct(m.occupancyPct, 1),
    adr: fmtUsdFull(m.adr),
    revpar: fmtUsdFull(m.revpar),
    revenue: fmtUsd(m.roomRevenue),
    isTotal: true,
  } as any);

  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;
  const totalRnights = fmtInt(m.roomsSold);

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col justify-between gap-3 bg-zinc-50/50 transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full" 
      style={{ animationDelay: '0.3s' }}
      onClick={() => openDrawer({ 
        type: 'MARKET_SEGMENT', 
        title: `Market Segment — ${propertyName}`, 
        data: { rows: segmentTable, propertyId, period } 
      })}
    >
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
        <div className="flex items-center gap-1.5">
          <InfoTooltip text="Visual breakdown of guest reservations grouped by key customer categories (Leisure, Business, Social, MICE, Others).">
            <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900 cursor-help">Market Segment</span>
          </InfoTooltip>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openDrawer({
              type: 'MARKET_SEGMENT',
              title: `Market Segment — ${propertyName}`,
              data: { rows: segmentTable, propertyId, period },
            });
          }}
          className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>See details</span> <RoundAltArrowRight size={10} />
        </button>
      </div>

      {/* Donut Chart + Legend matching Regional Level Dashboard */}
      <div className="flex items-center gap-6 px-2 py-1 h-[120px]">
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {segmentData.map((item, index) => {
              const strokeLength = (item.value / 100) * circumference;
              const strokeOffset = -(accumulated / 100) * circumference;
              accumulated += item.value;

              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${Math.max(0, strokeLength - 1.5)} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-[11px] font-bold text-zinc-900 leading-none">{totalRnights}</span>
            <span className="text-[7.5px] font-medium text-zinc-500 tracking-wide mt-0.5">Rnights</span>
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          {segmentData.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-[9.5px] text-zinc-700 font-medium">{s.name}</span>
              </div>
              <span className="text-[9.5px] text-zinc-500 font-medium">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table matching Regional Level Dashboard */}
      <div className="mt-auto pt-2">
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
              <th className="text-left pb-2.5 pt-1 pr-1 w-[22%] truncate font-medium">Segment</th>
              <th className="text-right pb-2.5 pt-1 px-1 w-[19%] truncate font-medium">Occupancy</th>
              <th className="text-right pb-2.5 pt-1 px-1 w-[19%] truncate font-medium">ADR</th>
              <th className="text-right pb-2.5 pt-1 px-1 w-[19%] truncate font-medium">RevPAR</th>
              <th className="text-right pb-2.5 pt-1 pl-1 w-[21%] truncate font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {segmentTable.map((row, idx) => {
              const isTotal = idx === segmentTable.length - 1;
              return (
                <tr key={row.segment} className={`text-[10px] border-b border-zinc-100 ${isTotal ? 'font-bold text-zinc-900 border-b-0 pt-2' : 'text-zinc-700'}`}>
                  <td className="py-2 pr-1 truncate">{row.segment}</td>
                  <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.occupancy}</td>
                  <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.adr}</td>
                  <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.revpar}</td>
                  <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.revenue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


