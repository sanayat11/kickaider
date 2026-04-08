import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Input } from '@/shared/ui/input/view/Input';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import { SearchIcon } from '@/shared/assets/icons/IconSearch';

import styles from '../view/CalendarBlock.module.scss';

interface CalendarToolbarProps {
  viewMode: 'day' | 'month';
  search: string;
  selectedEmployeeId: string;
  monthLabel: string;
  statusOptions: any[];
  employeeOptions: any[];
  setSearch: (val: string) => void;
  setViewMode: (mode: 'day' | 'month') => void;
  setSelectedEmployeeId: (id: string) => void;
  goPrevMonth: () => void;
  goNextMonth: () => void;
}

export const CalendarToolbar = ({
  viewMode,
  search,
  selectedEmployeeId,
  monthLabel,
  statusOptions,
  employeeOptions,
  setSearch,
  setViewMode,
  setSelectedEmployeeId,
  goPrevMonth,
  goNextMonth,
}: CalendarToolbarProps) => {
  const { control } = useForm({
    defaultValues: { search }
  });

  const searchValue = useWatch({
    control,
    name: 'search',
  });

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue, setSearch]);

  const dropdownOptions = employeeOptions.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));


  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarTop}>
        <div className={styles.searchWrapper}>
          <Input
            name="search"
            control={control}
            placeholder="Поиск по приложению"
            icon={<SearchIcon color="#64748B" />}
            className={styles.toolbarSearch}
          />
        </div>

        <div className={styles.monthNav}>
          <button className={styles.navBtn} onClick={goPrevMonth}>
            <IoChevronBack size={18} />
          </button>
          <div className={styles.monthLabel}>{monthLabel}</div>
          <button className={styles.navBtn} onClick={goNextMonth}>
            <IoChevronForward size={18} />
          </button>
        </div>

        <div className={styles.viewSelector}>
          <SegmentedControl
            options={[
              { label: 'Day', value: 'day' },
              { label: 'Month', value: 'month' },
            ]}
            value={viewMode}
            onChange={(val) => setViewMode(val as any)}
            size="medium"
          />
        </div>
      </div>

      <div className={styles.toolbarBottom}>
        <div className={styles.legend}>
          {statusOptions.map((status: any) => (
            <Chip key={status.value} tone={status.tone} variant="filter">
              {status.label}
            </Chip>
          ))}
        </div>

        <div className={styles.rightControls}>
          <SelectDropdown
            value={selectedEmployeeId}
            onChange={(val) => setSelectedEmployeeId(val)}
            options={dropdownOptions}
            className={styles.employeeDropdown}
            variant='ghost'
          />
        </div>
      </div>
    </div>
  );
};