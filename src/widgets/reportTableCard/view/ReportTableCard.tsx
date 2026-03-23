import { useState, type FC } from 'react';
import classNames from 'classnames';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from './ReportTableCard.module.scss';

type ReportRow = {
  department: string;
  productive: string;
  unproductive: string;
  neutral: string;
};

type ReportTableCardProps = {
  title: string;
  rows: ReportRow[];
  defaultOpen?: boolean;
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

export const ReportTableCard: FC<ReportTableCardProps> = ({
  title,
  rows,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.card}>
      <button type="button" className={styles.header} onClick={() => setOpen((prev) => !prev)}>
        <Typography variant="h4" weight="bold" className={styles.title}>
          {title}
        </Typography>
        <ChevronIcon open={open} />
      </button>

      <div className={classNames(styles.content, { [styles.contentOpen]: open })}>
        <div className={styles.inner}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Отделы</th>
                <th>Продуктивны</th>
                <th>Непродуктивны</th>
                <th>Нейтральны</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.department}-${index}`}>
                  <td>{row.department}</td>
                  <td>{row.productive}</td>
                  <td>{row.unproductive}</td>
                  <td>{row.neutral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};