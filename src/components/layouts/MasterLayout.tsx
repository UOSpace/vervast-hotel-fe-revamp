import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import bgImage from '../../assets/bg/background.png';
import { SakuraTransition, useSakuraTransition } from '../../features/dashboard/components/SakuraTransition';
import { DashboardDrawerProvider } from '../../features/dashboard/context/DashboardDrawerContext';
import { DashboardDrawer } from '../../features/dashboard/components/DashboardDrawer';

export function MasterLayout() {
  const { phase, trigger } = useSakuraTransition();
  const navigate = useNavigate();
  const location = useLocation();

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
        className="flex h-screen w-full overflow-hidden relative text-[#4a3c31]"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <SakuraTransition isActive={phase !== 'idle'} phase={phase} />
      <Sidebar onNavigate={handleNavigate} />

      <main className="flex-1 overflow-hidden relative z-10 flex flex-col h-full">
        <div className="w-full h-full max-w-[1920px] mx-auto">
          {/* Renders the matched child route component */}
          <Outlet />
        </div>
      </main>

      <DashboardDrawer />
    </div>
    </DashboardDrawerProvider>
  );
}
