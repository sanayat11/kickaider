export type CalendarVariant = 'month' | 'day' | 'range';

export type CalendarProps = {
  variant?: CalendarVariant;
  value?: Date | null;
  onSelectDate?: (date: Date) => void;
  className?: string;
};