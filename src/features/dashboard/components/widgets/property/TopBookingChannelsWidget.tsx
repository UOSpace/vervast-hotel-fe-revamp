import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import {
  getPropertyMetrics,
  fmtUsd,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import {
  BOOKING_CHANNEL_MIX,
  buildRoomMix,
  fmtTrendArrow,
  mixTrendPct,
} from '@/data/portfolio/hospitalitySubMix';

export function TopBookingChannelsWidget({
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
  const rows = buildRoomMix(BOOKING_CHANNEL_MIX, m.roomsSold, m.roomRevenue);

  const data = rows.map((row) => ({
    channel: row.name,
    shareNum: Math.round(row.sharePct),
    pct: `${Math.round(row.sharePct)}%`,
    trend: fmtTrendArrow(row.trendPct),
    up: row.trendPct >= 0,
  }));

  const channelTable = rows.map((row) => ({
    channel: row.name,
    rnights: `${Math.round(row.sharePct)}%`,
    adr: fmtUsdFull(row.adr),
    revenue: fmtUsd(row.revenue),
    trend: fmtTrendArrow(row.trendPct),
    up: row.trendPct >= 0,
  }));

  const avgTrend = mixTrendPct(rows);
  channelTable.push({
    channel: 'Total',
    rnights: '100%',
    adr: fmtUsdFull(m.adr),
    revenue: fmtUsd(m.roomRevenue),
    trend: fmtTrendArrow(avgTrend),
    up: avgTrend >= 0,
    isTotal: true,
  } as any);

  const totals = {
    pct: '100%',
    trend: fmtTrendArrow(avgTrend),
    up: avgTrend >= 0,
  };

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.35s' }}
      onClick={() => openDrawer({ 
        type: 'CHANNEL_DISTRIBUTION', 
        title: `Top Booking Channels — ${propertyName}`, 
        data: channelTable 
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <InfoTooltip text="Performance of main distribution sources (Direct vs OTAs) by percentage of total bookings.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Top Booking Channels</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'CHANNEL_DISTRIBUTION',
                title: `Top Booking Channels — ${propertyName}`,
                data: channelTable,
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
        {/* Header */}
        <div className="grid grid-cols-[48%_32%_20%] pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0">
          <div>Channel</div>
          <div className="text-right">% Share</div>
          <div className="text-right">Trend</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
          {data.map((row) => (
            <div key={row.channel} className="grid grid-cols-[48%_32%_20%] items-center text-[10px]">
              <div className="truncate text-zinc-700 font-medium pr-1">{row.channel}</div>
              <div className="text-right font-medium text-zinc-900">{row.pct}</div>
              <div className={`text-right font-medium text-[9.5px] ${row.up ? 'text-emerald-700' : 'text-rose-600'}`}>{row.trend}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className="grid grid-cols-[48%_32%_20%] items-center pt-1.5 border-t border-zinc-100 text-[10px] shrink-0">
          <div className="font-bold text-zinc-900">Total</div>
          <div className="text-right font-bold text-zinc-900">{totals.pct}</div>
          <div className={`text-right font-bold text-[9.5px] ${totals.up ? 'text-emerald-700' : 'text-rose-600'}`}>{totals.trend}</div>
        </div>
      </div>
    </div>
  );
}


