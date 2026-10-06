import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Buildings2, WineglassTriangle, Palette, Widget5 } from '@solar-icons/react';
import { LotusIcon } from '../icons/LotusIcon';
import { usePortal, type PortalId } from '../../context/PortalContext';

export interface PortalRailItem {
  id: PortalId;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const portalItems: PortalRailItem[] = [
  {
    id: 'hospitality',
    label: 'Hospitality',
    description: 'Hotels & Resort Operations',
    icon: Buildings2,
  },
  {
    id: 'sanctuary',
    label: 'Sanctuary',
    description: 'Spa & Holistic Wellness',
    icon: LotusIcon,
  },
  {
    id: 'fnb-experience',
    label: 'Experiences & F&B',
    description: 'Dining, Cuisine & Activities',
    icon: WineglassTriangle,
  },
  {
    id: 'design',
    label: 'Design',
    description: 'Architecture & Development',
    icon: Palette,
  },
];

interface PortalRailSidebarProps {
  onNavigate?: (path: string) => void;
  onClose?: () => void;
  className?: string;
}

export function PortalRailSidebar({ onNavigate, onClose, className = '' }: PortalRailSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activePortal, setActivePortal, getGlobalOverviewPath } = usePortal();

  const handlePortalClick = (portalId: PortalId) => {
    setActivePortal(portalId);
    const targetPath = getGlobalOverviewPath(portalId);
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      navigate(targetPath);
    }
    if (onClose) onClose();
  };

  const handleAllPortalsClick = () => {
    if (onNavigate) {
      onNavigate('/portal');
    } else {
      navigate('/portal');
    }
    if (onClose) onClose();
  };

  return (
    <aside
      className={`w-[54px] h-full flex flex-col items-center justify-between shrink-0 border-r border-border/60 bg-card/95 backdrop-blur-md text-foreground select-none relative z-50 ${className}`}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center w-full">
        {/* Top-Left Corner: Exactly matches Sidebar header h-[68px] and border-b */}
        <div className="h-[68px] w-full shrink-0 border-b border-border/30" />

        {/* 4 Portals Icons: Vertically aligned with Sidebar menu rows (pt-2, h-[34px], space-y-1) */}
        <div className="flex flex-col items-center space-y-1 w-full pt-2">
          {portalItems.map((item) => {
            const active = activePortal === item.id;
            const Icon = item.icon;

            return (
              <div key={item.id} className="relative flex items-center justify-center w-full group h-[34px]">
                {/* Wabi-sabi subtle organic ink indicator */}
                {active && (
                  <div className="absolute left-0 w-[2.5px] h-3.5 bg-zinc-800 rounded-r-full opacity-80" />
                )}

                {/* Portal Icon Button: Exactly h-[34px] w-[34px] to align with Sidebar rows */}
                <button
                  onClick={() => handlePortalClick(item.id)}
                  className={`w-[34px] h-[34px] rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-zinc-900/[0.08] text-zinc-900 border border-zinc-900/[0.12] shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-900/[0.03] border border-transparent'
                  }`}
                  aria-label={item.label}
                >
                  <Icon size={16} className={active ? 'text-zinc-900' : 'currentColor'} />
                </button>

                {/* Floating Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900 text-white text-[10px] font-medium rounded-lg whitespace-nowrap shadow-xl opacity-0 translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-[100] flex flex-col items-start border border-zinc-800">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Portal</span>
                  <span className="text-[11px] font-semibold text-white">{item.label}</span>
                  <span className="text-[9px] text-zinc-400 font-normal">{item.description}</span>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: All Portals Grid Switcher */}
      <div className="flex flex-col items-center w-full pb-3 pt-1">
        <div className="w-5 h-[1px] bg-border/40 my-1" />

        <div className="relative flex items-center justify-center w-full group h-[34px]">
          <button
            onClick={handleAllPortalsClick}
            className={`w-[34px] h-[34px] rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              location.pathname === '/portal'
                ? 'bg-zinc-900/[0.08] text-zinc-900 border border-zinc-900/[0.12] shadow-xs'
                : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-900/[0.03] border border-transparent'
            }`}
            aria-label="Portal Selection"
          >
            <Widget5 size={16} />
          </button>

          {/* Floating Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900 text-white text-[10px] font-medium rounded-lg whitespace-nowrap shadow-xl opacity-0 translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-[100] flex flex-col items-start border border-zinc-800">
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Navigation</span>
            <span className="text-[11px] font-semibold text-white">Switch Portal</span>
            <span className="text-[9px] text-zinc-400 font-normal">Return to portal selection grid</span>
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900" />
          </div>
        </div>
      </div>
    </aside>
  );
}
