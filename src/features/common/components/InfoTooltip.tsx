interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 dark:text-white/40 hover:text-[#C8A050] dark:hover:text-white transition-colors text-[9px] border border-[#7d6b5e]/30 dark:border-white/20 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute top-full right-0 mt-2 w-48 hidden group-hover:block bg-[#4a3c31] dark:bg-[#181818] dark:border dark:border-[#262626] text-[#fdfaf7] dark:text-white text-[9.5px] rounded p-2 shadow-xl z-[9999] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute bottom-full right-3 border-4 border-transparent border-b-[#4a3c31] dark:border-b-[#181818]" />
      </div>
    </div>
  );
}
