import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { PortalRailSidebar } from './PortalRailSidebar';
import { PortalProvider } from '../../context/PortalContext';
import { DashboardDrawerProvider } from '../../features/dashboard/context/DashboardDrawerContext';
import { DashboardDrawer } from '../../features/dashboard/components/DashboardDrawer';

export function MasterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (path: string) => {
    // If it's the exact same full path including query parameters, do nothing
    const currentFullPath = location.pathname + location.search;
    if (path === currentFullPath) return;
    navigate(path);
  };

  return (
    <PortalProvider>
      <DashboardDrawerProvider>
        <div 
          className="flex h-screen w-full overflow-hidden relative text-zinc-900 bg-background"
        >
        
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Dual Sidebar Container: Sidebar 1 (Portal Icon Rail) + Sidebar 2 (Menu Navigation) */}
        <div 
          className={`fixed md:static inset-y-0 left-0 flex h-full shrink-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <PortalRailSidebar 
            onNavigate={handleNavigate} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          <Sidebar 
            onNavigate={handleNavigate} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        </div>

        <main className="flex-1 overflow-hidden relative z-10 flex flex-col h-full">
          {/* Mobile Top Navigation Bar */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-border/60 bg-card/90 backdrop-blur-md sticky top-0 z-30 w-full shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-zinc-800 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-zinc-800">SOSEI PORTFOLIO</span>
            <div className="w-8" />
          </div>

          <div className="w-full h-full max-w-[1920px] mx-auto flex flex-col min-h-0">
            {/* Renders the matched child route component */}
            <Outlet />
          </div>
        </main>

        <DashboardDrawer />
      </div>
    </DashboardDrawerProvider>
    </PortalProvider>
  );
}
