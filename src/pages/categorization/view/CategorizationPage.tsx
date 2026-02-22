import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IoSearchOutline,
    IoGlobeOutline,
    IoCubeOutline,
    IoHandRightOutline,
    IoSettingsOutline,
    IoCheckmarkCircleOutline,
    IoCloseCircleOutline,
    IoTimeOutline,
    IoRefreshOutline,
    IoInformationCircleOutline
} from 'react-icons/io5';
import classNames from 'classnames';
import styles from './CategorizationPage.module.scss';
import dashboardStyles from '@/pages/dashboard/view/DashboardPage.module.scss';
import { Select } from '@/shared/ui/select/view/Select';
import { categorizationMockApi } from '@/shared/api/mock/categorization.mock';
import type { CategorizationRow, Category } from '@/shared/api/mock/categorization.mock';

export const CategorizationPage: React.FC = () => {
    const { t } = useTranslation();

    const [rows, setRows] = useState<CategorizationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'uncategorized' | 'manual'>('all');
    const [updatingIds, setUpdatingIds] = useState<string[]>([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await categorizationMockApi.getCategorizationList({ search, filter });
            setRows(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [search, filter]);

    const handleCategoryChange = async (id: string, category: Category) => {
        setUpdatingIds(prev => [...prev, id]);
        try {
            const updated = await categorizationMockApi.setCategory(id, category);
            setRows(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingIds(prev => prev.filter(x => x !== id));
        }
    };

    const handleReset = async (id: string) => {
        setUpdatingIds(prev => [...prev, id]);
        try {
            const updated = await categorizationMockApi.resetToDefault(id);
            setRows(prev => prev.map(r => r.id === id ? updated : r));
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingIds(prev => prev.filter(x => x !== id));
        }
    };

    const handleResetAll = async () => {
        if (!window.confirm(t('common.confirmResetAll') || 'Сбросить все ручные правила?')) return;
        setLoading(true);
        try {
            await categorizationMockApi.resetAllManual();
            await loadData();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const renderSkeleton = () => (
        <div className={styles.skeletonTable}>
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                    <div className={styles.skeletonBox} style={{ width: '240px' }} />
                    <div className={styles.skeletonBox} style={{ width: '120px' }} />
                    <div className={styles.skeletonBox} style={{ width: '100px' }} />
                    <div className={styles.skeletonBox} style={{ width: '180px', flex: 1 }} />
                </div>
            ))}
        </div>
    );

    return (
        <div className={classNames(styles.categorizationPage, dashboardStyles.container)}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>{t('settings.categorization.title')}</h1>
                    <p>{t('settings.categorization.subtitle')}</p>
                </div>
                <button className={styles.resetAllBtn} onClick={handleResetAll}>
                    <IoRefreshOutline />
                    <span>{t('settings.categorization.resetManual')}</span>
                </button>
            </header>

            <section className={styles.controlsCard}>
                <div className={styles.controlsRow}>
                    <div className={styles.filterGroup}>
                        <div className={styles.searchWrapper}>
                            <IoSearchOutline className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder={t('settings.categorization.searchPlaceholder')}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={filter}
                            onChange={(val) => setFilter(val as any)}
                            options={[
                                { label: t('settings.categorization.filter.all'), value: 'all' },
                                { label: t('settings.categorization.filter.uncategorized'), value: 'uncategorized' },
                                { label: t('settings.categorization.filter.manualOnly'), value: 'manual' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className={styles.tableCard}>
                {loading ? renderSkeleton() : rows.length === 0 ? (
                    <div className={styles.emptyState}>
                        <IoInformationCircleOutline className={styles.icon} />
                        <h3>{t('common.noData')}</h3>
                        <p>{t('settings.categorization.noMatches') || 'Ничего не найдено'}</p>
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('settings.categorization.table.name')}</th>
                                <th>{t('settings.categorization.table.category')}</th>
                                <th>{t('settings.categorization.table.source')}</th>
                                <th>{t('settings.categorization.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => {
                                const isUpdating = updatingIds.includes(row.id);
                                return (
                                    <tr key={row.id}>
                                        <td className={styles.nameCell}>
                                            <div className={styles.rowName}>
                                                {row.type === 'web' ? <IoGlobeOutline /> : <IoCubeOutline />}
                                                <span>{row.name}</span>
                                                <span className={classNames(styles.typeBadge, styles[row.type])}>
                                                    {row.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={classNames(styles.pill, styles[row.category])}>
                                                <div className={styles.dot} />
                                                <span>{t(`categories.${row.category}`)}</span>
                                            </div>
                                        </td>
                                        <td className={styles.sourceCell}>
                                            <div className={classNames(styles.sourceBadge, styles[row.source])}>
                                                {row.source === 'manual' ? <IoHandRightOutline /> : <IoSettingsOutline size={14} />}
                                                <span>{t(`settings.categorization.source.${row.source}`)}</span>
                                            </div>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            {(['productive', 'neutral', 'unproductive'] as Category[]).map(cat => (
                                                <button
                                                    key={cat}
                                                    title={t(`categories.${cat}`)}
                                                    className={classNames(styles.actionBtn, styles[cat], {
                                                        [styles.active]: row.category === cat,
                                                        [styles.loading]: isUpdating
                                                    })}
                                                    onClick={() => handleCategoryChange(row.id, cat)}
                                                >
                                                    {isUpdating ? <div className={styles.loader} /> : (
                                                        cat === 'productive' ? <IoCheckmarkCircleOutline size={18} /> :
                                                            cat === 'unproductive' ? <IoCloseCircleOutline size={18} /> :
                                                                <IoTimeOutline size={16} />
                                                    )}
                                                </button>
                                            ))}
                                            <button
                                                className={classNames(styles.actionBtn, styles.reset, { [styles.loading]: isUpdating })}
                                                title={t('common.reset')}
                                                onClick={() => handleReset(row.id)}
                                            >
                                                <IoRefreshOutline size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};
