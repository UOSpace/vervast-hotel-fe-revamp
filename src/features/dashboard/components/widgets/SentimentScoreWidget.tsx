export function SentimentScoreWidget() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4a3c31]">Sentiment Score</h3>
        <p className="text-[10px] text-[#7d6b5e]">MTD AVERAGE</p>
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
