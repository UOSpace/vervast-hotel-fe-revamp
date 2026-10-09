import React from 'react';
import { useLocation } from 'react-router-dom';

export interface NavbarProps {
  onOpenSidebar?: () => void;
  title?: string;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSidebar,
  title,
  className = '',
}) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path.includes('property')) return 'Property Analytics';
    if (path.includes('guests')) return 'Guest Intelligence';
    if (path.includes('partners')) return 'Partner Network';
    if (path.includes('reservations')) return 'Reservations & Leads';
    if (path.includes('sales')) return 'Sales & Pipeline';
    if (path.includes('spa')) return 'Wellness & Spa';
    if (path.includes('fnb')) return 'Food & Beverage';
    return 'Executive Overview';
  };

  return (
    <header className={`h-12 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-30 ${className}`}>
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-900">
            {getPageTitle()}
          </span>
          <span className="text-[10px] text-zinc-400">/</span>
          <span className="text-[10px] font-normal text-zinc-500">Live PMS Synchronized</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100/60">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9.5px] font-medium text-emerald-700">Online</span>
        </div>
      </div>
    </header>
  );
};
