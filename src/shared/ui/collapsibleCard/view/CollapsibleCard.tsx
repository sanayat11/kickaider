import { useState, type FC, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './CollapsibleCard.module.scss';

type CollapsibleCardProps = {
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

const ChevronIcon: FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={classNames(styles.chevronIcon, { [styles.open]: open })}
    aria-hidden="true"
  >
    <path
      d="M5 6.5L8 9.5L11 6.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CollapsibleCard: FC<CollapsibleCardProps> = ({
  left,
  center,
  right,
  children,
  defaultOpen = true,
  className,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={classNames(styles.card, className)}>
      <button
        type="button"
        className={styles.header}
        onClick={() =>
          setOpen((prev) => {
            const next = !prev;
            onOpenChange?.(next);
            return next;
          })
        }
      >
        <div className={styles.left}>{left}</div>
        <div className={styles.center}>{center}</div>
        <div className={styles.right}>
          {right}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div
        className={classNames(styles.content, {
          [styles.contentOpen]: open,
        })}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
};
