import React from 'react';
import classNames from 'classnames';
import styles from './WorkTimeStatsSection.module.scss';
import { Typography } from '@/shared/ui';

export type WorkTimeStatItem = {
  label: string;
  value: string;
  hint?: string;
};

type WorkTimeStatsProps = {
  items: WorkTimeStatItem[];
  loading?: boolean;
};

export const WorkTimeStats: React.FC<WorkTimeStatsProps> = ({ items, loading = false }) => {
  return (
    <section className={styles.kpiGrid}>
      {loading
        ? Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className={classNames(styles.kpiCard, styles.skeleton)} />
          ))
        : items.map((item, index) => (
            <div key={index} className={styles.kpiCard}>
              <Typography variant="h5" color="primary" context='dashboard' weight='semiBold'className={styles.label}>
                {item.label}
              </Typography>
              <Typography variant="h1" color="primary" context='dashboard' weight='bold' className={styles.value}>
                {item.value}
              </Typography>
            </div>
          ))}
    </section>
  );
};
