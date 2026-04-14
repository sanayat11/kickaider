import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ActivityDetailsPage.module.scss';

import { Pagination } from '@/shared/ui/pagination/view/Pagination';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { SegmentedControl } from '@/shared/ui/segmentedControl/view/SegmentedControl';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { IoSearchOutline } from 'react-icons/io5';

import { activityMockApi } from '@/shared/api/mock/activity.mock';
import type { EmployeeDayDetails } from '@/shared/api/mock/activity.mock';

import { DetailsHeader } from './components/DetailsHeader';
import { DetailsTableFull } from './components/DetailsTableFull';
import { DetailsTableShort } from './components/DetailsTableShort';

export const ActivityDetailsPage = () => {
  const { employeeId } = useParams();

  const [viewMode, setViewMode] = useState<'full' | 'short'>('full');
  const [timeMode, setTimeMode] = useState<'allDay' | 'workTime' | 'custom'>('workTime');
  const [timeInterval, setTimeInterval] = useState('15m');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<EmployeeDayDetails | null>(null);

  useEffect(() => {
    activityMockApi
      .getEmployeeDayDetails({
        employeeId: employeeId || '1',
        date: '2026-03-03',
      })
      .then(setData);
  }, [employeeId]);

  if (!data) return <div className={styles.loader}>Загрузка...</div>;

  return (
    <div className={styles.page}>
      <DetailsHeader fullName={data.header.fullName} hostname={data.header.hostname} />

      <div className={styles.card}>
        <div className={styles.controlsSection}>
          <div className={styles.controlsRowTop}>
            <SegmentedControl
              value={timeMode}
              onChange={(v) => setTimeMode(v as any)}
              options={[
                { label: 'Весь день', value: 'allDay' },
                { label: 'Рабочее время', value: 'workTime' },
                { label: 'Произвольное время', value: 'custom' },
              ]}
            />

            <div className={styles.timeSelectWrap}>
              <SelectDropdown
                value={timeInterval}
                onChange={setTimeInterval}
                placeholder="Время"
                size="sm"
                className={styles.timeSelect}
                options={[
                  { label: '1 минута', value: '1m' },
                  { label: '5 минут', value: '5m' },
                  { label: '15 минут', value: '15m' },
                  { label: '1 час', value: '1h' },
                ]}
              />
            </div>

            <div className={styles.searchWrap}>
              <BaseInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по приложению"
                icon={<IoSearchOutline />}
              />
            </div>
          </div>

          <div className={styles.controlsRowBottom}>
             <SegmentedControl
                value={viewMode}
                onChange={(v) => setViewMode(v as any)}
                options={[
                  { label: 'Подробный вид', value: 'full' },
                  { label: 'Сокращенный вид', value: 'short' },
                ]}
              />
          </div>
        </div>

        <div className={styles.tableContainer}>
          {viewMode === 'full' ? (
            <DetailsTableFull events={data.fullViewEvents} />
          ) : (
            <DetailsTableShort rows={data.shortViewRows} />
          )}
        </div>

        <div className={styles.footer}>
          <Pagination
            variant="bar"
            currentPage={1}
            totalPages={6}
            onPageChange={() => {}}
            pageSize={10}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
