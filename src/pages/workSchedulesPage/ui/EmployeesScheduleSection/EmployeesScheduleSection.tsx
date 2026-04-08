import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleSearchBar } from '../ScheduleSearchBar/ScheduleSearchBar';
import { EmployeeScheduleCard } from '@/widgets/employeeScheduleCard';
import type { EmployeeScheduleCardProps } from '@/widgets/employeeScheduleCard';
import type { EmployeeData, Schedule, DepartmentData } from '../../model/types';
import styles from './EmployeesScheduleSection.module.scss';

type EmployeesScheduleSectionProps = {
  employees: EmployeeData[];
  departments: DepartmentData[];
  companySchedule: Schedule;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  onToggleInheritance: (id: string, effectiveParentSchedule: Schedule) => void;
  onChangeSchedule: (id: string, field: keyof Schedule, value: unknown) => void;
};

export const EmployeesScheduleSection: FC<EmployeesScheduleSectionProps> = ({
  employees,
  departments,
  companySchedule,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  onToggleInheritance,
  onChangeSchedule,
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
          {employees.map((emp) => {
            const parentDept = departments.find((d) => d.name === emp.department);
            const effectiveParentSchedule = parentDept ? parentDept.schedule : companySchedule;
            const effectiveSchedule = emp.inheritDepartment ? effectiveParentSchedule : emp.schedule;

            const statusText = emp.inheritDepartment
              ? t('settings.schedules.employees.inherit')
              : t('settings.schedules.employees.custom');

            return (
              <EmployeeScheduleCard
                key={emp.id}
                name={emp.name}
                department={emp.department}
                avatarUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}`}
                statusText={statusText}
                defaultOpen={false}
                useParentSchedule={emp.inheritDepartment}
                initialStartTime={effectiveSchedule.startTime}
                initialEndTime={effectiveSchedule.endTime}
                initialLunch={effectiveSchedule.lunchDuration}
                initialDays={effectiveSchedule.workDays}
                onSubmit={(
                  values: NonNullable<EmployeeScheduleCardProps['onSubmit']> extends (
                    v: infer T,
                  ) => void
                    ? T
                    : never
                ) => {
                  if (values.useCompanySchedule !== emp.inheritDepartment) {
                    onToggleInheritance(emp.id, effectiveParentSchedule);
                  } else if (!emp.inheritDepartment) {
                    onChangeSchedule(emp.id, 'startTime', values.startTime);
                    onChangeSchedule(emp.id, 'endTime', values.endTime);
                    onChangeSchedule(emp.id, 'lunchDuration', values.lunch);
                    onChangeSchedule(emp.id, 'workDays', values.days);
                  }
                }}
              />
            );
          })}

          {employees.length === 0 && (
            <div className={styles.emptyResults}>
              {t('settings.schedules.employees.noResults')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};