import React, { useState, useEffect } from 'react';
import styles from './ActivityPage.module.scss';

import { ActivityHeader } from './components/ActivityHeader';
import { ActivityFilters } from './components/ActivityFilters';
import { ActivityLegend } from './components/ActivityLegend';
import { ActivityTable } from './components/ActivityTable';
import { Pagination } from '@/shared/ui/pagination/view/Pagination';

import { activityMockApi } from '@/shared/api/mock/activity.mock';
import type { Employee } from '@/shared/api/mock/activity.mock';

export const ActivityPage: React.FC = () => {
  const [date, setDate] = useState(new Date('2026-03-03').toISOString().split('T')[0]);
  const [department, setDepartment] = useState('Company');
  const [scale, setScale] = useState('allDay');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await activityMockApi.getTimelineDay({
          date,
          departments: department !== 'Company' ? [department] : [],
          searchQuery,
        });
        setEmployees(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [date, department, searchQuery]);

  return (
    <div className={styles.page}>
      <ActivityHeader />  <div className={styles.filtersWrapper}>
        <ActivityFilters
          date={date}
          setDate={setDate}
          department={department}
          setDepartment={setDepartment}
          scale={scale}
          setScale={setScale}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <ActivityLegend />
      <div className={styles.mainCard}>





        <ActivityTable employees={employees} date={date} loading={loading} scale={scale} />

        <div className={styles.footer}>
          <Pagination
            currentPage={currentPage}
            totalPages={6}
            onPageChange={setCurrentPage}
            variant="bar"
            pageSize={10}
            onPageSizeChange={() => { }}
          />
        </div>
      </div>
    </div>
  );
};