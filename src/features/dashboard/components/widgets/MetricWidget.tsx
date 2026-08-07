import { InfoTooltip } from '../../../common/components/InfoTooltip';
import type { ReactNode } from 'react';

interface MetricWidgetProps {
  title: string;
  value: string;
  trendText: string;
  trendUp: boolean;
  icon?: ReactNode;
  data: number[];
  color: string;
}

function getTooltipText(title: string) {
  const l = title.toUpperCase();
  if (l.includes('GUEST') || l.includes('CUSTOMER')) return "Average daily number of guests checked in YTD.";
  if (l.includes('OCCUPANCY')) return "Average occupancy rate YTD.";
  if (l.includes('REVENUE')) return "Average daily revenue YTD.";
  if (l.includes('REVPAR')) return "Average revenue per available room YTD.";
  if (l.includes('ADR')) return "Average Daily Rate YTD.";
  return "Key performance indicator metric.";
}

export function MetricWidget({ title, value, trendText, trendUp }: MetricWidgetProps) {
  return (
    <div className="flex flex-col relative w-full h-full justify-between pt-1">
      <div className="flex items-center justify-between gap-1 mb-1">
        <InfoTooltip text={getTooltipText(title)}>
          <p className="text-[10px] font-normal tracking-wider uppercase text-[#4a3c31] whitespace-nowrap truncate cursor-help">{title}</p>
        </InfoTooltip>
      </div>
      <h3 className="text-[22px] font-normal text-[#4a3c31] my-1">{value}</h3>
      <div className="flex items-center text-[10px] mt-1">
        <span className={trendUp ? 'text-[#15803d]' : 'text-[#b91c1c]'}>
          {trendUp ? '↑' : '↓'} {trendText}
        </span>
      </div>
    </div>
  );
}
