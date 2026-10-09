import { apiClient } from '@/services/api/client';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/auth.types';

export const authApi = {
  /**
   * Login user
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    // If backend is available, use apiClient.post('/auth/login', payload)
    // Here we preserve the local fallback simulation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (payload.email === 'vervast@vervast.com' && payload.password === 'password') {
          resolve({
            token: 'mock-jwt-token-vervast-123',
            user: {
              id: '1',
              email: payload.email,
              name: 'Vervast Admin',
              role: 'Administrator',
            },
          });
        } else {
          reject({
            response: {
              data: {
                message: 'Invalid email or password.',
              },
            },
          });
        }
      }, 800);
    });
  },

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token-vervast-new',
          user: {
            id: '2',
            email: payload.email,
            name: payload.name,
            role: 'Staff',
          },
        });
      }, 800);
    });
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};
