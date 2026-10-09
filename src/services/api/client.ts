import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { APP_CONFIG } from '@/constants/config';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.vervast.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: APP_CONFIG.API_TIMEOUT,
});

// Setup interceptors
setupInterceptors(apiClient);
