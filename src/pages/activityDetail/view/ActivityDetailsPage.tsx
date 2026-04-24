import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import styles from './ActivityDetailsPage.module.scss';

import { Pagination } from '@/shared/ui/pagination/view/Pagination';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/SelectDropdown';
import { IoSearchOutline } from 'react-icons/io5';
import { useAuthStore } from '@/shared/lib/model/AuthStore';

import {
  fetchActivityReport,
  fetchActivityTimeline,
  fetchCompanyEmployees,
  type ActivityEvent,
  type RawEmployee,
  type ShortViewRow,
  type TimelineItemNormalized,
} from '@/pages/activity/api/ActivityApi';

import { DetailsHeader } from './components/DetailsHeader';
import { DetailsTableFull } from './components/DetailsTableFull';
import { DetailsTableShort } from './components/DetailsTableShort';

const formatDateToIso = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const getEmployeeHostname = (employee?: RawEmployee | null) => {
  if (!employee) return '—';
  return employee.hostname || employee.user?.email || employee.employeeNumber || '—';
};

const mapTimelineState = (
  item: TimelineItemNormalized,
): 'productive' | 'neutral' | 'unproductive' | 'idle' | 'uncategorized' => {
  const type = String(item.type || '').toUpperCase();

  if (type === 'IDLE') {
    return 'idle';
  }

  if (type === 'WEB') {
    return 'neutral';
  }

  if (type === 'APP') {
    return 'productive';
  }

  return 'uncategorized';
};

const filterItemsByMode = (
  items: TimelineItemNormalized[],
  mode: 'allDay' | 'workTime' | 'custom',
  date: string,
) => {
  if (mode === 'allDay' || mode === 'custom') return items;

  const workStart = new Date(`${date}T09:00:00`);
  const workEnd = new Date(`${date}T18:00:00`);

  return items.filter((item) => {
    return item.endDate > workStart && item.startDate < workEnd;
  });
};

const buildFullViewEvents = (items: TimelineItemNormalized[]): ActivityEvent[] => {
  return items.map((item) => {
    return {
      timestamp: `${item.startDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${item.endDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      duration: formatSecondsToHHMMSS(item.durationSeconds || 0),
      state: mapTimelineState(item),
      appName: item.applicationName || item.title || item.type || '—',
      windowTitle:
        item.windowTitle ||
        (item.type === 'APP' ? item.details || undefined : undefined),
      url: item.url,
      screenshotUrl: undefined,
    };
  });
};

const intervalToMinutes = (value: string) => {
  switch (value) {
    case '1m':
      return 1;
    case '5m':
      return 5;
    case '15m':
      return 15;
    case '1h':
      return 60;
    default:
      return 15;
  }
};

const buildShortRows = (
  items: TimelineItemNormalized[],
  date: string,
  interval: string,
): ShortViewRow[] => {
  const bucketMinutes = intervalToMinutes(interval);
  const bucketMs = bucketMinutes * 60 * 1000;

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const rows: ShortViewRow[] = [];

  for (let cursor = dayStart.getTime(); cursor < dayEnd.getTime(); cursor += bucketMs) {
    const bucketStart = new Date(cursor);
    const bucketEnd = new Date(Math.min(cursor + bucketMs, dayEnd.getTime()));

    let activeSeconds = 0;
    let idleSeconds = 0;
    const apps = new Set<string>();

    items.forEach((item) => {
      const start = item.startDate.getTime();
      const end = item.endDate.getTime();

      const overlapStart = Math.max(start, bucketStart.getTime());
      const overlapEnd = Math.min(end, bucketEnd.getTime());

      if (overlapEnd <= overlapStart) return;

      const overlapSeconds = Math.floor((overlapEnd - overlapStart) / 1000);
      const state = mapTimelineState(item);

      if (state === 'idle') {
        idleSeconds += overlapSeconds;
      } else {
        activeSeconds += overlapSeconds;
      }

      const label = item.applicationName || item.title || item.type;

      if (label) {
        apps.add(label);
      }
    });

    if (activeSeconds === 0 && idleSeconds === 0 && apps.size === 0) {
      continue;
    }

    rows.push({
      period: `${bucketStart.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${bucketEnd.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      activityMinutes: formatSecondsToHHMMSS(activeSeconds),
      idleMinutes: formatSecondsToHHMMSS(idleSeconds),
      apps: Array.from(apps),
    });
  }

  return rows;
};

export const ActivityDetailsPage = () => {
  const { employeeId } = useParams();
  const [searchParams] = useSearchParams();
  const companyId = useAuthStore((state) => state.user?.companyId);

  const selectedDate =
    searchParams.get('date') || formatDateToIso(new Date());

  const [viewMode, setViewMode] = useState<'full' | 'short'>('full');
  const [timeMode, setTimeMode] = useState<'allDay' | 'workTime' | 'custom'>('workTime');
  const [timeInterval, setTimeInterval] = useState('15m');
  const [search, setSearch] = useState('');
  const [employee, setEmployee] = useState<RawEmployee | null>(null);
  const [timelineItems, setTimelineItems] = useState<TimelineItemNormalized[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId || !employeeId) return;

    let cancelled = false;

    const loadEmployee = async () => {
      try {
        const employees = await fetchCompanyEmployees(companyId);
        if (cancelled) return;

        const found = employees.find((item) => String(item.id) === String(employeeId)) || null;
        setEmployee(found);
      } catch {
        if (cancelled) return;
        setEmployee(null);
      }
    };

    loadEmployee();

    return () => {
      cancelled = true;
    };
  }, [companyId, employeeId]);

  useEffect(() => {
    if (!employeeId) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const employeeIdNumber = Number(employeeId);

        const dayFrom = `${selectedDate}T00:00:00Z`;
        const dayTo = `${selectedDate}T23:59:59Z`;

        const [timelineResponse, reportResponse] = await Promise.all([
          fetchActivityTimeline(employeeIdNumber, selectedDate),
          fetchActivityReport({
            employeeId: employeeIdNumber,
            from: dayFrom,
            to: dayTo,
            date: selectedDate,
            groupBy: 'DAY',
            onlyWorkTime: timeMode === 'workTime',
            page: 0,
            size: 25,
          }),
        ]);

        if (cancelled) return;

        setTimelineItems(timelineResponse.items || []);

        if (reportResponse.employeeName) {
          setEmployee((prev) =>
            prev
              ? {
                  ...prev,
                  fullName: reportResponse.employeeName,
                  name: reportResponse.employeeName,
                }
              : prev,
          );
        }
      } catch (e) {
        if (cancelled) return;

        setTimelineItems([]);
        setError(e instanceof Error ? e.message : 'Не удалось загрузить активность');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [employeeId, selectedDate, timeMode]);

  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const base = filterItemsByMode(timelineItems, timeMode, selectedDate);

    if (!normalizedSearch) return base;

    return base.filter((item) =>
      [
        item.applicationName,
        item.windowTitle,
        item.url,
        item.title,
        item.details,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [timelineItems, timeMode, search, selectedDate]);

  const fullViewEvents = useMemo(() => {
    return buildFullViewEvents(visibleItems);
  }, [visibleItems]);

  const shortViewRows = useMemo(() => {
    return buildShortRows(visibleItems, selectedDate, timeInterval);
  }, [visibleItems, selectedDate, timeInterval]);

  if (loading) return <div className={styles.loader}>Загрузка...</div>;
  if (error) return <div className={styles.loader}>{error}</div>;

  return (
    <div className={styles.page}>
      <DetailsHeader
        fullName={employee ? getEmployeeDisplayName(employee) : `#${employeeId}`}
        hostname={getEmployeeHostname(employee)}
      />

      <div className={styles.card}>
        <div className={styles.controlsSection}>
          <div className={styles.controlsRowTop}>
            <SegmentedControl
              size="small"
              className={styles.segmented}
              value={timeMode}
              onChange={(v) => setTimeMode(v as 'allDay' | 'workTime' | 'custom')}
              options={[
                { label: 'Весь день', value: 'allDay' },
                { label: 'Рабочее время', value: 'workTime' },
                { label: 'Произвольное время', value: 'custom' },
              ]}
            />

            <div className={styles.timeSelectWrap}>
              <SelectDropdown
                value={timeInterval}
                onChange={setTimeInterval}
                placeholder="Время"
                size="sm"
                className={styles.timeSelect}
                options={[
                  { label: '1 минута', value: '1m' },
                  { label: '5 минут', value: '5m' },
                  { label: '15 минут', value: '15m' },
                  { label: '1 час', value: '1h' },
                ]}
              />
            </div>

            <div className={styles.searchWrap}>
              <BaseInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по приложению"
                icon={<IoSearchOutline />}
              />
            </div>
          </div>

          <div className={styles.controlsRowBottom}>
            <SegmentedControl
              value={viewMode}
              className={styles.controls}
              onChange={(v) => setViewMode(v as 'full' | 'short')}
              options={[
                { label: 'Подробный вид', value: 'full' },
                { label: 'Сокращенный вид', value: 'short' },
              ]}
            />
          </div>
        </div>

        <div className={styles.tableContainer}>
          {viewMode === 'full' ? (
            <DetailsTableFull events={fullViewEvents} />
          ) : (
            <DetailsTableShort rows={shortViewRows} />
          )}
        </div>

        <div className={styles.footer}>
          <Pagination
            variant="bar"
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            pageSize={10}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};