import {
  simulatedMarketSegmentData,
  type MarketSegmentItem,
} from '../../services/propertySimulation';

interface MarketSegmentWidgetProps {
  onOpenDetails?: () => void;
  onSelectSegment?: (segment: MarketSegmentItem) => void;
}

export function MarketSegmentWidget({
  onOpenDetails,
  onSelectSegment,
}: MarketSegmentWidgetProps) {
  const data = simulatedMarketSegmentData;

  return (
    <div
      className="flex flex-col h-full justify-between"
      onClick={() => onOpenDetails && onOpenDetails()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
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
          className="text-[9.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-0.5 cursor-pointer"
        >
          See details <span>→</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 pb-1">
                <th className="py-1 text-left text-[9.5px] font-medium text-zinc-400">Segment</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">Room Nights</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">ADR</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">Revenue</th>
                <th className="py-1 text-right text-[9.5px] font-medium text-zinc-400">vs LY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/80">
              {data.items.map((item) => (
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
                  <td className="py-1.5 text-left text-[10px] font-medium text-zinc-900 group-hover:text-zinc-700">
                    {item.segment}
                  </td>
                  <td className="py-1.5 text-right text-[10px] font-medium text-zinc-600">
                    {item.roomNightsFormatted}
                  </td>
                  <td className="py-1.5 text-right text-[10px] font-medium text-zinc-600">
                    {item.adrFormatted}
                  </td>
                  <td className="py-1.5 text-right text-[10px] font-semibold text-zinc-900">
                    {item.revenueFormatted}
                  </td>
                  <td
                    className={`py-1.5 text-right text-[9.5px] font-medium ${
                      item.isPositive ? 'text-[#14532d]' : 'text-[#800020]'
                    }`}
                  >
                    {item.vsLyFormatted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
