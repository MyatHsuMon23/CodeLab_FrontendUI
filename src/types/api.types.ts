export class ApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;

  constructor(message: string, status?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  currentPage: number;
  from: number;
  to: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface QueryParams {
  [key: string]: string | string[] | number | boolean | null | undefined;
}

export type Status = 'error' | 'warning' | 'success' | 'info';
