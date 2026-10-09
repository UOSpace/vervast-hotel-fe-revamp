import { useState, useEffect } from 'react';
import { storage } from '@/services/storage/storage';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

let authState: AuthState = {
  user: storage.getUser<User>(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
};

const listeners = new Set<(state: AuthState) => void>();

function notify() {
  listeners.forEach((listener) => listener({ ...authState }));
}

export const authStore = {
  getState(): AuthState {
    return { ...authState };
  },

  setAuth(user: User, token: string): void {
    storage.setUser(user);
    storage.setToken(token);
    authState = {
      user,
      token,
      isAuthenticated: true,
    };
    notify();
  },

  logout(): void {
    storage.clearAuth();
    authState = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    notify();
  },

  subscribe(listener: (state: AuthState) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

/**
 * Hook to access and subscribe to auth store
 */
export function useAuthStore() {
  const [state, setState] = useState<AuthState>(authStore.getState());

  useEffect(() => {
    return authStore.subscribe(setState);
  }, []);

  return {
    ...state,
    setAuth: authStore.setAuth,
    logout: authStore.logout,
  };
}
