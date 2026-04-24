import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  WorkSchedulesTab,
  Schedule,
  DepartmentData,
  EmployeeData,
  EmployeeDaySchedule,
} from './types';
import {
  scheduleApi,
  type DayOfWeek,
  type EmployeeApiItem,
  type EmployeeScheduleTimePayload,
  type ScheduleDay,
} from '../api/scheduleApi';
import { useAuthStore } from '@/shared/lib/model/AuthStore';

const ALL_DAYS: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const DAY_KEY: Record<DayOfWeek, string> = {
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
  SUNDAY: 'sun',
};

const KEY_TO_DAY: Record<string, DayOfWeek> = Object.fromEntries(
  Object.entries(DAY_KEY).map(([dayOfWeek, key]) => [key, dayOfWeek as DayOfWeek]),
);

const JS_DAY_TO_KEY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const JS_DAY_TO_DAY_OF_WEEK: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const defaultSchedule: Schedule = {
  startTime: '09:00',
  endTime: '18:00',
  lunchDuration: '12:00',
  workDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
};

const WORK_SCHEDULES_TAB_STORAGE_KEY = 'kickaider:workSchedules:activeTab';

const isWorkSchedulesTab = (value: unknown): value is WorkSchedulesTab =>
  value === 'company' || value === 'departments' || value === 'employees';

const getInitialWorkSchedulesTab = (): WorkSchedulesTab => {
  if (typeof window === 'undefined') return 'company';

  try {
    const stored = window.localStorage.getItem(WORK_SCHEDULES_TAB_STORAGE_KEY);
    return isWorkSchedulesTab(stored) ? stored : 'company';
  } catch {
    return 'company';
  }
};

type ApiScheduleDay = {
  dayOfWeek: DayOfWeek;
  workingDay: boolean;
  startTime: unknown;
  endTime: unknown;
  breakStart: unknown;
  breakEnd: unknown;
};

type DepartmentSummary = {
  id: number;
  name: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeHHmm = (value: string, fallback = '00:00') => {
  const match = String(value ?? '').trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return fallback;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return fallback;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallback;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const toHHmmss = (value: string) => `${normalizeHHmm(value)}:00`;

const timeToMinutes = (value: string) => {
  const [hour, minute] = normalizeHHmm(value).split(':').map(Number);
  return hour * 60 + minute;
};

const minutesToHHmm = (minutes: number) => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const addHour = (value: string) => minutesToHHmm(timeToMinutes(value) + 60);

const isDayOfWeek = (value: unknown): value is DayOfWeek =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(DAY_KEY, value);

const parseWorkingDay = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
};

const getApiMessage = (payload: unknown): string | null => {
  if (!isRecord(payload)) return null;

  if (typeof payload.message === 'string') return payload.message;

  if (isRecord(payload.error) && typeof payload.error.message === 'string') {
    return payload.error.message;
  }

  return null;
};

const assertApiSuccess = (payload: unknown) => {
  if (!isRecord(payload)) return;

  if (payload.success === false || payload.error) {
    throw new Error(getApiMessage(payload) ?? 'API returned unsuccessful response');
  }
};

const formatTime = (value: unknown, fallback = '09:00') => {
  if (typeof value === 'string') {
    return normalizeHHmm(value, fallback);
  }

  if (isRecord(value)) {
    const hour = value.hour;
    const minute = value.minute;

    if (typeof hour === 'number' && typeof minute === 'number') {
      return normalizeHHmm(
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        fallback,
      );
    }
  }

  return fallback;
};

const extractDays = (res: unknown): ApiScheduleDay[] => {
  const normalizeDays = (value: unknown): ApiScheduleDay[] => {
    if (!Array.isArray(value)) return [];

    return value
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item) => ({
        dayOfWeek: item.dayOfWeek as DayOfWeek,
        workingDay: parseWorkingDay(item.workingDay),
        startTime: item.startTime,
        endTime: item.endTime,
        breakStart: item.breakStart,
        breakEnd: item.breakEnd,
      }))
      .filter((day) => isDayOfWeek(day.dayOfWeek));
  };

  const normalizeWeeklySchedule = (value: unknown): ApiScheduleDay[] => {
    if (!isRecord(value)) return [];

    return ALL_DAYS
      .filter((day) => isRecord(value[day]))
      .map((day) => {
        const slot = value[day] as Record<string, unknown>;

        return {
          dayOfWeek: day,
          workingDay: parseWorkingDay(slot.workingDay),
          startTime: slot.startTime,
          endTime: slot.endTime,
          breakStart: slot.breakStart,
          breakEnd: slot.breakEnd,
        };
      });
  };

  const findDaysArray = (value: unknown, depth = 0): ApiScheduleDay[] => {
    if (depth > 4 || !value) return [];

    const direct = normalizeDays(value);
    if (direct.length > 0) return direct;

    const directWeekly = normalizeWeeklySchedule(value);
    if (directWeekly.length > 0) return directWeekly;

    if (!isRecord(value)) return [];

    if ('days' in value) {
      const fromDays = normalizeDays(value.days);
      if (fromDays.length > 0) return fromDays;
    }

    if ('weeklySchedule' in value) {
      const fromWeekly = normalizeWeeklySchedule(value.weeklySchedule);
      if (fromWeekly.length > 0) return fromWeekly;
    }

    for (const nested of Object.values(value)) {
      const found = findDaysArray(nested, depth + 1);
      if (found.length > 0) return found;
    }

    return [];
  };

  if (Array.isArray(res)) {
    return normalizeDays(res);
  }

  if (isRecord(res)) {
    const found = findDaysArray(res);
    if (found.length > 0) return found;

    if (isRecord(res.data)) {
      const fromData = findDaysArray(res.data);
      if (fromData.length > 0) return fromData;
    }
  }

  return [];
};

const daysToSchedule = (days: ApiScheduleDay[]): Schedule => {
  const firstWorking = days.find((day) => day.workingDay);

  const startTime = firstWorking
    ? formatTime(firstWorking.startTime, defaultSchedule.startTime)
    : defaultSchedule.startTime;

  const endTime = firstWorking
    ? formatTime(firstWorking.endTime, defaultSchedule.endTime)
    : defaultSchedule.endTime;

  const lunchDuration = firstWorking
    ? formatTime(firstWorking.breakStart, defaultSchedule.lunchDuration)
    : defaultSchedule.lunchDuration;

  const workDays = days
    .filter((day) => day.workingDay && isDayOfWeek(day.dayOfWeek))
    .map((day) => DAY_KEY[day.dayOfWeek]);

  return {
    startTime,
    endTime,
    lunchDuration,
    workDays: workDays.length > 0 ? workDays : defaultSchedule.workDays,
  };
};

const buildScheduleFromForm = (values: {
  startTime: string;
  endTime: string;
  lunch: string;
  days: string[];
}): Schedule => ({
  startTime: normalizeHHmm(values.startTime, defaultSchedule.startTime),
  endTime: normalizeHHmm(values.endTime, defaultSchedule.endTime),
  lunchDuration: normalizeHHmm(values.lunch, defaultSchedule.lunchDuration),
  workDays: values.days.filter((day): day is keyof typeof KEY_TO_DAY => day in KEY_TO_DAY),
});

const normalizeWorkDays = (days: string[]) =>
  Array.from(new Set(days.filter((day) => day in KEY_TO_DAY))).sort();

const areSchedulesEqual = (left: Schedule, right: Schedule) => {
  const leftDays = normalizeWorkDays(left.workDays);
  const rightDays = normalizeWorkDays(right.workDays);

  return (
    normalizeHHmm(left.startTime, defaultSchedule.startTime) ===
      normalizeHHmm(right.startTime, defaultSchedule.startTime) &&
    normalizeHHmm(left.endTime, defaultSchedule.endTime) ===
      normalizeHHmm(right.endTime, defaultSchedule.endTime) &&
    normalizeHHmm(left.lunchDuration, defaultSchedule.lunchDuration) ===
      normalizeHHmm(right.lunchDuration, defaultSchedule.lunchDuration) &&
    leftDays.length === rightDays.length &&
    leftDays.every((day, index) => day === rightDays[index])
  );
};

const buildCompanyPayload = (schedule: Schedule): { days: ScheduleDay[] } => {
  const workingDays = new Set(schedule.workDays);
  const startTime = toHHmmss(schedule.startTime);
  const endTime = toHHmmss(schedule.endTime);
  const breakStart = toHHmmss(schedule.lunchDuration || defaultSchedule.lunchDuration);
  const breakEnd = toHHmmss(addHour(schedule.lunchDuration || defaultSchedule.lunchDuration));

  const days = ALL_DAYS.map((dayOfWeek) => {
    const isWorkingDay = workingDays.has(DAY_KEY[dayOfWeek]);

    if (!isWorkingDay) {
      return {
        dayOfWeek,
        workingDay: false,
      };
    }

    return {
      dayOfWeek,
      workingDay: true,
      startTime,
      endTime,
      breakStart,
      breakEnd,
    };
  });

  return { days };
};

const parseApiError = (error: unknown): { message: string; code: string | null } => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as unknown;
      const message = getApiMessage(parsed) ?? error.message;

      if (isRecord(parsed) && isRecord(parsed.error) && typeof parsed.error.code === 'string') {
        return { message, code: parsed.error.code };
      }

      return { message, code: null };
    } catch {
      return { message: error.message, code: null };
    }
  }

  return { message: String(error ?? 'Unknown error'), code: null };
};

const appendUniqueId = (ids: string[], nextId: string) =>
  ids.includes(nextId) ? ids : [...ids, nextId];

const removeId = (ids: string[], targetId: string) =>
  ids.filter((item) => item !== targetId);

const extractDepartmentItems = (payload: unknown): DepartmentSummary[] => {
  const normalize = (value: unknown): DepartmentSummary[] => {
    if (!Array.isArray(value)) return [];

    return value
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item) => ({
        id: Number(item.id),
        name: typeof item.name === 'string' ? item.name : '',
      }))
      .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.name.trim().length > 0);
  };

  if (Array.isArray(payload)) {
    return normalize(payload);
  }

  if (!isRecord(payload)) return [];

  const direct = normalize(payload.data);
  if (direct.length > 0) return direct;

  return normalize(payload.items);
};

const extractEmployeeItems = (payload: unknown): EmployeeApiItem[] => {
  const normalize = (value: unknown): EmployeeApiItem[] => {
    if (!Array.isArray(value)) return [];

    return value
      .filter((item): item is Record<string, unknown> => isRecord(item))
      .map((item) => ({
        id: Number(item.id),
        userId: Number(item.userId),
        companyId: Number(item.companyId),
        departmentId: Number(item.departmentId),
        position: typeof item.position === 'string' ? item.position : undefined,
        employeeNumber: typeof item.employeeNumber === 'string' ? item.employeeNumber : undefined,
      }))
      .filter(
        (item) =>
          Number.isFinite(item.id) && item.id > 0 && Number.isFinite(item.departmentId) &&
          item.departmentId > 0 && Number.isFinite(item.userId),
      );
  };

  if (Array.isArray(payload)) {
    return normalize(payload);
  }

  if (!isRecord(payload)) return [];

  const fromData = normalize(payload.data);
  if (fromData.length > 0) return fromData;

  return normalize(payload.items);
};

const parseIsoDate = (dateValue: string) => {
  const parts = dateValue.split('-').map(Number);
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const parseDateToKey = (dateValue: string): string | null => {
  const date = parseIsoDate(dateValue);
  if (!date) return null;

  return JS_DAY_TO_KEY[date.getDay()] ?? null;
};

const getDayOfWeekFromDate = (dateValue: string): DayOfWeek | null => {
  const date = parseIsoDate(dateValue);
  if (!date) return null;

  return JS_DAY_TO_DAY_OF_WEEK[date.getDay()] ?? null;
};

const getTodayDate = () => formatIsoDate(new Date());

const buildEmployeeDayScheduleFromWeekly = (
  schedule: Schedule,
  date: string,
): EmployeeDaySchedule => {
  const dayKey = parseDateToKey(date) ?? 'mon';

  return {
    date,
    workingDay: schedule.workDays.includes(dayKey),
    startTime: normalizeHHmm(schedule.startTime, defaultSchedule.startTime),
    endTime: normalizeHHmm(schedule.endTime, defaultSchedule.endTime),
    lunchDuration: normalizeHHmm(schedule.lunchDuration, defaultSchedule.lunchDuration),
  };
};

const extractSingleEmployeeSchedule = (
  payload: unknown,
  date: string,
  fallback: EmployeeDaySchedule,
): EmployeeDaySchedule | null => {
  const findCandidate = (value: unknown, depth = 0): Record<string, unknown> | null => {
    if (depth > 4 || !value) return null;

    if (isRecord(value)) {
      const hasWorkingDay = 'workingDay' in value;
      const hasDate = typeof value.date === 'string';
      const hasTime =
        'startTime' in value || 'endTime' in value || 'breakStart' in value || 'breakEnd' in value;

      if (hasWorkingDay && (hasDate || hasTime)) {
        return value;
      }

      for (const nested of Object.values(value)) {
        const found = findCandidate(nested, depth + 1);
        if (found) return found;
      }

      return null;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findCandidate(item, depth + 1);
        if (found) return found;
      }
    }

    return null;
  };

  const candidate = findCandidate(payload);
  if (!candidate) return null;

  return {
    date,
    workingDay: parseWorkingDay(candidate.workingDay),
    startTime: formatTime(candidate.startTime, fallback.startTime),
    endTime: formatTime(candidate.endTime, fallback.endTime),
    lunchDuration: formatTime(candidate.breakStart, fallback.lunchDuration),
  };
};

const toTimePayload = (value: string): EmployeeScheduleTimePayload => {
  const [hour, minute] = normalizeHHmm(value).split(':').map(Number);

  return {
    hour,
    minute,
    second: 0,
    nano: 0,
  };
};

const formatIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const buildEmployeeScheduleFromResponse = (
  payload: unknown,
  date: string,
  fallback: EmployeeDaySchedule,
): EmployeeDaySchedule | null => {
  const targetDayOfWeek = getDayOfWeekFromDate(date);
  const days = extractDays(payload);

  if (targetDayOfWeek) {
    const targetDay =
      days.find((item) => item.dayOfWeek === targetDayOfWeek) ?? (days.length === 1 ? days[0] : null);

    if (targetDay) {
      return {
        date,
        workingDay: targetDay.workingDay,
        startTime: formatTime(targetDay.startTime, fallback.startTime),
        endTime: formatTime(targetDay.endTime, fallback.endTime),
        lunchDuration: formatTime(targetDay.breakStart, fallback.lunchDuration),
      };
    }
  }

  return extractSingleEmployeeSchedule(payload, date, fallback);
};

const areEmployeeDaySchedulesEqual = (
  left: EmployeeDaySchedule,
  right: EmployeeDaySchedule,
) =>
  left.date === right.date &&
  left.workingDay === right.workingDay &&
  normalizeHHmm(left.startTime, defaultSchedule.startTime) ===
    normalizeHHmm(right.startTime, defaultSchedule.startTime) &&
  normalizeHHmm(left.endTime, defaultSchedule.endTime) ===
    normalizeHHmm(right.endTime, defaultSchedule.endTime) &&
  normalizeHHmm(left.lunchDuration, defaultSchedule.lunchDuration) ===
    normalizeHHmm(right.lunchDuration, defaultSchedule.lunchDuration);

const buildEmployeeRequest = (schedule: EmployeeDaySchedule) => {
  if (!schedule.workingDay) {
    return {
      date: schedule.date,
      workingDay: false,
    };
  }

  return {
    date: schedule.date,
    workingDay: true,
    startTime: toTimePayload(schedule.startTime),
    endTime: toTimePayload(schedule.endTime),
    breakStart: toTimePayload(schedule.lunchDuration || defaultSchedule.lunchDuration),
    breakEnd: toTimePayload(addHour(schedule.lunchDuration || defaultSchedule.lunchDuration)),
  };
};

const buildEmployeeName = (employee: EmployeeApiItem) => `Employee #${employee.userId}`;

const buildEmployeeDepartmentName = (employee: EmployeeApiItem, departments: DepartmentData[]) => {
  const department = departments.find((item) => Number(item.id) === employee.departmentId);
  return department?.name ?? `Department #${employee.departmentId}`;
};

const resolveDepartmentSchedule = (
  departmentName: string,
  departments: DepartmentData[],
  companySchedule: Schedule,
): Schedule => {
  const department = departments.find((item) => item.name === departmentName);
  if (!department) return companySchedule;

  return department.inheritCompany ? companySchedule : department.schedule;
};

export const useWorkSchedulesPage = () => {
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);

  const [activeTab, setActiveTab] = useState<WorkSchedulesTab>(getInitialWorkSchedulesTab);

  const [companySchedule, setCompanySchedule] = useState<Schedule>(defaultSchedule);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companySaving, setCompanySaving] = useState(false);
  const [scheduleKey, setScheduleKey] = useState(0);

  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [savingDepartmentIds, setSavingDepartmentIds] = useState<string[]>([]);
  const [loadingDepartmentScheduleIds, setLoadingDepartmentScheduleIds] = useState<string[]>([]);
  const [loadedDepartmentScheduleIds, setLoadedDepartmentScheduleIds] = useState<string[]>([]);

  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [savingEmployeeIds, setSavingEmployeeIds] = useState<string[]>([]);
  const [loadingEmployeeScheduleIds, setLoadingEmployeeScheduleIds] = useState<string[]>([]);
  const [loadedEmployeeScheduleDates, setLoadedEmployeeScheduleDates] = useState<
    Record<string, string>
  >({});
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('all');

  const loadCompanySchedule = useCallback(async () => {
    setCompanyLoading(true);

    try {
      const response = await scheduleApi.getCompanySchedule();
      assertApiSuccess(response);

      const days = extractDays(response);
      if (days.length === 0) {
        throw new Error('Invalid GET /schedules/company response: schedule days are missing');
      }

      setCompanySchedule(daysToSchedule(days));
      setScheduleKey((prev) => prev + 1);
    } catch (error) {
      const { message, code } = parseApiError(error);

      if (code !== 'SCHEDULE_NOT_FOUND' && !message.includes('SCHEDULE_NOT_FOUND')) {
        console.error('[useWorkSchedulesPage] loadCompanySchedule error:', error);
      }
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    if (!Number.isFinite(companyId)) {
      setDepartments([]);
      setLoadingDepartmentScheduleIds([]);
      setLoadedDepartmentScheduleIds([]);
      return;
    }

    setDepartmentsLoading(true);

    try {
      const departmentsResponse = await scheduleApi.getCompanyDepartments(companyId as number);
      assertApiSuccess(departmentsResponse);

      const departmentItems = extractDepartmentItems(departmentsResponse);

      if (departmentItems.length === 0) {
        setDepartments([]);
        setLoadingDepartmentScheduleIds([]);
        setLoadedDepartmentScheduleIds([]);
        return;
      }

      setDepartments(
        departmentItems.map((departmentItem) => ({
          id: String(departmentItem.id),
          name: departmentItem.name,
          inheritCompany: true,
          schedule: { ...companySchedule },
        })),
      );
      setLoadingDepartmentScheduleIds([]);
      setLoadedDepartmentScheduleIds([]);
    } catch (error) {
      console.error('[useWorkSchedulesPage] loadDepartments error:', error);
      setDepartments([]);
      setLoadingDepartmentScheduleIds([]);
      setLoadedDepartmentScheduleIds([]);
    } finally {
      setDepartmentsLoading(false);
    }
  }, [companyId, companySchedule]);

  const ensureDepartmentScheduleLoaded = useCallback(
    async (departmentId: string) => {
      if (
        loadingDepartmentScheduleIds.includes(departmentId) ||
        loadedDepartmentScheduleIds.includes(departmentId)
      ) {
        return;
      }

      const parsedDepartmentId = Number(departmentId);
      if (!Number.isFinite(parsedDepartmentId)) return;

      setLoadingDepartmentScheduleIds((prev) => appendUniqueId(prev, departmentId));

      try {
        const response = await scheduleApi.getDepartmentSchedule(parsedDepartmentId);
        assertApiSuccess(response);

        const days = extractDays(response);
        const nextSchedule = days.length > 0 ? daysToSchedule(days) : { ...companySchedule };
        const inheritCompany = days.length > 0
          ? areSchedulesEqual(nextSchedule, companySchedule)
          : true;

        setDepartments((prev) =>
          prev.map((department) =>
            department.id === departmentId
              ? {
                  ...department,
                  inheritCompany,
                  schedule: nextSchedule,
                }
              : department,
          ),
        );
      } catch (error) {
        const { message, code } = parseApiError(error);

        if (code === 'SCHEDULE_NOT_FOUND' || message.includes('SCHEDULE_NOT_FOUND')) {
          setDepartments((prev) =>
            prev.map((department) =>
              department.id === departmentId
                ? {
                    ...department,
                    inheritCompany: true,
                    schedule: { ...companySchedule },
                  }
                : department,
            ),
          );
        } else {
          console.error(
            `[useWorkSchedulesPage] loadDepartmentSchedule error for ${departmentId}:`,
            error,
          );
        }
      } finally {
        setLoadingDepartmentScheduleIds((prev) => removeId(prev, departmentId));
        setLoadedDepartmentScheduleIds((prev) => appendUniqueId(prev, departmentId));
      }
    },
    [companySchedule, loadedDepartmentScheduleIds, loadingDepartmentScheduleIds],
  );

  const loadEmployees = useCallback(async () => {
    if (!Number.isFinite(companyId)) {
      setEmployees([]);
      setLoadingEmployeeScheduleIds([]);
      setLoadedEmployeeScheduleDates({});
      return;
    }

    setEmployeesLoading(true);

    try {
      const employeesResponse = await scheduleApi.getCompanyEmployees(companyId as number);
      assertApiSuccess(employeesResponse);

      const employeeItems = extractEmployeeItems(employeesResponse);

      if (employeeItems.length === 0) {
        setEmployees([]);
        setLoadingEmployeeScheduleIds([]);
        setLoadedEmployeeScheduleDates({});
        return;
      }

      const selectedDate = getTodayDate();

      setEmployees(
        employeeItems.map((employeeItem) => {
          const departmentName = buildEmployeeDepartmentName(employeeItem, departments);
          const parentSchedule = resolveDepartmentSchedule(
            departmentName,
            departments,
            companySchedule,
          );
          const dailySchedule = buildEmployeeDayScheduleFromWeekly(parentSchedule, selectedDate);

          return {
            id: String(employeeItem.id),
            name: buildEmployeeName(employeeItem),
            initials: '',
            department: departmentName,
            selectedDate,
            inheritDepartment: true,
            schedule: dailySchedule,
          };
        }),
      );
      setLoadingEmployeeScheduleIds([]);
      setLoadedEmployeeScheduleDates({});
    } catch (error) {
      console.error('[useWorkSchedulesPage] loadEmployees error:', error);
      setEmployees([]);
      setLoadingEmployeeScheduleIds([]);
      setLoadedEmployeeScheduleDates({});
    } finally {
      setEmployeesLoading(false);
    }
  }, [companyId, companySchedule, departments]);

  const ensureEmployeeScheduleLoaded = useCallback(
    async (employeeId: string, requestedDate?: string) => {
      const parsedEmployeeId = Number(employeeId);
      if (!Number.isFinite(parsedEmployeeId)) return;

      const targetEmployee = employees.find((item) => item.id === employeeId);
      if (!targetEmployee) return;

      const requestDate = requestedDate ?? targetEmployee.selectedDate;

      if (
        loadingEmployeeScheduleIds.includes(employeeId) ||
        loadedEmployeeScheduleDates[employeeId] === requestDate
      ) {
        return;
      }

      const parentSchedule = resolveDepartmentSchedule(
        targetEmployee.department,
        departments,
        companySchedule,
      );
      const parentDaySchedule = buildEmployeeDayScheduleFromWeekly(parentSchedule, requestDate);

      setLoadingEmployeeScheduleIds((prev) => appendUniqueId(prev, employeeId));

      try {
        const response = await scheduleApi.getEmployeeSchedule(parsedEmployeeId, requestDate);
        assertApiSuccess(response);

        const scheduleFromApi = buildEmployeeScheduleFromResponse(
          response,
          requestDate,
          parentDaySchedule,
        );

        if (!scheduleFromApi) {
          setEmployees((prev) =>
            prev.map((item) =>
              item.id === employeeId
                ? {
                    ...item,
                    selectedDate: requestDate,
                    inheritDepartment: true,
                    schedule: parentDaySchedule,
                  }
                : item,
            ),
          );
          return;
        }

        setEmployees((prev) =>
          prev.map((item) =>
            item.id === employeeId
              ? {
                  ...item,
                  selectedDate: requestDate,
                  inheritDepartment: areEmployeeDaySchedulesEqual(
                    scheduleFromApi,
                    parentDaySchedule,
                  ),
                  schedule: scheduleFromApi,
                }
              : item,
          ),
        );
      } catch (error) {
        const { message, code } = parseApiError(error);

        if (code === 'SCHEDULE_NOT_FOUND' || message.includes('SCHEDULE_NOT_FOUND')) {
          setEmployees((prev) =>
            prev.map((item) =>
              item.id === employeeId
                ? {
                    ...item,
                    selectedDate: requestDate,
                    inheritDepartment: true,
                    schedule: parentDaySchedule,
                  }
                : item,
            ),
          );
        } else {
          console.error(`[useWorkSchedulesPage] loadEmployeeSchedule error for ${employeeId}:`, error);
        }
      } finally {
        setLoadingEmployeeScheduleIds((prev) => removeId(prev, employeeId));
        setLoadedEmployeeScheduleDates((prev) => ({
          ...prev,
          [employeeId]: requestDate,
        }));
      }
    },
    [companySchedule, departments, employees, loadedEmployeeScheduleDates, loadingEmployeeScheduleIds],
  );

  const changeEmployeeScheduleDate = useCallback(
    (employeeId: string, nextDate: string) => {
      const targetEmployee = employees.find((item) => item.id === employeeId);
      if (!targetEmployee || !nextDate) return;
      if (targetEmployee.selectedDate === nextDate) return;

      const parentSchedule = resolveDepartmentSchedule(
        targetEmployee.department,
        departments,
        companySchedule,
      );
      const fallbackSchedule = buildEmployeeDayScheduleFromWeekly(parentSchedule, nextDate);

      setEmployees((prev) =>
        prev.map((item) =>
          item.id === employeeId
            ? {
                ...item,
                selectedDate: nextDate,
                inheritDepartment: true,
                schedule: fallbackSchedule,
              }
            : item,
        ),
      );

      void ensureEmployeeScheduleLoaded(employeeId, nextDate);
    },
    [companySchedule, departments, employees, ensureEmployeeScheduleLoaded],
  );

  useEffect(() => {
    void loadCompanySchedule();
  }, [loadCompanySchedule]);

  useEffect(() => {
    if (companyLoading) return;
    void loadDepartments();
  }, [companyLoading, loadDepartments]);

  useEffect(() => {
    if (activeTab !== 'employees') return;
    if (companyLoading || departmentsLoading) return;

    void loadEmployees();
  }, [activeTab, companyLoading, departmentsLoading, loadEmployees]);

  useEffect(() => {
    setEmployees((prev) =>
      prev.map((employee) => {
        if (!employee.inheritDepartment) {
          return employee;
        }

        const parentSchedule = resolveDepartmentSchedule(
          employee.department,
          departments,
          companySchedule,
        );
        const parentDaySchedule = buildEmployeeDayScheduleFromWeekly(
          parentSchedule,
          employee.selectedDate,
        );

        if (areEmployeeDaySchedulesEqual(employee.schedule, parentDaySchedule)) {
          return employee;
        }

        return {
          ...employee,
          schedule: parentDaySchedule,
        };
      }),
    );
  }, [companySchedule, departments]);

  const saveCompanySchedule = async (values: {
    startTime: string;
    endTime: string;
    lunch: string;
    days: string[];
  }) => {
    const updated = buildScheduleFromForm(values);

    setCompanySaving(true);

    try {
      const response = await scheduleApi.setCompanySchedule(buildCompanyPayload(updated));
      assertApiSuccess(response);
      await loadCompanySchedule();

      setDepartments((prev) =>
        prev.map((department) =>
          department.inheritCompany
            ? {
                ...department,
                schedule: { ...updated },
              }
            : department,
        ),
      );
    } catch (error) {
      console.error('[useWorkSchedulesPage] saveCompanySchedule error:', error);
    } finally {
      setCompanySaving(false);
    }
  };

  const saveDepartmentSchedule = async (
    departmentId: string,
    values: {
      useCompanySchedule: boolean;
      startTime: string;
      endTime: string;
      lunch: string;
      days: string[];
    },
  ) => {
    const parsedDepartmentId = Number(departmentId);
    if (!Number.isFinite(parsedDepartmentId)) return;

    const updated = buildScheduleFromForm({
      startTime: values.startTime,
      endTime: values.endTime,
      lunch: values.lunch,
      days: values.days,
    });

    const nextSchedule = values.useCompanySchedule ? { ...companySchedule } : updated;

    setSavingDepartmentIds((prev) =>
      prev.includes(departmentId) ? prev : [...prev, departmentId],
    );

    try {
      const response = await scheduleApi.setDepartmentSchedule(
        parsedDepartmentId,
        buildCompanyPayload(nextSchedule),
      );

      assertApiSuccess(response);

      setDepartments((prev) =>
        prev.map((department) =>
          department.id === departmentId
            ? {
                ...department,
                inheritCompany: values.useCompanySchedule,
                schedule: nextSchedule,
              }
            : department,
        ),
      );
      setLoadedDepartmentScheduleIds((prev) => appendUniqueId(prev, departmentId));
    } catch (error) {
      console.error(
        `[useWorkSchedulesPage] saveDepartmentSchedule error for ${departmentId}:`,
        error,
      );
    } finally {
      setSavingDepartmentIds((prev) => prev.filter((id) => id !== departmentId));
    }
  };

  const saveEmployeeSchedule = async (
    employeeId: string,
    values: {
      useDepartmentSchedule: boolean;
      date: string;
      workingDay: boolean;
      startTime: string;
      endTime: string;
      lunch: string;
    },
  ) => {
    const parsedEmployeeId = Number(employeeId);
    if (!Number.isFinite(parsedEmployeeId)) return;

    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return;

    const parentSchedule = resolveDepartmentSchedule(
      employee.department,
      departments,
      companySchedule,
    );
    const parentDaySchedule = buildEmployeeDayScheduleFromWeekly(parentSchedule, values.date);

    const customSchedule: EmployeeDaySchedule = {
      date: values.date,
      workingDay: values.workingDay,
      startTime: normalizeHHmm(values.startTime, defaultSchedule.startTime),
      endTime: normalizeHHmm(values.endTime, defaultSchedule.endTime),
      lunchDuration: normalizeHHmm(values.lunch, defaultSchedule.lunchDuration),
    };

    const nextSchedule = values.useDepartmentSchedule ? parentDaySchedule : customSchedule;

    setSavingEmployeeIds((prev) => (prev.includes(employeeId) ? prev : [...prev, employeeId]));

    try {
      const response = await scheduleApi.setEmployeeSchedule(
        parsedEmployeeId,
        buildEmployeeRequest(nextSchedule),
      );
      assertApiSuccess(response);

      setEmployees((prev) =>
        prev.map((item) =>
          item.id === employeeId
            ? {
                ...item,
                selectedDate: values.date,
                inheritDepartment: values.useDepartmentSchedule,
                schedule: nextSchedule,
              }
            : item,
        ),
      );
      setLoadedEmployeeScheduleDates((prev) => ({
        ...prev,
        [employeeId]: values.date,
      }));
    } catch (error) {
      console.error(`[useWorkSchedulesPage] saveEmployeeSchedule error for ${employeeId}:`, error);
    } finally {
      setSavingEmployeeIds((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  const filteredEmployees = useMemo(() => {
    let result = employees;

    if (empDeptFilter !== 'all' && empDeptFilter !== 'time') {
      result = result.filter((employee) => employee.department === empDeptFilter);
    }

    if (empSearch.trim()) {
      const query = empSearch.toLowerCase();
      result = result.filter((employee) => employee.name.toLowerCase().includes(query));
    }

    return result;
  }, [employees, empSearch, empDeptFilter]);

  const handleTabChange = useCallback((nextTab: WorkSchedulesTab) => {
    setActiveTab(nextTab);

    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(WORK_SCHEDULES_TAB_STORAGE_KEY, nextTab);
    } catch {
      // ignore storage write errors
    }
  }, []);

  return {
    activeTab,
    handleTabChange,

    companySchedule,
    companyLoading,
    companySaving,
    scheduleKey,
    saveCompanySchedule,

    departments,
    departmentsLoading,
    savingDepartmentIds,
    loadingDepartmentScheduleIds,
    saveDepartmentSchedule,
    ensureDepartmentScheduleLoaded,

    employees,
    employeesLoading,
    savingEmployeeIds,
    loadingEmployeeScheduleIds,
    filteredEmployees,
    saveEmployeeSchedule,
    ensureEmployeeScheduleLoaded,
    changeEmployeeScheduleDate,
    empSearch,
    setEmpSearch,
    empDeptFilter,
    setEmpDeptFilter,
  };
};
