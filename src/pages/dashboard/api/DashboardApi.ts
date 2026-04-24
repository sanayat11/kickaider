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
  employeeNumber?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  hostname?: string;
  user?: {
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type DepartmentItem = {
  id: number;
  name: string;
  companyId: number;
  createdAt?: string;
};

export type EfficiencyRequest = {
  employeeId?: number;
  departmentId?: number;
  from: string;
  to: string;
  date: string;
  groupBy: 'DAY' | 'WEEK' | 'MONTH';
  onlyWorkTime: boolean;
  page: number;
  size: number;
};

export type EfficiencyResponse = {
  employeeId?: number;
  from: string;
  to: string;
  totalActiveTime: number;
  productiveTime: number;
  neutralTime: number;
  nonProductiveTime: number;
  uncategorizedTime: number;
  idleTime: number;
  productivityPercentage: number;
  categoryBreakdown: Record<string, number>;
};

export type TopApplicationItem = {
  applicationName: string;
  processName: string;
  totalSeconds: number;
  productiveSeconds: number;
  neutralSeconds: number;
  nonProductiveSeconds: number;
  uncategorizedSeconds: number;
  productivePercentage: number;
  neutralPercentage: number;
  nonProductivePercentage: number;
  uncategorizedPercentage: number;
};

export const fetchCompanyEmployees = async (
  companyId: number,
): Promise<RawEmployee[]> => {
  const response = await apiFetch<ApiEnvelope<RawEmployee[]> | RawEmployee[]>(
    `employees/company/${companyId}`,
    { method: 'GET' },
  );

  return unwrapResponse<RawEmployee[]>(response) ?? [];
};

export const fetchCompanyDepartments = async (
  companyId: number,
): Promise<DepartmentItem[]> => {
  const response = await apiFetch<ApiEnvelope<DepartmentItem[]> | DepartmentItem[]>(
    `departments/company/${companyId}`,
    { method: 'GET' },
  );

  return unwrapResponse<DepartmentItem[]>(response) ?? [];
};

export const fetchEfficiencyReport = async (
  payload: EfficiencyRequest,
): Promise<EfficiencyResponse> => {
  const response = await apiFetch<ApiEnvelope<EfficiencyResponse> | EfficiencyResponse>(
    'reports/efficiency',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  return unwrapResponse<EfficiencyResponse>(response);
};

export const fetchCompanyTopApplications = async ({
  from,
  to,
  limit = 5,
}: {
  from: string;
  to: string;
  limit?: number;
}): Promise<TopApplicationItem[]> => {
  const query = new URLSearchParams({
    from,
    to,
    limit: String(limit),
  });

  const response = await apiFetch<
    | ApiEnvelope<TopApplicationItem[] | TopApplicationItem>
    | TopApplicationItem[]
    | TopApplicationItem
  >(`reports/activity/company/top-applications?${query.toString()}`, {
    method: 'GET',
  });

  const unwrapped = unwrapResponse<TopApplicationItem[] | TopApplicationItem>(response);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  return unwrapped ? [unwrapped] : [];
};