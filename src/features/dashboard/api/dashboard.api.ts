import { apiClient } from '@/services/api/client';
import type { DashboardMetric, DashboardSummary } from '../types/dashboard.types';

export const dashboardApi = {
  /**
   * Fetch executive summary metrics
   */
  async getSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
      return response.data;
    } catch {
      // Fallback data
      return {
        adr: 685,
        revPar: 534,
        occupancy: 78,
        totalRevenue: 2840000,
        activeGuests: 342,
      };
    }
  },

  /**
   * Fetch key performance indicators
   */
  async getMetrics(): Promise<DashboardMetric[]> {
    try {
      const response = await apiClient.get<DashboardMetric[]>('/dashboard/metrics');
      return response.data;
    } catch {
      return [
        { id: '1', label: 'ADR', value: '$685', change: 4.8, isPositive: true },
        { id: '2', label: 'RevPAR', value: '$534', change: 8.2, isPositive: true },
        { id: '3', label: 'Occupancy', value: '78%', change: 2.1, isPositive: true },
        { id: '4', label: 'Total Revenue', value: '$2.84M', change: 11.5, isPositive: true },
      ];
    }
  },
};
