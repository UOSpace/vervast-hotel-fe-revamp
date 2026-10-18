import { ACTUAL_PERIOD_IDS, PERIOD_DEFS, type PeriodId } from '@/data/portfolio';

interface PeriodTabsWidgetProps {
  period: PeriodId;
  setPeriod: (period: PeriodId) => void;
  periods?: PeriodId[];
  /** Show the full period label (e.g. "MTD (October 1–17, 2026)") under the tabs. */
  showLabel?: boolean;
}

/** Today / MTD / YTD selector shared by the Hospitality sub-dashboards. Labels always come from PERIOD_DEFS. */
export function PeriodTabsWidget({ period, setPeriod, periods = ACTUAL_PERIOD_IDS, showLabel = true }: PeriodTabsWidgetProps) {
  return (
    <div className="flex flex-col gap-1 animate-card-enter shrink-0" style={{ animationDelay: '0.1s' }}>
      <div className="inline-flex items-center rounded-lg bg-zinc-100 p-0.5 border border-zinc-200/80 self-start">
        {periods.map((id) => {
          const active = id === period;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPeriod(id)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                active ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {PERIOD_DEFS[id].label}
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-[9.5px] text-zinc-900 font-medium">As of: {PERIOD_DEFS[period].periodLabel}</span>
      )}
    </div>
  );
}
