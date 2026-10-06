import { InfoTooltip } from '../../../common/components/InfoTooltip';
import { getDashboardComputedData } from '../../../../data/pms';

interface PortfolioPerformanceWidgetProps {
  period?: 'YTD' | 'MTD';
}

export function PortfolioPerformanceWidget({ period = 'YTD' }: PortfolioPerformanceWidgetProps) {
  const data = getDashboardComputedData().portfolioPerformance;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <InfoTooltip text="Breakdown of total room revenue and performance trends across resort categories.">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 cursor-help">Category Revenue</h3>
            <p className="text-[10px] text-zinc-500 font-medium">{period} BREAKDOWN</p>
          </div>
        </InfoTooltip>
      </div>

      <div className="flex-1 flex flex-col justify-between py-0.5 space-y-1">
        <div className="flex justify-between items-center text-[9.5px] font-medium text-zinc-400 border-b border-zinc-100 pb-1">
          <span>Category</span>
          <div className="flex space-x-3 justify-end items-center">
            <span>Revenue</span>
            <span className="w-8 text-right">Trend</span>
          </div>
        </div>

        {data.map((item, i) => {
          const displayVal = period === 'YTD' ? item.ytdRevenue : item.mtdRevenue;
          return (
            <div key={i} className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-700 font-normal truncate pr-2">{item.label}</span>
              <div className="flex space-x-3 justify-end items-center shrink-0">
                <span className="font-semibold text-zinc-900">{displayVal}</span>
                <span className={`w-8 text-right font-medium ${item.up ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {item.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
