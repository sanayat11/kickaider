import { useEffect, useMemo, useState } from 'react';
import type {
  EmployeeRatingFiltersState,
  EmployeeRatingRowData,
  Criterion,
} from '../types/EmployeeRatingPage';
import { fetchEmployeeRating, type RatingApiItem } from '../api/EmployeeRatingApi';

type Params = {
  filters: EmployeeRatingFiltersState;
  currentPage: number;
  pageSize: number;
};

const buildDayRange = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);

  return {
    from: new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString(),
    to: new Date(Date.UTC(year, month - 1, day, 23, 59, 59)).toISOString(),
    date: dateString,
  };
};

const toOptionalDepartmentId = (value: string): number | undefined => {
  if (!value || value === 'all') return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getInitials = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const formatSeconds = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  if (hours > 0) return `${hours} ч ${minutes} мин`;
  return `${minutes} мин`;
};

const getMetric = (item: RatingApiItem, criterion: Criterion) => {
  switch (criterion) {
    case 'unproductive': {
      const percent =
        item.totalActiveTime > 0
          ? Math.round((item.totalNonProductiveTime / item.totalActiveTime) * 100)
          : 0;

      return {
        value: item.totalNonProductiveTime,
        percent,
      };
    }

    case 'productive':
    default:
      return {
        value: item.totalProductiveTime,
        percent: Math.round(item.productivityPercentage || 0),
      };
  }
};

const mapRatingItemsToRows = (
  items: RatingApiItem[],
  criterion: Criterion,
): EmployeeRatingRowData[] => {
  return items.map((item) => {
    const metric = getMetric(item, criterion);

    return {
      id: String(item.employeeId),
      rank: String(item.rank),
      name: item.employeeName,
      initials: getInitials(item.employeeName),
      hostname: '—',
      progressValue: metric.value,
      progressPercent: metric.percent,
      timeLabel: formatSeconds(metric.value),
      avatar: undefined,
      isOnline: undefined,
    };
  });
};

export const useEmployeeRatingReport = ({
  filters,
  currentPage,
  pageSize,
}: Params) => {
  const [items, setItems] = useState<RatingApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const range = buildDayRange(filters.currentDate);

        const result = await fetchEmployeeRating({
          departmentId: toOptionalDepartmentId(filters.department),
          from: range.from,
          to: range.to,
          date: range.date,
          groupBy: 'DAY',
          onlyWorkTime: filters.onlyWorkHours,
          page: 0,
          size: 100,
        });

        if (cancelled) return;

        setItems(result);
      } catch (e) {
        if (cancelled) return;

        const message =
          e instanceof Error ? e.message : 'Не удалось загрузить рейтинг сотрудников';

        setItems([]);
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [filters.currentDate, filters.department, filters.onlyWorkHours]);

  const allRows: EmployeeRatingRowData[] = useMemo(() => {
    const mapped = mapRatingItemsToRows(items, filters.criterion);

    const query = filters.searchQuery.trim().toLowerCase();

    if (!query) return mapped;

    return mapped.filter((row) => row.name.toLowerCase().includes(query));
  }, [items, filters.criterion, filters.searchQuery]);

  const totalPages = Math.max(1, Math.ceil(allRows.length / pageSize));

  const rows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return allRows.slice(startIndex, startIndex + pageSize);
  }, [allRows, currentPage, pageSize]);

  return {
    rows,
    totalPages,
    isLoading,
    error,
  };
};