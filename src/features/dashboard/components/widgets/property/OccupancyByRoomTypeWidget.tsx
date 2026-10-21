import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import {
  getPropertyMetrics,
  fmtPct,
  fmtUsd,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import { buildRoomTiers } from '@/data/portfolio/hospitalitySubMix';

export function OccupancyByRoomTypeWidget({ 
  propertyId: rawPropertyId = 'sosei-geneva',
  propertyName,
  period = 'mtd',
}: { 
  propertyId?: string;
  propertyName?: string;
  period?: PeriodId;
}) {
  const propertyId = resolvePropertyId(rawPropertyId);
  const { openDrawer } = useDashboardDrawer();

  const m = getPropertyMetrics(propertyId, period);
  const tiers = buildRoomTiers(m);
  const data = tiers.map((t) => {
    const revpar = t.availableRn > 0 ? t.revenue / t.availableRn : 0;
    return {
      type: t.name,
      occ: t.occPct,
      occLabel: fmtPct(t.occPct, 1),
      occupied: Math.round(t.occupiedRn / Math.max(1, m.days)),
      available: t.keys,
      adr: t.adr,
      adrLabel: fmtUsdFull(t.adr),
      revpar,
      revparLabel: fmtUsdFull(revpar),
      rev: t.revenue,
      revLabel: fmtUsd(t.revenue),
    };
  });
  const totals = {
    occ: Math.round(m.occupancyPct),
    occLabel: fmtPct(m.occupancyPct, 1),
    occupied: data.reduce((sum, r) => sum + r.occupied, 0),
    available: m.rooms,
    adrLabel: fmtUsdFull(m.adr),
    revparLabel: fmtUsdFull(m.revpar),
    revLabel: fmtUsd(m.roomRevenue),
  };

  const activePropName = propertyName || m.name;

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.2s' }}
      onClick={() => openDrawer({ 
        type: 'ROOM_TIER_OCCUPANCY', 
        title: `Room Type Performance — ${activePropName}`, 
        data: { propertyId, propertyName: activePropName, period, types: data, totals, data } 
      })}
    >
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200/80 mb-2 shrink-0">
        <InfoTooltip text="Room type revenue, RevPAR, ADR, and occupancy performance breakdown across property inventory.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Room Type Performance</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'ROOM_TIER_OCCUPANCY',
                title: `Room Type Performance — ${activePropName}`,
                data: { propertyId, propertyName: activePropName, period, types: data, totals, data }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex flex-col text-xs text-zinc-900 flex-1 justify-between">
        <table className="w-full h-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
              <th className="text-left pb-2 pt-0.5 pr-1 w-[34%] truncate font-medium">Room Type</th>
              <th className="text-right pb-2 pt-0.5 px-1 w-[16%] truncate font-medium">Occupancy</th>
              <th className="text-right pb-2 pt-0.5 px-1 w-[16%] truncate font-medium">ADR</th>
              <th className="text-right pb-2 pt-0.5 px-1 w-[16%] truncate font-medium">RevPAR</th>
              <th className="text-right pb-2 pt-0.5 pl-1 w-[18%] truncate font-medium text-zinc-700">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="text-[10px] border-b border-zinc-100 text-zinc-700">
                <td className="py-2 pr-1 truncate font-medium text-zinc-800">{row.type}</td>
                <td className="text-right py-2 px-1 truncate text-zinc-700 font-medium">{row.occLabel}</td>
                <td className="text-right py-2 px-1 truncate text-zinc-700 font-medium">{row.adrLabel}</td>
                <td className="text-right py-2 px-1 truncate text-zinc-700 font-medium">{row.revparLabel}</td>
                <td className="text-right py-2 pl-1 truncate text-zinc-900 font-bold">{row.revLabel}</td>
              </tr>
            ))}
            <tr className="text-[10px] font-bold text-zinc-900 border-b-0 pt-2">
              <td className="py-2 pr-1 truncate">Total</td>
              <td className="text-right py-2 px-1 truncate">{totals.occLabel}</td>
              <td className="text-right py-2 px-1 truncate">{totals.adrLabel}</td>
              <td className="text-right py-2 px-1 truncate">{totals.revparLabel}</td>
              <td className="text-right py-2 pl-1 truncate font-bold text-zinc-900">{totals.revLabel}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


