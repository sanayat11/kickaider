import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterBar } from '@/shared/ui';
import { FilterIcon } from '@/shared/assets/icons';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';

type EmployeeOption = {
  value: string;
  label: string;
};

interface Props {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedEmployeeId: string;
  onEmployeeChange: (val: string) => void;
  employeeOptions: EmployeeOption[];
}

const isDate = (val: unknown): val is Date => val instanceof Date;

export const DayDetailsFilter: React.FC<Props> = ({
  currentDate,
  onDateChange,
  selectedEmployeeId,
  onEmployeeChange,
  employeeOptions,
}) => {
  const { t } = useTranslation();

  const handlePrevDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    onDateChange(date);
  };

  const handleNextDay = () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    onDateChange(date);
  };

  const items: FilterBarItem[] = [
    {
      id: 'icon',
      type: 'icon',
      icon: <FilterIcon />,
    },
    {
      id: 'datePicker',
      type: 'date-nav',
      value: currentDate,
      onPrev: handlePrevDay,
      onNext: handleNextDay,
      onChange: (val) => {
        if (!val) return;

        if (isDate(val)) {
          onDateChange(val);
          return;
        }

        if (typeof val === 'string') {
          const parts = val.split('.');
          if (parts.length === 3) {
            const parsed = new Date(
              Number(parts[2]),
              Number(parts[1]) - 1,
              Number(parts[0]),
            );
            onDateChange(parsed);
          }
        }
      },
    },
    {
      id: 'employees',
      type: 'select',
      value: selectedEmployeeId,
      onChange: onEmployeeChange,
      placeholder: t('dashboard.filters.employee', 'Сотрудник'),
      options: [
        { value: 'all', label: t('dashboard.departments.all', 'Все сотрудники') },
        ...employeeOptions,
      ],
    },
  ];

  return <FilterBar items={items} />;
};