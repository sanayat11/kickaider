import type { FC } from 'react';
import { FilterBar } from '@/shared/ui/filters-bar/view/FiltersBar';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';

const SCALES = [
  { value: 'allDay', label: 'Весь день' },
  { value: 'workTime', label: 'Рабочее время' },
];

export interface ActivityFiltersProps {
  date: string;
  setDate: (date: string) => void;
  department: string;
  setDepartment: (dept: string) => void;
  scale: string;
  setScale: (scale: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  departmentOptions: { value: string; label: string }[];
}

export const ActivityFilters: FC<ActivityFiltersProps> = ({
  date,
  setDate,
  department,
  setDepartment,
  scale,
  setScale,
  searchQuery,
  setSearchQuery,
  departmentOptions,
}) => {
  const handleDateChange = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split('T')[0]);
  };

  const filterItems: FilterBarItem[] = [
    {
      id: 'iconBtn',
      type: 'icon',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
      ),
      onClick: () => {},
    },
    {
      id: 'period',
      type: 'date-nav',
      label: 'Период',
      value: date,
      displayValue: date.split('-').reverse().join('.'),
      onPrev: () => handleDateChange(-1),
      onNext: () => handleDateChange(1),
      onChange: (val) => {
        const parts = val.split('.');
        if (parts.length === 3) {
          setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      },
    },
    {
      id: 'department',
      type: 'select',
      value: department,
      options: departmentOptions,
      onChange: setDepartment,
    },
    {
      id: 'scale',
      type: 'select',
      value: scale,
      options: SCALES,
      onChange: setScale,
    },
    {
      id: 'search',
      type: 'search',
      value: searchQuery,
      placeholder: 'Поиск по сотруднику/хосту',
      onChange: setSearchQuery,
    },
  ];

  return <FilterBar items={filterItems} />;
};