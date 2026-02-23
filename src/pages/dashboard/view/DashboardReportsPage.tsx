import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoDownloadOutline,
    IoSwapVerticalOutline,
} from 'react-icons/io5';
import { dashboardApi } from '@/shared/api/mock/dashboard.mock';
import type { DashboardData } from '@/shared/api/mock/dashboard.mock';
import styles from './DashboardPage.module.scss';

type TabType = 'time' | 'efficiency' | 'dynamics';

const Card = ({ title, value, hint, percent, color }: any) => (
    <div className={styles.card}>
        <span className={styles.cardTitle}>{title}</span>
        <div className={styles.cardMain}>
            <span className={styles.cardValue}>{value}</span>
            {hint && <span className={styles.cardHint}>{hint}</span>}
        </div>
        {percent !== undefined && (
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${percent}%`, backgroundColor: color || 'var(--color-accent)' }}
                />
            </div>
        )}
    </div>
);

const Skeleton = ({ className }: { className?: string }) => (
    <div className={classNames(styles.skeleton, className)} />
);

export const DashboardReportsPage: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('time');
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [groupBy, setGroupBy] = useState<'day' | 'week'>('day');
    const [isExporting, setIsExporting] = useState(false);
    const [isDetailedOpen, setIsDetailedOpen] = useState(false);
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

    const renderDeptSidebar = () => (
        <aside className={styles.deptSidebar}>
            {departmentsList.map(dept => (
                <div
                    key={dept.id}
                    className={classNames(styles.deptItem, { [styles.active]: selectedDept === dept.id })}
                    onClick={() => setSelectedDept(dept.id)}
                    style={{ cursor: 'pointer' }}
                >
                    {dept.label}
                </div>
            ))}
        </aside>
    );

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
                {renderDeptSidebar()}
                <div className={styles.mainContentArea}>
                    <div className={styles.cardsRow}>
                        <Card title={t('dashboard.cards.total')} value={computedTotals.total} />
                        <Card title={t('dashboard.cards.productive')} value={computedTotals.productive.val} hint={`${computedTotals.productive.pct}%`} percent={computedTotals.productive.pct} color="var(--color-productive)" />
                        <Card title={t('dashboard.cards.idle')} value={computedTotals.idle.val} hint={`${computedTotals.idle.pct}%`} percent={computedTotals.idle.pct} color="var(--color-idle)" />
                        <Card title={t('dashboard.cards.unproductive')} value={computedTotals.unproductive.val} hint={`${computedTotals.unproductive.pct}%`} percent={computedTotals.unproductive.pct} color="var(--color-unproductive)" />
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>{t('dashboard.topApps.title')}</h2>
                            <button className={styles.sortBtn}>
                                <IoSwapVerticalOutline />
                                {t('dashboard.topApps.sortByTime')}
                            </button>
                        </div>
                        <div className={styles.appList}>
                            {displayedApps.map((app: any, i: number) => (
                                <div key={i} className={styles.appRow}>
                                    <span className={styles.appName}>{app.name}</span>
                                    <div className={styles.stackedBar}>
                                        <div className={styles.segment} style={{ width: `${app.productive}%`, backgroundColor: 'var(--color-productive)' }} />
                                        <div className={styles.segment} style={{ width: `${app.neutral}%`, backgroundColor: 'var(--color-neutral)' }} />
                                        <div className={styles.segment} style={{ width: `${app.unproductive}%`, backgroundColor: 'var(--color-unproductive)' }} />
                                    </div>
                                    <span className={styles.appTime}>{app.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEfficiencyTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.tabSplit}>
                {renderDeptSidebar()}
                <div className={styles.mainContentArea}>
                    <div className={styles.section}>
                        <h2>{t('dashboard.efficiency.departments')}</h2>
                        <div className={styles.efficiencyMainContent}>
                            <div className={styles.legendContainer}>
                                <div className={styles.legend}>
                                    <div className={styles.legendItem}><span style={{ backgroundColor: 'var(--color-productive)' }} />{t('dashboard.efficiency.legend.productive')}</div>
                                    <div className={styles.legendItem}><span style={{ backgroundColor: 'var(--color-neutral)' }} />{t('dashboard.efficiency.legend.neutral')}</div>
                                    <div className={styles.legendItem}><span style={{ backgroundColor: 'var(--color-unproductive)' }} />{t('dashboard.efficiency.legend.unproductive')}</div>
                                    <div className={styles.legendItem}><span style={{ backgroundColor: 'var(--color-uncategorized)' }} />{t('dashboard.efficiency.legend.uncategorized')}</div>
                                    <div className={styles.legendItem}><span style={{ backgroundColor: 'var(--color-idle)' }} />{t('dashboard.efficiency.legend.idle')}</div>
                                </div>
                                <button
                                    className={styles.detailedBtn}
                                    onClick={() => setIsDetailedOpen(!isDetailedOpen)}
                                >
                                    {t('dashboard.efficiency.detailedReport')}
                                </button>
                            </div>

                            <div className={styles.histograms}>
                                {dashboardData?.efficiencyDept.map((dept, i) => (
                                    <div key={i} className={styles.histoCol}>
                                        <div className={styles.verticalStackedBar}>
                                            <div className={styles.vSegment} style={{ height: `${dept.productive}%`, backgroundColor: 'var(--color-productive)' }} />
                                            <div className={styles.vSegment} style={{ height: `${dept.neutral}%`, backgroundColor: 'var(--color-neutral)' }} />
                                            <div className={styles.vSegment} style={{ height: `${dept.unproductive}%`, backgroundColor: 'var(--color-unproductive)' }} />
                                            <div className={styles.vSegment} style={{ height: `${dept.uncategorized}%`, backgroundColor: 'var(--color-uncategorized)' }} />
                                            <div className={styles.vSegment} style={{ height: `${dept.idle}%`, backgroundColor: 'var(--color-idle)' }} />
                                        </div>
                                        <span className={styles.histoLabel}>{dept.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isDetailedOpen && (
                            <div className={styles.detailedSection}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>{t('dashboard.efficiency.table.dept')}</th>
                                            <th>{t('dashboard.efficiency.table.prod')}</th>
                                            <th>{t('dashboard.efficiency.table.idle')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData?.efficiencyDept.map((dept, i) => (
                                            <tr key={i}>
                                                <td>{dept.name}</td>
                                                <td>{dept.productive}%</td>
                                                <td>{dept.idle}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDynamicsTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.dynamicsHeader}>
                <div className={styles.chartTopControls}>
                    <div
                        className={classNames(styles.typeOption, { [styles.active]: chartType === 'web' })}
                        onClick={() => setChartType('web')}
                    >
                        {t('dashboard.filters.types.web')}
                    </div>
                    <div
                        className={classNames(styles.typeOption, { [styles.active]: chartType === 'apps' })}
                        onClick={() => setChartType('apps')}
                    >
                        {t('dashboard.filters.types.apps')}
                    </div>
                    <div
                        className={classNames(styles.typeOption, styles.accent, { [styles.active]: chartType === 'all' })}
                        onClick={() => setChartType('all')}
                    >
                        {t('dashboard.filters.types.total')}
                    </div>
                </div>

                <div className={styles.infoBanner}>
                    <div className={styles.infoIcon}>i</div>
                    Данные в отчете по динамике усреднены
                </div>
            </div>

            <div className={styles.tabSplit}>
                {renderDeptSidebar()}

                <div className={styles.mainContentArea}>
                    <div className={styles.chartGrid}>
                        <div className={styles.yAxisLabels}>
                            <span>0 сек</span>
                            <span>10 сек</span>
                            <span>20 сек</span>
                            <span>30 сек</span>
                            <span>40 сек</span>
                            <span>50 сек</span>
                        </div>
                        {displayedDynamics.map((d: any, i: number) => (
                            <div key={i} className={styles.chartBar}>
                                <div className={styles.segment} style={{ height: `${d.productive}%`, backgroundColor: 'var(--color-productive)' }} />
                                <div className={styles.segment} style={{ height: `${d.neutral}%`, backgroundColor: 'var(--color-neutral)' }} />
                                <div className={styles.segment} style={{ height: `${d.unproductive}%`, backgroundColor: 'var(--color-unproductive)' }} />
                                <div className={styles.segment} style={{ height: `${d.uncategorized}%`, backgroundColor: 'var(--color-uncategorized)' }} />
                                <span className={styles.label}>{d.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableSection}>
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
                    <IoDownloadOutline />
                    {isExporting ? t('dashboard.common.loading') : t('dashboard.common.exportXls')}
                </button>
            </header>

            <div className={styles.filtersBar}>
                <div className={styles.filterGroup}>
                    <select 
                        className={styles.select}
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                    >
                        <option value="week">{t('dashboard.filters.periods.week')}</option>
                        <option value="day">{t('dashboard.filters.periods.day')}</option>
                        <option value="month">{t('dashboard.filters.periods.month')}</option>
                    </select>
                    <div className={styles.dateNav}>
                        <button onClick={() => adjustDate(-1)}><IoChevronBackOutline /></button>
                        <label className={styles.datePickerWrapper}>
                            <span>{periodLabel}</span>
                            <input 
                                type="date"
                                className={styles.hiddenDateInput}
                                value={currentDate.toISOString().split('T')[0]}
                                onChange={(e) => {
                                    if(e.target.value) setCurrentDate(new Date(e.target.value));
                                }}
                            />
                        </label>
                        <button onClick={() => adjustDate(1)}><IoChevronForwardOutline /></button>
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <select 
                        className={styles.select}
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        <option value="all">{t('dashboard.filters.allEmployees', 'Все сотрудники')}</option>
                        {dashboardData?.employees.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <select 
                        className={styles.select}
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as any)}
                    >
                        <option value="all">{t('dashboard.filters.types.all')}</option>
                        <option value="web">{t('dashboard.filters.types.web')}</option>
                        <option value="apps">{t('dashboard.filters.types.apps')}</option>
                    </select>
                    {activeTab === 'dynamics' && (
                        <select
                            className={styles.select}
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as any)}
                        >
                            <option value="day">{t('dashboard.dynamics.day')}</option>
                            <option value="week">{t('dashboard.dynamics.week')}</option>
                        </select>
                    )}
                    <label className={styles.checkboxLabel}>
                        <input 
                            type="checkbox" 
                            checked={onlyWorkTime}
                            onChange={(e) => setOnlyWorkTime(e.target.checked)}
                        />
                        {t('dashboard.filters.onlyWorkTime')}
                    </label>
                </div>
            </div>

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
