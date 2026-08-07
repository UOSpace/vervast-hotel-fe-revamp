import type { ReactNode } from 'react';

interface InfoTooltipProps {
  text: string;
  children?: ReactNode;
}

export function InfoTooltip({ text, children }: InfoTooltipProps) {
  if (!children) return null;

  return (
    <div className="group relative inline-flex items-center cursor-help" onClick={(e) => e.stopPropagation()}>
      {children}
      <div className="absolute top-full left-0 mt-1.5 w-56 hidden group-hover:block bg-[#4a3c31] dark:bg-[#181818] dark:border dark:border-[#262626] text-[#fdfaf7] dark:text-white text-[9.5px] rounded p-2 shadow-xl z-[9999] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute bottom-full left-3 border-4 border-transparent border-b-[#4a3c31] dark:border-b-[#181818]" />
      </div>
    </div>
  );
}
