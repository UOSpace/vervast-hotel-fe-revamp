import { APP_CONFIG } from '@/constants/config';

export const storage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getUser<T = unknown>(): T | null {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  },

  setUser<T>(user: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
  },

  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};
