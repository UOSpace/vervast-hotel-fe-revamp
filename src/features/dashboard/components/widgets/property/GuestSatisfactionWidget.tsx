import { RoundAltArrowRight } from '@solar-icons/react';
import { InfoTooltip } from '../../../../common/components/InfoTooltip';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';
import { resolvePropertyId } from '../../../../../constants/categories';
import { getPropertyMetrics, fmtInt, type PeriodId } from '@/data/portfolio';
import {
  getPropertyGuestSatisfaction,
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
  getPropertyMetrics(propertyId, period);
  const sat = getPropertyGuestSatisfaction(propertyId, period);
  const data = sat.distribution;

  const widgetPillars = [
    sat.pillars[0], // Cleanliness
    sat.pillars[1], // Service & Butler
    sat.pillars[2], // Rooms & Comfort
    sat.pillars[3], // Sleep Quality
    sat.pillars[5], // Value & Dining
  ];

  const satisfactionTable = widgetPillars.map((p) => ({
    pillar: p.shortName,
    score: p.scoreLabel,
    reviews: fmtInt(p.mentions),
    isTotal: false,
  }));

  satisfactionTable.push({
    pillar: 'Overall',
    score: `${sat.score.toFixed(1)} / 5.0`,
    reviews: fmtInt(sat.totalReviews),
    isTotal: true,
  });

  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div 
      className="relative rounded-[12px] p-4 flex flex-col justify-between gap-3 bg-zinc-50/50 transition-[background-color,box-shadow,transform] duration-300 hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 cursor-pointer animate-card-enter h-full" 
      style={{ animationDelay: '0.4s' }}
      onClick={() => openDrawer({ 
        type: 'SENTIMENT_SCORE', 
        title: `Guest Satisfaction & Sentiment — ${propertyName}`,
        data: { propertyName, propertyId, period, score: `${sat.score.toFixed(1)} / 5.0` }
      })}
    >
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 mb-1">
        <div className="flex items-center gap-1.5">
          <InfoTooltip text="Average score based on guest survey feedback across service, cleanliness, comfort, and dining.">
            <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-900 cursor-help">Guest Satisfaction</span>
          </InfoTooltip>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openDrawer({
              type: 'SENTIMENT_SCORE',
              title: `Guest Satisfaction & Sentiment — ${propertyName}`,
              data: { propertyName, propertyId, period, score: `${sat.score.toFixed(1)} / 5.0` },
            });
          }}
          className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>See details</span> <RoundAltArrowRight size={10} />
        </button>
      </div>

      {/* Donut Chart + Legend matching Market Segment & Channel Distribution */}
      <div className="flex items-center gap-6 px-2 py-1 h-[120px]">
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
            <span className="text-[11px] font-bold text-zinc-900 leading-none">{sat.score.toFixed(1)}</span>
            <span className="text-[7.5px] font-medium text-zinc-500 tracking-wide mt-0.5">out of 5.0</span>
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-[9.5px] text-zinc-700 font-medium">{item.name}</span>
              </div>
              <span className="text-[9.5px] text-zinc-500 font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table matching Market Segment & Channel Distribution */}
      <div className="mt-auto pt-2">
        <table className="w-full" style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr className="text-[9.5px] font-medium text-zinc-400 border-b border-zinc-200/80">
              <th className="text-left pb-2.5 pt-1 pr-1 w-[46%] truncate font-medium">Pillar</th>
              <th className="text-right pb-2.5 pt-1 px-1 w-[28%] truncate font-medium">Score</th>
              <th className="text-right pb-2.5 pt-1 pl-1 w-[26%] truncate font-medium">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {satisfactionTable.map((row, idx) => {
              const isTotal = idx === satisfactionTable.length - 1;
              return (
                <tr key={row.pillar} className={`text-[10px] border-b border-zinc-100 ${isTotal ? 'font-bold text-zinc-900 border-b-0 pt-2' : 'text-zinc-700'}`}>
                  <td className="py-2 pr-1 truncate">{row.pillar}</td>
                  <td className="text-right py-2 px-1 truncate text-zinc-900 font-medium">{row.score}</td>
                  <td className="text-right py-2 pl-1 truncate text-zinc-900 font-medium">{row.reviews}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



