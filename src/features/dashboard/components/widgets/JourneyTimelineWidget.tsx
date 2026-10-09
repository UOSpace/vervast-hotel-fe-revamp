import React from 'react';
import { InfoTooltip } from '@/features/common/components/InfoTooltip';

export interface MilestoneItem {
  name: string;
  date: string;
  location: string;
  img: string;
}

export interface JourneyTimelineWidgetProps {
  milestones: MilestoneItem[];
  onOpenDetails?: () => void;
}

export const JourneyTimelineWidget: React.FC<JourneyTimelineWidgetProps> = ({
  milestones,
  onOpenDetails,
}) => {
  return (
    <div
      className="w-full relative rounded-[12px] p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
      onClick={onOpenDetails}
    >
      <div className="flex justify-between mb-1">
        <InfoTooltip text="Historical milestone timeline tracking the launch of each SOSEI sanctuary.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
              Journey Timeline
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium">SANCTUARY MILESTONES</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex justify-between items-center mt-1 px-1 overflow-x-auto custom-scrollbar gap-3 md:gap-0 pb-1 md:pb-0 flex-1">
        {milestones.slice(0, 6).map((j, i) => (
          <div key={i} className="group/jitem flex flex-col items-center shrink-0 min-w-[55px] md:min-w-0 cursor-pointer">
            <img
              src={j.img}
              alt={j.name}
              className="w-[38px] h-[38px] md:w-[40px] md:h-[40px] rounded-full border-2 border-zinc-200 object-cover mb-1 shadow-xs filter grayscale contrast-110 group-hover/jitem:grayscale-0 hover:grayscale-0 transition-all duration-500 ease-in-out group-hover/jitem:scale-105"
            />
            <div className="text-[9px] font-semibold text-zinc-900 text-center leading-tight">{j.date}</div>
            <div className="text-[8px] text-zinc-700 text-center leading-tight mt-0.5 truncate max-w-[68px]">{j.name}</div>
            <div className="text-[7.5px] text-zinc-400 text-center italic mt-0.5 leading-tight truncate max-w-[68px]">{j.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
