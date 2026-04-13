  import type { FC } from 'react';
  import classNames from 'classnames';
  import styles from './TimeBar.module.scss';
  import type { TimeBarProps } from '../types/TimeBar';

  export const TimeBar: FC<TimeBarProps> = ({
    segments,
    labels,
    className,
    height = 'md',
    onSegmentClick,
  }) => {
    const total = segments.reduce((acc, item) => acc + item.value, 0);

    return (
      <div className={classNames(styles.root, className)}>
        {labels && labels.length > 0 && (
          <div className={styles.labels}>
            {labels.map((label) => (
              <span key={label} className={styles.label}>
                {label}
              </span>
            ))}
          </div>
        )}

        <div className={classNames(styles.track, styles[height])}>
          {segments.map((segment, index) => {
            const width = total > 0 ? `${(segment.value / total) * 100}%` : '0%';
            const tone = segment.tone ?? 'neutral';

            return (
              <div
                key={segment.id}
                className={classNames(
                  styles.segment,
                  styles[tone],
                  {
                    [styles.first]: index === 0,
                    [styles.last]: index === segments.length - 1,
                    [styles.clickable]: !!onSegmentClick,
                  },
                )}
                style={{ width }}
                onClick={(e) => onSegmentClick?.(segment.id, e)}
              />
            );
          })}
        </div>
      </div>
    );
  };