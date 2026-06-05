function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
      <span className="cursor-help text-[#7d6b5e]/60 hover:text-[#C8A050] transition-colors text-[9px] border border-[#7d6b5e]/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold font-sans">
        ?
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-[#4a3c31] text-[#fdfaf7] text-[9.5px] rounded p-2 shadow-xl z-[90] pointer-events-none leading-normal font-normal normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#4a3c31]" />
      </div>
    </div>
  );
}

export function SentimentScoreWidget() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Sentiment Score</h3>
            <p className="text-[10px] text-[#7d6b5e]">MTD AVERAGE</p>
          </div>
          <InfoTooltip text="Average score based on guest survey feedback across service, cleanliness, comfort, and dining." />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Render a custom CSS ring instead of a heavy SVG chart */}
        <div className="w-24 h-24 rounded-full border-[4px] border-[#e5d8cb] relative flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 rounded-full border-[4px] border-[#947b66] border-r-transparent border-b-transparent transform rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f3eae1] to-[#e5d8cb] -z-10 shadow-sm m-1"></div>

          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-2xl font-bold text-[#4a3c31]">4.8</span>
              <span className="text-[10px] text-[#7d6b5e]">/5</span>
            </div>
            <span className="text-[10px] text-[#4a3c31]">Excellent</span>
          </div>
        </div>

        <div className="mt-4 text-[10px] text-[#7d6b5e] flex items-center space-x-1">
          <span className="text-[#657454]">↑ 0.3</span>
          <span>vs last month</span>
        </div>
      </div>
    </div>
  );
}
