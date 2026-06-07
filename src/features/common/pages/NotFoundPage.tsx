import { Home, Refresh } from '@solar-icons/react';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in bg-transparent relative">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #4a3c31 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-[#a65e52]/10 flex items-center justify-center border-4 border-[#a65e52]/30">
          <span className="text-5xl font-serif text-[#a65e52]">404</span>
        </div>
      </div>

      {/* Main message */}
      <h1 className="text-3xl font-serif text-[#4a3c31] mb-3 tracking-wide">Page Not Found</h1>
      <p className="text-[#7d6b5e] max-w-md mx-auto text-sm leading-relaxed mb-8 text-center">
        The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the dashboard.
      </p>

      {/* Path display */}
      <div className="border border-[#d4c4b7]/60 rounded-lg px-4 py-2 bg-[#f3eae1]/20 mb-8">
        <span className="text-[9px] text-[#9B8272] font-mono">{window.location.pathname}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/dashboard')}
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
          Refresh
        </button>
      </div>

      <p className="text-[8px] text-[#9B8272] mt-8 italic">
        If you believe this is an error, please contact the development team.
      </p>
    </div>
  );
}
