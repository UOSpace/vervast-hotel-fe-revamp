import {
  getSOSEISignalsData,
} from '../../services/propertySimulation';
import { PERIOD_DEFS, type PeriodId } from '@/data/portfolio';

interface SOSEISignalsDrawerContentProps {
  config?: {
    title?: string;
    data?: any;
  };
}

export function SOSEISignalsDrawerContent({ config }: SOSEISignalsDrawerContentProps) {
  const period: PeriodId =
    config?.data?.period || config?.data?.horizon || 'mtd';

  const periodDef = PERIOD_DEFS[period];
  const signalsData = getSOSEISignalsData(period);
  const filteredSignals = signalsData.items;

  return (
    <div className="space-y-4 animate-fade-in text-xs text-zinc-900 pb-6">
      {/* Header */}
      <div className="pb-3 border-b border-zinc-200">
        <p className="text-[10px] text-zinc-900 font-medium mt-0.5">
          As of: <span className="font-semibold text-zinc-900">{periodDef.periodLabel}</span>
        </p>
      </div>

      {/* Signal List */}
      <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white overflow-hidden">
        {filteredSignals.map((sig) => (
          <div
            key={sig.id}
            className="p-4 flex items-start justify-between gap-4 hover:bg-zinc-50/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              {sig.iconType === 'up_arrow' ? (
                <span className="w-6 h-6 rounded-full bg-[#ecfdf5] text-[#14532d] flex items-center justify-center shrink-0 font-bold text-xs border border-[#bbf7d0]/80 mt-0.5">
                  ↑
                </span>
              ) : sig.iconType === 'down_arrow' ? (
                <span className="w-6 h-6 rounded-full bg-[#fff1f2] text-[#800020] flex items-center justify-center shrink-0 font-bold text-xs border border-[#fecdd3]/80 mt-0.5">
                  ↓
                </span>
              ) : (
                <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0 font-bold text-xs border border-zinc-200/80 mt-0.5">
                  —
                </span>
              )}
              <div>
                <h5 className="text-xs font-bold text-zinc-900">{sig.title}</h5>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{sig.description}</p>
              </div>
            </div>

            <span className="text-[10px] text-zinc-400 font-normal shrink-0 whitespace-nowrap">
              {sig.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
