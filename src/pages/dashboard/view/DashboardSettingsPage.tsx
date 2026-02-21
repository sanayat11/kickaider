import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DashboardPage.module.scss';

export const DashboardSettingsPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>{t('dashboard.settings.title', 'Настройки')}</h1>
                    <p>{t('dashboard.settings.subtitle', 'Управление настройками платформы')}</p>
                </div>
            </header>
            
            <main className={styles.main}>
                <div className={styles.section}>
                    <p>Здесь будут располагаться настройки.</p>
                </div>
            </main>
        </div>
    );
};
