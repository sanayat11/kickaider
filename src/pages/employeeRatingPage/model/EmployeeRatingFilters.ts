import { useState, useMemo } from 'react';
import { format, addDays, subDays, parseISO, isValid } from 'date-fns';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';

export type Criterion = 'productive' | 'unproductive' | 'neutral' | 'idle';

export interface EmployeeRatingFiltersState {
  currentDate: string;
  department: string;
  onlyWorkHours: boolean;
  searchQuery: string;
  criterion: Criterion;
}

export const useEmployeeRatingFilters = () => {
  const [filtersState, setFiltersState] = useState<EmployeeRatingFiltersState>({
    currentDate: format(new Date(), 'yyyy-MM-dd'),
    department: 'all',
    onlyWorkHours: false,
    searchQuery: '',
    criterion: 'productive',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDateChange = (newDate: string) => {
    setFiltersState((prev) => ({ ...prev, currentDate: newDate }));
    setCurrentPage(1);
  };

  const handlePrevDay = () => {
    const current = parseISO(filtersState.currentDate);
    if (isValid(current)) {
      handleDateChange(format(subDays(current, 1), 'yyyy-MM-dd'));
    }
  };

  const handleNextDay = () => {
    const current = parseISO(filtersState.currentDate);
    if (isValid(current)) {
      handleDateChange(format(addDays(current, 1), 'yyyy-MM-dd'));
    }
  };

  const filterItems = useMemo<FilterBarItem[]>(() => [
    {
      id: 'date-nav',
      type: 'date-nav',
      value: filtersState.currentDate,
      onPrev: handlePrevDay,
      onNext: handleNextDay,
      onChange: handleDateChange,
    },
    {
      id: 'criterion',
      type: 'select',
      value: filtersState.criterion,
      options: [
        { label: 'Продуктивное', value: 'productive' },
        { label: 'Непродуктивное', value: 'unproductive' },
        { label: 'Нейтральное', value: 'neutral' },
        { label: 'Простой', value: 'idle' },
      ],
      onChange: (val) => {
        setFiltersState((prev) => ({ ...prev, criterion: val as Criterion }));
        setCurrentPage(1);
      },
    },
    {
      id: 'department',
      type: 'select',
      value: filtersState.department,
      placeholder: 'Отдел',
      options: [
        { label: 'Все отделы', value: 'all' },
        { label: 'IT', value: 'IT' },
        { label: 'HR', value: 'HR' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Finance', value: 'Finance' },
      ],
      onChange: (val) => {
        setFiltersState((prev) => ({ ...prev, department: val }));
        setCurrentPage(1);
      },
    },
    {
      id: 'only-work-hours',
      type: 'checkbox',
      checked: filtersState.onlyWorkHours,
      text: 'Только в рабочее время',
      onChange: (val) => {
        setFiltersState((prev) => ({ ...prev, onlyWorkHours: val }));
        setCurrentPage(1);
      },
    },
    {
      id: 'search',
      type: 'search',
      value: filtersState.searchQuery,
      placeholder: 'Поиск (имя, хост)',
      onChange: (val) => {
        setFiltersState((prev) => ({ ...prev, searchQuery: val }));
        setCurrentPage(1);
      },
    },
  ], [filtersState]);

  return {
    filtersState,
    filterItems,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  };
};
