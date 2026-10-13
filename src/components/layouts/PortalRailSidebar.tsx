import React, { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Buildings2, WineglassTriangle, Palette, Widget5, Logout2 } from '@solar-icons/react';
import { LotusIcon } from '../icons/LotusIcon';
import { usePortal, type PortalId } from '../../context/PortalContext';
import { ConfirmationModal } from '../ui/Modal';
import { useAuth } from '@/features/auth/hooks/useAuth';

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
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout();
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Single sliding tab: measure the active item's top and animate to it.
  const asideRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [tabTop, setTabTop] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const activeKey = location.pathname === '/portal' ? 'all-portals' : activePortal;

  useLayoutEffect(() => {
    const measure = () => {
      const aside = asideRef.current;
      const el = itemRefs.current[activeKey];
      if (!aside || !el) {
        setTabTop(null);
        return;
      }
      setTabTop(el.getBoundingClientRect().top - aside.getBoundingClientRect().top);
    };
    measure();
    // Enable the transition only after the first placement so it doesn't fly in from 0.
    const raf = requestAnimationFrame(() => setAnimate(true));
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [activeKey]);

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
      ref={asideRef}
      className={`w-[54px] h-full flex flex-col items-center justify-between shrink-0 bg-zinc-950 text-white select-none relative z-50 ${className}`}
    >
      {/* Sliding white tab that flows into the second sidebar */}
      {tabTop !== null && (
        <div
          aria-hidden
          className={`absolute left-2 right-[-1px] h-[44px] pointer-events-none z-0 ${
            animate ? 'transition-[top] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]' : ''
          }`}
          style={{ top: tabTop }}
        >
          <span className="absolute inset-0 bg-white rounded-l-[14px]" />
          <span className="absolute right-0 -top-[14px] w-[14px] h-[14px] rounded-br-[14px] shadow-[7px_7px_0_7px_#fff]" />
          <span className="absolute right-0 -bottom-[14px] w-[14px] h-[14px] rounded-tr-[14px] shadow-[7px_-7px_0_7px_#fff]" />
        </div>
      )}
      {/* Top Section */}
      <div className="flex flex-col items-center w-full">
        {/* Top-Left Corner: matches Sidebar header height */}
        <div className="h-[68px] w-full shrink-0 border-b border-white/10" />

        {/* Portal icons. The active one becomes a white tab that merges into the second sidebar. */}
        <div className="flex flex-col items-center gap-3 w-full pt-4">
          {portalItems.map((item) => {
            const active = activeKey === item.id;
            const Icon = item.icon;

            return (
              <RailItem
                key={item.id}
                innerRef={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                active={active}
                label={item.label}
                tooltipTitle="Portal"
                tooltipDesc={item.description}
                onClick={() => handlePortalClick(item.id)}
              >
                <Icon size={17} />
              </RailItem>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: All Portals Grid Switcher & Sign Out */}
      <div className="flex flex-col items-center w-full pb-3 pt-1 gap-1">
        <div className="w-5 h-[1px] bg-white/10 my-1.5" />

        <RailItem
          innerRef={(el) => {
            itemRefs.current['all-portals'] = el;
          }}
          active={activeKey === 'all-portals'}
          label="Portal Selection"
          tooltipTitle="Navigation"
          tooltipDesc="Return to portal selection grid"
          tooltipLabel="Switch Portal"
          onClick={handleAllPortalsClick}
        >
          <Widget5 size={17} />
        </RailItem>

        <RailItem
          active={false}
          label="Sign Out"
          tooltipTitle="Executive"
          tooltipDesc="End current executive session"
          tooltipLabel="Log Out"
          onClick={() => setShowLogoutModal(true)}
        >
          <Logout2 size={17} className="transition-transform group-hover:scale-110 text-zinc-400 group-hover:text-rose-400" />
        </RailItem>
      </div>

      {/* Reusable Confirmation Modal for Logout */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        icon={
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-900 shrink-0">
            <Logout2 size={20} />
          </div>
        }
        title="Sign Out of Session"
        description="Are you sure you want to end your executive session? You will be safely signed out and returned to the sign-in portal."
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        variant="default"
      />
    </aside>
  );
}

interface RailItemProps {
  active: boolean;
  label: string;
  tooltipTitle: string;
  tooltipDesc: string;
  tooltipLabel?: string;
  onClick: () => void;
  innerRef?: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}

/**
 * Rail button. The white tab itself is a single shared element in the rail
 * (it slides between items); this only handles the icon colour.
 */
function RailItem({ active, label, tooltipTitle, tooltipDesc, tooltipLabel, onClick, innerRef, children }: RailItemProps) {
  return (
    <div ref={innerRef} className="relative flex items-center w-full group h-[44px] pl-2">
      <button
        onClick={onClick}
        aria-label={label}
        className={`relative z-10 w-full h-full flex items-center justify-center transition-colors duration-500 ease-out cursor-pointer ${
          active ? 'text-zinc-900' : 'text-zinc-500 hover:text-white'
        }`}
      >
        {children}
      </button>

      {/* Floating Tooltip */}
      {!active && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900 text-white text-[10px] font-medium rounded-lg whitespace-nowrap shadow-xl opacity-0 translate-x-1 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 z-[100] flex flex-col items-start border border-zinc-800">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{tooltipTitle}</span>
          <span className="text-[11px] font-semibold text-white">{tooltipLabel ?? label}</span>
          <span className="text-[9px] text-zinc-400 font-normal">{tooltipDesc}</span>
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-zinc-900" />
        </div>
      )}
    </div>
  );
}

