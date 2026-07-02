import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SakuraTransition, useSakuraTransition } from '../../features/dashboard/components/SakuraTransition';
import { DashboardDrawerProvider } from '../../features/dashboard/context/DashboardDrawerContext';
import { DashboardDrawer } from '../../features/dashboard/components/DashboardDrawer';

export function MasterLayout() {
  const { phase, trigger } = useSakuraTransition();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (path: string) => {
    // If it's the exact same path, do nothing
    if (path === location.pathname) return;
    // Trigger transition and navigate at the peak
    trigger(() => {
      navigate(path);
    });
  };

  return (
    <DashboardDrawerProvider>
      <div 
        className="flex h-screen w-full overflow-hidden relative text-[#4a3c31] bg-background"
      >
        <SakuraTransition isActive={phase !== 'idle'} phase={phase} />
        
        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-[#4a3c31]/30 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar 
          onNavigate={handleNavigate} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1 overflow-hidden relative z-10 flex flex-col h-full">
          {/* Mobile Top Navigation Bar */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-[#d4c4b7]/50 bg-[#f3eae1]/80 backdrop-blur-md sticky top-0 z-30 w-full shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 text-[#4a3c31] hover:bg-[#E3CCB2]/40 rounded-lg cursor-pointer transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#4a3c31]">SOSEI PORTFOLIO</span>
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
  );
}
