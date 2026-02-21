import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoChevronDownOutline,
    IoDownloadOutline,
    IoSwapVerticalOutline,
} from 'react-icons/io5';
import { Sidebar } from '@/widgets/sidebar';
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

export const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('time');
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [groupBy, setGroupBy] = useState<'day' | 'week'>('day');
    const [isExporting, setIsExporting] = useState(false);
    const [isDetailedOpen, setIsDetailedOpen] = useState(false);
    const [chartType, setChartType] = useState<'all' | 'web' | 'apps'>('all');

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
            <div className={classNames(styles.deptItem, styles.active)}>
                Все сотрудники
            </div>
            <div className={styles.deptItem}>
                Бэк офис <IoChevronDownOutline className={styles.arrow} />
            </div>
            <div className={styles.deptItem}>
                Личные помощники <IoChevronDownOutline className={styles.arrow} />
            </div>
            <div className={styles.deptItem}>
                ОКК <IoChevronDownOutline className={styles.arrow} />
            </div>
            <div className={styles.deptItem}>
                Отдел продаж <IoChevronDownOutline className={styles.arrow} />
            </div>
            <div className={styles.deptItem}>
                Парсеры <IoChevronDownOutline className={styles.arrow} />
            </div>
            <div className={styles.deptItem}>
                Руководители <IoChevronDownOutline className={styles.arrow} />
            </div>
        </aside>
    );

    const renderTimeTab = () => (
        <div className={styles.tabContent}>
            <div className={styles.tabSplit}>
                {renderDeptSidebar()}
                <div className={styles.mainContentArea}>
                    <div className={styles.cardsRow}>
                        <Card title={t('dashboard.cards.total')} value="40:00" />
                        <Card title={t('dashboard.cards.productive')} value="28:30" hint="71%" percent={71} color="var(--color-productive)" />
                        <Card title={t('dashboard.cards.idle')} value="05:15" hint="13%" percent={13} color="var(--color-idle)" />
                        <Card title={t('dashboard.cards.unproductive')} value="06:15" hint="16%" percent={16} color="var(--color-unproductive)" />
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
                            {dashboardData?.appData.map((app, i) => (
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

                        {isDetailedOpen && (
                            <div className={styles.detailedSection}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Dept</th>
                                            <th>Prod %</th>
                                            <th>Idle %</th>
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
            <div className={styles.tabSplit}>
                {renderDeptSidebar()}

                <div className={styles.mainContentArea}>
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
                        <div className={styles.spinner} />
                        {t('dashboard.common.loading')}
                    </div>

                    <div className={styles.chartGrid}>
                        <div className={styles.yAxisLabels}>
                            <span>0</span>
                            <span>30 мин</span>
                            <span>60 мин</span>
                            <span>90 мин</span>
                            <span>120 мин</span>
                            <span>150 мин</span>
                        </div>
                        {dashboardData?.dynamics[groupBy].map((d: any, i: number) => (
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
                                    <th>{t('dashboard.dynamics.groupBy')}</th>
                                    <th>{t('dashboard.cards.unproductive')}</th>
                                    <th>{t('dashboard.dynamics.uncategorized')}</th>
                                    <th>{t('dashboard.cards.neutral')}</th>
                                    <th>{t('dashboard.cards.productive')}</th>
                                    <th>{t('dashboard.dynamics.totalActivity')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.dynamics[groupBy].map((d: any, i: number) => (
                                    <tr key={i}>
                                        <td>{d.label}</td>
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
        <div className={styles.pageWrapper}>
            <Sidebar />
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
                        <select className={styles.select}>
                            <option>{t('dashboard.filters.periods.week')}</option>
                            <option>{t('dashboard.filters.periods.day')}</option>
                            <option>{t('dashboard.filters.periods.month')}</option>
                        </select>
                        <div className={styles.dateNav}>
                            <button><IoChevronBackOutline /></button>
                            <span>12–18 Feb 2026</span>
                            <button><IoChevronForwardOutline /></button>
                        </div>
                    </div>
                    <div className={styles.filterGroup}>
                        <select className={styles.select}>
                            {dashboardData?.employees.map(e => <option key={e}>{e}</option>)}
                        </select>
                        <select className={styles.select}>
                            <option>{t('dashboard.filters.types.all')}</option>
                            <option>{t('dashboard.filters.types.web')}</option>
                            <option>{t('dashboard.filters.types.apps')}</option>
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
                            <input type="checkbox" />
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
        </div>
    );
};
