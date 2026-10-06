import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type PortalId = 'hospitality' | 'sanctuary' | 'fnb-experience' | 'design';

export const PORTAL_OVERVIEW_PATHS: Record<PortalId, string> = {
  hospitality: '/dashboard',
  sanctuary: '/dashboard/spa',
  'fnb-experience': '/dashboard/experience/fnb',
  design: '/dashboard/development',
};

export const PORTAL_LABELS: Record<PortalId, string> = {
  hospitality: 'Hospitality',
  sanctuary: 'Sanctuary',
  'fnb-experience': 'Experiences & F&B',
  design: 'Design',
};

interface PortalContextValue {
  activePortal: PortalId;
  setActivePortal: (portal: PortalId) => void;
  getGlobalOverviewPath: (portalId?: PortalId) => string;
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [activePortal, setActivePortal] = useState<PortalId>(() => {
    const saved = localStorage.getItem('sosei_active_portal');
    if (saved === 'sanctuary' || saved === 'fnb-experience' || saved === 'design' || saved === 'hospitality') {
      return saved;
    }
    return 'hospitality';
  });

  // Automatically sync active portal if user directly visits specific portal URLs
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/dashboard/spa')) {
      setActivePortal('sanctuary');
    } else if (path.startsWith('/dashboard/experience')) {
      setActivePortal('fnb-experience');
    } else if (path.startsWith('/dashboard/development')) {
      setActivePortal('design');
    }
  }, [location.pathname]);

  const handleSetActivePortal = (portal: PortalId) => {
    setActivePortal(portal);
    localStorage.setItem('sosei_active_portal', portal);
  };

  const getGlobalOverviewPath = (portalId?: PortalId) => {
    const target = portalId || activePortal;
    return PORTAL_OVERVIEW_PATHS[target] || '/dashboard';
  };

  return (
    <PortalContext.Provider
      value={{
        activePortal,
        setActivePortal: handleSetActivePortal,
        getGlobalOverviewPath,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    return {
      activePortal: 'hospitality' as PortalId,
      setActivePortal: () => {},
      getGlobalOverviewPath: (id?: PortalId) => PORTAL_OVERVIEW_PATHS[id || 'hospitality'] || '/dashboard',
    };
  }
  return context;
}
