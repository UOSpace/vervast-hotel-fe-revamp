import {
  simulatedSOSEISignalsData,
  type PortfolioSignalItem,
} from '../../services/propertySimulation';

interface SOSEISignalsWidgetProps {
  onOpenDetails?: () => void;
  onSelectSignal?: (signal: PortfolioSignalItem) => void;
}

export function SOSEISignalsWidget({
  onOpenDetails,
  onSelectSignal,
}: SOSEISignalsWidgetProps) {
  const data = simulatedSOSEISignalsData;

  const renderSignalIcon = (signal: PortfolioSignalItem) => {
    switch (signal.iconType) {
      case 'up_arrow':
        return (
          <div className="w-6 h-6 rounded-full bg-[#ecfdf5] text-[#14532d] flex items-center justify-center shrink-0 font-bold text-xs border border-[#bbf7d0]/80">
            ↑
          </div>
        );
      case 'down_arrow':
        return (
          <div className="w-6 h-6 rounded-full bg-[#fff1f2] text-[#800020] flex items-center justify-center shrink-0 font-bold text-xs border border-[#fecdd3]/80">
            ↓
          </div>
        );
      case 'dash':
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 font-bold text-xs border border-zinc-200/80">
            —
          </div>
        );
    }
  };

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
          See all signals <span>→</span>
        </button>
      </div>

      {/* 4 Signals List */}
      <div className="flex-1 flex flex-col justify-between py-0.5 space-y-1.5">
        {data.items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              if (onSelectSignal) {
                e.stopPropagation();
                onSelectSignal(item);
              }
            }}
            className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-zinc-100/60 transition-colors cursor-pointer group"
          >
            {/* Left: Icon & Text */}
            <div className="flex items-center gap-2.5 min-w-0">
              {renderSignalIcon(item)}
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors truncate">
                  {item.title}
                </div>
                <div className="text-[9px] text-zinc-500 font-normal leading-tight line-clamp-1">
                  {item.description}
                </div>
              </div>
            </div>

            {/* Right: Timestamp */}
            <div className="text-[9px] text-zinc-400 font-normal shrink-0 text-right">
              {item.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
