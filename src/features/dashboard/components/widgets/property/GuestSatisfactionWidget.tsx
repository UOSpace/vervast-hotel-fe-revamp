import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import { type PeriodId } from '@/data/portfolio';
import {
  GUEST_SATISFACTION_SCORE,
  GUEST_SATISFACTION_DELTA,
  GUEST_SATISFACTION_DISTRIBUTION,
} from '@/data/portfolio/hospitalitySubMix';

export function GuestSatisfactionWidget({
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
  const data = GUEST_SATISFACTION_DISTRIBUTION;

  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col transition-all duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full justify-between" 
      style={{ animationDelay: '0.35s' }}
      onClick={() => openDrawer({ 
        type: 'SENTIMENT_SCORE', 
        title: `Guest Satisfaction & Sentiment — ${propertyName}`,
        data: { propertyName, propertyId, period, score: `${GUEST_SATISFACTION_SCORE} / 5.0` }
      })}
    >
      <div className="flex justify-between items-center mb-3 h-4">
        <InfoTooltip text="Average score based on guest survey feedback across service, cleanliness, comfort, and dining.">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Guest Satisfaction (MTD)</h3>
        </InfoTooltip>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer({
                type: 'SENTIMENT_SCORE',
                title: `Guest Satisfaction & Sentiment — ${propertyName}`,
                data: { propertyName, propertyId, period, score: `${GUEST_SATISFACTION_SCORE} / 5.0` },
              });
            }}
            className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>See details</span> <RoundAltArrowRight size={10} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between py-1 gap-3">
        {/* Crisp Pure SVG Donut Chart */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {data.map((item, index) => {
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
            <span className="text-xl font-bold text-zinc-900 leading-none">{GUEST_SATISFACTION_SCORE}</span>
            <span className="text-[8.5px] text-zinc-500 font-medium mt-0.5">out of 5.0</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-500 font-medium truncate">{item.name}</span>
              </div>
              <span className="font-bold text-zinc-900 ml-2">{item.value}%</span>
            </div>
          ))}
          <div className="text-[9px] text-emerald-700 font-medium text-right mt-0.5">
            ↑ +{GUEST_SATISFACTION_DELTA} vs last mo
          </div>
        </div>
      </div>
    </div>
  );
}



