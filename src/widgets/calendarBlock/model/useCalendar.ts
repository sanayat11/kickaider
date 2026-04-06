import { useCallback, useEffect, useMemo, useState } from 'react';
import { productionCalendarMockApi } from '@/shared/api/mock/productionCalendar.mock';
import type {
  CalendarStatus,
  CalendarStatusType,
} from '@/shared/api/mock/productionCalendar.mock';
import { activityMockApi } from '@/shared/api/mock/activity.mock';
import type { Employee } from '@/shared/api/mock/activity.mock';
import { getMonthGrid, getMonthItems } from '../lib/calendar';

export type CalendarViewMode = 'day' | 'month';

type RangeFormState = {
  from: string;
  to: string;
  status: CalendarStatusType;
  employeeId: string;
};

export const useProductionCalendar = (locale: string = 'ru') => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  const [search, setSearch] = useState('');

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<'all' | string>('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<CalendarStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAssignEventModalOpen, setIsAssignEventModalOpen] = useState(false);
  const [rangeForm, setRangeForm] = useState<RangeFormState>({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    status: 'vacation',
    employeeId: 'all',
  });

  const [eventRange, setEventRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    status: undefined as unknown as CalendarStatusType,
  });

  const [activePopover, setActivePopover] = useState<{
    date: string;
    x: number;
    y: number;
  } | null>(null);

  const [assignTarget, setAssignTarget] = useState<{
    date: string;
    employeeId?: string;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const days = useMemo(() => getMonthGrid(year, month), [year, month]);
  const monthItems = useMemo(() => getMonthItems(year, locale), [year, locale]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(currentDate);
  }, [currentDate, locale]);

  // Status options for popover and legend
  const statusOptions: Array<{ label: string; value: CalendarStatusType; tone: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray' }> = useMemo(() => [
    { label: 'Отпуск', value: 'vacation', tone: 'green' },
    { label: 'Больничный', value: 'sick', tone: 'purple' },
    { label: 'Командировка', value: 'trip', tone: 'yellow' },
    { label: 'Прогул', value: 'absence', tone: 'red' },
  ], []);

  // Employee options for select
  const employeeOptions = useMemo(() => {
    const list = employees.map((e) => ({
      label: e.fullName,
      value: e.id,
    }));
    return [{ label: 'Все сотрудники', value: 'all' } as const, ...list];
  }, [employees]);

  const statusMap = useMemo(() => {
    return new Map<string, CalendarStatus>(statuses.map((item) => [item.date, item]));
  }, [statuses]);

  const loadEmployees = useCallback(async () => {
    try {
      const data = await activityMockApi.getTimelineDay({
        date: new Date().toISOString().split('T')[0],
        departments: [],
      });

      setEmployees(data);

      if (data.length > 0) {
        setRangeForm((prev) => ({
          ...prev,
          employeeId: prev.employeeId === 'all' ? data[0].id : prev.employeeId,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    setLoading(true);

    try {
      const data = await productionCalendarMockApi.getCalendarStatuses({
        month: monthKey,
        employeeId: selectedEmployeeId,
      });

      setStatuses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [monthKey, selectedEmployeeId]);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    void loadStatuses();
  }, [loadStatuses]);

  const goPrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };



  const setDayStatus = async (
    status: CalendarStatusType | 'reset',
    employeeId: string,
    date: string,
  ) => {
    try {
      if (status === 'reset') {
        await productionCalendarMockApi.removeCalendarStatus({ employeeId, date });
      } else {
        await productionCalendarMockApi.setCalendarStatus({ employeeId, date, status });
      }

      setActivePopover(null);
      setAssignTarget(null);
      await loadStatuses();
    } catch (error) {
      console.error(error);
    }
  };

  const openDayActions = (date: string) => {
    setEventRange({
      from: date,
      to: date,
      status: undefined as unknown as CalendarStatusType,
    });
    setIsAssignEventModalOpen(true);
  };

  const selectMonth = (monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1).toISOString().split('T')[0];
    const lastDay = new Date(year, monthIndex + 1, 0).toISOString().split('T')[0];
    
    setEventRange({
      from: firstDay,
      to: lastDay,
      status: undefined as unknown as CalendarStatusType,
    });
    setIsAssignEventModalOpen(true);
  };

  const handleAddEvent = async () => {
    try {
      setLoading(true);
      await productionCalendarMockApi.setCalendarRange({
        employeeId: selectedEmployeeId === 'all' ? employees[0]?.id : selectedEmployeeId,
        from: eventRange.from,
        to: eventRange.to,
        status: eventRange.status,
      });
      setIsAssignEventModalOpen(false);
      await loadStatuses();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return {
    currentDate,
    viewMode,
    search,
    selectedEmployeeId,
    employees,
    statuses,
    loading,
    isAssignEventModalOpen,
    rangeForm,
    eventRange,
    activePopover,
    assignTarget,
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
    setRangeForm,
    setEventRange,
    setActivePopover,
    setAssignTarget,

    goPrevMonth,
    goNextMonth,
    selectMonth,
    setDayStatus,
    handleAddEvent,
    openDayActions,
  };
};
