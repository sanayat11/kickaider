import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdFilterList } from 'react-icons/md';

import styles from './WorkTimePage.module.scss';
import { WorkTimeHeader } from '@/widgets/workTimeHeader/view/WorkTimeHeader';
import { WorkTimeFilters } from '@/widgets/WorkTimeFilterSection/view/WorkTimeFilterSection';
import { WorkTimeStats } from '@/widgets/workTimeStatsSection/view/WorkTimeStatsSection';
import { WorkTimeTable } from '@/widgets/workTimeTableSection/view/WorkTimeTableSection';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';

export interface TableRow {
  id: number;
  period: string;
  department: string;
  employee: string;
  firstActivity: string;
  lastActivity: string;
  lateness: number;
  latenessCount: number;
}

const EMPLOYEES = ['Елена Козлова', 'Дмитрий Волков'];

const DEPARTMENTS = ['IT', 'Sales', 'Marketing', 'HR', 'Support'];

const generateMockData = (): TableRow[] => {
  return Array.from({ length: 30 }, (_, index) => ({
    id: index + 1,
    period: '03.03.2026',
    employee: EMPLOYEES[Math.floor(Math.random() * EMPLOYEES.length)],
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    firstActivity: `00:00:00`,
    lastActivity: `00:00:00`,
    lateness: 0,
    latenessCount: 0,
  }));
};

const INITIAL_ROWS = generateMockData();

const parseDateFromString = (value: string) => {
  const [day, month, year] = value.split('.').map(Number);
  return new Date(year, month - 1, day);
};

export const WorkTimePage: React.FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 1, 14));
  const [employee, setEmployee] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [onlyWorkingHours, setOnlyWorkingHours] = useState<boolean>(false);

  const [rows] = useState<TableRow[]>(INITIAL_ROWS);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableRow;
    direction: 'asc' | 'desc';
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [visibleColumns] = useState<Set<string>>(
    new Set([
      'period',
      'department',
      'employee',
      'firstActivity',
      'lastActivity',
      'lateness',
      'latenessCount',
    ]),
  );

  const employeeOptions = useMemo(
    () => [
      { value: 'all', label: t('dashboard.filters.types.all') },
      ...EMPLOYEES.map((employeeName) => ({
        value: employeeName,
        label: employeeName,
      })),
    ],
    [t],
  );

  const contentTypeOptions = useMemo(
    () => [
      { value: 'all', label: t('reports.workTime.filters.all') },
      { value: 'lateness', label: t('reports.workTime.filters.withLateness') },
      { value: 'absences', label: t('reports.workTime.filters.withAbsences') },
    ],
    [t],
  );

  const kpiData = useMemo(
    () => [
      {
        label: t('reports.workTime.cards.lateness'),
        value: '40,689',
        hint: t('reports.workTime.hints.vsLastWeek', { val: '+2' }),
      },
      {
        label: t('reports.workTime.cards.earlyLeaves'),
        value: '40,689',
        hint: t('reports.workTime.hints.withinNorm'),
      },
      {
        label: t('reports.workTime.cards.absences'),
        value: '40,689',
        hint: t('reports.workTime.hints.unexcused'),
      },
      {
        label: t('reports.workTime.cards.timeAtWork'),
        value: '40,689',
        hint: t('reports.workTime.hints.avg', { val: '8:05' }),
      },
      {
        label: t('reports.workTime.cards.sickLeaves'),
        value: '40,689',
        hint: '',
      },
      {
        label: t('reports.workTime.cards.trips'),
        value: '40,689',
        hint: '',
      },
      {
        label: t('reports.workTime.cards.workDays'),
        value: '40,689',
        hint: t('reports.workTime.hints.fullMonth'),
      },
      {
        label: t('reports.workTime.cards.avgDayDuration'),
        value: '40,689',
        hint: '',
      },
      {
        label: t('reports.workTime.cards.vacations'),
        value: '40,689',
        hint: '',
      },
    ],
    [t],
  );

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    return [...rows].sort((first, second) => {
      const firstValue = first[sortConfig.key];
      const secondValue = second[sortConfig.key];

      if (firstValue < secondValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }, [rows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(rows.length / pageSize);

  const handlePageResetWithLoader = useCallback(() => {
    setLoading(true);
    setCurrentPage(1);

    window.setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const handlePrevDate = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() - 1);
    setSelectedDate(nextDate);
    handlePageResetWithLoader();
  }, [selectedDate, handlePageResetWithLoader]);

  const handleNextDate = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
    handlePageResetWithLoader();
  }, [selectedDate, handlePageResetWithLoader]);

  const handleDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      handlePageResetWithLoader();
    },
    [handlePageResetWithLoader],
  );

  const handleEmployeeChange = useCallback(
    (value: string) => {
      setEmployee(value);
      handlePageResetWithLoader();
    },
    [handlePageResetWithLoader],
  );

  const handleContentTypeChange = useCallback(
    (value: string) => {
      setContentType(value);
      handlePageResetWithLoader();
    },
    [handlePageResetWithLoader],
  );

  const handleOnlyWorkingHoursChange = useCallback(
    (checked: boolean) => {
      setOnlyWorkingHours(checked);
      handlePageResetWithLoader();
    },
    [handlePageResetWithLoader],
  );

  const handleSort = (key: keyof TableRow) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Period,Department,Employee,FirstActivity,LastActivity,Lateness,LatenessCount'].join(',') +
      '\n' +
      rows
        .map(
          (row) =>
            `${row.period},${row.department},${row.employee},${row.firstActivity},${row.lastActivity},${row.lateness},${row.latenessCount}`,
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'work_time_report.csv');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterItems: FilterBarItem[] = useMemo(
    () => [
      {
        id: 'filter-icon',
        type: 'icon',
        icon: <MdFilterList size={20} />,
        label: t('dashboard.common.filters'),
      },
      {
        id: 'period',
        type: 'date-nav',
        label: t('reports.workTime.filters.period'),
        value: selectedDate,
        onPrev: handlePrevDate,
        onNext: handleNextDate,
        onChange: (value: string) => handleDateChange(parseDateFromString(value)),
      },
      {
        id: 'employee',
        type: 'select',
        value: employee,
        placeholder: t('dashboard.filters.types.all'),
        options: employeeOptions,
        onChange: handleEmployeeChange,
      },
      {
        id: 'content-type',
        type: 'select',
        value: contentType,
        placeholder: t('reports.workTime.filters.filter'),
        options: contentTypeOptions,
        onChange: handleContentTypeChange,
      },
      {
        id: 'only-working-hours',
        type: 'checkbox',
        text: t('reports.workTime.filters.onlyWorkTime'),
        checked: onlyWorkingHours,
        onChange: handleOnlyWorkingHoursChange,
      },
    ],
    [
      t,
      selectedDate,
      employee,
      contentType,
      onlyWorkingHours,
      employeeOptions,
      contentTypeOptions,
      handlePrevDate,
      handleNextDate,
      handleDateChange,
      handleEmployeeChange,
      handleContentTypeChange,
      handleOnlyWorkingHoursChange,
    ],
  );

  return (
    <div className={styles.pageContainer}>
      <WorkTimeHeader
        title={t('reports.workTime.title')}
        subtitle={t('reports.workTime.subtitle')}
        exportLabel={t('dashboard.common.exportXls')}
        onExport={handleExport}
      />

      <WorkTimeFilters items={filterItems} />

      <WorkTimeStats loading={loading} items={kpiData} />

      <WorkTimeTable
        loading={loading}
        rows={paginatedRows}
        visibleColumns={visibleColumns}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        noDataText={t('dashboard.common.noData')}
        onSort={handleSort}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};
