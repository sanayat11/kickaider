import type { FC } from 'react';
import styles from '../ActivityDetailsPage.module.scss';

interface ShortViewRow {
  period: string;
  activityMinutes: string;
  idleMinutes: string;
  apps: string[];
}

interface DetailsTableShortProps {
  rows: ShortViewRow[];
}

export const DetailsTableShort: FC<DetailsTableShortProps> = ({ rows }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Активность</th>
          <th>Бездействие</th>
          <th>Список программ и сайтов</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <td className={styles.timeText}>{row.period}</td>
            <td className={styles.mutedText}>{row.idleMinutes}</td>
            <td>
              <div className={styles.appName}>{row.apps.join(', ')}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
