import { useState, type FC } from 'react';
import classNames from 'classnames';
import styles from './reportToggle.module.scss';

type ReportToggleProps = {
  label: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  onToggle?: (open: boolean) => void;
};

const ChevronIcon: FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={classNames(styles.chevron, { [styles.open]: open })}
    aria-hidden="true"
  >
    <path
      d="M4 5.5L7 8.5L10 5.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ReportToggle: FC<ReportToggleProps> = ({
  label,
  defaultOpen = false,
  disabled = false,
  className,
  onToggle,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const handleClick = () => {
    if (disabled) return;
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      className={classNames(
        styles.toggle,
        {
          [styles.disabled]: disabled,
          [styles.active]: open,
        },
        className,
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className={styles.label}>{label}</span>
      <ChevronIcon open={open} />
    </button>
  );
};