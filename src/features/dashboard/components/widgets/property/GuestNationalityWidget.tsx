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
  GUEST_NATIONALITY_MIX,
  GUEST_NATIONALITY_TOP_COUNT,
  buildRoomMix,
} from '@/data/portfolio/hospitalitySubMix';

const GRID = 'grid-cols-[31%_15%_18%_17%_19%]';

export function GuestNationalityWidget({
  propertyId: rawPropertyId = 'sosei-geneva',
  propertyName = 'SOSEI Geneva',
  period = 'mtd',
}: {
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const m = getPropertyMetrics(propertyId, period);
  const allRows = buildRoomMix(GUEST_NATIONALITY_MIX, m.roomsSold, m.roomRevenue);

  const drawerRows = allRows.map((row) => {
    const occPct = Math.min(98, Math.max(40, m.occupancyPct + row.trendPct * 0.9 - 1));
    return {
      code: row.id,
      country: row.name,
      occ: `${occPct.toFixed(1)}%`,
      adr: fmtUsdFull(row.adr),
      revPar: fmtUsdFull(row.adr * (occPct / 100)),
      revenue: fmtUsd(row.revenue),
    };
  });

  const data = drawerRows.slice(0, GUEST_NATIONALITY_TOP_COUNT);

  const total = {
    occ: `${m.occupancyPct.toFixed(1)}%`,
    adr: fmtUsdFull(m.adr),
    revPar: fmtUsdFull(m.revpar),
    revenue: fmtUsd(m.roomRevenue),
  };

  const drawerPayload = { rows: drawerRows, total, propertyId, period };

  const openDetails = () =>
    openDrawer({
      type: 'TOP_NATIONALITIES',
      title: `Guest Nationality — ${propertyName}`,
      data: drawerPayload,
    });

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.4s' }}
      onClick={openDetails}
    >
      <div className="flex justify-between items-center mb-3 h-4 shrink-0">
        <InfoTooltip text="The distribution of guest origin countries based on check-ins MTD.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Guest Nationality</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDetails();
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between pt-0.5 pb-0.5">
        {/* Header */}
        <div className={`grid ${GRID} pb-1.5 border-b border-zinc-100 text-[9.5px] font-medium text-zinc-400 shrink-0`}>
          <div>Country</div>
          <div className="text-right">Occupancy</div>
          <div className="text-right">ADR</div>
          <div className="text-right">RevPAR</div>
          <div className="text-right">Revenue</div>
        </div>

        {/* Rows */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-2">
          {data.map((row) => (
            <div key={row.country} className={`grid ${GRID} items-center text-[10px]`}>
              <div className="truncate text-zinc-700 font-medium pr-1">{row.country}</div>
              <div className="text-right font-medium text-zinc-900">{row.occ}</div>
              <div className="text-right font-medium text-zinc-900">{row.adr}</div>
              <div className="text-right font-medium text-zinc-900">{row.revPar}</div>
              <div className="text-right font-medium text-zinc-900">{row.revenue}</div>
            </div>
          ))}
        </div>

        {/* Footer / Total */}
        <div className={`grid ${GRID} items-center pt-1.5 border-t border-zinc-100 text-[10px] shrink-0`}>
          <div className="font-bold text-zinc-900">Total</div>
          <div className="text-right font-bold text-zinc-900">{total.occ}</div>
          <div className="text-right font-bold text-zinc-900">{total.adr}</div>
          <div className="text-right font-bold text-zinc-900">{total.revPar}</div>
          <div className="text-right font-bold text-zinc-900">{total.revenue}</div>
        </div>
      </div>
    </div>
  );
}
