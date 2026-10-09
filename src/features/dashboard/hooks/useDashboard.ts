import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardMetric, DashboardSummary } from '../types/dashboard.types';

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, summaryData] = await Promise.all([
        dashboardApi.getMetrics(),
        dashboardApi.getSummary(),
      ]);
      setMetrics(metricsData);
      setSummary(summaryData);
    } catch (err: unknown) {
      setError('Failed to fetch dashboard analytics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    metrics,
    summary,
    isLoading,
    error,
    refetch: fetchDashboardData,
  };
}
