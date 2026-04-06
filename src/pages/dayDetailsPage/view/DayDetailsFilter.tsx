import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterBar } from '@/shared/ui';
import { FilterIcon } from '@/shared/assets/icons';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';
import { BASE_EMPLOYEES } from '@/shared/api/mock/employees.mock';

interface Props {
    period: string;
    onPeriodChange: (val: string) => void;
    currentDate: Date;
    onDateChange: (date: Date) => void;
    selectedEmployee: string;
    onEmployeeChange: (val: string) => void;
}

export const DayDetailsFilter: React.FC<Props> = ({
    period,
    onPeriodChange,
    currentDate,
    onDateChange,
    selectedEmployee,
    onEmployeeChange,
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
        { id: 'icon', type: 'icon', icon: <FilterIcon /> },
        {
            id: 'period',
            type: 'select',
            placeholder: t('dashboard.filters.period'),
            value: period,
            onChange: onPeriodChange,
            options: [
                { value: 'Day', label: t('dashboard.filters.periods.day', 'День') },
                { value: 'Week', label: t('dashboard.filters.periods.week') },
                { value: 'Month', label: t('dashboard.filters.periods.month') },
            ],
        },
        {
            id: 'datePicker',
            type: 'date-nav',
            value: currentDate,
            onPrev: () => { onPeriodChange('Day'); handlePrevDay(); },
            onNext: () => { onPeriodChange('Day'); handleNextDay(); },
            onChange: (val) => { 
                if (val) {
                    onPeriodChange('Day'); 
                    // parse date string back to Date if needed, 
                    // but FiltersBar calls onChange with formatted string or Date?
                    // Actually FilterBar calls onChange with formatDate(date) which is a string.
                    // Let's parse it.
                    const parts = val.split('.');
                    if (parts.length === 3) {
                        const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
                        onDateChange(d);
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
                { value: 'All', label: t('dashboard.departments.all') },
                ...BASE_EMPLOYEES.map(emp => ({ value: emp.name, label: emp.name })),
            ]
        },
        {
            id: 'contentType',
            type: 'select',
            placeholder: t('dayDetails.contentType', 'Тип клиента'),
            value: '',
            onChange: () => { },
            options: [
                { value: 'web', label: t('dashboard.filters.types.web') },
                { value: 'apps', label: t('dashboard.filters.types.apps') },
            ]
        },
        {
            id: 'workTime',
            type: 'checkbox',
            text: t('dashboard.filters.onlyWorkTime'),
            checked: true,
            onChange: () => { },
        }
    ];

    return <FilterBar items={items} />;
};
