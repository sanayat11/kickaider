import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  IoTimeOutline,
  IoTrendingUpOutline,
} from 'react-icons/io5';
import { AttachmentIcon, GraphUpIcon } from '@/shared/assets/icons';
import {
  exportEfficiencyReport,
  exportActivityReport,
} from '@/shared/api/exportApi';
import styles from './DashboardPage.module.scss';
import { DashboardReportsFilter } from './DashboardReportsFilter';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/SelectDropdown';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import {
  fetchCompanyDepartments,
  fetchCompanyEmployees,
  fetchCompanyTopApplications,
  fetchEfficiencyReport,
  type DepartmentItem,
  type EfficiencyRequest,
  type EfficiencyResponse,
  type RawEmployee,
  type TopApplicationItem,
} from '../api/DashboardApi';

type TabType = 'time' | 'efficiency' | 'dynamics';

type DepartmentEfficiencyItem = {
  name: string;
  productive: number;
  neutral: number;
  unproductive: number;
  uncategorized: number;
  idle: number;
};

type DynamicsItem = {
  label: string;
  productiveSeconds: number;
  neutralSeconds: number;
  nonProductiveSeconds: number;
  uncategorizedSeconds: number;
  idleSeconds: number;
  totalSeconds: number;
};

const Card = ({ title, value, hint, icon, iconColor, iconOpacity = '33' }: any) => (
  <div className={styles.card}>
    <div className={styles.cardBody}>
      <div className={styles.cardText}>
        <span className={styles.cardTitle}>{title}</span>
        <div className={styles.cardMain}>
          <span className={styles.cardValue}>{value}</span>
          {hint ? <span className={styles.cardHint}>{hint}</span> : null}
        </div>
      </div>
      {icon ? (
        <div
          className={styles.cardIconBox}
          style={{
            backgroundColor: iconColor ? `${iconColor}${iconOpacity}` : undefined,
            color: iconColor,
          }}
        >
          {icon}
        </div>
      ) : null}
    </div>
  </div>
);

const Skeleton = ({ className }: { className?: string }) => (
  <div className={classNames(styles.skeleton, className)} />
);

const CHART_COLORS = {
  productive: '#8DE4DB',
  neutral: '#FFCC00',
  unproductive: '#FF0000',
  uncategorized: '#D1D5DB',
  idle: '#e5e5ea',
};

const DonutChart: React.FC<{
  productive: number;
  neutral: number;
  unproductive: number;
  uncategorized: number;
}> = ({ productive, neutral, unproductive, uncategorized }) => {
  const size = 90;
  const cx = 45;
  const cy = 45;
  const R = 38;
  const r = 24;

  const segs = [
    { val: productive, fill: CHART_COLORS.productive },
    { val: neutral, fill: CHART_COLORS.neutral },
    { val: unproductive, fill: CHART_COLORS.unproductive },
    { val: uncategorized, fill: CHART_COLORS.uncategorized },
  ];

  const total = segs.reduce((s, x) => s + x.val, 0) || 100;
  let a = -Math.PI / 2;

  const paths = segs.flatMap((seg) => {
    if (seg.val <= 0) return [];

    const sweep = (seg.val / total) * 2 * Math.PI;
    const a2 = a + sweep;
    const large = sweep > Math.PI ? 1 : 0;
    const c1 = [Math.cos(a), Math.sin(a)];
    const c2 = [Math.cos(a2), Math.sin(a2)];

    const d = `M${cx + R * c1[0]} ${cy + R * c1[1]}
      A${R} ${R} 0 ${large} 1 ${cx + R * c2[0]} ${cy + R * c2[1]}
      L${cx + r * c2[0]} ${cy + r * c2[1]}
      A${r} ${r} 0 ${large} 0 ${cx + r * c1[0]} ${cy + r * c1[1]}Z`;

    a = a2;

    return [{ d, fill: seg.fill }];
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
};

const formatSecondsToHHMM = (value: number) => {
  const safe = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const formatSecondsToHHMMSS = (value: number) => {
  const safe = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
};

const percentFromTotal = (value: number, total: number) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
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

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfWeek = (date: Date) => {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfMonth = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfMonth = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

const toIso = (date: Date) => date.toISOString();

const toDateOnly = (date: Date) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const buildPeriodPayload = ({
  currentDate,
  period,
  employeeId,
  onlyWorkTime,
}: {
  currentDate: Date;
  period: 'day' | 'week' | 'month';
  employeeId?: number;
  onlyWorkTime: boolean;
}): EfficiencyRequest => {
  const fromDate =
    period === 'day'
      ? startOfDay(currentDate)
      : period === 'week'
      ? startOfWeek(currentDate)
      : startOfMonth(currentDate);

  const toDate =
    period === 'day'
      ? endOfDay(currentDate)
      : period === 'week'
      ? endOfWeek(currentDate)
      : endOfMonth(currentDate);

  return {
    employeeId,
    from: toIso(fromDate),
    to: toIso(toDate),
    date: toDateOnly(currentDate),
    groupBy: period === 'month' ? 'MONTH' : period === 'week' ? 'WEEK' : 'DAY',
    onlyWorkTime,
    page: 0,
    size: 25,
  };
};

const splitPeriodForDynamics = (
  date: Date,
  period: 'day' | 'week' | 'month',
  groupBy: 'day' | 'week',
) => {
  if (period === 'day') {
    return [
      {
        label: toDateOnly(date),
        from: startOfDay(date),
        to: endOfDay(date),
      },
    ];
  }

  if (period === 'week') {
    const start = startOfWeek(date);

    return Array.from({ length: 7 }).map((_, index) => {
      const current = new Date(start);
      current.setDate(start.getDate() + index);

      return {
        label: current.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
        }),
        from: startOfDay(current),
        to: endOfDay(current),
      };
    });
  }

  if (groupBy === 'week') {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const result: { label: string; from: Date; to: Date }[] = [];

    let cursor = new Date(start);

    while (cursor <= end) {
      const weekStart = startOfWeek(cursor);
      const weekEnd = endOfWeek(cursor);

      result.push({
        label: `${weekStart.getDate()}–${Math.min(weekEnd.getDate(), end.getDate())}`,
        from: weekStart < start ? start : weekStart,
        to: weekEnd > end ? end : weekEnd,
      });

      cursor.setDate(cursor.getDate() + 7);
    }

    return result;
  }

  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const result: { label: string; from: Date; to: Date }[] = [];

  let cursor = new Date(start);

  while (cursor <= end) {
    result.push({
      label: `${cursor.getDate()}/${cursor.getMonth() + 1}`,
      from: startOfDay(cursor),
      to: endOfDay(cursor),
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
};

const isWebApplication = (app: TopApplicationItem) => {
  const joined = `${app.applicationName} ${app.processName}`.toLowerCase();
  return (
    joined.includes('chrome') ||
    joined.includes('firefox') ||
    joined.includes('edge') ||
    joined.includes('opera') ||
    joined.includes('browser') ||
    joined.includes('safari') ||
    joined.includes('yandex')
  );
};

export const DashboardReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const companyId = useAuthStore((state) => state.user?.companyId);

  const [activeTab, setActiveTab] = useState<TabType>('time');
  const [loading, setLoading] = useState(true);

  const [groupBy, setGroupBy] = useState<'day' | 'week'>('day');
  const [isExporting, setIsExporting] = useState(false);
  const [detailedReport, setDetailedReport] = useState<string>('');
  const [appSortAlpha, setAppSortAlpha] = useState<'asc' | 'desc' | ''>('');
  const [appSortTime, setAppSortTime] = useState<'asc' | 'desc' | ''>('');
  const [chartType, setChartType] = useState<'all' | 'web' | 'apps'>('all');

  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [onlyWorkTime, setOnlyWorkTime] = useState(false);

  const [employees, setEmployees] = useState<RawEmployee[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<EfficiencyResponse | null>(null);
  const [efficiencyByDepartment, setEfficiencyByDepartment] = useState<DepartmentEfficiencyItem[]>([]);
  const [dynamicsData, setDynamicsData] = useState<DynamicsItem[]>([]);
  const [topApplications, setTopApplications] = useState<TopApplicationItem[]>([]);

  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        value: String(employee.id),
        label: getEmployeeDisplayName(employee),
      })),
    [employees],
  );

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;

    const loadMeta = async () => {
      try {
        const [employeesResponse, departmentsResponse] = await Promise.all([
          fetchCompanyEmployees(companyId),
          fetchCompanyDepartments(companyId),
        ]);

        if (cancelled) return;

        setEmployees(Array.isArray(employeesResponse) ? employeesResponse : []);
        setDepartments(Array.isArray(departmentsResponse) ? departmentsResponse : []);
      } catch {
        if (cancelled) return;
        setEmployees([]);
        setDepartments([]);
      }
    };

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const employeeId =
          selectedEmployee !== 'all' ? Number(selectedEmployee) : undefined;

        const mainPayload = buildPeriodPayload({
          currentDate,
          period,
          employeeId,
          onlyWorkTime,
        });

        const [mainReport, apps] = await Promise.all([
          fetchEfficiencyReport(mainPayload),
          fetchCompanyTopApplications({
            from: mainPayload.from,
            to: mainPayload.to,
            limit: 5,
          }),
        ]);

        if (cancelled) return;

        setEfficiencyData(mainReport);
        setTopApplications(apps);

        const departmentReports =
          selectedEmployee === 'all' && departments.length > 0
            ? await Promise.all(
                departments.map(async (department) => {
                  const report = await fetchEfficiencyReport({
                    ...mainPayload,
                    departmentId: department.id,
                  });

                  const total = report.totalActiveTime || 0;

                  return {
                    name: department.name,
                    productive: percentFromTotal(report.productiveTime, total),
                    neutral: percentFromTotal(report.neutralTime, total),
                    unproductive: percentFromTotal(report.nonProductiveTime, total),
                    uncategorized: percentFromTotal(report.uncategorizedTime, total),
                    idle: percentFromTotal(report.idleTime, total),
                  };
                }),
              )
            : [
                {
                  name:
                    selectedEmployee === 'all'
                      ? t('dashboard.filters.allEmployees', 'Все сотрудники')
                      : employeeOptions.find((item) => item.value === selectedEmployee)?.label ||
                        `#${selectedEmployee}`,
                  productive: percentFromTotal(mainReport.productiveTime, mainReport.totalActiveTime),
                  neutral: percentFromTotal(mainReport.neutralTime, mainReport.totalActiveTime),
                  unproductive: percentFromTotal(
                    mainReport.nonProductiveTime,
                    mainReport.totalActiveTime,
                  ),
                  uncategorized: percentFromTotal(
                    mainReport.uncategorizedTime,
                    mainReport.totalActiveTime,
                  ),
                  idle: percentFromTotal(mainReport.idleTime, mainReport.totalActiveTime),
                },
              ];

        if (cancelled) return;
        setEfficiencyByDepartment(departmentReports);

        const dynamicRanges = splitPeriodForDynamics(currentDate, period, groupBy);

        const dynamicReports = await Promise.all(
          dynamicRanges.map(async (range) => {
            const report = await fetchEfficiencyReport({
              employeeId,
              from: toIso(range.from),
              to: toIso(range.to),
              date: toDateOnly(range.from),
              groupBy: groupBy === 'week' ? 'WEEK' : 'DAY',
              onlyWorkTime,
              page: 0,
              size: 25,
            });

            return {
              label: range.label,
              productiveSeconds: report.productiveTime || 0,
              neutralSeconds: report.neutralTime || 0,
              nonProductiveSeconds: report.nonProductiveTime || 0,
              uncategorizedSeconds: report.uncategorizedTime || 0,
              idleSeconds: report.idleTime || 0,
              totalSeconds: report.totalActiveTime || 0,
            };
          }),
        );

        if (cancelled) return;
        setDynamicsData(dynamicReports);
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
  }, [
    currentDate,
    period,
    groupBy,
    selectedEmployee,
    onlyWorkTime,
    departments,
    employeeOptions,
    t,
  ]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const employeeId =
        selectedEmployee !== 'all' ? Number(selectedEmployee) : undefined;

      const payload = buildPeriodPayload({
        currentDate,
        period,
        employeeId,
        onlyWorkTime,
      });

      if (activeTab === 'efficiency') {
        await exportEfficiencyReport(payload, `efficiency_${toDateOnly(currentDate)}.xlsx`);
      } else {
        await exportActivityReport(payload, `activity_${toDateOnly(currentDate)}.xlsx`);
      }
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const computedTotals = useMemo(() => {
    const total = efficiencyData?.totalActiveTime || 0;
    const productive = efficiencyData?.productiveTime || 0;
    const neutral = efficiencyData?.neutralTime || 0;
    const unproductive = efficiencyData?.nonProductiveTime || 0;

    return {
      total: formatSecondsToHHMM(total),
      productive: {
        val: formatSecondsToHHMM(productive),
        pct: percentFromTotal(productive, total),
      },
      neutral: {
        val: formatSecondsToHHMM(neutral),
        pct: percentFromTotal(neutral, total),
      },
      unproductive: {
        val: formatSecondsToHHMM(unproductive),
        pct: percentFromTotal(unproductive, total),
      },
    };
  }, [efficiencyData]);

  const displayedApps = useMemo(() => {
    let apps = [...topApplications];

    if (chartType === 'web') {
      apps = apps.filter(isWebApplication);
    } else if (chartType === 'apps') {
      apps = apps.filter((item) => !isWebApplication(item));
    }

    if (appSortAlpha === 'asc') {
      apps.sort((a, b) => a.applicationName.localeCompare(b.applicationName));
    } else if (appSortAlpha === 'desc') {
      apps.sort((a, b) => b.applicationName.localeCompare(a.applicationName));
    }

    if (appSortTime === 'asc') {
      apps.sort((a, b) => a.totalSeconds - b.totalSeconds);
    } else if (appSortTime === 'desc') {
      apps.sort((a, b) => b.totalSeconds - a.totalSeconds);
    }

    return apps.slice(0, 5);
  }, [topApplications, chartType, appSortAlpha, appSortTime]);

  const adjustDate = (dir: number) => {
    const d = new Date(currentDate);

    if (period === 'day') d.setDate(d.getDate() + dir);
    if (period === 'week') d.setDate(d.getDate() + dir * 7);
    if (period === 'month') d.setMonth(d.getMonth() + dir);

    setCurrentDate(d);
  };

  const periodLabel = useMemo(() => {
    if (period === 'day') {
      return currentDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    if (period === 'month') {
      return currentDate.toLocaleDateString('ru-RU', {
        month: 'long',
        year: 'numeric',
      });
    }

    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);

    return `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString('ru-RU', {
      month: 'short',
      year: 'numeric',
    })}`;
  }, [currentDate, period]);

  const renderTimeTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabSplit}>
        <div className={styles.mainContentArea}>
          <div className={styles.cardsRow}>
            <Card
              title="Общее время"
              value={computedTotals.total}
              icon={<IoTimeOutline />}
              iconColor="#8897F9"
            />
            <Card
              title={t('dashboard.cards.productive')}
              value={computedTotals.productive.val}
              icon={<GraphUpIcon />}
              iconColor="#8DE4DB"
            />
            <Card
              title="Нейтрально"
              value={computedTotals.neutral.val}
              icon={<IoTrendingUpOutline />}
              iconColor="#FFCC00"
              iconOpacity="40"
            />
            <Card
              title={t('dashboard.cards.unproductive')}
              value={computedTotals.unproductive.val}
              icon={<IoTimeOutline />}
              iconColor="#FF0000"
              iconOpacity="40"
            />
          </div>

          <div className={styles.appsCard}>
            <div className={styles.appsCardHeader}>
              <h1 className={styles.appsCardTitle}>Топ 5 приложений</h1>
              <div className={styles.appsFilters}>
                <SelectDropdown
                  placeholder="По алфавиту"
                  value={appSortAlpha || undefined}
                  onChange={(val) => {
                    setAppSortAlpha(val as any);
                    setAppSortTime('');
                  }}
                  options={[
                    { value: 'asc', label: 'А → Я' },
                    { value: 'desc', label: 'Я → А' },
                  ]}
                  size="sm"
                  className={styles.appsDropdown}
                  menuClassName={styles.appsDropdownMenu}
                />
                <SelectDropdown
                  placeholder="По времени"
                  value={appSortTime || undefined}
                  onChange={(val) => {
                    setAppSortTime(val as any);
                    setAppSortAlpha('');
                  }}
                  options={[
                    { value: 'desc', label: 'Больше → Меньше' },
                    { value: 'asc', label: 'Меньше → Больше' },
                  ]}
                  size="sm"
                  className={styles.appsDropdown}
                  menuClassName={styles.appsDropdownMenu}
                />
              </div>
            </div>

            <div className={styles.appsTableHeader}>
              <h4 className={styles.appsTableHeaderTitle}>Product Name</h4>
            </div>

            <div className={styles.appList}>
              {displayedApps.map((app, i) => {
                const total = app.totalSeconds || 1;
                const n = Math.round((app.neutralSeconds / total) * 100);
                const p = Math.round((app.productiveSeconds / total) * 100);
                const u = Math.max(
                  0,
                  100 -
                    n -
                    p -
                    Math.round((app.uncategorizedSeconds / total) * 100),
                );

                return (
                  <div key={i} className={styles.appRow}>
                    <div className={styles.appThumb} />
                    <div className={styles.appInfo}>
                      <h3 className={styles.appName}>{app.applicationName}</h3>
                      <h5 className={styles.appDesc}>{app.processName}</h5>
                    </div>

                    <div className={styles.appProgressBar}>
                      <span
                        className={styles.appProgressSegment}
                        style={{
                          width: `${n}%`,
                          backgroundColor: '#FFCC0040',
                        }}
                      >
                        {n}%
                      </span>
                      <span
                        className={styles.appProgressSegment}
                        style={{
                          width: `${p}%`,
                          backgroundColor: '#8DE4DB40',
                        }}
                      >
                        {p}%
                      </span>
                      <span
                        className={styles.appProgressSegment}
                        style={{
                          width: `${u}%`,
                          backgroundColor: '#FF000040',
                        }}
                      >
                        {u}%
                      </span>
                    </div>
                  </div>
                );
              })}

              {displayedApps.length === 0 ? (
                <div className={styles.emptyAppsState}>Нет данных</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEfficiencyTab = () => {
    const depts = efficiencyByDepartment;

    return (
      <div className={styles.tabContent}>
        <div className={styles.efficiencyBlock}>
          <div className={styles.efficiencyBlockHeader}>
            <h2 className={styles.efficiencyBlockTitle}>
              {t('dashboard.efficiency.departments')}
            </h2>
            <div className={styles.efficiencyLegend}>
              <span className={styles.efficiencyLegendItem}>
                <em style={{ background: CHART_COLORS.productive }} />
                {t('dashboard.efficiency.legend.productive')}
              </span>
              <span className={styles.efficiencyLegendItem}>
                <em style={{ background: CHART_COLORS.neutral }} />
                {t('dashboard.efficiency.legend.neutral')}
              </span>
              <span className={styles.efficiencyLegendItem}>
                <em style={{ background: CHART_COLORS.unproductive }} />
                {t('dashboard.efficiency.legend.unproductive')}
              </span>
              <span className={styles.efficiencyLegendItem}>
                <em style={{ background: CHART_COLORS.uncategorized }} />
                {t('dashboard.efficiency.legend.uncategorized')}
              </span>
            </div>
          </div>

          <div className={styles.donutsRow}>
            {depts.map((dept, i) => (
              <div key={i} className={styles.donutCol}>
                <DonutChart
                  productive={dept.productive}
                  neutral={dept.neutral}
                  unproductive={dept.unproductive}
                  uncategorized={dept.uncategorized}
                />
                <span className={styles.donutLabel}>{dept.name}</span>
              </div>
            ))}
          </div>

          <div className={styles.detailedRow}>
            <SelectDropdown
              placeholder={t('dashboard.efficiency.detailedReport')}
              value={detailedReport || undefined}
              onChange={(val) => setDetailedReport((prev) => (prev === val ? '' : val))}
              options={[
                { value: 'dept', label: 'По отделам' },
                { value: 'employee', label: 'По сотруднику' },
              ]}
              className={styles.detailedDropdown}
              menuClassName={styles.detailedDropdownMenu}
            />
          </div>

          {detailedReport ? (
            <div className={styles.detailedSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('dashboard.efficiency.table.dept')}</th>
                    <th className={styles.productiveHdr}>{t('dashboard.efficiency.table.prod')}</th>
                    <th className={styles.neutralHdr}>Нейтрально</th>
                    <th className={styles.unproductiveHdr}>Непродуктивно</th>
                    <th className={styles.uncategorizedHdr}>Без категории</th>
                    <th>{t('dashboard.efficiency.table.idle')}</th>
                  </tr>
                </thead>
                <tbody>
                  {depts.map((dept, i) => (
                    <tr key={i}>
                      <td className={styles.periodCol}>{dept.name}</td>
                      <td className={styles.productive}>{dept.productive}%</td>
                      <td className={styles.neutral}>{dept.neutral}%</td>
                      <td className={styles.unproductive}>{dept.unproductive}%</td>
                      <td className={styles.uncategorized}>{dept.uncategorized}%</td>
                      <td>{dept.idle}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderDynamicsTab = () => (
    <div className={styles.tabContent}>
      <div className={styles.tabSplit}>
        <div className={styles.mainContentArea}>
          <div className={styles.chartWrapper}>
            <div className={styles.chartGrid}>
              <div className={styles.yAxisLabels}>
                <span>0%</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>

              {dynamicsData.map((d, i) => {
                const total = d.totalSeconds || 1;
                const productivePct = percentFromTotal(d.productiveSeconds, total);
                const neutralPct = percentFromTotal(d.neutralSeconds, total);
                const unproductivePct = percentFromTotal(d.nonProductiveSeconds, total);
                const uncategorizedPct = percentFromTotal(d.uncategorizedSeconds, total);

                return (
                  <div key={i} className={styles.chartBar}>
                    <div
                      className={styles.segment}
                      style={{ height: `${productivePct}%`, backgroundColor: '#8DE4DB' }}
                    />
                    <div
                      className={styles.segment}
                      style={{ height: `${neutralPct}%`, backgroundColor: '#FFCC00' }}
                    />
                    <div
                      className={styles.segment}
                      style={{ height: `${unproductivePct}%`, backgroundColor: '#FF0000' }}
                    />
                    <div
                      className={styles.segment}
                      style={{ height: `${uncategorizedPct}%`, backgroundColor: '#D1D5DB' }}
                    />
                  </div>
                );
              })}
            </div>

            <div className={styles.xAxisLabels}>
              <div className={styles.xAxisSpacer} />
              {dynamicsData.map((d, i) => (
                <div key={i} className={styles.xAxisLabel}>
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.dynamicsTableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Период</th>
              <th className={styles.unproductiveHdr}>Непродуктивно</th>
              <th className={styles.uncategorizedHdr}>Без категории</th>
              <th className={styles.neutralHdr}>Нейтрально</th>
              <th className={styles.productiveHdr}>Продуктивно</th>
              <th>Общая активность</th>
            </tr>
          </thead>
          <tbody>
            {dynamicsData.map((d, i) => (
              <tr key={i}>
                <td className={styles.periodCol}>{d.label}</td>
                <td className={styles.unproductive}>
                  {formatSecondsToHHMMSS(d.nonProductiveSeconds)}
                </td>
                <td className={styles.uncategorized}>
                  {formatSecondsToHHMMSS(d.uncategorizedSeconds)}
                </td>
                <td className={styles.neutral}>
                  {formatSecondsToHHMMSS(d.neutralSeconds)}
                </td>
                <td className={styles.productive}>
                  {formatSecondsToHHMMSS(d.productiveSeconds)}
                </td>
                <td className={styles.total}>{formatSecondsToHHMMSS(d.totalSeconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>

        <button
          className={styles.exportBtn}
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? t('dashboard.common.loading') : t('dashboard.common.exportXls')}
          <AttachmentIcon className={styles.exportIcon} />
        </button>
      </header>

      <div className={styles.filtersSection}>
        <DashboardReportsFilter
          period={period}
          onPeriodChange={setPeriod}
          periodLabel={periodLabel}
          onAdjustDate={adjustDate}
          onDateChange={setCurrentDate}
          currentDate={currentDate}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={setSelectedEmployee}
          employees={employeeOptions}
          chartType={chartType}
          onChartTypeChange={setChartType}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          onlyWorkTime={onlyWorkTime}
          onOnlyWorkTimeChange={setOnlyWorkTime}
          showGroupBy={activeTab === 'dynamics' && period !== 'day'}
        />
      </div>

      <div className={styles.tabsBar}>
        {(['time', 'efficiency', 'dynamics'] as TabType[]).map((tab) => (
          <button
            key={tab}
            className={classNames(styles.tabBtn, {
              [styles.active]: activeTab === tab,
            })}
            onClick={() => handleTabChange(tab)}
          >
            {t(`dashboard.tabs.${tab}`)}
          </button>
        ))}
      </div>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.cardsRow}>
              <Skeleton className={styles.skeletonCard} />
              <Skeleton className={styles.skeletonCard} />
              <Skeleton className={styles.skeletonCard} />
              <Skeleton className={styles.skeletonCard} />
            </div>
            <Skeleton className={styles.skeletonChart} />
          </div>
        ) : activeTab === 'time' ? (
          renderTimeTab()
        ) : activeTab === 'efficiency' ? (
          renderEfficiencyTab()
        ) : (
          renderDynamicsTab()
        )}
      </main>
    </div>
  );
};