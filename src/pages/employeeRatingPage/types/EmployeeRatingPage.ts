export type Criterion = 'productive' | 'unproductive';

export interface EmployeeRatingFiltersState {
  currentDate: string;
  department: string; // 'all' или строковый departmentId, например '3'
  onlyWorkHours: boolean;
  searchQuery: string;
  criterion: Criterion;
}

export interface EmployeeRatingRowData {
  id: string;
  rank: string;
  name: string;
  initials?: string;
  hostname: string;
  progressValue: number;
  progressPercent: number;
  timeLabel: string;
  avatar?: string;
  isOnline?: boolean;
}