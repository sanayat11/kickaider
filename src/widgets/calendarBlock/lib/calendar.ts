export type CalendarDay = {
  date: string;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};

const toIsoDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const getMonthGrid = (year: number, month: number): CalendarDay[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);

    days.push({
      date: toIsoDate(date.getFullYear(), date.getMonth(), day),
      day,
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    days.push({
      date: toIsoDate(year, month, day),
      day,
      month,
      year,
      isCurrentMonth: true,
    });
  }

  while (days.length < 42) {
    const nextDay = days.length - (firstWeekday + daysInCurrentMonth) + 1;
    const date = new Date(year, month + 1, nextDay);

    days.push({
      date: toIsoDate(date.getFullYear(), date.getMonth(), nextDay),
      day: nextDay,
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth: false,
    });
  }

  return days;
};

export const isToday = (date: string) => {
  return date === new Date().toISOString().split('T')[0];
};

export const getMonthItems = (year: number, locale: string) => {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(year, index, 1);

    return {
      index,
      label: new Intl.DateTimeFormat(locale, { month: 'long' }).format(date),
    };
  });
};

export const formatDateForInput = (value: string) => {
  if (!value) return '';
  return value;
};
