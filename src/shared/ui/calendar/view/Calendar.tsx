import { useMemo, useState, type FC } from 'react';
import classNames from 'classnames';
import styles from './Calendar.module.scss';
import type { CalendarProps } from '../types/Calendar';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M9.5 4.5L6 8L9.5 11.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6.5 4.5L10 8L6.5 11.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const isSameDate = (first: Date | null, second: Date | null) => {
  if (!first || !second) return false;

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const buildCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: Array<{
    key: string;
    value: number;
    currentMonth: boolean;
    date: Date;
  }> = [];

  for (let i = firstWeekDay - 1; i >= 0; i -= 1) {
    const dayValue = prevMonthDays - i;
    days.push({
      key: `prev-${dayValue}`,
      value: dayValue,
      currentMonth: false,
      date: new Date(year, month - 1, dayValue),
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      key: `current-${day}`,
      value: day,
      currentMonth: true,
      date: new Date(year, month, day),
    });
  }

  while (days.length < 35) {
    const nextDay = days.length - (firstWeekDay + daysInMonth) + 1;
    days.push({
      key: `next-${nextDay}`,
      value: nextDay,
      currentMonth: false,
      date: new Date(year, month + 1, nextDay),
    });
  }

  return days;
};

const MonthPicker: FC<{
  value?: Date | null;
  onChange?: (date: Date) => void;
}> = ({ value, onChange }) => {
  const initialDate = value ?? new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const monthLabel = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => setCurrentDate(new Date(year - 1, currentDate.getMonth(), 1))}
        >
          <ChevronLeft />
        </button>

        <div className={styles.title}>{monthLabel}</div>

        <button
          type="button"
          className={styles.navButton}
          onClick={() => setCurrentDate(new Date(year + 1, currentDate.getMonth(), 1))}
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.monthGrid}>
        {MONTHS.map((month, index) => (
          <button
            key={month}
            type="button"
            className={styles.monthCell}
            onClick={() => onChange?.(new Date(year, index, 1))}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

const DayCalendar: FC<{
  range?: boolean;
  value?: Date | null;
  onChange?: (date: Date) => void;
}> = ({ range = false, value, onChange }) => {
  const initialDate = value ?? new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const days = useMemo(
    () => buildCalendarDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );

  const [rangeStart, rangeEnd] = range ? [30, 6] : [null, null];

  const monthLabel = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() =>
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
          }
        >
          <ChevronLeft />
        </button>

        <div className={styles.title}>{monthLabel}</div>

        <button
          type="button"
          className={styles.navButton}
          onClick={() =>
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
          }
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEK_DAYS.map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {days.map((day, index) => {
          const isSelected = !range && isSameDate(value ?? null, day.date);

          const isRangeStart = range && index === 0;
          const isRangeEnd = range && index === 6;
          const isRangeMiddle = range && index > 0 && index < 6;

          return (
            <div
              key={day.key}
              className={classNames(styles.dayCell, {
                [styles.rangeMiddle]: isRangeMiddle,
                [styles.rangeStartWrap]: isRangeStart,
                [styles.rangeEndWrap]: isRangeEnd,
              })}
            >
              <button
                type="button"
                className={classNames(styles.dayButton, {
                  [styles.dayOutside]: !day.currentMonth,
                  [styles.daySelected]: isSelected,
                  [styles.rangeStart]: isRangeStart,
                  [styles.rangeEnd]: isRangeEnd,
                })}
                onClick={() => {
                  if (!range) {
                    onChange?.(day.date);
                  }
                }}
              >
                {range && isRangeStart ? rangeStart : range && isRangeEnd ? rangeEnd : day.value}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Calendar: FC<CalendarProps> = ({ variant = 'day', value, onChange }) => {
  if (variant === 'month') {
    return <MonthPicker value={value} onChange={onChange} />;
  }

  if (variant === 'range') {
    return <DayCalendar range value={value} onChange={onChange} />;
  }

  return <DayCalendar value={value} onChange={onChange} />;
};
