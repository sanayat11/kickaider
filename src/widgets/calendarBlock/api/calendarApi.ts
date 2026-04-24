import { apiFetch } from '@/shared/api/baseApi';

export type DayOffType = 'VACATION' | 'SICK' | 'TRIP' | 'ABSENCE';

// ─── Day Offs ────────────────────────────────────────────────────────────────

export interface DayOffApiItem {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: DayOffType;
  comment?: string | null;
  createdAt?: string;
}

export interface DayOffsApiResponse {
  success?: boolean;
  data?: DayOffApiItem[] | { dayOffs?: DayOffApiItem[]; content?: DayOffApiItem[]; total?: number };
  error?: unknown;
}

// ─── Calendar Entries ─────────────────────────────────────────────────────────

export interface CalendarEntryApiItem {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: DayOffType;
  comment?: string | null;
  createdAt?: string;
}

export interface CalendarEntriesApiResponse {
  success?: boolean;
  data?:
    | CalendarEntryApiItem[]
    | { entries?: CalendarEntryApiItem[]; content?: CalendarEntryApiItem[]; total?: number };
  error?: unknown;
}

export interface CreateEntryPayload {
  employeeId: number;
  startDate: string;
  endDate: string;
  type: DayOffType;
  comment?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const calendarApi = {
  // Day Offs (kept for reference)
  getCompanyDayOffs: (from: string, to: string) =>
    apiFetch<DayOffsApiResponse>(
      `calendar/companies/me/day-offs?from=${from}&to=${to}`,
      { method: 'GET' },
    ),

  createDayOff: (
    employeeId: number,
    payload: { startDate: string; endDate: string; type: DayOffType; comment?: string },
  ) =>
    apiFetch<{ success: boolean; data: DayOffApiItem }>(
      `calendar/employees/${employeeId}/day-offs`,
      { method: 'POST', body: JSON.stringify(payload) },
    ),

  deleteDayOff: (id: number) =>
    apiFetch<unknown>(`calendar/day-offs/${id}`, { method: 'DELETE' }),

  // Calendar Entries (primary)
  getCompanyEntries: (from: string, to: string) =>
    apiFetch<CalendarEntriesApiResponse>(
      `calendar/companies/me/entries?from=${from}&to=${to}`,
      { method: 'GET' },
    ),

  getEmployeeEntries: (employeeId: number, from: string, to: string) =>
    apiFetch<CalendarEntriesApiResponse>(
      `calendar/employees/${employeeId}/entries?from=${from}&to=${to}`,
      { method: 'GET' },
    ),

  createEntry: (payload: CreateEntryPayload) =>
    apiFetch<{ success: boolean; data: CalendarEntryApiItem }>('calendar/entries', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  deleteEntry: (entryId: number) =>
    apiFetch<unknown>(`calendar/entries/${entryId}`, { method: 'DELETE' }),
};
