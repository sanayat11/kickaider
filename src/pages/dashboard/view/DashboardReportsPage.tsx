import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    IoSwapVerticalOutline,
    IoTimeOutline,
    IoTrendingUpOutline,
} from 'react-icons/io5';
import { AttachmentIcon, GraphUpIcon } from '@/shared/assets/icons';
import { dashboardApi } from '@/shared/api/mock/dashboard.mock';
import type { DashboardData } from '@/shared/api/mock/dashboard.mock';
import styles from './DashboardPage.module.scss';
import { DashboardReportsFilter } from './DashboardReportsFilter';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';

type TabType = 'time' | 'efficiency' | 'dynamics';

const Card = ({ title, value, hint, icon, iconColor, iconOpacity = '33' }: any) => (
    <div className={styles.card}>
        <div className={styles.cardBody}>
            <div className={styles.cardText}>
                <span className={styles.cardTitle}>{title}</span>
                <div className={styles.cardMain}>
                    <span className={styles.cardValue}>{value}</span>
                    {hint && <span className={styles.cardHint}>{hint}</span>}
                </div>
            </div>
            {icon && (
                <div className={styles.cardIconBox} style={{ backgroundColor: iconColor ? `${iconColor}${iconOpacity}` : undefined, color: iconColor }}>
                    {icon}
                </div>
            )}
        </div>
    </div>
);

const Skeleton = ({ className }: { className?: string }) => (
    <div className={classNames(styles.skeleton, className)} />
);

const CHART_COLORS = {
    productive: '#34c759',
    neutral: '#F59E0B',
    unproductive: '#ff3b30',
    uncategorized: '#f2f2f7',
    idle: '#e5e5ea',
};

const DonutChart: React.FC<{
    productive: number; neutral: number; unproductive: number; uncategorized: number; idle: number;
}> = ({ productive, neutral, unproductive, uncategorized, idle }) => {
    const size = 90;
    const cx = 45, cy = 45, R = 38, r = 24;
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
        const d = `M${cx + R * c1[0]} ${cy + R * c1[1]} A${R} ${R} 0 ${large} 1 ${cx + R * c2[0]} ${cy + R * c2[1]} L${cx + r * c2[0]} ${cy + r * c2[1]} A${r} ${r} 0 ${large} 0 ${cx + r * c1[0]} ${cy + r * c1[1]}Z`;
        a = a2;
        return [{ d, fill: seg.fill }];
    });
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {paths.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)}
        </svg>
    );
};

export const DashboardReportsPage: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('time');
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [groupBy, setGroupBy] = useState<'day' | 'week'>('day');
    const [isExporting, setIsExporting] = useState(false);
    const [detailedReport, setDetailedReport] = useState<string>('');
    const [appSortAlpha, setAppSortAlpha] = useState<'asc' | 'desc' | ''>('');
    const [appSortTime, setAppSortTime] = useState<'asc' | 'desc' | ''>('');
    const [chartType, setChartType] = useState<'all' | 'web' | 'apps'>('all');

    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
    const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 1, 15)); // 15 Feb 2026

    const [selectedDept, setSelectedDept] = useState<string>('all');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
    const [onlyWorkTime, setOnlyWorkTime] = useState(false);

    const departmentsList = [
        { id: 'all', label: t('dashboard.departments.all') },
        { id: 'backOffice', label: t('dashboard.departments.backOffice') },
        { id: 'personalAssistants', label: t('dashboard.departments.personalAssistants') },
        { id: 'qualityControl', label: t('dashboard.departments.qualityControl') },
        { id: 'sales', label: t('dashboard.departments.sales') },
        { id: 'parsers', label: t('dashboard.departments.parsers') },
        { id: 'managers', label: t('dashboard.departments.managers') },
    ];

    useEffect(() => {
        setLoading(true);
        dashboardApi.getDashboardData().then(data => {
            setDashboardData(data);
            setLoading(false);
        });
    }, [activeTab]);

    const handleTabChange = (tab: TabType) => {
        setLoading(true);
        setActiveTab(tab);
    };

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            alert(t('dashboard.common.exportedMock'));
        }, 1000);
    };

   
    // Compute dynamic data based on selected dept, employee, filters
    const computedTotals = useMemo(() => {
        const baseTotalMins = 40 * 60; // 40 hours as minutes
        let factor = 1;
        if (selectedDept !== 'all') {
            factor *= 0.4 + (departmentsList.findIndex(d => d.id === selectedDept) * 0.15);
        }
        if (selectedEmployee !== 'all') factor *= 0.15; // single employee is less time
        if (chartType === 'web') factor *= 0.6;
        if (chartType === 'apps') factor *= 0.4;
        if (onlyWorkTime) factor *= 0.85;
        
        const totalLine = Math.round(baseTotalMins * factor);
        const prodPct = Math.min(100, Math.round(71 * (factor > 0.8 ? 1.1 : 0.85)));
        const idlePct = Math.round(13 * (factor > 0.8 ? 0.9 : 1.3));
        const unprodPct = Math.max(0, 100 - prodPct - idlePct);

        const fmt = (m: number) => `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;

        return {
            total: fmt(totalLine),
            productive: { val: fmt(Math.round((totalLine * prodPct) / 100)), pct: prodPct },
            idle: { val: fmt(Math.round((totalLine * idlePct) / 100)), pct: idlePct },
            unproductive: { val: fmt(Math.round((totalLine * unprodPct) / 100)), pct: unprodPct }
        };
    }, [selectedDept, selectedEmployee, chartType, onlyWorkTime]);

    const displayedApps = useMemo(() => {
        if (!dashboardData) return [];
        let curApps = dashboardData.appData;

        let factor = 0.5 + (departmentsList.findIndex(d => d.id === selectedDept) * 0.1);
        if (selectedEmployee !== 'all') factor *= 0.8;
        if (onlyWorkTime) factor *= 0.9;
        if (chartType === 'web') curApps = curApps.filter(a => a.name.includes('Google') || a.name.includes('Yandex') || a.name.includes('Figma'));
        if (chartType === 'apps') curApps = curApps.filter(a => a.name.includes('Word') || a.name.includes('Excel') || a.name.includes('Telegram') || a.name.includes('1C'));

        return curApps.map(app => {
            const hMatch = app.total.match(/(\d+)h/);
            const mMatch = app.total.match(/(\d+)m/);
            const hrs = hMatch ? parseInt(hMatch[1]) : 0;
            const mins = mMatch ? parseInt(mMatch[1]) : 0;
            const totalMins = Math.round((hrs * 60 + mins) * factor);
            const newHrs = Math.floor(totalMins / 60);
            const newMins = totalMins % 60;

            return {
                ...app,
                productive: Math.min(100, Math.round(app.productive * (factor > 0.7 ? 1.2 : 0.8))),
                unproductive: Math.min(100, Math.round(app.unproductive * (factor > 0.7 ? 0.8 : 1.2))),
                total: `${newHrs > 0 ? newHrs + 'h ' : ''}${newMins}m`
            };
        });
    }, [dashboardData, selectedDept, selectedEmployee, chartType, onlyWorkTime]);

    const adjustDate = (dir: number) => {
        const d = new Date(currentDate);
        if (period === 'day') d.setDate(d.getDate() + dir);
        if (period === 'week') d.setDate(d.getDate() + dir * 7);
        if (period === 'month') d.setMonth(d.getMonth() + dir);
        setCurrentDate(d);
    };

    const periodLabel = useMemo(() => {
        if (period === 'day') {
            return currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
        }
        if (period === 'month') {
            return currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
        }
        // week
        const start = new Date(currentDate);
        start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })}`;
    }, [currentDate, period]);

    const displayedDynamics = useMemo(() => {
        if (!dashboardData) return [];
        const baseData = dashboardData.dynamics[groupBy];
        
        let multiplier = 1;
        if (chartType === 'web') multiplier = 0.6;
        if (chartType === 'apps') multiplier = 0.4;
        
        return baseData.map(d => {
            const baseMatches = d.total.match(/(\d+):(\d+):(\d+)/);
            let totalSecs = 0;
            if (baseMatches) {
                totalSecs = parseInt(baseMatches[1]) * 3600 + parseInt(baseMatches[2]) * 60 + parseInt(baseMatches[3]);
            }
            const newTotalSecs = Math.round(totalSecs * multiplier);
            const h = Math.floor(newTotalSecs / 3600).toString().padStart(2, '0');
            const m = Math.floor((newTotalSecs % 3600) / 60).toString().padStart(2, '0');
            const s = (newTotalSecs % 60).toString().padStart(2, '0');
            
            return {
                ...d,
                productive: Math.min(100, Math.round(d.productive * (chartType === 'web' ? 1.1 : 0.9))),
                unproductive: Math.min(100, Math.round(d.unproductive * (chartType === 'apps' ? 1.2 : 0.8))),
                total: `${h}:${m}:${s}`
            };
        });
    }, [dashboardData, groupBy, chartType]);

    const renderTimeTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.tabSplit}>
                <div className={styles.mainContentArea}>
                    <div className={styles.cardsRow}>
                        <Card title="Общее время" value={computedTotals.total} icon={<IoTimeOutline />} iconColor="#8897F9" />
                        <Card title={t('dashboard.cards.productive')} value={computedTotals.productive.val} icon={<GraphUpIcon />} iconColor="#8DE4DB" />
                        <Card title="Нейтрально" value={computedTotals.idle.val} icon={<IoTrendingUpOutline />} iconColor="#FFCC00" iconOpacity="40" />
                        <Card title={t('dashboard.cards.unproductive')} value={computedTotals.unproductive.val} icon={<IoTimeOutline />} iconColor="#FF0000" iconOpacity="40" />
                    </div>

                    <div className={styles.appsCard}>
                        <div className={styles.appsCardHeader}>
                            <h1 className={styles.appsCardTitle}>Топ 5 приложений</h1>
                            <div className={styles.appsFilters}>
                                <SelectDropdown
                                    placeholder="По алфавиту"
                                    value={appSortAlpha || undefined}
                                    onChange={(val) => { setAppSortAlpha(val as any); setAppSortTime(''); }}
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
                                    onChange={(val) => { setAppSortTime(val as any); setAppSortAlpha(''); }}
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
                            {[...displayedApps]
                                .sort((a: any, b: any) => {
                                    if (appSortAlpha === 'asc') return a.name.localeCompare(b.name);
                                    if (appSortAlpha === 'desc') return b.name.localeCompare(a.name);
                                    return 0;
                                })
                                .map((app: any, i: number) => {
                                    const total = (app.neutral || 0) + (app.productive || 0) + (app.unproductive || 0) || 100;
                                    const n = Math.round((app.neutral || 0) / total * 100);
                                    const p = Math.round((app.productive || 0) / total * 100);
                                    const u = 100 - n - p;
                                    return (
                                    <div key={i} className={styles.appRow}>
                                        <div className={styles.appThumb} />
                                        <div className={styles.appInfo}>
                                            <h3 className={styles.appName}>{app.name}</h3>
                                            <h5 className={styles.appDesc}>Отслеживание активности</h5>
                                        </div>
                                        <div className={styles.appProgressBar}>
                                            <span className={styles.appProgressSegment} style={{ width: `${n}%`, backgroundColor: '#FFCC0040' }}>{n}%</span>
                                            <span className={styles.appProgressSegment} style={{ width: `${p}%`, backgroundColor: '#8DE4DB40' }}>{p}%</span>
                                            <span className={styles.appProgressSegment} style={{ width: `${u}%`, backgroundColor: '#FF000040' }}>{u}%</span>
                                        </div>
                                    </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEfficiencyTab = () => {
        const depts = dashboardData?.efficiencyDept ?? [];

        return (
            <div className={styles.tabContent}>
                <div className={styles.efficiencyBlock}>
                    <div className={styles.efficiencyBlockHeader}>
                        <h2 className={styles.efficiencyBlockTitle}>{t('dashboard.efficiency.departments')}</h2>
                        <div className={styles.efficiencyLegend}>
                            <span className={styles.efficiencyLegendItem}><em style={{ background: CHART_COLORS.productive }} />{t('dashboard.efficiency.legend.productive')}</span>
                            <span className={styles.efficiencyLegendItem}><em style={{ background: CHART_COLORS.neutral }} />{t('dashboard.efficiency.legend.neutral')}</span>
                            <span className={styles.efficiencyLegendItem}><em style={{ background: CHART_COLORS.unproductive }} />{t('dashboard.efficiency.legend.unproductive')}</span>
                            <span className={styles.efficiencyLegendItem}><em style={{ background: CHART_COLORS.uncategorized }} />{t('dashboard.efficiency.legend.uncategorized')}</span>
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
                                    idle={dept.idle}
                                />
                                <span className={styles.donutLabel}>{dept.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.detailedRow}>
                        <SelectDropdown
                            placeholder={t('dashboard.efficiency.detailedReport')}
                            value={detailedReport || undefined}
                            onChange={(val) => setDetailedReport(prev => prev === val ? '' : val)}
                            options={[
                                { value: 'dept', label: 'По отделам' },
                                { value: 'employee', label: 'По сотрудникам' },
                            ]}
                            className={styles.detailedDropdown}
                            menuClassName={styles.detailedDropdownMenu}
                        />
                    </div>

                    {detailedReport && (
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
                    )}
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
                                <span>0 мин</span>
                                <span>10 мин</span>
                                <span>20 мин</span>
                                <span>30 мин</span>
                                <span>40 мин</span>
                                <span>50 мин</span>
                            </div>
                            {displayedDynamics.map((d: any, i: number) => (
                                <div key={i} className={styles.chartBar}>
                                    <div className={styles.segment} style={{ height: `${d.productive}%`, backgroundColor: '#8DE4DB' }} />
                                    <div className={styles.segment} style={{ height: `${d.neutral}%`, backgroundColor: '#FFCC00' }} />
                                    <div className={styles.segment} style={{ height: `${d.unproductive}%`, backgroundColor: '#FF0000' }} />
                                    <div className={styles.segment} style={{ height: `${d.uncategorized}%`, backgroundColor: '#D1D5DB' }} />
                                </div>
                            ))}
                        </div>
                        <div className={styles.xAxisLabels}>
                            <div className={styles.xAxisSpacer} />
                            {displayedDynamics.map((d: any, i: number) => (
                                <div key={i} className={styles.xAxisLabel}>{d.label}</div>
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
                        {displayedDynamics.map((d: any, i: number) => (
                            <tr key={i}>
                                <td className={styles.periodCol}>{d.label} - {d.label.replace('00', '59')}</td>
                                <td className={styles.unproductive}>00:00:00</td>
                                <td className={styles.uncategorized}>00:00:00</td>
                                <td className={styles.neutral}>00:00:00</td>
                                <td className={styles.productive}>00:00:00</td>
                                <td className={styles.total}>{d.total}</td>
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

            <DashboardReportsFilter
                period={period}
                onPeriodChange={setPeriod}
                periodLabel={periodLabel}
                onAdjustDate={adjustDate}
                onDateChange={setCurrentDate}
                currentDate={currentDate}
                selectedEmployee={selectedEmployee}
                onEmployeeChange={setSelectedEmployee}
                employees={dashboardData?.employees ?? []}
                chartType={chartType}
                onChartTypeChange={setChartType}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                onlyWorkTime={onlyWorkTime}
                onOnlyWorkTimeChange={setOnlyWorkTime}
                showGroupBy={false}
            />

            <div className={styles.tabsBar}>
                {(['time', 'efficiency', 'dynamics'] as TabType[]).map(tab => (
                    <button
                        key={tab}
                        className={classNames(styles.tabBtn, { [styles.active]: activeTab === tab })}
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
                ) : (
                    activeTab === 'time' ? renderTimeTab() :
                        activeTab === 'efficiency' ? renderEfficiencyTab() :
                            renderDynamicsTab()
                )}
            </main>
        </div>
    );
};
