import type { FC } from 'react';
import classNames from 'classnames';
import type { ChipButtonProps } from '../types/ChipButton';
import styles from './ChipButton.module.scss';

export const ChipButton: FC<ChipButtonProps> = ({
  children,
  color = 'purple',
  selected = false,
  disabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={classNames(
        styles.chip,
        styles[color],
        {
          [styles.selected]: selected,
        },
        className,
      )}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
};