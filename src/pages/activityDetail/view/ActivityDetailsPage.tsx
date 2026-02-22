import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    IoChevronBackOutline,
    IoSearchOutline,
    IoInformationCircleOutline,
    IoImageOutline,
    IoCalendarOutline,
    IoPersonOutline,
    IoBusinessOutline,
    IoDesktopOutline
} from 'react-icons/io5';
import classNames from 'classnames';
import styles from './ActivityDetailsPage.module.scss';
import { activityMockApi } from '@/shared/api/mock/activity.mock';
import type { EmployeeDayDetails } from '@/shared/api/mock/activity.mock';

export const ActivityDetailsPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { employeeId } = useParams<{ employeeId: string }>();
    const [searchParams] = useSearchParams();
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const [timeMode, setTimeMode] = useState('allDay');
    const [scale, setScale] = useState('5min');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'short' | 'full'>('short');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<EmployeeDayDetails | null>(null);

    const loadData = async () => {
        if (!employeeId) return;
        setLoading(true);
        try {
            const res = await activityMockApi.getEmployeeDayDetails({
                employeeId,
                date: dateParam
            });
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [employeeId, dateParam]);

    const filteredFullEvents = useMemo(() => {
        if (!data) return [];
        if (!searchQuery) return data.fullViewEvents;
        return data.fullViewEvents.filter(e =>
            e.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.windowTitle && e.windowTitle.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [data, searchQuery]);

    const filteredShortRows = useMemo(() => {
        if (!data) return [];
        if (!searchQuery) return data.shortViewRows;
        return data.shortViewRows.filter(row =>
            row.apps.some(app => app.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [data, searchQuery]);

    const renderSkeleton = () => (
        <div className={styles.skeletonTable}>
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                    <div className={styles.skeletonCell} style={{ width: '100px' }} />
                    <div className={styles.skeletonCell} style={{ width: '80px' }} />
                    <div className={styles.skeletonCell} style={{ flex: 1 }} />
                    <div className={styles.skeletonCell} style={{ width: '60px' }} />
                </div>
            ))}
        </div>
    );

    return (
        <div className={styles.detailsPage}>
            <header className={styles.headerBlock}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    <IoChevronBackOutline />
                    <span>{t('activity.details.back')}</span>
                </button>

                {data && (
                    <div className={styles.titleInfo}>
                        <div className={styles.infoItem}>
                            <IoCalendarOutline />
                            <span className={styles.label}>{t('activity.details.titleParts.date')}:</span>
                            <span className={styles.value}>{data.header.date}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <IoBusinessOutline />
                            <span className={styles.label}>{t('activity.details.titleParts.department')}:</span>
                            <span className={styles.value}>{data.header.department}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <IoPersonOutline />
                            <span className={styles.label}>{t('activity.details.titleParts.employee')}:</span>
                            <span className={styles.value}>{data.header.fullName} ({data.header.employeeId})</span>
                        </div>
                        <div className={styles.infoItem}>
                            <IoDesktopOutline />
                            <span className={styles.label}>{t('activity.details.titleParts.hostname')}:</span>
                            <span className={styles.value}>{data.header.hostname}</span>
                        </div>
                    </div>
                )}
            </header>

            <div className={styles.controlsCard}>
                <div className={styles.controlsRow}>
                    <div className={styles.controlGroup}>
                        <div className={styles.segmentedControl}>
                            <button
                                className={classNames({ [styles.active]: viewMode === 'short' })}
                                onClick={() => setViewMode('short')}
                            >
                                {t('activity.details.view.short')}
                            </button>
                            <button
                                className={classNames({ [styles.active]: viewMode === 'full' })}
                                onClick={() => setViewMode('full')}
                            >
                                {t('activity.details.view.full')}
                            </button>
                        </div>

                        <div className={styles.segmentedControl}>
                            <button
                                className={classNames({ [styles.active]: timeMode === 'allDay' })}
                                onClick={() => setTimeMode('allDay')}
                            >
                                {t('activity.timeline.filters.allDay')}
                            </button>
                            <button
                                className={classNames({ [styles.active]: timeMode === 'workTime' })}
                                onClick={() => setTimeMode('workTime')}
                            >
                                {t('activity.timeline.filters.workTime')}
                            </button>
                        </div>

                        <div className={styles.segmentedControl}>
                            {['5m', '15m', '1h'].map(s => (
                                <button
                                    key={s}
                                    className={classNames({ [styles.active]: scale === s })}
                                    onClick={() => setScale(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.searchWrapper}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder={t('activity.details.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableCard}>
                {loading ? renderSkeleton() : !data ? (
                    <div className={styles.emptyState}>
                        <IoInformationCircleOutline className={styles.icon} />
                        <p>{t('common.noData')}</p>
                    </div>
                ) : viewMode === 'short' ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('activity.details.columns.period')}</th>
                                <th>{t('activity.details.columns.activity')}</th>
                                <th>{t('activity.details.columns.idle')}</th>
                                <th>{t('activity.details.columns.programs')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShortRows.map((row, i) => (
                                <tr key={i}>
                                    <td className={styles.periodCell}>{row.period}</td>
                                    <td className={styles.activityCell}>{row.activityMinutes}</td>
                                    <td className={styles.idleCell}>{row.idleMinutes}</td>
                                    <td className={styles.appsList}>{row.apps.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('activity.details.columns.period')}</th>
                                <th style={{ width: '100px' }}>{t('activity.details.columns.activity')}</th>
                                <th>{t('activity.details.columns.programs')}</th>
                                <th style={{ width: '120px' }}>{t('activity.details.columns.screenshot')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFullEvents.map((event) => (
                                <tr key={event.id} className={classNames({ [styles.idleRow]: event.state === 'idle' })}>
                                    <td className={styles.periodCell}>{event.timestamp}</td>
                                    <td className={styles.durationCell}>{event.duration}</td>
                                    <td>
                                        <div className={styles.appEntry}>
                                            <div className={styles.appTitle}>
                                                <span className={classNames(styles.stateDot, styles[`state_${event.state}`])} />
                                                <span className={styles.name}>{event.appName}</span>
                                            </div>
                                            {event.windowTitle && <div className={styles.windowTitle}>{event.windowTitle}</div>}
                                            {event.url && <a href={event.url} className={styles.url} target="_blank" rel="noreferrer">{event.url}</a>}
                                        </div>
                                    </td>
                                    <td>
                                        {event.screenshotUrl ? (
                                            <div className={styles.screenshotThumb}>
                                                <img src={event.screenshotUrl} alt="Screen" />
                                            </div>
                                        ) : (
                                            <div className={styles.noImage}><IoImageOutline /></div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
