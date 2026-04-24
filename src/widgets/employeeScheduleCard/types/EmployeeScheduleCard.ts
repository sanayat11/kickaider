export type EmployeeScheduleCardProps = {
  name: string;
  department: string;
  statusText: string;
  avatarUrl?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  useParentSchedule?: boolean;
  initialDate: string;
  initialWorkingDay: boolean;
  initialStartTime?: string;
  initialEndTime?: string;
  initialLunch?: string;
  onDateChange?: (date: string) => void;
  onSubmit?: (values: {
    useDepartmentSchedule: boolean;
    date: string;
    workingDay: boolean;
    startTime: string;
    endTime: string;
    lunch: string;
  }) => void;
};
