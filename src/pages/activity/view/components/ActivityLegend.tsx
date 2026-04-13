import type { FC } from 'react';
import styles from '../ActivityPage.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';

const legendItems = [
  { state: 'productive', label: 'Продуктивно', colorClass: styles.state_productive },
  { state: 'unproductive', label: 'Непродуктивно', colorClass: styles.state_unproductive },
  { state: 'idle', label: 'Бездействие', colorClass: styles.state_idle },
  { state: 'nodata', label: 'Нет данных', colorClass: styles.state_nodata },
  { state: 'uncategorized', label: 'Без категории', colorClass: styles.state_uncategorized },
];

export const ActivityLegend: FC = () => {
  return (
    <div className={styles.legend}>
      {legendItems.map((item) => (
        <div key={item.state} className={styles.legendItem}>
          <span className={`${styles.dot} ${item.colorClass}`} />
          <Typography variant="body2">{item.label}</Typography>
        </div>
      ))}
    </div>
  );
};
