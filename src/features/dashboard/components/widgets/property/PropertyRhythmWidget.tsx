import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import { type PeriodId } from '@/data/portfolio';
import { getPropertyRhythm } from '@/data/portfolio/hospitalitySubMix';

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

  const rhythmData = getPropertyRhythm(propertyId);

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
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
      <div className="flex justify-between items-center mb-1 h-4">
        <InfoTooltip text="Persentase beban kapasitas operasional departemen saat jam puncak (Peak Capacity Load Utilization).">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Property Rhythm &amp; Peak Loads</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'PROPERTY_RHYTHM',
                title: `Property Rhythm & Hourly Department Load — ${propertyName}`,
                data: { propertyId, propertyName, period, rhythmData }
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Explanatory Column Header */}
      <div className="flex justify-between items-center text-[9px] font-medium text-zinc-400 border-b border-zinc-100 pb-1 mb-1">
        <span>Department</span>
        <div className="flex items-center gap-4">
          <span className="text-right">Peak Hours</span>
          <span className="text-right font-semibold text-zinc-600">Capacity Load (%)</span>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 py-1 gap-2.5">
        {rhythmData.map((item) => (
          <div key={item.department} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline text-[10px]">
              <span className="font-bold text-zinc-900 leading-tight">{item.department}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 font-normal">Peak: <strong className="text-zinc-700 font-medium">{item.peak}</strong></span>
                <span className="text-[9.5px] font-bold text-zinc-900 w-16 text-right">
                  {item.load}% <span className="text-[8.5px] text-zinc-400 font-normal">load</span>
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  item.load >= 90 ? 'bg-zinc-900' : item.load >= 80 ? 'bg-zinc-700' : 'bg-zinc-500'
                }`} 
                style={{ width: `${item.load}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-100 text-[9px] text-zinc-500 font-medium mt-1">
        <span>Capacity Status: <strong className="text-emerald-700 font-medium">All Operations Normal</strong></span>
        <span className="text-zinc-400">Next Peak: F&B Dining (7:00 PM)</span>
      </div>
    </div>
  );
}



