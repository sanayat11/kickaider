import React from 'react';
import { Sidebar } from '@/widgets/sidebar';
import styles from './ReportsPage.module.scss';

export const ReportsPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.content}>
                <h1>Базовые отчеты</h1>
                <p>Здесь будут отображаться базовые отчеты после регистрации.</p>
                <div className={styles.mockGrid}>
                    <div className={styles.card}>Статистика по отделам</div>
                    <div className={styles.card}>Активность за неделю</div>
                    <div className={styles.card}>Топ приложений</div>
                </div>
            </div>
        </div>
    );
};
