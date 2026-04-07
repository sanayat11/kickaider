export const formatIsoDateToDisplay = (value: string) => {
  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}`;
};

export const formatDisplayDateToIso = (value: string) => {
  const [day, month, year] = value.split('.');

  if (!day || !month || !year) {
    return value;
  }

  return `${year}-${month}-${day}`;
};

export const shiftIsoDate = (value: string, days: number) => {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};
