export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
