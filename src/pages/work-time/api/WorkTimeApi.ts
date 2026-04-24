import { apiFetch } from '@/shared/api/baseApi';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
    timestamp?: string;
    path?: string;
    errors?: Record<string, string[]>;
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

export type RawEmployee = {
  id: number;
  departmentId?: number;
  departmentName?: string;
  position?: string;
  employeeNumber?: string;
  status?: string;
  hostname?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  user?: {
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type WorkTimeDashboardRequest = {
  fromDate: string;
  toDate: string;
  employeeId?: number;
  departmentId?: number;
  onlyWorkTime: boolean;
};

export type WorkTimeSummary = {
  lateMinutes: number;
  lateCount: number;
  earlyLeaveMinutes: number;
  absenceCount: number;
  workedMinutes: number;
  sickLeaveCount: number;
  businessTripCount: number;
  workingDayCount: number;
  averageDayMinutes: number;
  vacationCount: number;
};

export type WorkTimeDashboardItem = {
  date: string;
  employeeId: number;
  employeeNumber?: string;
  employeeName: string;
  departmentName?: string;
  firstActivityAt: string | null;
  lastActivityAt: string | null;
  lateMinutes: number;
  lateCount: number;
  earlyLeaveMinutes: number;
  workedMinutes: number;
  dayStatus: string;
};

export type WorkTimeDashboardResponse = {
  fromDate: string;
  toDate: string;
  onlyWorkTime: boolean;
  summary: WorkTimeSummary;
  items: WorkTimeDashboardItem[];
};

export const fetchCompanyEmployees = async (
  companyId: number,
): Promise<RawEmployee[]> => {
  const response = await apiFetch<ApiEnvelope<RawEmployee[]> | RawEmployee[]>(
    `employees/company/${companyId}`,
    {
      method: 'GET',
    },
  );

  return unwrapResponse<RawEmployee[]>(response) ?? [];
};

export const fetchWorkTimeDashboard = async (
  payload: WorkTimeDashboardRequest,
): Promise<WorkTimeDashboardResponse> => {
  const response = await apiFetch<
    ApiEnvelope<WorkTimeDashboardResponse> | WorkTimeDashboardResponse
  >('reports/work-time', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return unwrapResponse<WorkTimeDashboardResponse>(response);
};