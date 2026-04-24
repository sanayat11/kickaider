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
  earlyLeaveMinutes: number;
  earlyLeaveCount: number;
  absenceCount: number;
  businessTripCount: number;
  vacationCount: number;
  sickLeaveCount: number;
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
                  <th onClick={() => onSort('period')}>
                    Период <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('department') && (
                  <th onClick={() => onSort('department')}>
                    Отдел <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('employee') && (
                  <th onClick={() => onSort('employee')}>
                    Сотрудник <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('firstActivity') && (
                  <th onClick={() => onSort('firstActivity')}>
                    Первая активность <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('lastActivity') && (
                  <th onClick={() => onSort('lastActivity')}>
                    Последняя активность <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('lateness') && (
                  <th onClick={() => onSort('lateness')}>
                    Опоздания <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('latenessCount') && (
                  <th onClick={() => onSort('latenessCount')}>
                    Кол-во опозданий <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('earlyLeaveMinutes') && (
                  <th onClick={() => onSort('earlyLeaveMinutes')}>
                    Ранние уходы <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('earlyLeaveCount') && (
                  <th onClick={() => onSort('earlyLeaveCount')}>
                    Кол-во уходов <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('absenceCount') && (
                  <th onClick={() => onSort('absenceCount')}>
                    Прогулы <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('businessTripCount') && (
                  <th onClick={() => onSort('businessTripCount')}>
                    Командировки <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('vacationCount') && (
                  <th onClick={() => onSort('vacationCount')}>
                    Отпуски <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
                )}

                {visibleColumns.has('sickLeaveCount') && (
                  <th onClick={() => onSort('sickLeaveCount')}>
                    Больничные <IoChevronDownOutline size={14} className={styles.sortIcon} />
                  </th>
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
                  {visibleColumns.has('earlyLeaveMinutes') && <td>{row.earlyLeaveMinutes}</td>}
                  {visibleColumns.has('earlyLeaveCount') && <td>{row.earlyLeaveCount}</td>}
                  {visibleColumns.has('absenceCount') && <td>{row.absenceCount}</td>}
                  {visibleColumns.has('businessTripCount') && <td>{row.businessTripCount}</td>}
                  {visibleColumns.has('vacationCount') && <td>{row.vacationCount}</td>}
                  {visibleColumns.has('sickLeaveCount') && <td>{row.sickLeaveCount}</td>}
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