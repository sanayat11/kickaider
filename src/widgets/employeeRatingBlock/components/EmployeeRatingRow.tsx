import { useEffect, useRef, type FC } from 'react';
import classNames from 'classnames';

import styles from '../styles/EmployeeRatingRow.module.scss';
import { TimeBar } from '@/shared/ui/timeBar/view/TimeBar';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import type { EmployeeRatingRowData } from '@/pages/employeeRatingPage/types/EmployeeRatingPage';
import { EmployeeDetailsPopover } from '@/features/employeeDetailModal/view/EmployeeDetailModal';

type Props = {
  row: EmployeeRatingRowData;
  openedRowId: string | null;
  onToggleRow: (rowId: string | null) => void;
};

export const EmployeeRatingRow: FC<Props> = ({ row, openedRowId, onToggleRow }) => {
  const rowRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = openedRowId === row.id;

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) {
        onToggleRow(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggleRow]);

  return (
    <div className={classNames(styles.rowWrap, { [styles.rowWrapOpened]: isOpen })}>
      <button
        ref={rowRef}
        type="button"
        className={styles.row}
        onClick={() => onToggleRow(isOpen ? null : row.id)}
      >
        <Typography variant="h5" className={styles.rank}>
          {row.rank}
        </Typography>

        <div className={styles.nameCell}>
          <div className={styles.avatar}>{row.initials}</div>

          <Typography variant="h5" className={styles.name} truncate={22}>
            {row.name}
          </Typography>

          {isOpen && (
            <EmployeeDetailsPopover
              employee={{
                name: row.name,
                hostname: row.hostname,
                initials: row.initials,
                avatar: row.avatar,
                isOnline: row.isOnline,
              }}
              onClose={() => onToggleRow(null)}
            />
          )}
        </div>

        <Typography variant="h5" className={styles.hostname}>
          {row.hostname}
        </Typography>

        <div className={styles.progressCell}>
          <TimeBar
            segments={[
              {
                id: `${row.id}-active`,
                value: row.progressPercent,
                tone: 'success',
              },
              {
                id: `${row.id}-rest`,
                value: Math.max(100 - row.progressPercent, 0),
                tone: 'neutral',
              },
            ]}
          />
        </div>

        <Typography variant="h5" className={styles.time}>
          {row.timeLabel}
        </Typography>
      </button>
    </div>
  );
};