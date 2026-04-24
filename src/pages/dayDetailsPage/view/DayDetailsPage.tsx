import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { AttachmentIcon } from '@/shared/assets/icons';
import styles from './DayDetailsPage.module.scss';
import { DayDetailsChart } from '../../dayDetailsChart/view/DayDetailsChart';
import type {
  ActivityType,
  DayActivityData,
  TimeSegment,
} from '../../dayDetailsChart/view/DayDetailsChart';
import { DayDetailsFilter } from './DayDetailsFilter';
import {
  fetchAttendanceReport,
  fetchCompanyDepartments,
  fetchCompanyEmployees,
  fetchTimelineReport,
  type AttendanceResponse,
  type DepartmentItem,
  type RawEmployee,
  type TimelineItem,
  type TimelineResponse,
} from '../api/DayDetailsApi';

type LocationState = {
  selectedEmployeeId?: string | number;
};

type EmployeeOption = {
  value: string;
  label: string;
  departmentId?: number;
};

const ALL_EMPLOYEES_VALUE = 'all';

const formatDateToIso = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatRuDate = (date: Date) =>
  date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatSecondsToHHMMSS = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
};

const formatMinutesToHHMMSS = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor((value || 0) * 60));
  return formatSecondsToHHMMSS(totalSeconds);
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

const mapTimelineStateToActivityType = (state?: string): ActivityType => {
  const normalized = String(state || '').toUpperCase();

  if (
    normalized === 'NON_PRODUCTIVE' ||
    normalized === 'UNPRODUCTIVE' ||
    normalized === 'NONPRODUCTIVE'
  ) {
    return 'unproductive';
  }

  if (normalized === 'PRODUCTIVE') {
    return 'productive';
  }

  if (normalized === 'NEUTRAL') {
    return 'neutral';
  }

  return 'uncategorized';
};

const buildTimelineSegments = (items: TimelineItem[]): TimeSegment[] => {
  const chartStartHour = 8;
  const chartEndHour = 20;

  return items
    .map((item, index) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
      }

      const chartStart = new Date(start);
      chartStart.setHours(chartStartHour, 0, 0, 0);

      const chartEnd = new Date(start);
      chartEnd.setHours(chartEndHour, 0, 0, 0);

      const clampedStartMs = Math.max(start.getTime(), chartStart.getTime());
      const clampedEndMs = Math.min(end.getTime(), chartEnd.getTime());

      if (clampedEndMs <= clampedStartMs) {
        return null;
      }

      const totalRangeMs = chartEnd.getTime() - chartStart.getTime();
      const startPercent =
        ((clampedStartMs - chartStart.getTime()) / totalRangeMs) * 100;
      const widthPercent =
        ((clampedEndMs - clampedStartMs) / totalRangeMs) * 100;

      const tooltipStart = start.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const tooltipEnd = end.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        id: `${index}-${item.startTime}-${item.endTime}`,
        type: mapTimelineStateToActivityType(item.state),
        startPercent: Math.max(0, Math.min(100, startPercent)),
        widthPercent: Math.max(0.4, Math.min(100, widthPercent)),
        tooltipTime: `${tooltipStart}-${tooltipEnd}`,
      } as TimeSegment;
    })
    .filter(Boolean) as TimeSegment[];
};

const buildDayActivityData = ({
  timeline,
  attendance,
  employeeName,
  departmentName,
  dateLabel,
}: {
  timeline: TimelineResponse;
  attendance: AttendanceResponse;
  employeeName: string;
  departmentName: string;
  dateLabel: string;
}): DayActivityData => {
  const groupedSeconds: Record<ActivityType, number> = {
    productive: 0,
    neutral: 0,
    unproductive: 0,
    uncategorized: 0,
  };

  timeline.items.forEach((item) => {
    const type = mapTimelineStateToActivityType(item.state);
    groupedSeconds[type] += Math.max(0, item.durationSeconds || 0);
  });

  const totalTrackedSeconds = Object.values(groupedSeconds).reduce(
    (sum, value) => sum + value,
    0,
  );

  const donutOrder: ActivityType[] = [
    'productive',
    'neutral',
    'unproductive',
    'uncategorized',
  ];

  const donutSegments = donutOrder.map((type) => ({
    type,
    percent:
      totalTrackedSeconds > 0
        ? Number(((groupedSeconds[type] / totalTrackedSeconds) * 100).toFixed(1))
        : 0,
    duration: formatSecondsToHHMMSS(groupedSeconds[type]),
  }));

  return {
    employeeName,
    date: dateLabel,
    department: departmentName || '—',
    donutSegments,
    timelineSegments: buildTimelineSegments(timeline.items || []),
    stats: {
      active: formatSecondsToHHMMSS(totalTrackedSeconds),
      productive: formatSecondsToHHMMSS(groupedSeconds.productive),
      unproductive: formatSecondsToHHMMSS(groupedSeconds.unproductive),
      neutral: formatSecondsToHHMMSS(groupedSeconds.neutral),
      uncategorized: formatSecondsToHHMMSS(groupedSeconds.uncategorized),
      firstActivity: attendance.firstActivityAt
        ? new Date(attendance.firstActivityAt).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : '-',
      lastActivity: attendance.lastActivityAt
        ? new Date(attendance.lastActivityAt).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : '-',
      timeAtWork: formatMinutesToHHMMSS(attendance.actualMinutes),
    },
  };
};

export const DayDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { companyId } = useParams<{ companyId?: string }>();
  const location = useLocation();

  const locationState = (location.state as LocationState | null) ?? null;

  const parsedCompanyId = Number(companyId);
  const hasValidCompanyId = Boolean(companyId) && Number.isFinite(parsedCompanyId);

  const passedEmployeeId =
    locationState?.selectedEmployeeId != null
      ? String(locationState.selectedEmployeeId)
      : '';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    passedEmployeeId || ALL_EMPLOYEES_VALUE,
  );

  const [employees, setEmployees] = useState<RawEmployee[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [chartsData, setChartsData] = useState<DayActivityData[]>([]);

  const [isMetaLoading, setIsMetaLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const employeeOptions: EmployeeOption[] = useMemo(() => {
    return employees.map((employee) => ({
      value: String(employee.id),
      label: getEmployeeDisplayName(employee),
      departmentId: employee.departmentId,
    }));
  }, [employees]);

  const visibleEmployeeOptions: EmployeeOption[] = useMemo(() => {
    if (employeeOptions.length > 0) return employeeOptions;

    if (selectedEmployeeId && selectedEmployeeId !== ALL_EMPLOYEES_VALUE) {
      return [
        {
          value: selectedEmployeeId,
          label: `#${selectedEmployeeId}`,
        },
      ];
    }

    return [];
  }, [employeeOptions, selectedEmployeeId]);

  const departmentNameById = useMemo(() => {
    return new Map(
      departments.map((department) => [department.id, department.name]),
    );
  }, [departments]);

  useEffect(() => {
    if (!hasValidCompanyId) return;

    let cancelled = false;

    const loadMeta = async () => {
      try {
        setIsMetaLoading(true);
        setError(null);

        const [employeesResponse, departmentsResponse] = await Promise.all([
          fetchCompanyEmployees(parsedCompanyId),
          fetchCompanyDepartments(parsedCompanyId),
        ]);

        if (cancelled) return;

        setEmployees(Array.isArray(employeesResponse) ? employeesResponse : []);
        setDepartments(Array.isArray(departmentsResponse) ? departmentsResponse : []);
      } catch (e) {
        if (cancelled) return;

        const message =
          e instanceof Error
            ? e.message
            : t('common.error', 'Ошибка загрузки данных');

        setEmployees([]);
        setDepartments([]);
        setError(message);
      } finally {
        if (!cancelled) {
          setIsMetaLoading(false);
        }
      }
    };

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, [hasValidCompanyId, parsedCompanyId, t]);

  useEffect(() => {
    if (passedEmployeeId) {
      setSelectedEmployeeId(passedEmployeeId);
      return;
    }

    if (selectedEmployeeId) return;

    setSelectedEmployeeId(ALL_EMPLOYEES_VALUE);
  }, [passedEmployeeId, selectedEmployeeId]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setChartsData([]);
      return;
    }

    let cancelled = false;

    const loadSingleEmployee = async (employeeId: number) => {
      const date = formatDateToIso(currentDate);

      const [timelineResponse, attendanceResponse] = await Promise.all([
        fetchTimelineReport({ employeeId, date }),
        fetchAttendanceReport({ employeeId, date }),
      ]);

      const employee = employees.find((item) => item.id === employeeId);

      const employeeName =
        timelineResponse.employeeName ||
        attendanceResponse.employeeName ||
        (employee ? getEmployeeDisplayName(employee) : `#${employeeId}`);

      const departmentName =
        employee?.departmentId != null
          ? departmentNameById.get(employee.departmentId) || '—'
          : '—';

      return buildDayActivityData({
        timeline: timelineResponse,
        attendance: attendanceResponse,
        employeeName,
        departmentName,
        dateLabel: formatRuDate(currentDate),
      });
    };

    const loadReports = async () => {
      try {
        setIsReportLoading(true);
        setError(null);

        if (selectedEmployeeId === ALL_EMPLOYEES_VALUE) {
          if (!hasValidCompanyId) {
            setChartsData([]);
            setError('Для режима "Все сотрудники" нужен companyId в URL');
            return;
          }

          if (employees.length === 0) {
            setChartsData([]);
            return;
          }

          const results = await Promise.all(
            employees.map((employee) => loadSingleEmployee(employee.id)),
          );

          if (cancelled) return;

          setChartsData(results);
          return;
        }

        const employeeId = Number(selectedEmployeeId);
        const result = await loadSingleEmployee(employeeId);

        if (cancelled) return;

        setChartsData([result]);
      } catch (e) {
        if (cancelled) return;

        const message =
          e instanceof Error
            ? e.message
            : t('common.error', 'Ошибка загрузки отчёта');

        setChartsData([]);
        setError(message);
      } finally {
        if (!cancelled) {
          setIsReportLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      cancelled = true;
    };
  }, [
    currentDate,
    departmentNameById,
    employees,
    hasValidCompanyId,
    selectedEmployeeId,
    t,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerText}>
          <h1>{t('dayDetails.title')}</h1>
          <p>
            {t(
              'dayDetails.subtitle',
              'Общий аналитический обзор по компании или сотруднику',
            )}
          </p>
        </div>

        <button className={styles.exportBtn} type="button">
          Экспорт XLS
          <AttachmentIcon className={styles.exportIcon} />
        </button>
      </div>

      <div className={styles.filtersSection}>
        <DayDetailsFilter
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          selectedEmployeeId={selectedEmployeeId}
          onEmployeeChange={setSelectedEmployeeId}
          employeeOptions={visibleEmployeeOptions}
        />
      </div>

      <main className={styles.main}>
        {isMetaLoading || isReportLoading ? (
          <div className={styles.emptyState}>Загрузка...</div>
        ) : null}

        {!isMetaLoading && !isReportLoading && error ? (
          <div className={styles.emptyState}>{error}</div>
        ) : null}

        {!isMetaLoading &&
        !isReportLoading &&
        !error &&
        chartsData.length === 0 ? (
          <div className={styles.emptyState}>Нет данных за выбранный день</div>
        ) : null}

        {!isMetaLoading &&
        !isReportLoading &&
        !error &&
        chartsData.length > 0 ? (
          <div className={styles.generatedContent}>
            {chartsData.map((item, index) => (
              <DayDetailsChart
                key={`${item.employeeName}-${item.date}-${index}`}
                data={item}
              />
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
};