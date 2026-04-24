import classNames from 'classnames';
import { CalendarDayCell } from './CalendarDayCell';
import { CalendarPopover } from './CalendarPopover';
import { isToday } from '../lib/calendar';
import type { CalendarStatus, CalendarStatusType } from '../model/types';

import styles from '../view/CalendarBlock.module.scss';

interface CalendarGridProps {
  viewMode: 'day' | 'month';
  days: Array<{ date: string; day: number; isCurrentMonth: boolean }>;
  statusMap: Map<string, CalendarStatus>;
  activePopover: { date: string } | null;
  selectedEmployeeId: string;
  openDayActions: (date: string) => void;
  setDayStatus: (status: CalendarStatusType | 'reset', employeeId: string, date: string) => void;
  statusOptions: Array<{ label: string; value: CalendarStatusType; tone: any }>;
  monthItems: Array<{ index: number; label: string }>;
  selectMonth: (index: number) => void;
  currentDate: Date;
}

export const CalendarGrid = ({
  viewMode,
  days,
  statusMap,
  activePopover,
  selectedEmployeeId,
  openDayActions,
  setDayStatus,
  statusOptions,
  monthItems,
  selectMonth,
  currentDate,
}: CalendarGridProps) => {
  if (viewMode === 'month') {
    return (
      <div className={styles.monthGrid}>
        {monthItems.map((month) => (
          <div
            key={month.index}
            className={classNames(styles.monthCell, {
              [styles.active]: currentDate.getMonth() === month.index,
            })}
            onClick={() => selectMonth(month.index)}
          >
            {month.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.gridSection}>
      <div className={styles.dayGrid}>
        <div className={styles.weekHeader}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className={styles.weekDay}>
              {d}
            </div>
          ))}
        </div>
        {days.map((day) => {
        const item = statusMap.get(day.date);
        const statusDetail = item ? statusOptions.find(o => o.value === item.status) : null;

        return (
          <CalendarDayCell
            key={day.date}
            day={day.day}
            status={statusDetail ? { value: statusDetail.label, tone: statusDetail.tone } : undefined}
            isToday={isToday(day.date)}
            isCurrentMonth={day.isCurrentMonth}
            onClick={() => openDayActions(day.date)}
          >
            {activePopover?.date === day.date &&
              selectedEmployeeId !== 'all' && (
                <CalendarPopover
                  date={day.date}
                  options={statusOptions}
                  onSelect={(value) =>
                    setDayStatus(value as CalendarStatusType, selectedEmployeeId, day.date)
                  }
                  onReset={() =>
                    setDayStatus('reset', selectedEmployeeId, day.date)
                  }
                />
              )}
          </CalendarDayCell>
        );
      })}
      </div>
    </div>
  );
};