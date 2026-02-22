import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IoChevronBackOutline,
    IoChevronForwardOutline,
    IoCalendarOutline,
    IoCloseCircleOutline,
    IoAirplaneOutline,
    IoMedkitOutline,
    IoTrashOutline,
    IoFlashOutline
} from 'react-icons/io5';
import classNames from 'classnames';
import styles from './ProductionCalendarPage.module.scss';
import dashboardStyles from '@/pages/dashboard/view/DashboardPage.module.scss';
import { Select } from '@/shared/ui/select/view/Select';
import { FiltersBar } from '@/shared/ui/filters-bar/view/FiltersBar';
import { productionCalendarMockApi } from '@/shared/api/mock/productionCalendar.mock';
import type { CalendarStatus, CalendarStatusType } from '@/shared/api/mock/productionCalendar.mock';
import { activityMockApi } from '@/shared/api/mock/activity.mock';
import type { Employee } from '@/shared/api/mock/activity.mock';

const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];

    let firstDayIndex = date.getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
        days.push({
            day: prevMonthLastDate - i + 1,
            month: month - 1,
            year,
            isCurrentMonth: false
        });
    }

    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDate; i++) {
        days.push({ day: i, month, year, isCurrentMonth: true });
    }

    const totalSlots = 42;
    const nextMonthDays = totalSlots - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({ day: i, month: month + 1, year, isCurrentMonth: false });
    }

    return days;
};

export const ProductionCalendarPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<'all' | string>('all');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [statuses, setStatuses] = useState<CalendarStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMassAssignOpen, setIsMassAssignOpen] = useState(false);

    const [rangeForm, setRangeForm] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
        status: 'vacation' as CalendarStatusType,
        employeeId: 'all'
    });

    const [activePopover, setActivePopover] = useState<{ date: string, x: number, y: number } | null>(null);
    const [assignTarget, setAssignTarget] = useState<{ date: string, employeeId?: string } | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthStr = `${year}-${(month + 1).toString().padStart(2, '0')}`;

    const loadInitialData = async () => {
        try {
            const empList = await activityMockApi.getTimelineDay({ date: new Date().toISOString().split('T')[0], departments: [] });
            setEmployees(empList);
            if (empList.length > 0 && rangeForm.employeeId === 'all') {
                setRangeForm(prev => ({ ...prev, employeeId: empList[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadStatuses = async () => {
        setLoading(true);
        try {
            const data = await productionCalendarMockApi.getCalendarStatuses({
                month: monthStr,
                employeeId: selectedEmployeeId
            });
            setStatuses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadInitialData(); }, []);
    useEffect(() => { loadStatuses(); }, [monthStr, selectedEmployeeId]);

    const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

    const handleMonthNav = (dir: number) => {
        setCurrentDate(new Date(year, month + dir, 1));
    };

    const handleCellClick = (date: string) => {
        if (selectedEmployeeId === 'all') {
            setAssignTarget({ date });
        } else {
            setActivePopover({ date, x: 0, y: 0 });
        }
    };

    const setStatus = async (status: CalendarStatusType | 'reset', employeeId: string, date: string) => {
        try {
            if (status === 'reset') {
                await productionCalendarMockApi.removeCalendarStatus({ employeeId, date });
            } else {
                await productionCalendarMockApi.setCalendarStatus({ employeeId, date, status });
            }
            setActivePopover(null);
            setAssignTarget(null);
            loadStatuses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMassAssign = async () => {
        const empId = selectedEmployeeId === 'all' ? rangeForm.employeeId : selectedEmployeeId;
        if (!empId || empId === 'all') return;

        try {
            setLoading(true);
            await productionCalendarMockApi.setCalendarRange({
                employeeId: empId,
                from: rangeForm.from,
                to: rangeForm.to,
                status: rangeForm.status
            });
            setIsMassAssignOpen(false);
            loadStatuses();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const statusOptions: { value: CalendarStatusType, label: string, icon: any, color: string }[] = [
        { value: 'vacation', label: t('settings.calendar.status.vacation'), icon: IoAirplaneOutline, color: styles.vacation },
        { value: 'sick', label: t('settings.calendar.status.sick'), icon: IoMedkitOutline, color: styles.sick },
        { value: 'trip', label: t('settings.calendar.status.trip'), icon: IoFlashOutline, color: styles.trip },
        { value: 'absence', label: t('settings.calendar.status.absence'), icon: IoCloseCircleOutline, color: styles.absence },
    ];

    const monthName = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(currentDate);

    const renderSkeleton = () => (
        <div className={styles.skeletonGrid}>
            {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className={styles.skeletonCell}>
                    <div className={styles.box} />
                </div>
            ))}
        </div>
    );

    return (
        <div className={classNames(styles.calendarPage, dashboardStyles.container)}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{t('settings.calendar.title')}</h1>
                    <p>{t('settings.calendar.subtitle')}</p>
                </div>
            </header>

            <FiltersBar className={styles.controlsCard}>
                <div className={styles.controlsRow}>
                    <div className={styles.leftGroup}>
                        <div className={styles.monthNav}>
                            <button className={styles.navBtn} onClick={() => handleMonthNav(-1)}>
                                <IoChevronBackOutline />
                            </button>
                            <span className={styles.currentMonth}>{monthName}</span>
                            <button className={styles.navBtn} onClick={() => handleMonthNav(1)}>
                                <IoChevronForwardOutline />
                            </button>
                        </div>

                        <Select
                            label={t('settings.calendar.employee')}
                            value={selectedEmployeeId}
                            onChange={setSelectedEmployeeId}
                            options={[
                                { value: 'all', label: t('settings.calendar.allEmployees') },
                                ...employees.map(e => ({ value: e.id, label: e.fullName }))
                            ]}
                        />
                    </div>

                    <button className={styles.massAssignBtn} onClick={() => setIsMassAssignOpen(!isMassAssignOpen)}>
                        <IoCalendarOutline />
                        <span>{t('settings.calendar.massAssign')}</span>
                    </button>
                </div>
            </FiltersBar>

            <section className={styles.legendContainer}>
                <div className={styles.legend}>
                    {statusOptions.map(s => (
                        <div key={s.value} className={styles.legendItem}>
                            <div className={classNames(styles.dot, styles[s.value])} />
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {isMassAssignOpen && (
                <section className={styles.massAssignCard}>
                    <div className={styles.massAssignForm}>
                        {selectedEmployeeId === 'all' && (
                            <div className={styles.formGroup}>
                                <label>{t('settings.calendar.employee')}</label>
                                <Select
                                    value={rangeForm.employeeId}
                                    onChange={val => setRangeForm(prev => ({ ...prev, employeeId: val }))}
                                    options={employees.map(e => ({ value: e.id, label: e.fullName }))}
                                />
                            </div>
                        )}
                        <div className={styles.formGroup}>
                            <label>{t('settings.calendar.from')}</label>
                            <input type="date" value={rangeForm.from} onChange={e => setRangeForm(prev => ({ ...prev, from: e.target.value }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('settings.calendar.to')}</label>
                            <input type="date" value={rangeForm.to} onChange={e => setRangeForm(prev => ({ ...prev, to: e.target.value }))} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('settings.calendar.status.vacation')}</label>
                            <Select
                                value={rangeForm.status}
                                onChange={val => setRangeForm(prev => ({ ...prev, status: val as any }))}
                                options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                            />
                        </div>
                        <button className={styles.applyBtn} onClick={handleMassAssign} disabled={loading}>
                            {t('settings.calendar.apply')}
                        </button>
                        <button className={styles.cancelBtn} onClick={() => setIsMassAssignOpen(false)}>{t('common.cancel') || 'Отменить'}</button>
                    </div>
                </section>
            )}

            <section className={styles.calendarCard}>
                <div className={styles.calendarGrid}>
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(d => (
                        <div key={d} className={styles.dayHeader}>
                            {t(`common.days.${d}`)}
                        </div>
                    ))}

                    {loading ? renderSkeleton() : days.map((day, idx) => {
                        const dateStr = `${day.year}-${(day.month + 1).toString().padStart(2, '0')}-${day.day.toString().padStart(2, '0')}`;
                        const isToday = dateStr === new Date().toISOString().split('T')[0];
                        const dayStatus = statuses.find(s => s.date === dateStr);

                        return (
                            <div
                                key={idx}
                                className={classNames(styles.calendarCell, {
                                    [styles.notCurrentMonth]: !day.isCurrentMonth,
                                    [styles.today]: isToday
                                })}
                                onClick={() => handleCellClick(dateStr)}
                            >
                                <span className={styles.dateNum}>{day.day}</span>
                                {dayStatus && (
                                    <div className={classNames(styles.statusIndicator, styles[dayStatus.status])}>
                                        <div className={styles.statusDotSmall} />
                                        {t(`settings.calendar.status.${dayStatus.status}`)}
                                    </div>
                                )}

                                {activePopover?.date === dateStr && (
                                    <div className={styles.popover} onClick={e => e.stopPropagation()}>
                                        <div className={styles.popoverTitle}>{dateStr}</div>
                                        <div className={styles.popoverList}>
                                            {statusOptions.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    className={styles.popoverBtn}
                                                    onClick={() => setStatus(opt.value, selectedEmployeeId, dateStr)}
                                                >
                                                    <div className={classNames(styles.statusDot, styles[opt.value])} />
                                                    {opt.label}
                                                </button>
                                            ))}
                                            <button className={classNames(styles.popoverBtn, styles.reset)} onClick={() => setStatus('reset', selectedEmployeeId, dateStr)}>
                                                <IoTrashOutline />
                                                {t('settings.calendar.reset')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {assignTarget && (
                <div className={styles.modalOverlay} onClick={() => setAssignTarget(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>{t('settings.calendar.selectEmployee')}</h3>
                        <p>{assignTarget.date}</p>
                        <Select
                            label={t('settings.calendar.employee')}
                            value={assignTarget.employeeId || employees[0]?.id}
                            onChange={val => setAssignTarget(prev => ({ ...prev!, employeeId: val }))}
                            options={employees.map(e => ({ value: e.id, label: e.fullName }))}
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.secondaryBtn} onClick={() => setAssignTarget(null)}>{t('common.cancel') || 'Отмена'}</button>
                            <button className={styles.primaryBtn} onClick={() => {
                                const empId = assignTarget.employeeId || employees[0]?.id;
                                setAssignTarget(null);
                                setActivePopover({ date: assignTarget.date, x: 0, y: 0 });
                                setSelectedEmployeeId(empId);
                            }}>
                                {t('common.next') || 'Далее'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
