import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdFilterList } from 'react-icons/md';

import styles from './WorkTimePage.module.scss';
import { WorkTimeHeader } from '@/widgets/workTimeHeader/view/WorkTimeHeader';
import { WorkTimeFilters } from '@/widgets/WorkTimeFilterSection/view/WorkTimeFilterSection';
import { WorkTimeStats } from '@/widgets/workTimeStatsSection/view/WorkTimeStatsSection';
import {
  WorkTimeTable,
  type WorkTimeTableRow,
} from '@/widgets/workTimeTableSection/view/WorkTimeTableSection';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import {
  fetchCompanyEmployees,
  fetchWorkTimeDashboard,
  type RawEmployee,
  type WorkTimeDashboardItem,
  type WorkTimeSummary,
} from '../api/WorkTimeApi';
import { exportAttendanceReport } from '@/shared/api/exportApi';

type TableRowExtended = WorkTimeTableRow & {
  dayStatus: string;
};

const parseDateFromString = (value: string) => {
  const [day, month, year] = value.split('.').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateToISO = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateToDisplay = (value: string) => {
  if (!value) return '—';

  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;

  return `${day}.${month}.${year}`;
};

const formatMinutes = (value: number) => {
  const safe = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const formatDateTimeToTime = (value: string | null) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getEmployeeDisplayName = (employee: RawEmployee) => {
  const directName =
    employee.name ||
    employee.fullName ||
    employee.user?.name ||
    employee.user?.fullName;

  if (directName) return directName;

  const firstName = employee.firstName || employee.user?.firstName || '';
  const lastName = employee.lastName || employee.user?.lastName || '';
  const composedName = `${lastName} ${firstName}`.trim();

  if (composedName) return composedName;

  if (employee.employeeNumber) return employee.employeeNumber;

  return `#${employee.id}`;
};

const hasStatus = (status: string | undefined, fragment: string) =>
  String(status || '').toUpperCase().includes(fragment);

const mapDashboardItemToRow = (
  item: WorkTimeDashboardItem,
  index: number,
): TableRowExtended => {
  return {
    id: index + 1,
    period: formatDateToDisplay(item.date),
    department: item.departmentName || '—',
    employee: item.employeeName || item.employeeNumber || `#${item.employeeId}`,
    firstActivity: formatDateTimeToTime(item.firstActivityAt),
    lastActivity: formatDateTimeToTime(item.lastActivityAt),
    lateness: item.lateMinutes,
    latenessCount: item.lateCount,

    earlyLeaveMinutes: item.earlyLeaveMinutes ?? 0,
    earlyLeaveCount: (item.earlyLeaveMinutes ?? 0) > 0 ? 1 : 0,
    absenceCount: hasStatus(item.dayStatus, 'ABSENCE') ? 1 : 0,
    businessTripCount: hasStatus(item.dayStatus, 'BUSINESS_TRIP') ? 1 : 0,
    vacationCount: hasStatus(item.dayStatus, 'VACATION') ? 1 : 0,
    sickLeaveCount: hasStatus(item.dayStatus, 'SICK') ? 1 : 0,

    dayStatus: item.dayStatus,
  };
};

export const WorkTimePage: React.FC = () => {
  const { t } = useTranslation();
  const companyId = useAuthStore((state) => state.user?.companyId);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [employee, setEmployee] = useState<string>('all');
  const [contentType, setContentType] = useState<string>('all');
  const [onlyWorkingHours, setOnlyWorkingHours] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [rows, setRows] = useState<TableRowExtended[]>([]);
  const [summary, setSummary] = useState<WorkTimeSummary | null>(null);
  const [employees, setEmployees] = useState<RawEmployee[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof WorkTimeTableRow;
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
      'earlyLeaveMinutes',
      'earlyLeaveCount',
      'absenceCount',
      'businessTripCount',
      'vacationCount',
      'sickLeaveCount',
    ]),
  );

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;

    const loadEmployees = async () => {
      try {
        const response = await fetchCompanyEmployees(companyId);
        if (cancelled) return;

        setEmployees(Array.isArray(response) ? response : []);
      } catch {
        if (cancelled) return;
        setEmployees([]);
      }
    };

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const day = formatDateToISO(selectedDate);

        const response = await fetchWorkTimeDashboard({
          fromDate: day,
          toDate: day,
          employeeId:
            employee && employee !== 'all' ? Number(employee) : undefined,
          onlyWorkTime: onlyWorkingHours,
        });

        if (cancelled) return;

        setSummary(response.summary ?? null);
        setRows((response.items ?? []).map(mapDashboardItemToRow));
      } catch (e) {
        if (cancelled) return;

        setSummary(null);
        setRows([]);
        setError(
          e instanceof Error
            ? e.message
            : 'Не удалось загрузить сводку рабочего времени',
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [companyId, selectedDate, employee, onlyWorkingHours]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, employee, contentType, onlyWorkingHours]);

  const employeeOptions = useMemo(
    () => [
      { value: 'all', label: 'Все сотрудники' },
      ...employees.map((employeeItem) => ({
        value: String(employeeItem.id),
        label: getEmployeeDisplayName(employeeItem),
      })),
    ],
    [employees],
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
        value: summary ? formatMinutes(summary.lateMinutes) : '00:00',
      },
      {
        label: t('reports.workTime.cards.earlyLeaves'),
        value: summary ? formatMinutes(summary.earlyLeaveMinutes) : '00:00',
      },
      {
        label: t('reports.workTime.cards.absences'),
        value: summary ? String(summary.absenceCount) : '0',
      },
      {
        label: t('reports.workTime.cards.timeAtWork'),
        value: summary ? formatMinutes(summary.workedMinutes) : '00:00',
      },
      {
        label: t('reports.workTime.cards.sickLeaves'),
        value: summary ? String(summary.sickLeaveCount) : '0',
      },
      {
        label: t('reports.workTime.cards.trips'),
        value: summary ? String(summary.businessTripCount) : '0',
      },
      {
        label: t('reports.workTime.cards.workDays'),
        value: summary ? String(summary.workingDayCount) : '0',
      },
      {
        label: t('reports.workTime.cards.avgDayDuration'),
        value: summary ? formatMinutes(summary.averageDayMinutes) : '00:00',
      },
      {
        label: t('reports.workTime.cards.vacations'),
        value: summary ? String(summary.vacationCount) : '0',
      },
    ],
    [summary, t],
  );

  const filteredRows = useMemo(() => {
    if (contentType === 'lateness') {
      return rows.filter((row) => row.lateness > 0 || row.latenessCount > 0);
    }

    if (contentType === 'absences') {
      return rows.filter((row) => row.absenceCount > 0);
    }

    return rows;
  }, [rows, contentType]);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return filteredRows;

    return [...filteredRows].sort((first, second) => {
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
  }, [filteredRows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const handlePrevDate = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() - 1);
    setSelectedDate(nextDate);
  }, [selectedDate]);

  const handleNextDate = useCallback(() => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  }, [selectedDate]);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleEmployeeChange = useCallback((value: string) => {
    setEmployee(value);
  }, []);

  const handleContentTypeChange = useCallback((value: string) => {
    setContentType(value);
  }, []);

  const handleOnlyWorkingHoursChange = useCallback((checked: boolean) => {
    setOnlyWorkingHours(checked);
  }, []);

  const handleSort = (key: keyof WorkTimeTableRow) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const day = formatDateToISO(selectedDate);
      await exportAttendanceReport({
        employeeId: employee && employee !== 'all' ? Number(employee) : undefined,
        date: day,
      }, `attendance_${day}.xlsx`);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
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
        placeholder: 'Все сотрудники',
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
        exportLabel={isExporting ? 'Экспорт...' : t('dashboard.common.exportXls')}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <WorkTimeFilters items={filterItems} />

      {error ? <div className={styles.error}>{error}</div> : null}

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