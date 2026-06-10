import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type LoginPayload } from '../../../services/auth.service';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async (payload: LoginPayload) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(payload);
      localStorage.setItem('auth_token', response.token);
      // Redirect to portal selection after successful login
      navigate('/portal');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
