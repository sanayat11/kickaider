import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleSearchBar } from '../ScheduleSearchBar/ScheduleSearchBar';
import { EmployeeScheduleCard } from '@/widgets/employeeScheduleCard';
import type { EmployeeData, DepartmentData } from '../../model/types';
import styles from './EmployeesScheduleSection.module.scss';

type EmployeesScheduleSectionProps = {
  employees: EmployeeData[];
  loading: boolean;
  savingIds: string[];
  loadingScheduleIds: string[];
  departments: DepartmentData[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  onOpenEmployee: (id: string) => void;
  onEmployeeDateChange: (id: string, date: string) => void;
  onSaveEmployeeSchedule: (
    id: string,
    values: {
      useDepartmentSchedule: boolean;
      date: string;
      workingDay: boolean;
      startTime: string;
      endTime: string;
      lunch: string;
    },
  ) => void;
};

export const EmployeesScheduleSection: FC<EmployeesScheduleSectionProps> = ({
  employees,
  loading,
  savingIds,
  loadingScheduleIds,
  departments,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onOpenEmployee,
  onEmployeeDateChange,
  onSaveEmployeeSchedule,
}) => {
  const { t } = useTranslation();

  const deptOptions = departments.map((d) => ({ label: d.name, value: d.name }));

  return (
    <div className={styles.section}>
      <div className={styles.panel}>
        <ScheduleSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filterType={filterType}
          onFilterChange={onFilterChange}
          departmentOptions={deptOptions}
        />

        <div className={styles.list}>
          {loading && <div className={styles.emptyResults}>{t('common.loading')}</div>}

          {!loading && employees.length === 0 && (
            <div className={styles.emptyResults}>{t('settings.schedules.employees.noResults')}</div>
          )}

          {!loading &&
            employees.map((emp) => {
              const effectiveSchedule = emp.schedule;

              const statusText = emp.inheritDepartment
                ? t('settings.schedules.employees.inherit')
                : t('settings.schedules.employees.custom');
              const isBusy = savingIds.includes(emp.id) || loadingScheduleIds.includes(emp.id);

              return (
                <EmployeeScheduleCard
                  key={emp.id}
                  name={emp.name}
                  department={emp.department}
                  avatarUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}`}
                  statusText={statusText}
                  defaultOpen={false}
                  disabled={isBusy}
                  onOpenChange={(open) => {
                    if (open) {
                      onOpenEmployee(emp.id);
                    }
                  }}
                  useParentSchedule={emp.inheritDepartment}
                  initialDate={emp.selectedDate}
                  initialWorkingDay={effectiveSchedule.workingDay}
                  initialStartTime={effectiveSchedule.startTime}
                  initialEndTime={effectiveSchedule.endTime}
                  initialLunch={effectiveSchedule.lunchDuration}
                  onDateChange={(date) => onEmployeeDateChange(emp.id, date)}
                  onSubmit={(values) => onSaveEmployeeSchedule(emp.id, values)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
