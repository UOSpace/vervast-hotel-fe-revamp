import { useNavigate } from 'react-router-dom';
import {
  simulatedPortfolioComparisonData,
  type PortfolioComparisonItem,
} from '../../services/propertySimulation';

interface PortfolioComparisonWidgetProps {
  onOpenDetails?: () => void;
  onSelectProperty?: (item: PortfolioComparisonItem) => void;
}

export function PortfolioComparisonWidget({
  onOpenDetails,
  onSelectProperty,
}: PortfolioComparisonWidgetProps) {
  const navigate = useNavigate();
  const data = simulatedPortfolioComparisonData;

  const handleRowClick = (item: PortfolioComparisonItem) => {
    if (onSelectProperty) {
      onSelectProperty(item);
    } else if (item.propertyRoute) {
      navigate(item.propertyRoute);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
            {data.title}
          </h3>
          <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
            {data.subtitle}
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

      {/* Table Container with Horizontal Scroll Safety */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[760px] text-xs text-zinc-800 border-separate border-spacing-0">
          <thead>
            <tr className="text-zinc-400 border-b border-zinc-100">
              <th className="py-1.5 px-2 text-left font-medium text-[9.5px]">Property</th>
              <th className="py-1.5 px-2 text-left font-medium text-[9.5px]">Location</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">Occupancy</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">ADR (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">RevPAR (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">Room Revenue (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">Total Revenue (USD)</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">vs LY</th>
              <th className="py-1.5 px-2 text-right font-medium text-[9.5px]">vs Budget</th>
              <th className="py-1.5 px-2 text-center font-medium text-[9.5px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`transition-colors cursor-pointer group hover:bg-zinc-100/70 ${
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-zinc-50/40'
                }`}
              >
                {/* Property Name */}
                <td className="py-2 px-2 text-left font-bold text-[10.5px] text-zinc-900 group-hover:text-zinc-700 whitespace-nowrap border-b border-zinc-100/80">
                  {item.property}
                </td>

                {/* Location */}
                <td className="py-2 px-2 text-left text-[10px] text-zinc-500 whitespace-nowrap border-b border-zinc-100/80">
                  {item.location}
                </td>

                {/* Occupancy */}
                <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                  {item.occupancy}
                </td>

                {/* ADR */}
                <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                  {item.adrFormatted}
                </td>

                {/* RevPAR */}
                <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                  {item.revparFormatted}
                </td>

                {/* Room Revenue */}
                <td className="py-2 px-2 text-right text-[10.5px] font-medium text-zinc-800 whitespace-nowrap border-b border-zinc-100/80">
                  {item.roomRevenueFormatted}
                </td>

                {/* Total Revenue */}
                <td className="py-2 px-2 text-right text-[10.5px] font-bold text-zinc-900 whitespace-nowrap border-b border-zinc-100/80">
                  {item.totalRevenueFormatted}
                </td>

                {/* vs LY */}
                <td className="py-2 px-2 text-right whitespace-nowrap border-b border-zinc-100/80">
                  <span
                    className={`inline-flex items-center gap-0.5 text-[9.5px] font-medium ${
                      item.growthVsLyNum > 0
                        ? 'text-[#14532d]'
                        : item.growthVsLyNum < 0
                        ? 'text-[#800020]'
                        : 'text-zinc-500'
                    }`}
                  >
                    <span>{item.growthVsLyNum > 0 ? '↑' : item.growthVsLyNum < 0 ? '↓' : '—'}</span>
                    {item.growthVsLy}
                  </span>
                </td>

                {/* vs Budget */}
                <td className="py-2 px-2 text-right whitespace-nowrap border-b border-zinc-100/80">
                  <span
                    className={`inline-flex items-center gap-0.5 text-[9.5px] font-medium ${
                      item.vsBudgetNum > 0
                        ? 'text-[#14532d]'
                        : item.vsBudgetNum < 0
                        ? 'text-[#800020]'
                        : 'text-zinc-500'
                    }`}
                  >
                    <span>{item.vsBudgetNum > 0 ? '↑' : item.vsBudgetNum < 0 ? '↓' : '—'}</span>
                    {item.vsBudget}
                  </span>
                </td>

                {/* Status Dot */}
                <td className="py-2 px-2 text-center whitespace-nowrap border-b border-zinc-100/80">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      item.status === 'above_plan'
                        ? 'bg-[#14532d]'
                        : item.status === 'on_plan'
                        ? 'bg-zinc-400'
                        : 'bg-[#800020]'
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
