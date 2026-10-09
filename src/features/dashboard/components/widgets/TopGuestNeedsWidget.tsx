import React from 'react';
import { UsersGroupTwoRounded, Heart, Snowflake, Plain } from '@solar-icons/react';
import { InfoTooltip } from '@/features/common/components/InfoTooltip';

export interface GuestNeedItem {
  label: string;
  percentage: string;
}

export interface TopGuestNeedsWidgetProps {
  needs: GuestNeedItem[];
  onOpenDetails?: () => void;
}

const getNeedIcon = (label: string, iconSize = 12) => {
  switch (label.toLowerCase()) {
    case 'wellness':
      return <Heart size={iconSize} />;
    case 'family':
      return <UsersGroupTwoRounded size={iconSize} />;
    case 'dining':
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case 'ski':
      return <Snowflake size={iconSize} />;
    case 'transport':
      return <Plain size={iconSize} />;
    default:
      return <span>{label.charAt(0)}</span>;
  }
};

export const TopGuestNeedsWidget: React.FC<TopGuestNeedsWidgetProps> = ({
  needs,
  onOpenDetails,
}) => {
  const zincShades = ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa'];

  return (
    <div
      className="relative rounded-[12px] p-3 flex flex-col justify-between cursor-pointer hover:bg-gray-100/70 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:z-20 transition-all animate-card-enter bg-zinc-50/50 backdrop-blur-sm h-full"
      onClick={onOpenDetails}
    >
      <div className="mb-2">
        <InfoTooltip text="Top requested guest activities, amenities and services logged MTD.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">
              Top Guest Needs
            </h3>
            <p className="text-[10px] text-zinc-500 font-medium">BASED ON IN-HOUSE GUESTS</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 flex flex-col justify-around py-0.5">
        {needs.map((need, idx) => {
          const pctVal = parseInt(need.percentage) || 50;
          return (
            <div key={idx} className="flex flex-col">
              {idx > 0 && <hr className="border-t border-zinc-100 my-1" />}
              <div className="flex items-center py-0.5 hover:bg-zinc-100/80 px-1 rounded transition-all cursor-pointer group/need">
                <div className="w-0 opacity-0 group-hover/need:w-6 group-hover/need:opacity-100 group-hover/need:mr-2.5 rounded-full bg-zinc-200/60 flex items-center justify-center text-zinc-700 shrink-0 h-6 overflow-hidden transition-all duration-300 ease-out">
                  {getNeedIcon(need.label, 12)}
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between items-center text-[10px] mb-0.5">
                    <span className="font-medium text-zinc-700 truncate">{need.label}</span>
                    <span className="font-bold text-zinc-900 shrink-0">{need.percentage}</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pctVal}%`,
                        backgroundColor: zincShades[idx % zincShades.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
