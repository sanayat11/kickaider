import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { FilterIcon } from '@/shared/assets/icons';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { Checkbox } from '@/shared/ui/checkbox/view/CheckBox';
import { BASE_EMPLOYEES } from '@/shared/api/mock/employees.mock';
import styles from './DayDetailsFilter.module.scss';

interface Props {
    period: string;
    onPeriodChange: (val: string) => void;
    currentDate: string;
    onDateChange: (date: string) => void;
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

    const formatDisplayDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handlePrevDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    return (
        <div className={styles.filtersBar}>
            <div className={styles.filterGroupShort}>
                <FilterIcon className={styles.filterIcon} />
            </div>

            <div className={styles.filterGroupShort}>
                <SelectDropdown
                    placeholder={t('dashboard.filters.period')}
                    onChange={onPeriodChange}
                    options={[
                        { value: 'Week', label: t('dashboard.filters.periods.week') },
                        { value: 'Month', label: t('dashboard.filters.periods.month') },
                    ]}
                    size="sm"
                    className={styles.periodDropdown}
                    menuClassName={styles.periodDropdownMenu}
                />
            </div>

            <div className={styles.filterGroupShort}>
                <button className={styles.navBtn} onClick={handlePrevDay}>
                    <IoChevronBackOutline />
                </button>
                <div className={styles.dateInputContainer}>
                    <span className={styles.dateText}>{formatDisplayDate(currentDate)}</span>
                    <input
                        type="date"
                        value={currentDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className={styles.hiddenDateInput}
                    />
                </div>
                <button className={styles.navBtn} onClick={handleNextDay}>
                    <IoChevronForwardOutline />
                </button>
            </div>

            <div className={styles.filterGroupFull}>
                <select
                    className={styles.filterSelect}
                    value={selectedEmployee}
                    onChange={(e) => onEmployeeChange(e.target.value)}
                >
                    <option value="All">{t('dashboard.departments.all')}</option>
                    {BASE_EMPLOYEES.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroupFull}>
                <SelectDropdown
                    placeholder={t('dayDetails.contentType', 'Тип клиента')}
                    onChange={() => {}}
                    options={[
                        { value: 'web', label: t('dashboard.filters.types.web') },
                        { value: 'apps', label: t('dashboard.filters.types.apps') },
                    ]}
                    size="sm"
                    className={styles.clientTypeDropdown}
                    menuClassName={styles.periodDropdownMenu}
                />
            </div>

            <div className={styles.checkboxGroup}>
                <Checkbox
                    label={t('dashboard.filters.onlyWorkTime')}
                    defaultChecked
                    className={styles.workTimeCheckbox}
                    reverse
                />
            </div>
        </div>
    );
};
