import { apiFetch } from '@/shared/api/baseApi';

export type DayOfWeek =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY'
  | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export type ScheduleTimeValue = TimeObject | string;

export interface ScheduleDay {
  dayOfWeek: DayOfWeek;
  workingDay: boolean;
  startTime?: ScheduleTimeValue;
  endTime?: ScheduleTimeValue;
  breakStart?: ScheduleTimeValue;
  breakEnd?: ScheduleTimeValue;
}

export interface CompanySchedulePayload {
  days: ScheduleDay[];
}

export interface DepartmentApiItem {
  id: number;
  name: string;
  companyId?: number;
  createdAt?: string;
}

export interface EmployeeApiItem {
  id: number;
  userId: number;
  companyId: number;
  departmentId: number;
  position?: string;
  hireDate?: string;
  employeeNumber?: string;
  status?: 'ACTIVE' | 'BLOCKED' | string;
  createdAt?: string;
}

export interface CompanyScheduleApiResponse {
  success?: boolean;
  data?:
    | { days?: ScheduleDay[]; weeklySchedule?: Record<string, unknown> }
    | ScheduleDay[]
    | Record<string, unknown>;
  error?: unknown;
}

export interface DepartmentsApiResponse {
  success?: boolean;
  data?: DepartmentApiItem[];
  error?: unknown;
}

export interface EmployeesApiResponse {
  success?: boolean;
  data?: EmployeeApiItem[];
  error?: unknown;
}

export interface EmployeeScheduleTimePayload {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface SetEmployeeScheduleRequest {
  date: string;
  workingDay: boolean;
  startTime?: EmployeeScheduleTimePayload;
  endTime?: EmployeeScheduleTimePayload;
  breakStart?: EmployeeScheduleTimePayload;
  breakEnd?: EmployeeScheduleTimePayload;
}

export const scheduleApi = {
  getCompanyDepartments: (companyId: number) =>
    apiFetch<DepartmentsApiResponse>(`departments/company/${companyId}`, {
      method: 'GET',
    }),

  getCompanyEmployees: (companyId: number) =>
    apiFetch<EmployeesApiResponse>(`employees/company/${companyId}`, {
      method: 'GET',
    }),

  getCompanySchedule: () =>
    apiFetch<CompanyScheduleApiResponse>('schedules/company', { method: 'GET' }),

  setCompanySchedule: (payload: CompanySchedulePayload) =>
    apiFetch<CompanyScheduleApiResponse>('schedules/company', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getDepartmentSchedule: (departmentId: number) =>
    apiFetch<CompanyScheduleApiResponse>(`schedules/department/${departmentId}`, {
      method: 'GET',
    }),

  setDepartmentSchedule: (departmentId: number, payload: CompanySchedulePayload) =>
    apiFetch<CompanyScheduleApiResponse>(`schedules/department/${departmentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getEmployeeSchedule: (employeeId: number, date: string) =>
    apiFetch<CompanyScheduleApiResponse | Record<string, unknown>>(
      `schedules/employee/${employeeId}?date=${encodeURIComponent(date)}`,
      {
        method: 'GET',
      },
    ),

  setEmployeeSchedule: (employeeId: number, payload: SetEmployeeScheduleRequest) =>
    apiFetch<CompanyScheduleApiResponse | Record<string, unknown>>(
      `schedules/employee/${employeeId}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),
};
