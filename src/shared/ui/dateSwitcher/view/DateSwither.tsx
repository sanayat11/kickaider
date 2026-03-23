import type { FC } from 'react';
import classNames from 'classnames';
import styles from './DateSwitcher.module.scss';

type DateSwitcherProps = {
  value: string;
  disabled?: boolean;
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M8.75 3.5L5.25 7L8.75 10.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M5.25 3.5L8.75 7L5.25 10.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DateSwitcher: FC<DateSwitcherProps> = ({
  value,
  disabled = false,
  className,
  onPrev,
  onNext,
}) => {
  return (
    <div className={classNames(styles.root, { [styles.disabled]: disabled }, className)}>
      <button
        type="button"
        className={styles.arrowButton}
        onClick={onPrev}
        disabled={disabled}
      >
        <ChevronLeft />
      </button>

      <span className={styles.value}>{value}</span>

      <button
        type="button"
        className={styles.arrowButton}
        onClick={onNext}
        disabled={disabled}
      >
        <ChevronRight />
      </button>
    </div>
  );
};