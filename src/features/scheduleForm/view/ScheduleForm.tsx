import { useState, type FC } from 'react';
import classNames from 'classnames';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from './ScheduleForm.module.scss';

const DAYS = [
  { key: 'mon', label: 'ПН' },
  { key: 'tue', label: 'ВТ' },
  { key: 'wed', label: 'СР' },
  { key: 'thu', label: 'ЧТ' },
  { key: 'fri', label: 'ПТ' },
  { key: 'sat', label: 'СБ' },
  { key: 'sun', label: 'ВС' },
] as const;

type ScheduleFormProps = {
  initialUseCompanySchedule?: boolean;
  initialStartTime?: string;
  initialEndTime?: string;
  initialLunch?: string;
  initialDays?: string[];
  disabled?: boolean;
  onSubmit?: (values: {
    useCompanySchedule: boolean;
    startTime: string;
    endTime: string;
    lunch: string;
    days: string[];
  }) => void;
};

export const ScheduleForm: FC<ScheduleFormProps> = ({
  initialUseCompanySchedule = false,
  initialStartTime = '09:00',
  initialEndTime = '09:00',
  initialLunch = '09:00',
  initialDays = ['mon', 'tue', 'wed', 'thu', 'fri'],
  disabled = false,
  onSubmit,
}) => {
  const [useCompanySchedule, setUseCompanySchedule] = useState(initialUseCompanySchedule);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [lunch, setLunch] = useState(initialLunch);
  const [days, setDays] = useState<string[]>(initialDays);

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      useCompanySchedule,
      startTime,
      endTime,
      lunch,
      days,
    });
  };

  const formLocked = disabled || useCompanySchedule;

  return (
    <div className={classNames(styles.form, { [styles.disabled]: disabled })}>
      <label className={styles.switchRow}>
        <button
          type="button"
          className={classNames(styles.switch, {
            [styles.switchOn]: useCompanySchedule,
          })}
          onClick={() => !disabled && setUseCompanySchedule((prev) => !prev)}
          aria-pressed={useCompanySchedule}
          disabled={disabled}
        >
          <span className={styles.switchThumb} />
        </button>

        <Typography variant="h4" color='gray' weight='regular' className={styles.switchLabel}>
          Использовать график компании
        </Typography>
      </label>

      <div
        className={classNames(styles.formContent, {
          [styles.formContentLocked]: formLocked,
        })}
        aria-hidden={formLocked}
      >
        <div className={styles.fields}>
          <div className={styles.field}>
            <Typography variant="h5" className={styles.label}>
              Начало рабочего дня
            </Typography>
            <input
              className={styles.input}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={formLocked}
            />
          </div>

          <div className={styles.field}>
            <Typography variant="h5" className={styles.label}>
              Конец рабочего дня
            </Typography>
            <input
              className={styles.input}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={formLocked}
            />
          </div>

          <div className={styles.field}>
            <Typography variant="h5" className={styles.label}>
              Обед
            </Typography>
            <select
              className={styles.select}
              value={lunch}
              onChange={(e) => setLunch(e.target.value)}
              disabled={formLocked}
            >
              <option value="09:00">09:00</option>
              <option value="09:30">09:30</option>
              <option value="10:00">10:00</option>
            </select>
          </div>
        </div>

        <div className={styles.days}>
          {DAYS.map((day) => {
            const active = days.includes(day.key);

            return (
              <button
                key={day.key}
                type="button"
                className={classNames(styles.dayChip, {
                  [styles.dayChipActive]: active,
                })}
                onClick={() => !formLocked && toggleDay(day.key)}
                disabled={formLocked}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        <Button
          variant="solid"
          tone="primary"
          size="large"
          className={styles.saveButton}
          onClick={handleSubmit}
        >
          Сохранить график
        </Button>
      </div>
    </div>
  );
};