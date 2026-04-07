export type Criterion = 'productive' | 'unproductive' | 'neutral' | 'idle';

export type EmployeeRatingFiltersState = {
  currentDate: string;
  department: string;
  criterion: Criterion;
  searchQuery: string;
  onlyWorkHours: boolean;
};

export type EmployeeRatingSourceEmployee = {
  id: string;
  name: string;
  initials: string;
  hostname: string;
  department: string;
  bProd: number;
  bUnp: number;
  bNeu: number;
  bIdle: number;
};

export type EmployeeRatingRowData = {
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
};

export type GetEmployeeRatingRowsParams = {
  employees: EmployeeRatingSourceEmployee[];
  filters: EmployeeRatingFiltersState;
  currentPage: number;
  pageSize: number;
};

export type GetEmployeeRatingRowsResult = {
  rows: EmployeeRatingRowData[];
  totalPages: number;
};
