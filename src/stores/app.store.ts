import { useState, useEffect } from 'react';

interface AppState {
  sidebarOpen: boolean;
  selectedPortal: string;
  isDummyMode: boolean;
}

let appState: AppState = {
  sidebarOpen: false,
  selectedPortal: 'portfolio',
  isDummyMode: import.meta.env.VITE_DATA === 'dummy',
};

const listeners = new Set<(state: AppState) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...appState }));
}

export const appStore = {
  getState(): AppState {
    return { ...appState };
  },

  setSidebarOpen(open: boolean): void {
    appState.sidebarOpen = open;
    notify();
  },

  toggleSidebar(): void {
    appState.sidebarOpen = !appState.sidebarOpen;
    notify();
  },

  setSelectedPortal(portal: string): void {
    appState.selectedPortal = portal;
    notify();
  },

  subscribe(listener: (state: AppState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/**
 * Hook to access and subscribe to app store
 */
export function useAppStore() {
  const [state, setState] = useState<AppState>(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(setState);
  }, []);

  return {
    ...state,
    setSidebarOpen: appStore.setSidebarOpen,
    toggleSidebar: appStore.toggleSidebar,
    setSelectedPortal: appStore.setSelectedPortal,
  };
}
