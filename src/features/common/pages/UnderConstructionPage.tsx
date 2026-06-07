import { CodeSquare, Home, Refresh } from '@solar-icons/react';
import { useNavigate } from 'react-router-dom';

export function UnderConstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in bg-transparent relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #4a3c31 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Icon container with pulse animation */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-[#E3CCB2]/40 flex items-center justify-center border-4 border-[#C8A050]/40 shadow-[0_0_50px_rgba(200,160,80,0.15)]">
          <CodeSquare size={56} className="text-[#6A5848]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#a65e52] flex items-center justify-center shadow-md">
          <span className="text-white text-[10px] font-bold">!</span>
        </div>
      </div>

      {/* Main message */}
      <h1 className="text-3xl font-serif text-[#4a3c31] mb-3 tracking-wide">Module Under Development</h1>
      <p className="text-[#7d6b5e] max-w-lg mx-auto text-sm leading-relaxed mb-8">
        This module is currently being crafted by our engineering team. We're working hard to bring you new features and improvements.
      </p>

      {/* Status indicators */}
      <div className="flex gap-3 mb-8">
        <div className="px-3 py-1.5 rounded-full bg-[#a65e52]/10 border border-[#a65e52]/30 text-[10px] text-[#a65e52] font-semibold tracking-wide">
          ● In Progress
        </div>
        <div className="px-3 py-1.5 rounded-full bg-[#C8A050]/10 border border-[#C8A050]/30 text-[10px] text-[#C8A050] font-semibold tracking-wide">
          ETA: Upcoming Sprint
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a3c31] text-white text-xs font-semibold hover:bg-[#3a2c21] transition-colors shadow-md cursor-pointer"
        >
          <Home size={14} />
          Back to Dashboard
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#d4c4b7] text-[#4a3c31] text-xs font-semibold hover:bg-[#f3eae1]/50 transition-colors cursor-pointer"
        >
          <Refresh size={14} />
          Refresh Page
        </button>
      </div>

      <p className="text-[8px] text-[#9B8272] mt-6 italic">
        If this issue persists, please share Error ID with the development team.
      </p>
    </div>
  );
}
