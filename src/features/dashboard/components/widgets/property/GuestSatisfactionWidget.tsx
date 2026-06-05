import { ArrowRight } from '@solar-icons/react';
import { useDashboardDrawer } from '../../../context/DashboardDrawerContext';

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

export function GuestSatisfactionWidget() {
  const { openDrawer } = useDashboardDrawer();
  const scores = [
    { label: 'Overall Experience', score: 4.9 },
    { label: 'Service', score: 4.8 },
    { label: 'Cleanliness', score: 4.9 },
    { label: 'Room Comfort', score: 4.7 },
    { label: 'Dining', score: 4.6 },
  ];

  return (
    <div 
      className="relative border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col bg-[#f3eae1]/30 hover:ring-2 hover:ring-[#C8A050]/50 hover:z-20 transition-all cursor-pointer animate-card-enter" 
      style={{ animationDelay: '0.45s' }}
      onClick={() => openDrawer({ type: 'SENTIMENT_SCORE', title: 'Sentiment Score' })}
    >
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4 flex items-center justify-between">
        <span>GUEST SATISFACTION (MTD)</span>
        <InfoTooltip text="Average score based on guest survey feedback across service, cleanliness, comfort, and dining." />
      </div>

      <div className="flex-1 flex items-center justify-between">
        {/* Left Side: Gauge */}
        <div className="flex flex-col items-center ml-4">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-[#e5d8cb] shadow-[0_0_15px_rgba(200,160,80,0.3)]">
            {/* Value Circle Segment (Simulated with pure CSS border tricks or SVG) */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="44" cy="44" r="44" fill="none" stroke="transparent" strokeWidth="4" />
              <circle
                cx="44" cy="44" r="44"
                fill="none"
                stroke="#C8A050"
                strokeWidth="4"
                strokeDasharray="276"
                strokeDashoffset={276 - (4.8 / 5) * 276}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-serif font-bold text-[#4a3c31]">
                4.8 <span className="text-xs font-normal text-[#6A5848]">/5</span>
              </div>
              <div className="text-[9px] text-[#C8A050] font-bold uppercase tracking-wider">Excellent</div>
            </div>
          </div>
          <div className="text-[9px] text-[#6A5848] mt-3">vs last month <span className="text-[#657454] font-bold">↑ 0.3</span></div>
        </div>

        {/* Right Side: Scores */}
        <div className="flex flex-col gap-2.5 mr-2 flex-1 max-w-[140px]">
          {scores.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-[10px] text-[#4a3c31]">
              <span>{item.label}</span>
              <span className="font-bold">{item.score}</span>
            </div>
          ))}
          <button className="flex items-center gap-1 text-[#C8A050] text-[9px] font-bold mt-2 hover:opacity-80 transition-opacity uppercase tracking-wider justify-end">
            View all feedback <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
