import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { IoSearchOutline } from 'react-icons/io5';
import styles from './ScheduleSearchBar.module.scss';

type ScheduleSearchBarProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filterType: string;
    onFilterChange: (value: string) => void;
    departmentOptions: { label: string; value: string }[];
};

export const ScheduleSearchBar: FC<ScheduleSearchBarProps> = ({
    searchQuery,
    onSearchChange,
    filterType,
    onFilterChange,
    departmentOptions,
}) => {
    const { t } = useTranslation();

    const dropdownOptions = [
        { label: t('settings.schedules.employees.allDepts'), value: 'all' },
        { label: 'По времени', value: 'time' },
        ...departmentOptions,
    ];

    return (
        <div className={styles.bar}>
            <div className={styles.searchWrapper}>
                    <BaseInput
                        placeholder={t('settings.schedules.employees.search')}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        icon={<IoSearchOutline size={18} color="#7E86B9" />}
                    />
            </div>
            <div className={styles.filterWrapper}>
                <SelectDropdown
                    value={filterType}
                    onChange={(val) => onFilterChange(val)}
                    size="sm"
                    options={dropdownOptions}
                    className={styles.filterDropdown}
                />
            </div>
        </div>
    );
};
