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

export const useProductionCalendar = (locale: string) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('day');
  const [search, setSearch] = useState('');

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<'all' | string>('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<CalendarStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const [isMassAssignOpen, setIsMassAssignOpen] = useState(false);
  const [rangeForm, setRangeForm] = useState<RangeFormState>({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    status: 'vacation',
    employeeId: 'all',
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

  const statusMap = useMemo(() => {
    return new Map(statuses.map((item) => [item.date, item]));
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

  const selectMonth = (monthIndex: number) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setViewMode('day');
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

  const handleMassAssign = async () => {
    const employeeId =
      selectedEmployeeId === 'all' ? rangeForm.employeeId : selectedEmployeeId;

    if (!employeeId || employeeId === 'all') return;

    try {
      setLoading(true);

      await productionCalendarMockApi.setCalendarRange({
        employeeId,
        from: rangeForm.from,
        to: rangeForm.to,
        status: rangeForm.status,
      });

      setIsMassAssignOpen(false);
      await loadStatuses();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const openDayActions = (date: string) => {
    if (selectedEmployeeId === 'all') {
      setAssignTarget({ date });
      return;
    }

    setActivePopover({ date, x: 0, y: 0 });
  };

  return {
    currentDate,
    viewMode,
    search,
    selectedEmployeeId,
    employees,
    statuses,
    loading,
    isMassAssignOpen,
    rangeForm,
    activePopover,
    assignTarget,
    days,
    monthItems,
    monthLabel,
    statusMap,

    setSearch,
    setViewMode,
    setSelectedEmployeeId,
    setIsMassAssignOpen,
    setRangeForm,
    setActivePopover,
    setAssignTarget,

    goPrevMonth,
    goNextMonth,
    selectMonth,
    setDayStatus,
    handleMassAssign,
    openDayActions,
  };
};