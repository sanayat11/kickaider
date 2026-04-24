import React, { useEffect, useMemo, useState } from 'react';
import styles from './ActivityPage.module.scss';

import { ActivityHeader } from './components/ActivityHeader';
import { ActivityFilters } from './components/ActivityFilters';
import { ActivityLegend } from './components/ActivityLegend';
import { ActivityTable } from './components/ActivityTable';
import { Pagination } from '@/shared/ui/pagination/view/Pagination';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { exportActivityReport } from '@/shared/api/exportApi';

import {
  fetchActivityReport,
  fetchActivityTimeline,
  fetchCompanyEmployees,
  type TimelineItemNormalized,
  type RawEmployee,
} from '../api/ActivityApi';

import type {
  ActivityBlock,
  ActivityBlockState,
  ActivityEmployeeRow,
} from './components/ActivityTable';

const formatSecondsToHHMMSS = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
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

const getEmployeeHostname = (employee: RawEmployee) => {
  return employee.hostname || employee.user?.email || employee.employeeNumber || '—';
};

const mapStateToBlockState = (item: TimelineItemNormalized): ActivityBlockState => {
  const type = String(item.type || '').toUpperCase();

  if (type === 'IDLE') return 'idle';
  if (type === 'WEB') return 'neutral';
  if (type === 'APP') return 'productive';

  return 'uncategorized';
};

const filterTimelineByScale = (
  items: TimelineItemNormalized[],
  scale: string,
  date: string,
): TimelineItemNormalized[] => {
  if (scale !== 'workTime') return items;

  const workStart = new Date(`${date}T09:00:00`);
  const workEnd = new Date(`${date}T18:00:00`);

  return items.filter((item) => {
    return item.endDate > workStart && item.startDate < workEnd;
  });
};

const buildActivityBlocks = (
  items: TimelineItemNormalized[],
  scale: string,
  date: string,
): ActivityBlock[] => {
  return filterTimelineByScale(items, scale, date).map((item) => ({
    start: item.startDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    end: item.endDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    state: mapStateToBlockState(item),
    appName: item.applicationName || item.title || item.type,
    windowTitle: item.windowTitle || item.details || undefined,
  }));
};

type EmployeeMeta = {
  id: number;
  fullName: string;
  hostname: string;
  departmentId?: number;
  departmentName?: string;
};

export const ActivityPage: React.FC = () => {
  const companyId = useAuthStore((state) => state.user?.companyId);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('all');
  const [scale, setScale] = useState('allDay');
  const [searchQuery, setSearchQuery] = useState('');
  const [employeesMeta, setEmployeesMeta] = useState<EmployeeMeta[]>([]);
  const [employees, setEmployees] = useState<ActivityEmployeeRow[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingRows, setLoadingRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [date, department, scale, searchQuery]);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        setError(null);

        const employeesResponse = await fetchCompanyEmployees(companyId);

        if (cancelled) return;

        const mappedEmployees: EmployeeMeta[] = (employeesResponse || []).map((employee) => ({
          id: employee.id,
          fullName: getEmployeeDisplayName(employee),
          hostname: getEmployeeHostname(employee),
          departmentId: employee.departmentId,
          departmentName:
            employee.departmentName ||
            (employee.departmentId != null
              ? `Отдел ${employee.departmentId}`
              : '—'),
        }));

        setEmployeesMeta(mappedEmployees);
      } catch (e) {
        if (cancelled) return;

        setEmployeesMeta([]);
        setError(e instanceof Error ? e.message : 'Не удалось загрузить сотрудников');
      } finally {
        if (!cancelled) {
          setLoadingMeta(false);
        }
      }
    };

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const departmentOptions = useMemo(() => {
    const unique = new Map<string, string>();
    employeesMeta.forEach((employee) => {
      if (employee.departmentId != null) {
        unique.set(
          String(employee.departmentId),
          employee.departmentName || `Отдел ${employee.departmentId}`,
        );
      }
    });

    return [
      { value: 'all', label: 'Все отделы' },
      ...Array.from(unique.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [employeesMeta]);

  const filteredMeta = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return employeesMeta.filter((employee) => {
      const departmentOk =
        department === 'all' || String(employee.departmentId ?? '') === department;

      const searchOk =
        !query ||
        employee.fullName.toLowerCase().includes(query) ||
        employee.hostname.toLowerCase().includes(query);

      return departmentOk && searchOk;
    });
  }, [employeesMeta, department, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMeta.length / pageSize));

  const visibleMeta = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMeta.slice(start, start + pageSize);
  }, [filteredMeta, currentPage, pageSize]);

  useEffect(() => {
    let cancelled = false;

    const loadRows = async () => {
      try {
        setLoadingRows(true);
        setError(null);

        const startOfDay = `${date}T00:00:00Z`;
        const endOfDay = `${date}T23:59:59Z`;

        const rows = await Promise.all(
          visibleMeta.map(async (employee) => {
            const [timeline, report] = await Promise.all([
              fetchActivityTimeline(employee.id, date),
              fetchActivityReport({
                employeeId: employee.id,
                from: startOfDay,
                to: endOfDay,
                date,
                groupBy: 'DAY',
                onlyWorkTime: scale === 'workTime',
                page: 0,
                size: 25,
              }),
            ]);

            const blocks = buildActivityBlocks(timeline.items || [], scale, date);

            return {
              id: String(employee.id),
              employeeId: employee.id,
              fullName: report.employeeName || employee.fullName,
              hostname: employee.hostname,
              department: employee.departmentName || '—',
              timeline: blocks,
              totalActiveTime: formatSecondsToHHMMSS(report.totalActiveTime || 0),
              totalIdleTime: formatSecondsToHHMMSS(report.totalIdleTime || 0),
              latestScreenshotUrl: undefined,
              searchText: [
                report.employeeName || employee.fullName,
                employee.hostname,
                ...((timeline.items || []).map((item: TimelineItemNormalized) =>
                  [
                    item.applicationName,
                    item.windowTitle,
                    item.url,
                    item.title,
                    item.details,
                  ]
                    .filter(Boolean)
                    .join(' '),
                )),
              ]
                .join(' ')
                .toLowerCase(),
            } satisfies ActivityEmployeeRow;
          }),
        );

        if (cancelled) return;

        setEmployees(rows);
      } catch (e) {
        if (cancelled) return;

        setEmployees([]);
        setError(e instanceof Error ? e.message : 'Не удалось загрузить активность');
      } finally {
        if (!cancelled) {
          setLoadingRows(false);
        }
      }
    };

    if (visibleMeta.length === 0) {
      setEmployees([]);
      return;
    }

    loadRows();

    return () => {
      cancelled = true;
    };
  }, [visibleMeta, date, scale]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportActivityReport({
        departmentId: department !== 'all' ? Number(department) : undefined,
        from: `${date}T00:00:00Z`,
        to: `${date}T23:59:59Z`,
        date,
        groupBy: 'DAY',
        onlyWorkTime: scale === 'workTime',
        page: currentPage - 1,
        size: pageSize,
      }, `activity_${date}.xlsx`);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.page}>
      <ActivityHeader onExport={handleExport} exporting={isExporting} />

      <div className={styles.filtersWrapper}>
        <ActivityFilters
          date={date}
          setDate={setDate}
          department={department}
          setDepartment={setDepartment}
          scale={scale}
          setScale={setScale}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          departmentOptions={departmentOptions}
        />
      </div>

      <ActivityLegend />

      <div className={styles.mainCard}>
        {error ? <div className={styles.loader}>{error}</div> : null}

        <ActivityTable
          employees={employees}
          date={date}
          loading={loadingMeta || loadingRows}
          scale={scale}
        />

        <div className={styles.footer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            variant="bar"
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};