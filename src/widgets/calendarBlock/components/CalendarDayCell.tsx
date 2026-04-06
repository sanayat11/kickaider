import React from 'react';
import classNames from 'classnames';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import styles from '../view/CalendarBlock.module.scss';

interface CalendarDayCellProps {
  day: number;
  status?: {
    value: string;
    tone: 'purple' | 'red' | 'yellow' | 'green' | 'blue' | 'gray';
  };
  isToday: boolean;
  isCurrentMonth: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export const CalendarDayCell = ({
  day,
  status,
  isToday,
  isCurrentMonth,
  onClick,
  children,
}: CalendarDayCellProps) => {
  return (
    <div
      className={classNames(styles.dayCell, {
        [styles.today]: isToday,
        [styles.notCurrent]: !isCurrentMonth,
      })}
      onClick={onClick}
    >
      <div className={styles.cellHeader}>
        <div className={styles.dayNumber}>{day}</div>
      </div>
      
      {status && (
        <Chip 
          tone={status.tone} 
          variant="list" 
          className={styles.cellStatusChip}
        >
          {status.value}
        </Chip>
      )}
      
      {children}
    </div>
  );
};