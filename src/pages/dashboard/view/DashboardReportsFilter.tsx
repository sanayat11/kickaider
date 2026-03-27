import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { FilterIcon } from '@/shared/assets/icons';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { Checkbox } from '@/shared/ui/checkbox/view/CheckBox';
import styles from './DashboardReportsFilter.module.scss';

interface Props {
    period: 'day' | 'week' | 'month';
    onPeriodChange: (val: 'day' | 'week' | 'month') => void;
    periodLabel: string;
    onAdjustDate: (dir: number) => void;
    onDateChange: (date: Date) => void;
    currentDate: Date;
    selectedEmployee: string;
    onEmployeeChange: (val: string) => void;
    employees: string[];
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

    return (
        <div className={styles.filtersBar}>
            <div className={styles.filterGroupShort}>
                <FilterIcon className={styles.filterIcon} />
            </div>

            <div className={styles.filterGroupShort}>
                <SelectDropdown
                    placeholder={t('dashboard.filters.period')}
                    onChange={(val) => onPeriodChange(val as 'day' | 'week' | 'month')}
                    options={[
                        { value: 'day', label: t('dashboard.filters.periods.day') },
                        { value: 'week', label: t('dashboard.filters.periods.week') },
                        { value: 'month', label: t('dashboard.filters.periods.month') },
                    ]}
                    size="sm"
                    className={styles.periodDropdown}
                    menuClassName={styles.periodDropdownMenu}
                />
            </div>

            <div className={styles.filterGroupShort}>
                <button className={styles.navBtn} onClick={() => onAdjustDate(-1)}>
                    <IoChevronBackOutline />
                </button>
                <div className={styles.dateInputContainer}>
                    <span className={styles.dateText}>{periodLabel}</span>
                    <input
                        type="date"
                        value={currentDate.toISOString().split('T')[0]}
                        onChange={(e) => { if (e.target.value) onDateChange(new Date(e.target.value)); }}
                        className={styles.hiddenDateInput}
                    />
                </div>
                <button className={styles.navBtn} onClick={() => onAdjustDate(1)}>
                    <IoChevronForwardOutline />
                </button>
            </div>

            <div className={styles.filterGroupFull}>
                <select
                    className={styles.filterSelect}
                    value={selectedEmployee}
                    onChange={(e) => onEmployeeChange(e.target.value)}
                >
                    <option value="all">{t('dashboard.filters.allEmployees', 'Все сотрудники')}</option>
                    {employees.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>

            <div className={styles.filterGroupFull}>
                <SelectDropdown
                    placeholder="Тип клиента"
                    value={chartType === 'all' ? undefined : chartType}
                    onChange={(val) => onChartTypeChange(val as 'all' | 'web' | 'apps')}
                    options={[
                        { value: 'all', label: t('dashboard.filters.types.all') },
                        { value: 'web', label: t('dashboard.filters.types.web') },
                        { value: 'apps', label: t('dashboard.filters.types.apps') },
                    ]}
                    size="sm"
                    className={styles.clientTypeDropdown}
                    menuClassName={styles.periodDropdownMenu}
                />
            </div>

            {showGroupBy && (
                <div className={styles.filterGroupFull}>
                    <select
                        className={styles.filterSelect}
                        value={groupBy}
                        onChange={(e) => onGroupByChange(e.target.value as any)}
                    >
                        <option value="day">{t('dashboard.dynamics.day')}</option>
                        <option value="week">{t('dashboard.dynamics.week')}</option>
                    </select>
                </div>
            )}

            <div className={styles.checkboxGroup}>
                <Checkbox
                    label={t('dashboard.filters.onlyWorkTime')}
                    checked={onlyWorkTime}
                    onChange={(e) => onOnlyWorkTimeChange(e.target.checked)}
                    className={styles.workTimeCheckbox}
                    reverse
                />
            </div>
        </div>
    );
};
