import { useState } from 'react';
import { CheckCircle, AddCircle } from '@solar-icons/react';
import { cn } from '@/lib/utils';

export interface PipelineStage {
  id: string;
  label: string;
  /** Terminal stages (turned down, cancelled, ...) end the flow instead of advancing it. */
  terminal?: boolean;
  /** Visual tone used when this terminal stage is selected. */
  tone?: 'danger' | 'muted';
}

interface PipelineStepperProps {
  stages: PipelineStage[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

const ARROW = 12; // px depth of the chevron tip
const OVERLAP = 9; // px each segment tucks under the previous one (leaves a thin gap)

function clip(first: boolean, last: boolean) {
  const left = first ? '0 0' : `${ARROW}px 50%`;
  const leftTop = '0 0';
  const leftBottom = '0 100%';
  const right = last
    ? '100% 0, 100% 100%'
    : `calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%`;
  // top-left -> top-right -> tip -> bottom-right -> bottom-left -> notch
  return first
    ? `polygon(${leftTop}, ${right}, ${leftBottom})`
    : `polygon(${leftTop}, ${right}, ${leftBottom}, ${left})`;
}

/**
 * Clickable chevron pipeline. Completed and current stages are solid black,
 * upcoming ones are light grey with a plus icon. Selecting a normal stage
 * completes everything before it; a terminal stage keeps the last reached progress.
 */
export function PipelineStepper({ stages, value, onChange, className }: PipelineStepperProps) {
  const currentIndex = Math.max(0, stages.findIndex((s) => s.id === value));
  const [reached, setReached] = useState(() => {
    const cur = stages[currentIndex];
    if (!cur?.terminal) return currentIndex;
    const firstTerminal = stages.findIndex((s) => s.terminal);
    return Math.max(0, firstTerminal - 1);
  });

  const select = (index: number) => {
    const stage = stages[index];
    if (!stage.terminal) setReached(index);
    onChange(stage.id);
  };

  return (
    <div role="tablist" aria-label="Pipeline" className={cn('flex w-full', className)}>
      {stages.map((stage, i) => {
        const first = i === 0;
        const last = i === stages.length - 1;
        const isCurrent = i === currentIndex;
        const isDone = !stage.terminal && i <= reached && !isCurrent;
        const filled = isCurrent || isDone;

        const tone = isCurrent && stage.terminal
          ? stage.tone === 'danger'
            ? 'bg-[#800020] text-white'
            : 'bg-zinc-500 text-white'
          : filled
            ? 'bg-zinc-900 text-white'
            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200/80 hover:text-zinc-800';

        const Icon = filled ? CheckCircle : AddCircle;

        return (
          <button
            key={stage.id}
            role="tab"
            type="button"
            aria-selected={isCurrent}
            onClick={() => select(i)}
            style={{
              clipPath: clip(first, last),
              marginLeft: first ? 0 : -OVERLAP,
              zIndex: stages.length - i,
              paddingLeft: first ? 14 : ARROW + 10,
              paddingRight: last ? 14 : ARROW + 6,
            }}
            className={cn(
              'relative flex-1 min-w-0 h-9 flex items-center justify-center gap-2 text-[10.5px] cursor-pointer transition-colors duration-300',
              first && 'rounded-l-[8px]',
              last && 'rounded-r-[8px]',
              isCurrent ? 'font-semibold' : 'font-medium',
              tone,
            )}
          >
            <Icon size={15} weight={isCurrent ? 'Bold' : 'Linear'} className="shrink-0" />
            <span className="truncate">{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
}
