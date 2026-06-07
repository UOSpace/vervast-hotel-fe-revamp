import { createContext, useContext, useState, type ReactNode } from 'react';

export type DrawerType = 
  | 'LIVE_OVERVIEW' 
  | 'METRIC' 
  | 'ALERTS' 
  | 'GUEST_MOVEMENT' 
  | 'PORTFOLIO_PERFORMANCE' 
  | 'WORLD_MAP'
  | 'TOP_NATIONALITIES' 
  | 'SENTIMENT_SCORE'
  | 'GUEST_ARRIVALS'
  | 'GUEST_NEEDS'
  | 'NOTES_YESTERDAY'
  | 'JOURNEY_TIMELINE'
  | 'SPEND_OVERTIME'
  | 'GEO_MARKET'
  | 'MARKET_SEGMENT'
  | 'CHANNEL_DISTRIBUTION'
  | null;

export interface DrawerConfig {
  type: DrawerType;
  title: string;
  data?: any;
}

interface DashboardDrawerContextType {
  isOpen: boolean;
  config: DrawerConfig | null;
  openDrawer: (config: DrawerConfig) => void;
  closeDrawer: () => void;
}

const DashboardDrawerContext = createContext<DashboardDrawerContextType | undefined>(undefined);

export function DashboardDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DrawerConfig | null>(null);

  const openDrawer = (newConfig: DrawerConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    // Don't clear config immediately so exit animation looks smooth
    setTimeout(() => setConfig(null), 500);
  };

  return (
    <DashboardDrawerContext.Provider value={{ isOpen, config, openDrawer, closeDrawer }}>
      {children}
    </DashboardDrawerContext.Provider>
  );
}

export function useDashboardDrawer() {
  const context = useContext(DashboardDrawerContext);
  if (context === undefined) {
    throw new Error('useDashboardDrawer must be used within a DashboardDrawerProvider');
  }
  return context;
}
