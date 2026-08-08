import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sidebarMenu } from '../../config/menu';
import { AltArrowDown } from '@solar-icons/react';
import { Logo } from '../ui/Logo';

export function Sidebar({ 
  onNavigate, 
  isOpen, 
  onClose 
}: { 
  onNavigate?: (path: string) => void; 
  isOpen?: boolean; 
  onClose?: () => void; 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Group View');

  const toggleMenu = (name: string) => {
    setExpandedMenu(prev => prev === name ? null : name);
  };

  const isMenuActive = (item: typeof sidebarMenu[0]) => {
    const currentPath = location.pathname + location.search;
    if (item.path === '/dashboard' && !item.children) return location.pathname === '/dashboard';
    if (location.pathname === item.path && !location.search) return true;
    if (item.children) {
      return item.children.some(child => {
        if (child.path.includes('?')) {
          return currentPath === child.path || (location.pathname === '/dashboard' && !location.search && child.path.endsWith('view=all'));
        }
        return location.pathname.startsWith(child.path);
      });
    }
    return item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/');
  };

  return (
    <aside 
      className={`fixed md:static inset-y-0 left-0 w-[180px] h-full flex flex-col shrink-0 z-50 border-r border-border/60 bg-card/95 backdrop-blur-md text-foreground transition-transform duration-300 ease-in-out select-none md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end px-2 pt-2">
        <button 
          onClick={onClose} 
          className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          aria-label="Close sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Brand Header */}
      <div className="pt-4 pb-3 px-3 flex flex-col items-center justify-center shrink-0 border-b border-border/30 mb-1">
        <Logo className="w-10 h-auto opacity-90" />
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar space-y-0.5">
        <nav className="space-y-0.5">
          {sidebarMenu.map((item) => {
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenu === item.name || (expandedMenu === null && isActive);
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.name} className="space-y-0.5">
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-foreground/5 text-foreground font-semibold border-l-2 border-foreground -ml-0.5 pl-2'
                      : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <Icon size={15} className={`shrink-0 ${isActive ? 'text-foreground' : 'text-muted-foreground/70'}`} />
                    <span className="truncate tracking-tight text-left">{item.name}</span>
                  </div>
                  {hasChildren && (
                    <AltArrowDown
                      size={10}
                      className={`shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-foreground' : 'text-muted-foreground/50'
                      }`}
                    />
                  )}
                </button>

                {/* Submenu Dropdown */}
                {hasChildren && isExpanded && (
                  <div className="ml-3.5 mt-0.5 mb-1 space-y-0.5 border-l border-border/40 pl-2.5">
                    {item.children!.map((child) => {
                      const currentPath = location.pathname + location.search;
                      const childActive = currentPath === child.path || (location.pathname === '/dashboard' && !location.search && child.path.endsWith('view=all'));
                      return (
                        <button
                          key={child.name}
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate(child.path);
                            } else {
                              navigate(child.path);
                            }
                            if (onClose) onClose();
                          }}
                          className={`w-full text-left px-2 py-1 rounded text-[10px] transition-all duration-150 cursor-pointer ${
                            childActive
                              ? 'bg-foreground/8 text-foreground font-bold'
                              : 'text-muted-foreground/70 hover:bg-foreground/[0.03] hover:text-foreground font-medium'
                          }`}
                        >
                          <span className="truncate block">{child.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}


