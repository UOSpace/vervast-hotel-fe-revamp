import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import { type PeriodId } from '@/data/portfolio';
import { getPropertyRhythm } from '@/data/portfolio/hospitalitySubMix';

const TIMEFRAMES = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'] as const;

function getBlockColorClass(loadPct: number): string {
  if (loadPct >= 88) return 'bg-zinc-900';
  if (loadPct >= 72) return 'bg-zinc-600';
  if (loadPct >= 50) return 'bg-zinc-400';
  if (loadPct >= 35) return 'bg-zinc-200';
  return 'bg-zinc-100';
}

export function PropertyRhythmWidget({
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

  const rhythmData = getPropertyRhythm(propertyId, period);

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.2s' }}
      onClick={() => openDrawer({ 
        type: 'PROPERTY_RHYTHM', 
        title: `Property Rhythm & Hourly Department Load — ${propertyName}`,
        data: {
          propertyId,
          propertyName,
          period,
          rhythmData,
        }
      })}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2.5 h-4 shrink-0">
        <InfoTooltip text="Distribusi beban kapasitas operasional departemen & aktivitas spesifik properti berdasarkan rentang waktu (Timeframe Utilization Load).">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
            Property Rhythm &amp; Peak Loads
          </h3>
        </InfoTooltip>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openDrawer({
              type: 'PROPERTY_RHYTHM',
              title: `Property Rhythm & Hourly Department Load — ${propertyName}`,
              data: { propertyId, propertyName, period, rhythmData },
            });
          }}
          className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>See details</span> <RoundAltArrowRight size={10} />
        </button>
      </div>

      {/* Timeframe Block Heatmap */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        {/* Column Headers */}
        <div className="grid grid-cols-[136px_repeat(6,1fr)] gap-1.5 text-[8.5px] text-zinc-400 font-medium items-center pb-1.5 border-b border-zinc-100">
          <span className="text-left">Department / Activity</span>
          {TIMEFRAMES.map((t) => (
            <span key={t} className="text-center">
              {t}
            </span>
          ))}
        </div>

        {/* Department Rows with Rectangular Timeframe Blocks */}
        <div className="flex flex-col justify-between flex-1 py-1.5 gap-1.5">
          {rhythmData.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[136px_repeat(6,1fr)] gap-1.5 items-center"
            >
              <span className="text-[9.5px] font-medium text-zinc-700 truncate pr-1 transition-all duration-300" title={item.department}>
                {item.department}
              </span>
              {item.timeframeLoads.map((slotLoad, tIdx) => (
                <div
                  key={TIMEFRAMES[tIdx]}
                  className={`group/blk relative h-5 rounded-[3px] flex items-center justify-center text-[8.5px] font-medium tabular-nums ${getBlockColorClass(slotLoad)} ${slotLoad >= 50 ? 'text-white' : 'text-zinc-700'} transition-colors duration-500 hover:opacity-90`}
                >
                  {slotLoad}%
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-30 opacity-0 translate-y-0.5 group-hover/blk:opacity-100 group-hover/blk:translate-y-0 transition-all duration-150 whitespace-nowrap rounded-lg bg-white border border-zinc-200 shadow-lg shadow-black/10 px-2.5 py-1.5 text-left">
                    <div className="text-[9.5px] font-semibold text-zinc-900 leading-tight">{item.department}</div>
                    <div className="text-[9px] text-zinc-500 leading-tight mt-0.5">
                      {TIMEFRAMES[tIdx]} · <span className="font-semibold text-zinc-900">{slotLoad}% load</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer Legend matching Utilization by Time */}
        <div className="flex justify-between items-center text-[8.5px] text-zinc-400 pt-2 border-t border-zinc-100">
          <span>Low Utilization</span>
          <div className="flex gap-1 items-center">
            <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-100 border border-zinc-200/60" />
            <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-300" />
            <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-600" />
            <span className="w-2.5 h-1.5 rounded-[2px] bg-zinc-900" />
          </div>
          <span>High Utilization</span>
        </div>
      </div>
    </div>
  );
}



