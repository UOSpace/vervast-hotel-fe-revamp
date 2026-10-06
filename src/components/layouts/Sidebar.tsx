import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSidebarMenu, type MenuItem } from '../../config/menu';
import { AltArrowDown, Palette } from '@solar-icons/react';
import { Logo } from '../ui/Logo';
import { usePortal, PORTAL_LABELS } from '../../context/PortalContext';

export function Sidebar({ 
  onNavigate, 
  onClose,
  className = ''
}: { 
  onNavigate?: (path: string) => void; 
  isOpen?: boolean; 
  onClose?: () => void; 
  className?: string;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { activePortal, getGlobalOverviewPath } = usePortal();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Group View');

  const toggleMenu = (name: string) => {
    setExpandedMenu(prev => prev === name ? null : name);
  };

  const isChildActive = (child: { name: string; path: string; isDynamicOverview?: boolean }) => {
    const currentPath = location.pathname + location.search;
    if (child.isDynamicOverview) {
      const overviewPath = getGlobalOverviewPath(activePortal);
      if (location.pathname === overviewPath) return true;
      if (activePortal === 'hospitality' && (location.pathname === '/dashboard' || currentPath === '/dashboard?view=all')) return true;
      return false;
    }
    if (child.path.includes('?')) {
      return currentPath === child.path;
    }
    return location.pathname === child.path || location.pathname.startsWith(child.path + '/');
  };

  const menuItems = getSidebarMenu(activePortal);

  const isMenuActive = (item: MenuItem) => {
    if (item.name === 'Group View') {
      const overviewPath = getGlobalOverviewPath(activePortal);
      if (location.pathname === overviewPath) return true;
      if (
        location.pathname === '/dashboard' ||
        location.pathname === '/dashboard/spa' ||
        location.pathname === '/dashboard/experience/fnb' ||
        location.pathname === '/dashboard/development'
      ) {
        return true;
      }
    }
    if (item.path === '/dashboard' && !item.children) return location.pathname === '/dashboard';
    if (location.pathname === item.path && !location.search) return true;
    if (item.children) {
      return item.children.some(child => isChildActive(child));
    }
    return item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/');
  };

  return (
    <aside 
      className={`w-[180px] h-full flex flex-col shrink-0 z-40 border-r border-border/60 bg-card/95 backdrop-blur-md text-foreground select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="h-[68px] px-3 flex flex-col items-center justify-center shrink-0 border-b border-border/30 relative">
        {/* Mobile close button */}
        <button 
          onClick={onClose} 
          className="md:hidden absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          aria-label="Close sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <Logo className="w-8 h-auto opacity-90" />
      </div>

      {/* Navigation Menu or Design Empty State */}
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
        {/* Active Portal Label - plain text, left-aligned, no dot, no background */}
        <div className="px-2.5 pt-1 pb-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 select-none">
            {PORTAL_LABELS[activePortal]}
          </p>
        </div>

        {activePortal === 'design' ? (
          <div className="flex flex-col items-center justify-center p-4 text-center select-none space-y-2 animate-fade-in pt-8">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-200/60 dark:border-zinc-700">
              <Palette size={16} />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200">Design Portal</p>
              <p className="text-[9px] text-zinc-400 mt-0.5 leading-relaxed">
                Under development.<br />No sub-menus available.
              </p>
            </div>
          </div>
        ) : (
          <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenu === item.name || (expandedMenu === null && isActive);
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.name);
                    } else {
                      if (onNavigate) {
                        onNavigate(item.path);
                      } else {
                        navigate(item.path);
                      }
                      if (onClose) onClose();
                    }
                  }}
                  className={`w-full h-[34px] flex items-center justify-between px-2.5 rounded-xl text-[11px] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900/[0.06] text-zinc-900 font-semibold border border-zinc-900/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/[0.025] font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <Icon size={15} className={`shrink-0 transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                    <span className="truncate tracking-tight text-left">{item.name}</span>
                  </div>
                  {hasChildren && (
                    <AltArrowDown
                      size={10}
                      className={`shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-zinc-800' : 'text-zinc-400'
                      }`}
                    />
                  )}
                </button>

                {/* Submenu Dropdown */}
                {hasChildren && isExpanded && (
                  <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l border-zinc-200/60 pl-2">
                    {item.children!.map((child) => {
                      const targetPath = child.isDynamicOverview ? getGlobalOverviewPath(activePortal) : child.path;
                      const childActive = isChildActive(child);
                      return (
                        <button
                          key={child.name}
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate(targetPath);
                            } else {
                              navigate(targetPath);
                            }
                            if (onClose) onClose();
                          }}
                          className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg text-[10px] transition-all duration-150 cursor-pointer ${
                            childActive
                              ? 'bg-zinc-900/[0.05] text-zinc-900 font-semibold'
                              : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-900/[0.02] font-normal'
                          }`}
                        >
                          <span className="truncate block">{child.name}</span>
                          {childActive && (
                            <span className="w-1 h-1 rounded-full bg-zinc-700 opacity-60 shrink-0 ml-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        )}
      </div>

    </aside>
  );
}


