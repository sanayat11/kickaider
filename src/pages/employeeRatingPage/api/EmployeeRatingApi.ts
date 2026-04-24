import { apiFetch } from '@/shared/api/baseApi';

export type RatingGroupBy = 'DAY' | 'WEEK' | 'MONTH';

export type RatingRequest = {
  employeeId?: number;
  departmentId?: number;
  from: string;
  to: string;
  date: string;
  groupBy: RatingGroupBy;
  onlyWorkTime: boolean;
  page: number;
  size: number;
};

export type RatingApiItem = {
  employeeId: number;
  employeeName: string;
  totalActiveTime: number;
  totalProductiveTime: number;
  totalNonProductiveTime: number;
  productivityPercentage: number;
  rank: number;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: {
    message?: string;
  };
  timestamp?: string;
};

const unwrapResponse = <T,>(response: T | ApiEnvelope<T>): T => {
  if (
    response &&
    typeof response === 'object' &&
    'data' in (response as Record<string, unknown>)
  ) {
    return ((response as ApiEnvelope<T>).data ?? null) as T;
  }

  return response as T;
};

export const fetchEmployeeRating = async (
  payload: RatingRequest,
): Promise<RatingApiItem[]> => {
  const response = await apiFetch<ApiEnvelope<RatingApiItem[]> | RatingApiItem[]>(
    'reports/rating',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  return unwrapResponse<RatingApiItem[]>(response) ?? [];
};