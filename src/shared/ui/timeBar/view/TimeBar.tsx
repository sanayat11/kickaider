import type { FC } from 'react';
import classNames from 'classnames';
import styles from './TimeBar.module.scss';
import type { TimeBarProps, TimeBarSegment } from '../types/TimeBar';

const hasPositionedSegments = (segments: TimeBarSegment[]) =>
  segments.some(
    (segment) =>
      typeof segment.startPercent === 'number' ||
      typeof segment.widthPercent === 'number',
  );

export const TimeBar: FC<TimeBarProps> = ({
  segments,
  labels,
  className,
  height = 'md',
  onSegmentClick,
}) => {
  const isTimeline = hasPositionedSegments(segments);
  const total = segments.reduce((acc, item) => acc + (item.value ?? 0), 0);

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

      <div
        className={classNames(
          styles.track,
          styles[height],
          {
            [styles.timeline]: isTimeline,
          },
        )}
      >
        {segments.length === 0 ? (
          <div className={styles.emptyTrack} />
        ) : (
          segments.map((segment, index) => {
            const tone = segment.tone ?? 'neutral';

            const stackedWidth =
              total > 0 ? `${((segment.value ?? 0) / total) * 100}%` : '0%';

            const positionedWidth =
              typeof segment.widthPercent === 'number'
                ? `${segment.widthPercent}%`
                : stackedWidth;

            const positionedLeft =
              typeof segment.startPercent === 'number'
                ? `${segment.startPercent}%`
                : undefined;

            return (
              <div
                key={segment.id}
                className={classNames(
                  styles.segment,
                  styles[tone],
                  {
                    [styles.first]: !isTimeline && index === 0,
                    [styles.last]: !isTimeline && index === segments.length - 1,
                    [styles.clickable]: !!onSegmentClick,
                    [styles.positioned]: isTimeline,
                    [styles.stacked]: !isTimeline,
                  },
                )}
                style={
                  isTimeline
                    ? {
                        left: positionedLeft,
                        width: positionedWidth,
                      }
                    : {
                        width: stackedWidth,
                      }
                }
                title={segment.title}
                onClick={(e) => onSegmentClick?.(segment.id, e)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};