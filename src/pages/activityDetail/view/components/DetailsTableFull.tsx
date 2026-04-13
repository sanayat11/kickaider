import type { FC } from 'react';
import classNames from 'classnames';
import styles from '../ActivityDetailsPage.module.scss';
import type { ActivityEvent } from '@/shared/api/mock/activity.mock';

interface DetailsTableFullProps {
  events: ActivityEvent[];
}

export const DetailsTableFull: FC<DetailsTableFullProps> = ({ events }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Время</th>
          <th>Продолжительность</th>
          <th>Программа\Сайт</th>
          <th>URL</th>
          <th>Скриншоты</th>
        </tr>
      </thead>
      <tbody>
        {events.map((row, i) => (
          <tr key={i} className={classNames({ [styles.idleRow]: row.state === 'idle' })}>
            <td className={styles.timeText}>
              {row.timestamp}
            </td>
            <td className={styles.durationText}>{row.duration}</td>
            <td className={styles.appName}>
              <span className={classNames(styles.dot, styles[`state_${row.state}`])} />
              <div className={styles.appTitleStack}>
                <span>{row.appName}</span>
                {row.windowTitle && <span className={styles.windowTitle}>{row.windowTitle}</span>}
              </div>
            </td>
            <td>
              {row.url ? (
                <a href={row.url} className={styles.urlLink} target="_blank" rel="noreferrer">
                  {row.url}
                </a>
              ) : (
                '-'
              )}
            </td>
            <td>
              <div 
                className={styles.screenshotThumb} 
                style={{ backgroundImage: `url(/src/shared/assets/images/imgBoost2.png)` }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
