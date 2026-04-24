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
  period: 'day' | 'week' | 'month';
  onPeriodChange: (val: 'day' | 'week' | 'month') => void;
  periodLabel: string;
  onAdjustDate: (dir: number) => void;
  onDateChange: (date: Date) => void;
  currentDate: Date;
  selectedEmployee: string;
  onEmployeeChange: (val: string) => void;
  employees: EmployeeOption[];
  chartType: 'all' | 'web' | 'apps';
  onChartTypeChange: (val: 'all' | 'web' | 'apps') => void;
  groupBy: 'day' | 'week';
  onGroupByChange: (val: 'day' | 'week') => void;
  onlyWorkTime: boolean;
  onOnlyWorkTimeChange: (val: boolean) => void;
  showGroupBy: boolean;
}

export const DashboardReportsFilter: React.FC<Props> = ({
  period,
  onPeriodChange,
  periodLabel,
  onAdjustDate,
  onDateChange,
  currentDate,
  selectedEmployee,
  onEmployeeChange,
  employees,
  chartType,
  onChartTypeChange,
  groupBy,
  onGroupByChange,
  onlyWorkTime,
  onOnlyWorkTimeChange,
  showGroupBy,
}) => {
  const { t } = useTranslation();

  const items: FilterBarItem[] = [
    { id: 'icon', type: 'icon', icon: <FilterIcon /> },
    {
      id: 'period',
      type: 'select',
      placeholder: t('dashboard.filters.period'),
      value: period,
      onChange: (val) => onPeriodChange(val as 'day' | 'week' | 'month'),
      options: [
        { value: 'day', label: t('dashboard.filters.periods.day') },
        { value: 'week', label: t('dashboard.filters.periods.week') },
        { value: 'month', label: t('dashboard.filters.periods.month') },
      ],
    },
    {
      id: 'datePicker',
      type: 'date-nav',
      label: '',
      displayValue: periodLabel,
      value: currentDate,
      onPrev: () => onAdjustDate(-1),
      onNext: () => onAdjustDate(1),
      onChange: (val) => {
        if (!val) return;

        const isDate = (v: unknown): v is Date =>
          typeof v === 'object' && v instanceof Date;

        if (isDate(val)) {
          onDateChange(val);
          return;
        }

        if (typeof val === 'string') {
          const parsed = new Date(val);
          if (!Number.isNaN(parsed.getTime())) {
            onDateChange(parsed);
          }
        }
      },
    },
    {
      id: 'employees',
      type: 'select',
      value: selectedEmployee,
      onChange: onEmployeeChange,
      options: [
        { value: 'all', label: t('dashboard.filters.allEmployees', 'Все сотрудники') },
        ...employees,
      ],
    },
    {
      id: 'chartType',
      type: 'select',
      placeholder: 'Тип клиента',
      value: chartType,
      onChange: (val) => onChartTypeChange(val as 'all' | 'web' | 'apps'),
      options: [
        { value: 'all', label: t('dashboard.filters.types.all') },
        { value: 'web', label: t('dashboard.filters.types.web') },
        { value: 'apps', label: t('dashboard.filters.types.apps') },
      ],
    },
    ...(showGroupBy
      ? [
          {
            id: 'groupBy',
            type: 'select',
            value: groupBy,
            onChange: (val) => onGroupByChange(val as 'day' | 'week'),
            options: [
              { value: 'day', label: t('dashboard.dynamics.day') },
              { value: 'week', label: t('dashboard.dynamics.week') },
            ],
          } as FilterBarItem,
        ]
      : []),
    {
      id: 'onlyWorkTime',
      type: 'checkbox',
      text: t('dashboard.filters.onlyWorkTime'),
      checked: onlyWorkTime,
      onChange: onOnlyWorkTimeChange,
    },
  ];

  return <FilterBar items={items} />;
};