import { useEffect, useRef, useState, type FC } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Toggle } from '@/shared/ui/toggle/view/Toggle';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import styles from './EmployeeDayScheduleForm.module.scss';

type EmployeeDayScheduleFormProps = {
  initialUseDepartmentSchedule?: boolean;
  initialDate: string;
  initialWorkingDay: boolean;
  initialStartTime?: string;
  initialEndTime?: string;
  initialLunch?: string;
  disabled?: boolean;
  onDateChange?: (date: string) => void;
  onSubmit?: (values: {
    useDepartmentSchedule: boolean;
    date: string;
    workingDay: boolean;
    startTime: string;
    endTime: string;
    lunch: string;
  }) => void;
};

const DateArrow: FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={direction === 'left' ? 'M9.5 4.5L6 8L9.5 11.5' : 'M6.5 4.5L10 8L6.5 11.5'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const shiftDate = (value: string, diff: number) => {
  const [year, month, day] = value.split('-').map(Number);
  const nextDate = new Date(year, (month ?? 1) - 1, day ?? 1);

  if (Number.isNaN(nextDate.getTime())) {
    return value;
  }

  nextDate.setDate(nextDate.getDate() + diff);

  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextDate.getDate()).padStart(2, '0');

  return `${nextYear}-${nextMonth}-${nextDay}`;
};

export const EmployeeDayScheduleForm: FC<EmployeeDayScheduleFormProps> = ({
  initialUseDepartmentSchedule = false,
  initialDate,
  initialWorkingDay,
  initialStartTime = '09:00',
  initialEndTime = '18:00',
  initialLunch = '12:00',
  disabled = false,
  onDateChange,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [useDepartmentSchedule, setUseDepartmentSchedule] = useState(initialUseDepartmentSchedule);
  const [date, setDate] = useState(initialDate);
  const [workingDay, setWorkingDay] = useState(initialWorkingDay);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [lunch, setLunch] = useState(initialLunch);
  const formContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUseDepartmentSchedule(initialUseDepartmentSchedule);
    setDate(initialDate);
    setWorkingDay(initialWorkingDay);
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
    setLunch(initialLunch);
  }, [
    initialDate,
    initialEndTime,
    initialLunch,
    initialStartTime,
    initialUseDepartmentSchedule,
    initialWorkingDay,
  ]);

  const formLocked = disabled || useDepartmentSchedule;
  const timeFieldsLocked = formLocked || !workingDay;

  useEffect(() => {
    const node = formContentRef.current;
    if (!node) return;

    if (formLocked) {
      const active = document.activeElement;
      if (active instanceof HTMLElement && node.contains(active)) {
        active.blur();
      }
      node.setAttribute('inert', '');
    } else {
      node.removeAttribute('inert');
    }
  }, [formLocked]);

  const updateDate = (nextDate: string) => {
    if (!nextDate) return;

    setDate(nextDate);
    onDateChange?.(nextDate);
  };

  return (
    <div className={classNames(styles.form, { [styles.disabled]: disabled })}>
      <div className={styles.dateRow}>
        <div className={styles.dateHeader}>
          <Typography variant="h5" className={styles.label}>
            {t('settings.schedules.employees.date')}
          </Typography>
        </div>

        <div className={styles.dateControls}>
          <button
            type="button"
            className={styles.dayShift}
            onClick={() => updateDate(shiftDate(date, -1))}
            disabled={disabled}
            aria-label={t('settings.schedules.employees.prevDay')}
          >
            <DateArrow direction="left" />
          </button>

          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={(event) => updateDate(event.target.value)}
            disabled={disabled}
          />

          <button
            type="button"
            className={styles.dayShift}
            onClick={() => updateDate(shiftDate(date, 1))}
            disabled={disabled}
            aria-label={t('settings.schedules.employees.nextDay')}
          >
            <DateArrow direction="right" />
          </button>
        </div>
      </div>

      <Toggle
        className={styles.switchRow}
        checked={useDepartmentSchedule}
        onChange={setUseDepartmentSchedule}
        disabled={disabled}
        label={t('settings.schedules.employees.useDept')}
      />

      <div
        ref={formContentRef}
        className={classNames(styles.formContent, {
          [styles.formContentLocked]: formLocked,
        })}
      >
        <Toggle
          className={styles.switchRow}
          checked={workingDay}
          onChange={setWorkingDay}
          disabled={formLocked}
          label={t('settings.schedules.employees.workingDay')}
        />

        <div className={styles.fields}>
          <div className={styles.field}>
            <Typography variant="h5" className={styles.label}>
              {t('settings.schedules.form.startTime')}
            </Typography>
            <input
              type="time"
              className={styles.input}
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              disabled={timeFieldsLocked}
            />
          </div>

          <div className={styles.field}>
            <Typography variant="h5" className={styles.label}>
              {t('settings.schedules.form.endTime')}
            </Typography>
            <input
              type="time"
              className={styles.input}
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              disabled={timeFieldsLocked}
            />
          </div>

          <div className={styles.field}>
            <Typography variant="h5" className={styles.label}>
              {t('settings.schedules.form.lunchDuration')}
            </Typography>
            <SelectDropdown
              value={lunch}
              onChange={setLunch}
              disabled={timeFieldsLocked}
              className={styles.selectWrapper}
              options={[
                { label: '11:00', value: '11:00' },
                { label: '11:30', value: '11:30' },
                { label: '12:00', value: '12:00' },
                { label: '12:30', value: '12:30' },
                { label: '13:00', value: '13:00' },
                { label: '13:30', value: '13:30' },
              ]}
            />
          </div>
        </div>
      </div>

      <Button
        variant="solid"
        tone="primary"
        size="large"
        className={styles.saveButton}
        disabled={disabled}
        onClick={() =>
          onSubmit?.({
            useDepartmentSchedule,
            date,
            workingDay,
            startTime,
            endTime,
            lunch,
          })
        }
      >
        {t('settings.schedules.form.save')}
      </Button>
    </div>
  );
};
