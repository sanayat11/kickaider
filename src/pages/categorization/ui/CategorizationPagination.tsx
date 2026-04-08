import type { FC } from 'react';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import classNames from 'classnames';
import styles from '../view/CategorizationPage.module.scss';

interface CategorizationPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export const CategorizationPagination: FC<CategorizationPaginationProps> = ({
  page,
  pageSize,
  totalPages,
  setPage,
  setPageSize,
}) => {
  return (
    <div className={styles.pagination}>
      <div className={styles.pageSizeSelector}>
        <span className={styles.paginationLabel}>Показать по</span>

        <SelectDropdown
          value={pageSize.toString()}
          onChange={(val) => {
            setPageSize(Number(val));
            setPage(1);
          }}
          options={[
            { label: '10', value: '10' },
            { label: '20', value: '20' },
            { label: '50', value: '50' },
          ]}
          className={styles.pSelect}
          size="sm"
        />
      </div>

      <div className={styles.pageControls}>
        <button
          className={classNames(styles.pBtn, { [styles.disabled]: page === 1 })}
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <IoChevronBack />
        </button>

        <span className={styles.pageIndicator}>
          Страница {page} из {Math.max(1, totalPages)}
        </span>

        <button
          className={classNames(styles.pBtn, {
            [styles.disabled]: page >= totalPages,
          })}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
};