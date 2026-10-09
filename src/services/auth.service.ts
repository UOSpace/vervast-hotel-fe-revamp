import { authApi } from '@/features/auth/api/auth.api';
export type { LoginPayload, AuthResponse } from '@/features/auth/types/auth.types';

export const authService = {
  login: authApi.login,
  getProfile: authApi.getProfile,
  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },
};
