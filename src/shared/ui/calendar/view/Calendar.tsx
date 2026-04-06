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

const buildCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const days: Array<{
    key: string;
    value: number;
    currentMonth: boolean;
    monthOffset: -1 | 0 | 1;
  }> = [];

  for (let i = firstWeekDay - 1; i >= 0; i -= 1) {
    days.push({
      key: `prev-${prevMonthDays - i}`,
      value: prevMonthDays - i,
      currentMonth: false,
      monthOffset: -1,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      key: `current-${day}`,
      value: day,
      currentMonth: true,
      monthOffset: 0,
    });
  }

  while (days.length < 35) {
    const nextDay = days.length - (firstWeekDay + daysInMonth) + 1;
    days.push({
      key: `next-${nextDay}`,
      value: nextDay,
      currentMonth: false,
      monthOffset: 1,
    });
  }

  return days;
};

const MonthPicker: FC<Pick<CalendarProps, 'value' | 'className'>> = ({ value, className }) => {
  const [currentDate, setCurrentDate] = useState(value ?? new Date());

  const year = currentDate.getFullYear();
  const monthLabel = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={classNames(styles.calendar, className)}>
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
        {MONTHS.map((month) => (
          <button key={month} type="button" className={styles.monthCell}>
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

const DayCalendar: FC<Pick<CalendarProps, 'value' | 'onSelectDate' | 'className'>> = ({
  value,
  onSelectDate,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(
    () =>
      new Date(
        value?.getFullYear() ?? new Date().getFullYear(),
        value?.getMonth() ?? new Date().getMonth(),
        1,
      ),
  );

  const days = useMemo(
    () => buildCalendarDays(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );

  const monthLabel = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={classNames(styles.calendar, className)}>
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
        {days.map((day) => {
          const selected =
            !!value &&
            day.currentMonth &&
            value.getFullYear() === currentDate.getFullYear() &&
            value.getMonth() === currentDate.getMonth() &&
            value.getDate() === day.value;

          return (
            <div key={day.key} className={styles.dayCell}>
              <button
                type="button"
                className={classNames(styles.dayButton, {
                  [styles.dayOutside]: !day.currentMonth,
                  [styles.daySelected]: selected,
                })}
                onClick={() => {
                  const nextDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + day.monthOffset,
                    day.value,
                  );

                  onSelectDate?.(nextDate);
                }}
              >
                {day.value}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Calendar: FC<CalendarProps> = ({
  variant = 'day',
  value,
  onSelectDate,
  className,
}) => {
  if (variant === 'month') {
    return <MonthPicker value={value} className={className} />;
  }

  if (variant === 'range') {
    return <DayCalendar value={value} onSelectDate={onSelectDate} className={className} />;
  }

  return <DayCalendar value={value} onSelectDate={onSelectDate} className={className} />;
};
