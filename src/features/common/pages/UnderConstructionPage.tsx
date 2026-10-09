import { CodeSquare, Home, Refresh } from '@solar-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

export function UnderConstructionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDesignPortal = location.pathname === '/dashboard/development';
  const pageTitle = isDesignPortal ? 'Welcome to SOSEI Design' : 'Module Under Development';
  const pageSubtitle = isDesignPortal 
    ? 'Concept, architecture, property renovation and luxury developments.' 
    : "This module is currently being crafted by our engineering team. We're working hard to bring you new features and improvements.";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in bg-transparent relative text-zinc-900">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Icon container with pulse animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-zinc-100 flex items-center justify-center border border-zinc-200 shadow-sm">
          <CodeSquare size={44} className="text-zinc-700" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
          <span className="text-white text-[10px] font-bold">!</span>
        </div>
      </div>

      {/* Main message */}
      <h1 className="text-2xl font-bold text-zinc-900 mb-2 tracking-wide text-center">{pageTitle}</h1>
      <p className="text-zinc-500 max-w-lg mx-auto text-xs text-center leading-relaxed mb-8">
        {pageSubtitle}
      </p>

      {/* Status indicators */}
      <div className="flex gap-2.5 mb-8">
        <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-700 dark:text-zinc-300 font-medium tracking-wide flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>In Progress</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
          ETA: Upcoming Phase
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer"
        >
          <Home size={14} />
          Back to Dashboard
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          <Refresh size={14} />
          Refresh Page
        </button>
      </div>

      <p className="text-[9px] text-zinc-400 mt-6 tracking-wide">
        SOSEI Luxury Hospitality & Architectural Concepts
      </p>
    </div>
  );
}
