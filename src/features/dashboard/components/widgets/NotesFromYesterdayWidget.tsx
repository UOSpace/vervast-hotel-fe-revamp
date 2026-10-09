import React from 'react';
import { InfoTooltip } from '@/features/common/components/InfoTooltip';
import cityImg from '@/assets/property_types/city.png';

export interface NotesFromYesterdayWidgetProps {
  note: {
    text: string;
    author: string;
  };
  onOpenDetails?: () => void;
}

export const NotesFromYesterdayWidget: React.FC<NotesFromYesterdayWidgetProps> = ({
  note,
  onOpenDetails,
}) => {
  return (
    <div
      className="group w-full relative rounded-[12px] p-3 grid grid-cols-12 gap-3 items-stretch cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
      onClick={onOpenDetails}
    >
      <div className="col-span-12 sm:col-span-7 flex flex-col justify-between overflow-hidden">
        <div className="mb-2">
          <InfoTooltip text="Diary log entries and comments submitted by resort general managers.">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
                Notes From Yesterday
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">DAILY GM HIGHLIGHTS</p>
            </div>
          </InfoTooltip>
        </div>
        <div className="flex gap-2 items-start my-auto py-1">
          <span className="text-zinc-400 text-xl font-serif leading-none shrink-0 mt-0.5 select-none">
            &ldquo;
          </span>
          <p className="text-[11px] text-zinc-700 italic leading-relaxed text-left">
            {note.text}
          </p>
        </div>
        <p className="text-[9px] text-zinc-500 text-right font-medium">— {note.author}</p>
      </div>

      <div className="col-span-12 sm:col-span-5 relative h-full min-h-[110px] overflow-hidden rounded-lg">
        <img
          src={cityImg}
          alt="GM highlights"
          className="absolute inset-0 w-full h-full object-cover rounded-lg filter grayscale contrast-110 group-hover:grayscale-0 hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  );
};
