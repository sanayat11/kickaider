import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IoSettingsOutline,
    IoPeopleOutline,
    IoTrashOutline,
    IoCreateOutline,
    IoSaveOutline,
    IoCheckmarkCircleOutline,
    IoCloseOutline,
} from 'react-icons/io5';
import classNames from 'classnames';
import styles from './SettingsPage.module.scss';
import { settingsMockApi } from '@/shared/api/mock/settings.mock';
import type {
    GeneralSettings,
    AdminAccount,
} from '@/shared/api/mock/settings.mock';

export const SettingsPage: React.FC = () => {
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const [genSettings, setGenSettings] = useState<GeneralSettings>({
        timezone: 'Europe/Moscow',
        language: 'ru',
        idleThreshold: 10,
        lateTolerance: 5,
    });

    const [accounts, setAccounts] = useState<AdminAccount[]>([]);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({ login: '', password: '' });

    useEffect(() => {
        void loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [settings, accList] = await Promise.all([
                settingsMockApi.getGeneralSettings(),
                settingsMockApi.getAdminAccounts(),
            ]);
            setGenSettings(settings);
            setAccounts(accList);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2500);
    };

    const isSaveDisabled = useMemo(() => {
        const idleOk = Number.isFinite(genSettings.idleThreshold) && genSettings.idleThreshold >= 0;
        const lateOk = Number.isFinite(genSettings.lateTolerance) && genSettings.lateTolerance >= 0;
        return !idleOk || !lateOk;
    }, [genSettings.idleThreshold, genSettings.lateTolerance]);

    const handleSaveGeneral = async () => {
        try {
            await settingsMockApi.saveGeneralSettings(genSettings);
            if (genSettings.language !== i18n.language) {
                await i18n.changeLanguage(genSettings.language);
            }
            showToast(t('common.success'));
        } catch (err) { console.error(err); }
    };

    const handleCreateAccount = async () => {
        if (!newAccount.login || !newAccount.password) return;
        try {
            await settingsMockApi.createAdminAccount(newAccount);
            const accList = await settingsMockApi.getAdminAccounts();
            setAccounts(accList);
            setIsAccountModalOpen(false);
            setNewAccount({ login: '', password: '' });
            showToast(t('common.success'));
        } catch (err: any) {
            alert(err?.message ?? 'Error');
        }
    };

    const handleDeleteAccount = async (id: string, login: string) => {
        if (login === 'admin') return;
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            await settingsMockApi.deleteAdminAccount(id);
            setAccounts((prev) => prev.filter((acc) => acc.id !== id));
            showToast(t('common.success'));
        } catch (err) { console.error(err); }
    };

    const closeModal = () => setIsAccountModalOpen(false);
    const onOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.skeletonCard} />
                <div className={styles.skeletonCard} />
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* ── 1. General Settings ─────────────────────────────── */}
            <section className={styles.card}>
                <div className={classNames(styles.cardHeader, styles.blue)}>
                    <h2 className={styles.title}>
                        <span className={classNames(styles.iconPill, styles.blue)}>
                            <IoSettingsOutline />
                        </span>
                        {t('settings.general.title')}
                    </h2>
                    <button
                        className={classNames(styles.btn, styles.btnPrimary)}
                        onClick={handleSaveGeneral}
                        disabled={isSaveDisabled}
                    >
                        <IoSaveOutline />
                        {t('settings.general.save')}
                    </button>
                </div>

                <div className={styles.cardBody}>
                    <div className={styles.grid2}>
                        <div className={styles.field}>
                            <label className={styles.label}>{t('settings.general.timezone')}</label>
                            <select
                                className={styles.control}
                                value={genSettings.timezone}
                                onChange={(e) => setGenSettings((p) => ({ ...p, timezone: e.target.value }))}
                            >
                                <option value="Europe/Moscow">Europe/Moscow (UTC +3)</option>
                                <option value="Asia/Bishkek">Asia/Bishkek (UTC +6)</option>
                                <option value="Europe/Berlin">Europe/Berlin (UTC +1)</option>
                                <option value="America/New_York">America/New_York (UTC −5)</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>{t('settings.general.language')}</label>
                            <select
                                className={styles.control}
                                value={genSettings.language}
                                onChange={(e) =>
                                    setGenSettings((p) => ({ ...p, language: e.target.value as 'ru' | 'en' }))
                                }
                            >
                                <option value="ru">Русский (RU)</option>
                                <option value="en">English (EN)</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>{t('settings.general.idleThreshold')}</label>
                            <input
                                className={styles.control}
                                type="number"
                                min={0}
                                value={genSettings.idleThreshold}
                                onChange={(e) =>
                                    setGenSettings((p) => ({ ...p, idleThreshold: Number(e.target.value) }))
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>{t('settings.general.lateTolerance')}</label>
                            <input
                                className={styles.control}
                                type="number"
                                min={0}
                                value={genSettings.lateTolerance}
                                onChange={(e) =>
                                    setGenSettings((p) => ({ ...p, lateTolerance: Number(e.target.value) }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Admin Accounts ────────────────────────────────── */}
            <section className={styles.card}>
                <div className={classNames(styles.cardHeader, styles.green)}>
                    <h2 className={styles.title}>
                        <span className={classNames(styles.iconPill, styles.green)}>
                            <IoPeopleOutline />
                        </span>
                        {t('settings.accounts.title')}
                    </h2>
                    <button
                        className={classNames(styles.btn, styles.btnSecondary)}
                        onClick={() => setIsAccountModalOpen(true)}
                    >
                        <IoCreateOutline />
                        {t('settings.accounts.create')}
                    </button>
                </div>

                <div className={styles.cardBody}>
                    <div className={styles.tableCard}>
                        <div className={styles.tableScroll}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t('settings.accounts.login')}</th>
                                        <th>{t('settings.accounts.createdAt')}</th>
                                        <th className={styles.thRight}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts.map((acc) => (
                                        <tr key={acc.id}>
                                            <td>
                                                <div className={styles.loginCell}>
                                                    <div className={styles.avatar}>
                                                        {acc.login[0].toUpperCase()}
                                                    </div>
                                                    <span className={styles.loginText}>{acc.login}</span>
                                                    {acc.login === 'admin' && (
                                                        <span className={styles.adminBadge}>admin</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{new Date(acc.createdAt).toLocaleDateString()}</td>
                                            <td className={styles.tdRight}>
                                                {acc.login !== 'admin' ? (
                                                    <button
                                                        className={classNames(styles.iconBtn, styles.danger)}
                                                        onClick={() => handleDeleteAccount(acc.id, acc.login)}
                                                        title={t('settings.accounts.delete')}
                                                        aria-label={t('settings.accounts.delete')}
                                                    >
                                                        <IoTrashOutline />
                                                    </button>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Modal ────────────────────────────────────────────── */}
            {isAccountModalOpen && (
                <div
                    className={styles.modalOverlay}
                    onMouseDown={onOverlayClick}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{t('settings.accounts.modal.title')}</h3>
                            <button className={styles.iconBtn} onClick={closeModal} aria-label="Close">
                                <IoCloseOutline />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.field}>
                                <label className={styles.label}>{t('settings.accounts.modal.login')}</label>
                                <input
                                    className={styles.control}
                                    type="text"
                                    autoFocus
                                    value={newAccount.login}
                                    onChange={(e) => setNewAccount((p) => ({ ...p, login: e.target.value }))}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>{t('settings.accounts.modal.password')}</label>
                                <input
                                    className={styles.control}
                                    type="password"
                                    value={newAccount.password}
                                    onChange={(e) => setNewAccount((p) => ({ ...p, password: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={classNames(styles.btn, styles.btnSecondary)}
                                onClick={closeModal}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                className={classNames(styles.btn, styles.btnPrimary)}
                                onClick={handleCreateAccount}
                                disabled={!newAccount.login || !newAccount.password}
                            >
                                {t('common.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast ────────────────────────────────────────────── */}
            {toast && (
                <div className={styles.toast} role="status" aria-live="polite">
                    <IoCheckmarkCircleOutline />
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};