export type CalendarStatusType = 'vacation' | 'sick' | 'trip' | 'absence';

export interface CalendarStatus {
  id: string;
  apiId: number;
  employeeId: string;
  date: string;
  status: CalendarStatusType;
}
