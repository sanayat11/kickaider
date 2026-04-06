import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/widgets/sidebar';
import styles from './DashboardPage.module.scss';

export const DashboardPage: React.FC = () => {
    return (
        <div className={styles.pageWrapper}>
            <Sidebar />
            <div className={styles.container}>
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

