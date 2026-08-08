import { useCallback } from 'react';

interface SakuraTransitionProps {
  isActive: boolean;
  phase: 'idle' | 'falling' | 'peak' | 'clearing';
}

export function SakuraTransition(_props: SakuraTransitionProps) {
  return null;
}

// Hook for orchestrating page transition instantly without petal animation
export function useSakuraTransition() {
  const trigger = useCallback((onSwitch: () => void) => {
    onSwitch?.();
  }, []);

  return { phase: 'idle' as const, trigger };
}
