import { useState } from 'react';
import { format, addDays, subDays, parseISO, isValid } from 'date-fns';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';
import type {
  Criterion,
  EmployeeRatingFiltersState,
} from '../types/EmployeeRatingPage';

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

  const handleCriterionChange = (val: string) => {
    setFiltersState((prev) => ({
      ...prev,
      criterion: val as Criterion,
    }));
    setCurrentPage(1);
  };

  const handleDepartmentChange = (val: string) => {
    setFiltersState((prev) => ({
      ...prev,
      department: val,
    }));
    setCurrentPage(1);
  };

  const handleOnlyWorkHoursChange = (val: boolean) => {
    setFiltersState((prev) => ({
      ...prev,
      onlyWorkHours: val,
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setFiltersState((prev) => ({
      ...prev,
      searchQuery: val,
    }));
    setCurrentPage(1);
  };

  const filterItems: FilterBarItem[] = [
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
      ],
      onChange: handleCriterionChange,
    },
    {
      id: 'department',
      type: 'select',
      value: filtersState.department,
      placeholder: 'Отдел',
      options: [
        { label: 'Все отделы', value: 'all' },
      ],
      onChange: handleDepartmentChange,
    },
    {
      id: 'only-work-hours',
      type: 'checkbox',
      checked: filtersState.onlyWorkHours,
      text: 'Только в рабочее время',
      onChange: handleOnlyWorkHoursChange,
    },
    {
      id: 'search',
      type: 'search',
      value: filtersState.searchQuery,
      placeholder: 'Поиск по имени',
      onChange: handleSearchChange,
    },
  ];

  return {
    filtersState,
    filterItems,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  };
};