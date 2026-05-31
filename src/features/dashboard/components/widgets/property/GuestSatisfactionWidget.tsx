import { ArrowRight } from '@solar-icons/react';

export function GuestSatisfactionWidget() {
  const scores = [
    { label: 'Overall Experience', score: 4.9 },
    { label: 'Service', score: 4.8 },
    { label: 'Cleanliness', score: 4.9 },
    { label: 'Room Comfort', score: 4.7 },
    { label: 'Dining', score: 4.6 },
  ];

  return (
    <div className="border border-[#d4c4b7] rounded-[12px] p-4 flex flex-col backdrop-blur-sm bg-[#f3eae1]/0 animate-card-enter" style={{ animationDelay: '0.45s' }}>
      <div className="uppercase tracking-widest text-[8px] font-bold text-[#7d6b5e] mb-4">GUEST SATISFACTION (MTD)</div>

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
