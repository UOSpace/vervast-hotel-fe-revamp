import React from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from '@/config/theme-provider';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vervast-hotel-theme">
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
};
