import { RoundAltArrowRight } from '@solar-icons/react';
import {
  getPortfolioMetrics,
  fmtPct,
  fmtUsdFull,
  type PeriodId,
} from '@/data/portfolio';
import {
  getMarketSegmentData,
  type MarketSegmentItem,
} from '../../services/propertySimulation';

interface MarketSegmentWidgetProps {
  period?: PeriodId;
  onOpenDetails?: () => void;
  onSelectSegment?: (segment: MarketSegmentItem) => void;
}

const SEGMENT_OCC_OFFSET: Record<string, number> = {
  leisure: 2.4,
  business: -1.8,
  social: -4.2,
  mice: -3.5,
  others: -6.8,
};

export function MarketSegmentWidget({
  period = 'mtd',
  onOpenDetails,
  onSelectSegment,
}: MarketSegmentWidgetProps) {
  const data = getMarketSegmentData(period);
  const pm = getPortfolioMetrics(undefined, period);

  return (
    <div
      className="flex flex-col h-full justify-between"
      onClick={() => onOpenDetails && onOpenDetails()}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            {data.title}
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {data.question}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails && onOpenDetails();
          }}
          className="text-[9.5px] font-medium text-zinc-500 hover:text-zinc-900 hover:underline transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          See details <RoundAltArrowRight size={10} />
        </button>
      </div>

      {/* Main Table */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 pb-1">
                <th className="py-1 text-left text-[9.5px] font-medium text-zinc-400">Segment</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">Occupancy</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">ADR</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">RevPAR</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">Revenue</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">vs LY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/80">
              {data.items.map((item) => {
                const occPct = Math.min(
                  98,
                  Math.max(40, pm.occupancyPct + (SEGMENT_OCC_OFFSET[item.id] ?? 0))
                );
                const revparUsd = Math.round(item.adrUsd * (occPct / 100));

                return (
                  <tr
                    key={item.id}
                    onClick={(e) => {
                      if (onSelectSegment) {
                        e.stopPropagation();
                        onSelectSegment(item);
                      }
                    }}
                    className="hover:bg-zinc-100/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-1.5 text-left text-[10px] font-medium text-zinc-900 group-hover:text-zinc-700 whitespace-nowrap">
                      {item.segment}
                    </td>
                    <td className="py-1.5 text-right text-[10px] font-medium text-zinc-600 whitespace-nowrap">
                      {fmtPct(occPct, 1)}
                    </td>
                    <td className="py-1.5 text-right text-[10px] font-medium text-zinc-600 whitespace-nowrap">
                      {item.adrFormatted}
                    </td>
                    <td className="py-1.5 text-right text-[10px] font-medium text-zinc-600 whitespace-nowrap">
                      {fmtUsdFull(revparUsd)}
                    </td>
                    <td className="py-1.5 text-right text-[10px] font-semibold text-zinc-900 whitespace-nowrap">
                      {item.revenueFormatted}
                    </td>
                    <td
                      className={`py-1.5 text-right text-[9.5px] font-medium whitespace-nowrap ${
                        item.isPositive ? 'text-[#14532d]' : 'text-[#800020]'
                      }`}
                    >
                      {item.vsLyFormatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
