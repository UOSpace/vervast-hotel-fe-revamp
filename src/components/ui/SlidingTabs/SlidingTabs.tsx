import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import { cn } from '@/lib/utils';

export interface SlidingTabItem {
  id: string;
  label: string;
  icon?: ComponentType<{ size?: number | string; className?: string }>;
}

interface SlidingTabsProps {
  tabs: SlidingTabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  /** Visual size; "sm" is used for secondary tab rows. */
  size?: 'md' | 'sm';
}

/**
 * Underline tabs. The active tab only gets a thin black line underneath,
 * and that line slides horizontally to the next tab.
 */
export function SlidingTabs({ tabs, value, onChange, className, size = 'md' }: SlidingTabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);

  const measure = () => {
    const el = refs.current[value];
    if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
    else setBar(null);
  };

  useLayoutEffect(measure, [value, tabs, size]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  });

  return (
    <div className={cn('relative border-b border-zinc-200/80 overflow-x-auto', className)}>
      <div role="tablist" className="relative flex items-center gap-6 min-w-max">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.id === value;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                'flex items-center gap-1.5 pb-2.5 cursor-pointer transition-colors duration-200 whitespace-nowrap',
                size === 'md' ? 'text-[11px] font-medium' : 'text-[10px] font-medium',
                active ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-700',
              )}
            >
              {Icon && <Icon size={size === 'md' ? 15 : 13} />}
              {t.label}
            </button>
          );
        })}

        {bar && (
          <span
            aria-hidden
            className="absolute bottom-0 h-[2px] bg-zinc-900 rounded-full transition-[left,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ left: bar.left, width: bar.width }}
          />
        )}
      </div>
    </div>
  );
}

/** Tracks tab order so the content can slide in from the correct side. */
export function useTabDirection(ids: string[], value: string) {
  const prev = useRef(value);
  const [dir, setDir] = useState<'left' | 'right'>('right');

  useLayoutEffect(() => {
    if (prev.current !== value) {
      setDir(ids.indexOf(value) > ids.indexOf(prev.current) ? 'right' : 'left');
      prev.current = value;
    }
  }, [ids, value]);

  return dir;
}
