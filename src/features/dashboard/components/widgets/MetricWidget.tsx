import { InfoTooltip } from '../../../common/components/InfoTooltip';
import type { ReactNode } from 'react';

interface MetricWidgetProps {
  title: string;
  value: string;
  trendText: string;
  trendUp: boolean;
  subLabel?: string;
  icon?: ReactNode;
  data: number[];
  color: string;
}

function getTooltipText(title: string) {
  const l = title.toUpperCase();
  if (l.includes('GUEST') || l.includes('CUSTOMER')) return "Total daily checked-in guests across all properties.";
  if (l.includes('OCCUPANCY')) return "Occupancy rate MTD (Month-To-Date) compared with prior period.";
  if (l.includes('REVENUE')) return "Cumulative room revenue YTD (Year-To-Date) compared with last year.";
  if (l.includes('REVPAR')) return "Revenue Per Available Room MTD calculated as Occupancy x ADR.";
  if (l.includes('ADR')) return "Average Daily Rate MTD (Room Revenue / Rooms Sold).";
  return "Key performance indicator metric.";
}

export function MetricWidget({ title, value, trendText, trendUp, subLabel }: MetricWidgetProps) {
  return (
    <div className="flex flex-col relative w-full h-full justify-between pt-1">
      <div className="flex items-center justify-between gap-1 mb-1">
        <InfoTooltip text={getTooltipText(title)}>
          <p className="text-[10px] font-normal tracking-wider uppercase text-zinc-900 whitespace-nowrap truncate cursor-help">
            {title}
          </p>
        </InfoTooltip>
      </div>
      <div>
        <h3 className="text-[22px] font-normal text-zinc-900 my-0.5 leading-tight">{value}</h3>
        {subLabel && <p className="text-[9px] text-zinc-400 font-normal">{subLabel}</p>}
      </div>
      <div className="flex items-center text-[10px] mt-1">
        <span className={`font-medium ${trendUp ? 'text-emerald-700' : 'text-rose-600'}`}>
          {trendUp ? '↑' : '↓'} {trendText}
        </span>
      </div>
    </div>
  );
}
