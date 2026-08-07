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
    <div className={`fixed md:static inset-y-0 left-0 w-[178px] h-full flex flex-col shrink-0 py-6 z-50 border-r border-[#d4c4b7] bg-[#efe7d5] md:bg-transparent transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Mobile close button */}
      <div className="md:hidden flex justify-end px-3 pb-2">
        <button onClick={onClose} className="p-1 rounded-md text-[#4a3c31] hover:bg-[#E3CCB2]/40 cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-3 flex justify-center">
        <Logo className="w-10 h-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <nav className="space-y-0.5">
          {sidebarMenu.map((item) => {
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenu === item.name || (expandedMenu === null && isActive);
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.name}>
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[10px] transition-all ${
                    isActive && !hasChildren
                      ? 'bg-gray-200/80 text-[#1F1D1C] font-bold'
                      : isActive && hasChildren
                      ? 'bg-gray-200/60 text-[#1F1D1C] font-bold'
                      : 'text-[#4B5563] font-medium hover:bg-gray-200/50 hover:text-[#1F1D1C]'
                  }` }
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={15} className={isActive ? 'text-[#1F1D1C] shrink-0' : 'shrink-0'} />
                    <span className="text-[10px] tracking-wide leading-tight text-left">{item.name}</span>
                  </div>
                  {hasChildren && (
                    <AltArrowDown
                      size={10}
                      className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* Children dropdown */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-0.5 space-y-0.5 pl-3">
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
                          className={`w-full text-left px-2 py-1 rounded-[8px] text-[9px] transition-all ${
                            childActive
                              ? 'bg-gray-200/90 text-[#1F1D1C] font-bold'
                              : 'text-[#6B7280] hover:bg-gray-200/50 hover:text-[#1F1D1C]'
                          }`}
                        >
                          {child.name}
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


    </div>
  );
}

