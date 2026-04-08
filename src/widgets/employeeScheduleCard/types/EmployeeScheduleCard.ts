export type EmployeeScheduleCardProps = {
  name: string;
  department: string;
  statusText: string;
  avatarUrl?: string;
  defaultOpen?: boolean;
  useParentSchedule?: boolean;
  initialStartTime?: string;
  initialEndTime?: string;
  initialLunch?: string;
  initialDays?: string[];
  onSubmit?: (values: {
    useCompanySchedule: boolean;
    startTime: string;
    endTime: string;
    lunch: string;
    days: string[];
  }) => void;
};
