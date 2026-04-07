import { useState, type FC } from 'react';

import styles from '../styles/EmployeeRatingTable.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Pagination } from '@/shared/ui/pagination/view/Pagination';
import type { EmployeeRatingRowData } from '@/pages/employeeRatingPage/types/EmployeeRatingPage';
import { EmployeeRatingRow } from './EmployeeRatingRow';

type Props = {
  rows: EmployeeRatingRowData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const EmployeeRatingTable: FC<Props> = ({
  rows,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [openedRowId, setOpenedRowId] = useState<string | null>(null);

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <Typography variant="h5" className={styles.headCell}>
          №
        </Typography>
        <Typography variant="h5" className={styles.headCell}>
          Name
        </Typography>
        <Typography variant="h5" className={styles.headCell}>
          Hostname
        </Typography>
        <Typography variant="h5" className={styles.headCell}>
          Общая активность
        </Typography>
        <Typography variant="h5" className={styles.headCell}>
          Общая активность
        </Typography>
      </div>

      <div className={styles.body}>
        {rows.length > 0 ? (
          rows.map((row) => (
            <EmployeeRatingRow
              key={row.id}
              row={row}
              openedRowId={openedRowId}
              onToggleRow={setOpenedRowId}
            />
          ))
        ) : (
          <div className={styles.emptyState}>Нет данных по выбранным фильтрам</div>
        )}
      </div>

      <div className={styles.paginationWrap}>
        <Pagination
          variant="bar"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={[10, 25, 50]}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};