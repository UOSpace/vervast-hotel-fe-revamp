import type { ReactNode } from 'react';

interface InfoTooltipProps {
  text: string;
  children?: ReactNode;
}

export function InfoTooltip({ text, children }: InfoTooltipProps) {
  if (!children) return null;

  return (
    <div className="group/tooltip relative inline-flex items-center cursor-help" onClick={(e) => e.stopPropagation()}>
      {children}
      <div className="absolute top-full left-0 mt-1.5 w-56 hidden group-hover/tooltip:block bg-zinc-900 dark:bg-[#181818] dark:border dark:border-[#262626] text-white text-[9.5px] rounded-md p-2 shadow-xl z-[9999] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute bottom-full left-3 border-4 border-transparent border-b-zinc-900 dark:border-b-[#181818]" />
      </div>
    </div>
  );
}
