export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  period?: string;
  isPositive?: boolean;
}

export interface NationalityBreakdown {
  country: string;
  percentage: number;
  flag?: string;
  guestCount?: number;
}

export interface OccupancyByRoom {
  roomType: string;
  occupancyRate: number;
  revenue: number;
  trend: string;
}

export interface DashboardSummary {
  adr: number;
  revPar: number;
  occupancy: number;
  totalRevenue: number;
  activeGuests: number;
}
