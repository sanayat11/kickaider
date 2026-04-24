import { useEffect, useRef, useState, type FC } from 'react';
import classNames from 'classnames';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Toggle } from '@/shared/ui/toggle/view/Toggle';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
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
  hideToggle?: boolean;
};

export const ScheduleForm: FC<ScheduleFormProps> = ({
  initialUseCompanySchedule = false,
  initialStartTime = '09:00',
  initialEndTime = '09:00',
  initialLunch = '09:00',
  initialDays = ['mon', 'tue', 'wed', 'thu', 'fri'],
  disabled = false,
  onSubmit,
  hideToggle = false,
}) => {
  const [useCompanySchedule, setUseCompanySchedule] = useState(initialUseCompanySchedule);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [lunch, setLunch] = useState(initialLunch);
  const [days, setDays] = useState<string[]>(initialDays);
  const formContentRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className={classNames(styles.form, { [styles.disabled]: disabled })}>
      {!hideToggle && (
        <Toggle
          className={styles.switchRow}
          checked={useCompanySchedule}
          onChange={setUseCompanySchedule}
          disabled={disabled}
          label="Использовать график компании"
        />
      )}

      <div
        ref={formContentRef}
        className={classNames(styles.formContent, {
          [styles.formContentLocked]: formLocked,
        })}
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
            <SelectDropdown
              value={lunch}
              onChange={setLunch}
              disabled={formLocked}
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
          disabled={formLocked}
          onClick={handleSubmit}
        >
          Сохранить график
        </Button>
      </div>
    </div>
  );
};
