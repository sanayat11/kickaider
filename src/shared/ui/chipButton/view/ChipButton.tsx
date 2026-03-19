import type { FC } from 'react';
import classNames from 'classnames';
import styles from './ChipButton.module.scss';

interface ChipProps {
  children: React.ReactNode;
  tone?: 'purple' | 'red' | 'yellow' | 'green' | 'blue' | 'gray';
  selected?: boolean;
  disabled?: boolean;
  leftAccent?: boolean;
  className?: string;
}

export const Chip: FC<ChipProps> = ({
  children,
  tone = 'purple',
  selected,
  disabled,
  leftAccent,
  className,
}) => {
  return (
    <div
      className={classNames(
        styles.chip,
        styles[tone],
        {
          [styles.selected]: selected,
          [styles.disabled]: disabled,
          [styles.leftAccent]: leftAccent,
        },
        className,
      )}
    >
      <span className={styles.label}>{children}</span>
    </div>
  );
};
