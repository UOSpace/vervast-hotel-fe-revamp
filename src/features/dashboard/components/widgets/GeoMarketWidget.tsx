import {
  simulatedGeoMarketData,
  type GeoMarketItem,
} from '../../services/propertySimulation';

interface GeoMarketWidgetProps {
  onOpenDetails?: () => void;
  onSelectMarket?: (market: GeoMarketItem) => void;
}

export function GeoMarketWidget({
  onOpenDetails,
  onSelectMarket,
}: GeoMarketWidgetProps) {
  const data = simulatedGeoMarketData;

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
                <th className="py-1 text-left text-[9.5px] font-medium text-zinc-400">Market</th>
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
                    if (onSelectMarket) {
                      e.stopPropagation();
                      onSelectMarket(item);
                    }
                  }}
                  className="hover:bg-zinc-100/60 transition-colors cursor-pointer group"
                >
                  <td className="py-1.5 text-left text-[10px] font-medium text-zinc-900 group-hover:text-zinc-700">
                    {item.market}
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
                  <td className="py-1.5 text-right text-[9.5px] font-medium text-[#14532d]">
                    {item.vsLyFormatted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Subtext: Total feeder volume */}
        <div className="pt-2 mt-1 border-t border-zinc-100 flex items-center justify-between text-[9px] text-zinc-400">
          <span>Global Feeder Markets</span>
          <span className="font-medium text-zinc-700">Total Room Rev: {data.totalRevenue}</span>
        </div>
      </div>
    </div>
  );
}
