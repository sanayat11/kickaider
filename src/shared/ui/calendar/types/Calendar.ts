import type { DateRange } from 'react-day-picker';

export type CalendarSingleProps = {
  mode?: 'single';
  value?: Date;
  onChange?: (date: Date | undefined) => void;
};

export type CalendarRangeProps = {
  mode: 'range';
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
};

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;