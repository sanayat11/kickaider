import type { FC } from 'react';

import styles from './EmployeeRatingPage.module.scss';

import { EmployeeRatingHeader } from '@/widgets/employeeRatingBlock/components/EmployeeRatingHeader';
import { EmployeeRatingFilters } from '@/widgets/employeeRatingBlock/components/EmployeeRatingFilters';
import { EmployeeRatingTable } from '@/widgets/employeeRatingBlock/components/EmployeeRatingTable';
import { useEmployeeRatingReport } from '../model/useEmployeeRating';
import { useEmployeeRatingFilters } from '../model/EmployeeRatingFilters';
import type { EmployeeRatingRowData } from '@/pages/employeeRatingPage/types/EmployeeRatingPage';
import { exportRatingReport } from '@/shared/api/exportApi';
import { useState } from 'react';

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
  const {
    filterItems,
    filtersState,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  } = useEmployeeRatingFilters();
  

  const { rows, totalPages, isLoading, error } = useEmployeeRatingReport({
    filters: filtersState,
    currentPage,
    pageSize,
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportRatingReport({
        departmentId: filtersState.department !== 'all' ? Number(filtersState.department) : undefined,
        from: `${filtersState.currentDate}T00:00:00Z`,
        to: `${filtersState.currentDate}T23:59:59Z`,
        date: filtersState.currentDate,
        groupBy: 'DAY',
        onlyWorkTime: filtersState.onlyWorkHours,
        page: currentPage - 1,
        size: pageSize,
      }, `rating_${filtersState.currentDate}.xlsx`);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.page}>
      <EmployeeRatingHeader onExport={handleExport} exporting={isExporting} />
      <EmployeeRatingFilters items={filterItems} />

      {isLoading ? <div>Загрузка рейтинга...</div> : null}
      {error ? <div>{error}</div> : null}

      <EmployeeRatingPageContent
        rows={rows}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
      
    </div>
  );
};