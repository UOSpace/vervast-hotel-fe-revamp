import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import type { LoginPayload, RegisterPayload } from '../types/auth.types';
import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authState = useAuthStore();

  const login = async (payload: LoginPayload) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login(payload);
      authState.setAuth(response.user, response.token);
      navigate('/portal');
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to login. Please try again.'
          : 'Failed to login. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.register(payload);
      authState.setAuth(response.user, response.token);
      navigate('/portal');
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Registration failed.'
          : 'Registration failed.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authState.logout();
    navigate('/login');
  };

  return {
    ...authState,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
