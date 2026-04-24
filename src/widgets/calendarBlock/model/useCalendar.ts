import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { apiFetch } from '@/shared/api/baseApi';
import type { EmployeesApiResponse } from '@/pages/orgStructurePage/model/types';
import {
  calendarApi,
  type CalendarEntryApiItem,
  type DayOffType,
} from '../api/calendarApi';
import type { CalendarStatus, CalendarStatusType } from './types';
import { getMonthGrid, getMonthItems } from '../lib/calendar';

export type CalendarViewMode = 'day' | 'month';

export type { CalendarStatusType, CalendarStatus };

const FRONTEND_TO_API: Record<CalendarStatusType, DayOffType> = {
  vacation: 'VACATION',
  sick: 'SICK',
  trip: 'TRIP',
  absence: 'ABSENCE',
};

const API_TO_FRONTEND: Record<DayOffType, CalendarStatusType> = {
  VACATION: 'vacation',
  SICK: 'sick',
  TRIP: 'trip',
  ABSENCE: 'absence',
};

const dateToISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const expandEntry = (item: CalendarEntryApiItem): CalendarStatus[] => {
  const result: CalendarStatus[] = [];
  const cur = new Date(item.startDate);
  const end = new Date(item.endDate);

  while (cur <= end) {
    result.push({
      id: String(item.id),
      apiId: item.id,
      employeeId: String(item.employeeId),
      date: dateToISO(cur),
      status: API_TO_FRONTEND[item.type] ?? 'absence',
    });
    cur.setDate(cur.getDate() + 1);
  }

  return result;
};

const extractEntries = (response: unknown): CalendarEntryApiItem[] => {
  if (Array.isArray(response)) return response as CalendarEntryApiItem[];
  const r = response as Record<string, unknown>;
  const d = r.data;
  if (Array.isArray(d)) return d as CalendarEntryApiItem[];
  if (d && typeof d === 'object') {
    const nested = d as Record<string, unknown>;
    if (Array.isArray(nested.entries)) return nested.entries as CalendarEntryApiItem[];
    if (Array.isArray(nested.content)) return nested.content as CalendarEntryApiItem[];
  }
  return [];
};

interface CalendarEmployee {
  id: string;
  fullName: string;
}

export const useProductionCalendar = (locale: string = 'ru') => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  const [search, setSearch] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<'all' | string>('all');

  const [employees, setEmployees] = useState<CalendarEmployee[]>([]);
  const [allEntries, setAllEntries] = useState<CalendarEntryApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAssignEventModalOpen, setIsAssignEventModalOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<{ date: string; x: number; y: number } | null>(null);

  const today = dateToISO(new Date());

  const [eventRange, setEventRange] = useState({
    from: today,
    to: today,
    status: undefined as unknown as CalendarStatusType,
    employeeId: 'all',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const days = useMemo(() => getMonthGrid(year, month), [year, month]);
  const monthItems = useMemo(() => getMonthItems(year, locale), [year, locale]);

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(currentDate),
    [currentDate, locale],
  );

  const statusOptions = useMemo<
    Array<{ label: string; value: CalendarStatusType; tone: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray' }>
  >(
    () => [
      { label: 'Отпуск',       value: 'vacation', tone: 'green'  },
      { label: 'Больничный',   value: 'sick',     tone: 'purple' },
      { label: 'Командировка', value: 'trip',     tone: 'yellow' },
      { label: 'Прогул',       value: 'absence',  tone: 'red'    },
    ],
    [],
  );

  const employeeOptions = useMemo(() => {
    const list = employees.map((e) => ({ label: e.fullName, value: e.id }));
    return [{ label: 'Все сотрудники', value: 'all' } as const, ...list];
  }, [employees]);

  const statuses = useMemo<CalendarStatus[]>(() => {
    return allEntries
      .flatMap(expandEntry)
      .filter(
        (s) =>
          s.date.startsWith(monthKey) &&
          (selectedEmployeeId === 'all' || s.employeeId === selectedEmployeeId),
      );
  }, [allEntries, monthKey, selectedEmployeeId]);

  const statusMap = useMemo(
    () => new Map<string, CalendarStatus>(statuses.map((s) => [s.date, s])),
    [statuses],
  );

  const loadEmployees = useCallback(async () => {
    const companyId = useAuthStore.getState().user?.companyId;
    if (!companyId) return;

    try {
      const res = await apiFetch<EmployeesApiResponse>(`employees/company/${companyId}`, {
        method: 'GET',
      });
      const items = res.data ?? [];
      setEmployees(
        items.map((e) => ({
          id: String(e.id),
          fullName: e.employeeNumber
            ? `${e.employeeNumber} — ${e.position || 'Сотрудник'}`
            : `Сотрудник #${e.id}`,
        })),
      );
    } catch (err) {
      console.error('[useCalendar] loadEmployees error:', err);
    }
  }, []);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const from = dateToISO(new Date(year, month, 1));
      const to   = dateToISO(new Date(year, month + 1, 0));
      const res  = await calendarApi.getCompanyEntries(from, to);
      setAllEntries(extractEntries(res));
    } catch (err) {
      console.error('[useCalendar] loadEntries error:', err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { void loadEmployees(); }, [loadEmployees]);
  useEffect(() => { void loadEntries();   }, [loadEntries]);

  const goPrevMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const goNextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const setDayStatus = async (
    status: CalendarStatusType | 'reset',
    employeeId: string,
    date: string,
  ) => {
    try {
      const existing = allEntries.find((e) => {
        const target = new Date(date);
        return (
          String(e.employeeId) === employeeId &&
          target >= new Date(e.startDate) &&
          target <= new Date(e.endDate)
        );
      });

      if (existing) {
        await calendarApi.deleteEntry(existing.id);
      }

      if (status !== 'reset') {
        await calendarApi.createEntry({
          employeeId: Number(employeeId),
          startDate: date,
          endDate: date,
          type: FRONTEND_TO_API[status],
        });
      }

      setActivePopover(null);
      await loadEntries();
    } catch (err) {
      console.error('[useCalendar] setDayStatus error:', err);
      alert('Не удалось обновить статус');
    }
  };

  const openDayActions = (date: string) => {
    setEventRange({
      from: date,
      to: date,
      status: undefined as unknown as CalendarStatusType,
      employeeId: selectedEmployeeId,
    });
    setIsAssignEventModalOpen(true);
  };

  const selectMonth = (monthIndex: number) => {
    setEventRange({
      from: dateToISO(new Date(year, monthIndex, 1)),
      to:   dateToISO(new Date(year, monthIndex + 1, 0)),
      status: undefined as unknown as CalendarStatusType,
      employeeId: selectedEmployeeId,
    });
    setIsAssignEventModalOpen(true);
  };

  const handleAddEvent = async () => {
    if (!eventRange.status) return;

    const targetEmpId =
      eventRange.employeeId !== 'all'
        ? eventRange.employeeId
        : selectedEmployeeId !== 'all'
          ? selectedEmployeeId
          : employees[0]?.id;

    if (!targetEmpId) {
      alert('Выберите сотрудника');
      return;
    }

    try {
      setLoading(true);
      await calendarApi.createEntry({
        employeeId: Number(targetEmpId),
        startDate: eventRange.from,
        endDate:   eventRange.to,
        type:      FRONTEND_TO_API[eventRange.status],
      });
      setIsAssignEventModalOpen(false);
      await loadEntries();
    } catch (err) {
      console.error('[useCalendar] handleAddEvent error:', err);
      alert('Не удалось создать запись');
      setLoading(false);
    }
  };

  return {
    currentDate,
    viewMode,
    search,
    selectedEmployeeId,
    employees,
    loading,
    isAssignEventModalOpen,
    eventRange,
    activePopover,
    days,
    monthItems,
    monthLabel,
    statusMap,
    statusOptions,
    employeeOptions,

    setSearch,
    setViewMode,
    setSelectedEmployeeId,
    setIsAssignEventModalOpen,
    setEventRange,
    setActivePopover,

    goPrevMonth,
    goNextMonth,
    selectMonth,
    setDayStatus,
    handleAddEvent,
    openDayActions,
  };
};
