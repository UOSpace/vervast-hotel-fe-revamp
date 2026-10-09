import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { storage } from '../storage/storage';

export function setupInterceptors(instance: AxiosInstance): AxiosInstance {
  // Request Interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        storage.clearAuth();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
