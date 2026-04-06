export type CalendarVariant = 'month' | 'day' | 'range';

export type CalendarProps = {
  variant?: CalendarVariant;
  value?: Date | null;
  onChange?: (date: Date) => void;
};
