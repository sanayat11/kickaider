import { formatMinutes } from '@/shared/lib/formatMinute/FormateMinute';
import type { Criterion, EmployeeRatingFiltersState } from './EmployeeRatingFilters';

export interface EmployeeRatingRowData {
  id: string;
  rank: string;
  name: string;
  initials: string;
  hostname: string;
  progressValue: number;
  progressPercent: number;
  timeLabel: string;
}

export interface GetEmployeeRatingRowsParams {
  employees: any[];
  filters: EmployeeRatingFiltersState;
  currentPage: number;
  pageSize: number;
}

export interface GetEmployeeRatingRowsResult {
  rows: EmployeeRatingRowData[];
  totalPages: number;
}

const getCriterionValue = (employee: any, criterion: Criterion): number => {
  switch (criterion) {
    case 'productive':
      return employee.bProd;
    case 'unproductive':
      return employee.bUnp;
    case 'neutral':
      return employee.bNeu;
    case 'idle':
      return employee.bIdle;
    default:
      return 0;
  }
};

const getDateModifier = (dateString: string): number => {
  // Simple hash for date to shift values mock-style
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 10) / 10;
};

export const getEmployeeRatingRows = ({
  employees,
  filters,
  currentPage,
  pageSize,
}: GetEmployeeRatingRowsParams): GetEmployeeRatingRowsResult => {
  const dateModifier = getDateModifier(filters.currentDate);

  let prepared = employees.map((employee) => {
    const productive = Math.max(0, Math.floor(employee.bProd * (1 + (dateModifier * 0.2 - 0.1))));
    const unproductive = Math.max(0, Math.floor(employee.bUnp * (1 + (dateModifier * 0.3 - 0.15))));
    const neutral = Math.max(0, Math.floor(employee.bNeu * (1 + (dateModifier * 0.2 - 0.1))));
    const idle = Math.max(0, Math.floor(employee.bIdle * (1 + (dateModifier * 0.4 - 0.2))));

    return {
      ...employee,
      bProd: productive,
      bUnp: unproductive,
      bNeu: neutral,
      bIdle: idle,
    };
  });

  if (filters.department !== 'all') {
    prepared = prepared.filter((employee) => employee.department === filters.department);
  }

  if (filters.onlyWorkHours) {
    prepared = prepared.filter((employee) => employee.bProd > 0);
  }

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();

    prepared = prepared.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.hostname.toLowerCase().includes(query),
    );
  }

  prepared.sort(
    (a, b) => getCriterionValue(b, filters.criterion) - getCriterionValue(a, filters.criterion),
  );

  const maxValue = Math.max(
    1,
    ...prepared.map((employee) => getCriterionValue(employee, filters.criterion)),
  );

  const mapped: EmployeeRatingRowData[] = prepared.map((employee, index) => {
    const value = getCriterionValue(employee, filters.criterion);

    return {
      id: employee.id,
      rank: String(index + 1).padStart(4, '0'),
      name: employee.name,
      initials: employee.initials,
      hostname: employee.hostname,
      progressValue: value,
      progressPercent: (value / maxValue) * 100,
      timeLabel: formatMinutes(value),
    };
  });

  const totalPages = Math.max(1, Math.ceil(mapped.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const rows = mapped.slice(startIndex, startIndex + pageSize);

  return {
    rows,
    totalPages,
  };
};