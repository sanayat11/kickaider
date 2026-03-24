import { useMemo, type FC } from 'react';
import classNames from 'classnames';
import styles from './SegmentedControl.module.scss';
import type { SegmentedControlProps } from '../types/SegmentedControl';

export const SegmentedControl: FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'medium',
  fullWidth = false,
  className,
}) => {
  const activeIndex = useMemo(
    () => Math.max(0, options.findIndex((option) => option.value === value)),
    [options, value],
  );

  return (
    <div
      className={classNames(
        styles.root,
        styles[size],
        {
          [styles.fullWidth]: fullWidth,
        },
        className,
      )}
    >
      <div
        className={styles.thumb}
        style={{
          width: `${100 / options.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            className={classNames(styles.option, {
              [styles.active]: active,
              [styles.disabled]: option.disabled,
            })}
            onClick={() => !option.disabled && onChange?.(option.value)}
            disabled={option.disabled}
          >
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};