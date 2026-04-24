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
  position?: string;
  employeeNumber?: string;
  status?: string;
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

export type AttendanceRequest = {
  employeeId: number;
  date: string;
};

export type AttendanceResponse = {
  employeeId: number;
  employeeName?: string;
  date: string;
  workingDay: boolean;
  calendarStatus: string;
  calendarSource: string;
  plannedMinutes: number;
  actualMinutes: number;
  overtimeMinutes: number;
  lateMinutes: number;
  lateCount: number;
  earlyLeaveMinutes: number;
  firstActivityAt: string | null;
  lastActivityAt: string | null;
};

export type TimelineRequest = {
  employeeId: number;
  date: string;
};

export type TimelineItem = {
  startTime: string;
  endTime: string;
  durationSeconds: number;
  type: string;
  state: string;
  applicationName?: string;
  windowTitle?: string;
  domain?: string;
  url?: string;
  messengerChatName?: string;
  screenshotId?: string;
  screenshotUrl?: string;
  title?: string;
  details?: string;
};

export type TimelineResponse = {
  employeeId: number;
  employeeName?: string;
  date: string;
  timezone: string;
  onlyWorkTime: boolean;
  items: TimelineItem[];
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

export const fetchCompanyDepartments = async (
  companyId: number,
): Promise<DepartmentItem[]> => {
  const response = await apiFetch<ApiEnvelope<DepartmentItem[]> | DepartmentItem[]>(
    `departments/company/${companyId}`,
    {
      method: 'GET',
    },
  );

  return unwrapResponse<DepartmentItem[]>(response) ?? [];
};

export const fetchAttendanceReport = async (
  payload: AttendanceRequest,
): Promise<AttendanceResponse> => {
  const response = await apiFetch<
    ApiEnvelope<AttendanceResponse> | AttendanceResponse
  >('reports/attendance', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return unwrapResponse<AttendanceResponse>(response);
};

export const fetchTimelineReport = async (
  payload: TimelineRequest,
): Promise<TimelineResponse> => {
  const response = await apiFetch<
    ApiEnvelope<TimelineResponse> | TimelineResponse
  >('reports/timeline', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return unwrapResponse<TimelineResponse>(response);
};