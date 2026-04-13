import type { FC } from 'react';
import classNames from 'classnames';
import styles from './ChipButton.module.scss';
import type { ChipProps } from '../types/ChipButton';

export const Chip: FC<ChipProps> = ({
  children,
  tone = 'purple',
  variant = 'filter',
  selected,
  disabled,
  className,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles.chip,
        styles[tone],
        styles[variant], 
        {
          [styles.selected]: selected && variant === 'filter',
          [styles.disabled]: disabled,
        },
        className,
      )}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
};
