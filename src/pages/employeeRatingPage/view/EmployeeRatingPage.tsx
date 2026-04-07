import type { FC } from 'react';

import styles from './EmployeeRatingPage.module.scss';
import { BASE_EMPLOYEES } from '@/shared/api/mock/employees.mock';

import { EmployeeRatingHeader } from '@/widgets/employeeRatingBlock/components/EmployeeRatingHeader';
import { EmployeeRatingFilters } from '@/widgets/employeeRatingBlock/components/EmployeeRatingFilters';
import { EmployeeRatingTable } from '@/widgets/employeeRatingBlock/components/EmployeeRatingTable';
import { useEmployeeRatingFilters } from '../model/EmployeeRatingFilters';
import { getEmployeeRatingRows } from '../model/EmployeeRatingRows';
import type { EmployeeRatingRowData } from '@/pages/employeeRatingPage/types/EmployeeRatingPage';

type Props = {
  rows: EmployeeRatingRowData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export const EmployeeRatingPageContent: FC<Props> = ({
  rows,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className={styles.page}>
      <EmployeeRatingTable
        rows={rows}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export const EmployeeRatingPage: FC = () => {
  const { filterItems, filtersState, currentPage, pageSize, setCurrentPage, setPageSize } =
    useEmployeeRatingFilters();

  const { rows, totalPages } = getEmployeeRatingRows({
    employees: BASE_EMPLOYEES,
    filters: filtersState,
    currentPage,
    pageSize,
  });

  return (
    <div className={styles.page}>
      <EmployeeRatingHeader />
      <EmployeeRatingFilters items={filterItems} />
      <EmployeeRatingPageContent
        rows={rows as any}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};