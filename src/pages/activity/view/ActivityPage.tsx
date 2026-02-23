import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoSearchOutline,
    IoInformationCircleOutline,
    IoCalendarOutline
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ActivityPage.module.scss';
import dashboardStyles from '@/pages/dashboard/view/DashboardPage.module.scss';
import { Select } from '@/shared/ui/select/view/Select';
import { Checkbox } from '@/shared/ui/checkbox/view/CheckBox';
import { activityMockApi } from '@/shared/api/mock/activity.mock';
import type { Employee, ActivityBlock, ActivityState } from '@/shared/api/mock/activity.mock';


const DEPARTMENTS = ['Company', 'IT', 'Marketing', 'Sales', 'HR', 'Finance'];

export const ActivityPage: React.FC = () => {
    const { t } = useTranslation();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDepts, setSelectedDepts] = useState<string[]>(['Company']);
    const [timeMode, setTimeMode] = useState('allDay');
    const [customRange, setCustomRange] = useState({ from: '09:00', to: '18:00' });
    const [scale, setScale] = useState('1hour');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [tooltip, setTooltip] = useState<{
        open: boolean,
        x: number,
        y: number,
        employee: Employee | null,
        block: ActivityBlock | null
    }>({ open: false, x: 0, y: 0, employee: null, block: null });

    // Pagination state
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const containerRef = useRef<HTMLDivElement>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await activityMockApi.getTimelineDay({
                date,
                departments: selectedDepts,
                searchQuery
            });
            setEmployees(data);
        } catch (err) {
            setError(t('common.error') || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [date, selectedDepts, searchQuery]);

    // Reset page on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [date, selectedDepts, searchQuery, itemsPerPage]);

    // Derived paginated data
    // Add copies to simulate large dataset if needed, like in DayDetailsPage
    const fullData = useMemo(() => {
        let data = [...employees];
        if (data.length > 0 && data.length < 15 && selectedDepts.includes('Company') && !searchQuery) {
            for(let i=0; i<30; i++) {
                data.push({...data[i % employees.length], id: `${data[i % employees.length].id}_${i}`, fullName: `${data[i % employees.length].fullName} (Копия ${i + 1})`});
            }
        }
        return data;
    }, [employees, selectedDepts, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(fullData.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const currentItems = fullData.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'prev' && safeCurrentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
        if (direction === 'next' && safeCurrentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
        setTooltip(prev => ({ ...prev, open: false })); // hide tooltip on page change
    };

    const renderSkeleton = () => (
        <div className={styles.skeletonContainer}>
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                    <div className={classNames(styles.skeleton, styles.skeletonAvatar)} />
                    <div className={classNames(styles.skeleton, styles.skeletonText)} />
                    <div className={styles.skeletonGrid}>
                        {Array.from({ length: 12 }).map((_, j) => (
                            <div key={j} className={classNames(styles.skeleton, styles.skeletonCell)} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const timeSlots = useMemo(() => {
        const slots: string[] = [];
        let start = 0;
        let end = 24;
        let step = 1;

        if (timeMode === 'workTime') {
            start = 9;
            end = 18;
        } else if (timeMode === 'custom') {
            const [fH] = customRange.from.split(':').map(Number);
            const [tH] = customRange.to.split(':').map(Number);
            start = fH;
            end = tH;
        }

        if (scale === '15min') step = 0.25;
        if (scale === '5min') step = 1 / 12;
        if (scale === '1min') step = 1 / 60;

        let count = 0;
        for (let t = start; t < end; t += step) {
            if (count > 120) break;
            const h = Math.floor(t);
            const m = Math.round((t % 1) * 60);
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
            count++;
        }
        return slots;
    }, [timeMode, customRange, scale]);

    const handleCellMouseEnter = (e: React.MouseEvent, emp: Employee, block: ActivityBlock) => {
        setTooltip({
            open: true,
            x: e.clientX,
            y: e.clientY,
            employee: emp,
            block: block
        });
    };

    const handleCellMouseMove = (e: React.MouseEvent) => {
        if (tooltip.open) {
            setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
        }
    };

    const handleCellMouseLeave = () => {
        setTooltip(prev => ({ ...prev, open: false }));
    };



    const handleDateChange = (days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().split('T')[0]);
    };

    const toggleDept = (dept: string) => {
        if (dept === 'Company') {
            setSelectedDepts(['Company']);
        } else {
            const newDepts = selectedDepts.filter(d => d !== 'Company');
            if (newDepts.includes(dept)) {
                const next = newDepts.filter(d => d !== dept);
                setSelectedDepts(next.length ? next : ['Company']);
            } else {
                setSelectedDepts([...newDepts, dept]);
            }
        }
    };

    return (
        <div className={classNames(styles.activityPage, dashboardStyles.container)} ref={containerRef}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{t('activity.timeline.title')}</h1>
                    <p>{t('activity.timeline.subtitle')}</p>
                </div>
            </header>

            <section className={classNames(styles.card, styles.filtersCard)}>
                <div className={styles.filtersGrid}>
                    <div className={styles.filterGroup}>
                        <div className={styles.datePicker}>
                            <button className={styles.navBtn} onClick={() => handleDateChange(-1)}><IoChevronBackOutline /></button>
                            <div className={styles.dateDisplay}>
                                <IoCalendarOutline size={16} />
                                <span>{date}</span>
                            </div>
                            <button className={styles.navBtn} onClick={() => handleDateChange(1)}><IoChevronForwardOutline /></button>
                        </div>
                        <div className={styles.deptList}>
                            {DEPARTMENTS.map(dept => (
                                <Checkbox
                                    key={dept}
                                    label={dept === 'Company' ? t('dashboard.departments.all') : dept}
                                    checked={selectedDepts.includes(dept)}
                                    onChange={() => toggleDept(dept)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <div className={styles.timeModeWrapper}>
                            <Select
                                value={timeMode}
                                onChange={setTimeMode}
                                options={[
                                    { label: t('activity.timeline.filters.allDay'), value: 'allDay' },
                                    { label: t('activity.timeline.filters.workTime'), value: 'workTime' },
                                    { label: t('activity.timeline.filters.custom'), value: 'custom' },
                                ]}
                            />
                            {timeMode === 'custom' && (
                                <div className={styles.timeInputs}>
                                    <input type="time" value={customRange.from} onChange={e => setCustomRange({ ...customRange, from: e.target.value })} />
                                    <input type="time" value={customRange.to} onChange={e => setCustomRange({ ...customRange, to: e.target.value })} />
                                </div>
                            )}
                        </div>
                        <Select
                            value={scale}
                            onChange={setScale}
                            options={[
                                { label: `1 ${t('dashboard.common.hoursShort')}`, value: '1hour' },
                                { label: `15 ${t('dashboard.common.minutesShort')}`, value: '15min' },
                                { label: `5 ${t('dashboard.common.minutesShort')}`, value: '5min' },
                                { label: `1 ${t('dashboard.common.minutesShort')}`, value: '1min' },
                            ]}
                        />
                        <div className={styles.searchWrapper}>
                            <IoSearchOutline className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={t('activity.timeline.filters.searchApp')}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.tableCard}>
                <div className={styles.legendRow}>
                    {(['productive', 'neutral', 'unproductive', 'uncategorized', 'idle', 'nodata'] as ActivityState[]).map(state => (
                        <div key={state} className={styles.legendItem}>
                            <div className={classNames(styles.dot, styles[`state_${state}`])} />
                            <span>{t(`activity.timeline.legend.${state}`)}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.gridContainer}>
                    {loading ? renderSkeleton() : (
                        error ? (
                            <div className={styles.errorBanner}>
                                <IoInformationCircleOutline size={20} />
                                <span>{error}</span>
                                <button className={styles.retryBtn} onClick={loadData}>{t('common.retry')}</button>
                            </div>
                        ) : employees.length === 0 ? (
                            <div className={styles.emptyState}>
                                <IoInformationCircleOutline className={styles.icon} />
                                <p>{t('common.noData')}</p>
                            </div>
                        ) : (
                            <table className={styles.timelineTable}>
                                <thead>
                                    <tr>
                                        <th className={classNames(styles.frozenColumn, styles.timeHeader)}>{t('reports.workTime.table.employee')}</th>
                                        {timeSlots.map(slot => (
                                            <th key={slot} className={styles.timeHeader}>{slot}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(emp => (
                                        <tr key={emp.id} className={styles.gridRow}>
                                            <td className={styles.frozenColumn}>
                                                <Link to={`/activity/${emp.id}?date=${date}`} className={styles.employeeLink}>
                                                    <div className={styles.employeeInfo}>
                                                        <div className={styles.avatar}>{emp.fullName.split(' ').map(n => n[0]).join('')}</div>
                                                        <div className={styles.details}>
                                                            <span className={styles.name}>{emp.fullName}</span>
                                                            <span className={styles.dept}>{emp.department}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            {timeSlots.map(slot => {
                                                const block = emp.timeline.find(b => {
                                                    const [sh, sm] = b.start.split(':').map(Number);
                                                    const [eh, em] = b.end.split(':').map(Number);
                                                    const [slotH, slotM] = slot.split(':').map(Number);
                                                    const startTime = sh * 60 + sm;
                                                    const endTime = eh * 60 + em;
                                                    const slotTime = slotH * 60 + slotM;
                                                    return slotTime >= startTime && slotTime < endTime;
                                                });


                                                return (
                                                    <td
                                                        key={slot}
                                                        className={styles.cell}
                                                        onMouseEnter={(e) => block && handleCellMouseEnter(e, emp, block)}
                                                        onMouseMove={handleCellMouseMove}
                                                        onMouseLeave={handleCellMouseLeave}
                                                    >
                                                        {!block && <div className={styles.nodataText}>{t('activity.timeline.legend.nodata')}</div>}
                                                        {block && (
                                                            <div className={classNames(styles.block, styles[`state_${block.state}`])} />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>

                {fullData.length > 0 && !loading && !error && (
                    <div className={styles.pagination}>
                        <div className={styles.pageInfo}>
                            {t('reports.rating.showEntries', 'Показывать:')}
                            <select
                                className={styles.perPageSelect}
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className={styles.pageControls}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange('prev')}
                                disabled={safeCurrentPage === 1}
                                style={{ opacity: safeCurrentPage === 1 ? 0.5 : 1, cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                <IoChevronBackOutline />
                            </button>
                            <span className={styles.pageCurrent}>{safeCurrentPage}</span>
                            <span className={styles.pageTotal}>{t('reports.rating.of', 'из')} {totalPages}</span>
                            <button
                                className={styles.pageBtn}
                                onClick={() => handlePageChange('next')}
                                disabled={safeCurrentPage === totalPages}
                                style={{ opacity: safeCurrentPage === totalPages ? 0.5 : 1, cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                <IoChevronForwardOutline />
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {tooltip.open && tooltip.employee && tooltip.block && (
                <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
                    <div className={styles.tooltipHeader}>{tooltip.employee.fullName}</div>
                    <div className={styles.tooltipBody}>
                        <div>{tooltip.block.start} - {tooltip.block.end}</div>
                        <div className={styles.tooltipState}>
                            <div className={classNames(styles.dot, styles[`state_${tooltip.block.state}`])} />
                            <span>{t(`activity.timeline.legend.${tooltip.block.state}`)}</span>
                        </div>
                        <div><span>{tooltip.block.appName}</span></div>
                    </div>
                    {tooltip.block.url && (
                        <div className={styles.tooltipFooter}>{tooltip.block.url}</div>
                    )}
                </div>
            )}
        </div>
    );
};
