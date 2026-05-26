import { apiClient } from './api.client';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  /**
   * Login user
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (payload.email === 'vervast@vervast.com' && payload.password === 'password') {
          resolve({
            token: 'mock-jwt-token-vervast-123',
            user: {
              id: '1',
              email: payload.email,
              name: 'Vervast Admin',
            }
          });
        } else {
          reject({
            response: {
              data: {
                message: 'Invalid email or password.'
              }
            }
          });
        }
      }, 800);
    });
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }
};
