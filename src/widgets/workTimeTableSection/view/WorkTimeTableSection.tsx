import React from 'react';
import { IoFileTrayOutline, IoChevronDownOutline } from 'react-icons/io5';
import { Pagination } from '@/shared/ui';
import styles from './WorkTimeTableSection.module.scss';

export interface WorkTimeTableRow {
  id: number;
  period: string;
  department: string;
  employee: string;
  firstActivity: string;
  lastActivity: string;
  lateness: number;
  latenessCount: number;
}

type WorkTimeTableProps = {
  loading?: boolean;
  rows: WorkTimeTableRow[];
  visibleColumns: Set<string>;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  noDataText: string;
  onSort: (key: keyof WorkTimeTableRow) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const WorkTimeTable: React.FC<WorkTimeTableProps> = ({
  loading = false,
  rows,
  visibleColumns,
  currentPage,
  totalPages,
  pageSize,
  noDataText,
  onSort,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <section className={styles.tableSection}>
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.skeleton} />
        ) : rows.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                {visibleColumns.has('period') && (
                  <th onClick={() => onSort('period')}>Период <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
                {visibleColumns.has('department') && (
                  <th onClick={() => onSort('department')}>Отдел <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
                {visibleColumns.has('employee') && (
                  <th onClick={() => onSort('employee')}>Сотрудник <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
                {visibleColumns.has('firstActivity') && (
                  <th onClick={() => onSort('firstActivity')}>Первая активность <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
                {visibleColumns.has('lastActivity') && (
                  <th onClick={() => onSort('lastActivity')}>Последняя активность <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
                {visibleColumns.has('lateness') && (
                  <th onClick={() => onSort('lateness')}>Опоздания <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
                {visibleColumns.has('latenessCount') && (
                  <th onClick={() => onSort('latenessCount')}>Кол-во опозданий <IoChevronDownOutline size={14} className={styles.sortIcon} /></th>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {visibleColumns.has('period') && <td>{row.period}</td>}
                  {visibleColumns.has('department') && <td>{row.department}</td>}
                  {visibleColumns.has('employee') && <td>{row.employee}</td>}
                  {visibleColumns.has('firstActivity') && <td>{row.firstActivity}</td>}
                  {visibleColumns.has('lastActivity') && <td>{row.lastActivity}</td>}
                  {visibleColumns.has('lateness') && <td>{row.lateness}</td>}
                  {visibleColumns.has('latenessCount') && <td>{row.latenessCount}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <IoFileTrayOutline />
            <p>{noDataText}</p>
          </div>
        )}
      </div>

      <Pagination
        className={styles.pagination}
        variant="bar"
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
};
