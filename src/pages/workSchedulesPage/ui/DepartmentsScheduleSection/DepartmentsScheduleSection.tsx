import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyScheduleCard } from '@/widgets/companyScheduleCard';
import type { DepartmentData, Schedule } from '../../model/types';
import styles from './DepartmentsScheduleSection.module.scss';

type DepartmentsScheduleSectionProps = {
  departments: DepartmentData[];
  loading: boolean;
  savingIds: string[];
  loadingScheduleIds: string[];
  companySchedule: Schedule;
  onOpenDepartment: (id: string) => void;
  onSaveDepartmentSchedule: (
    id: string,
    values: {
      useCompanySchedule: boolean;
      startTime: string;
      endTime: string;
      lunch: string;
      days: string[];
    },
  ) => void;
};

export const DepartmentsScheduleSection: FC<DepartmentsScheduleSectionProps> = ({
  departments,
  loading,
  savingIds,
  loadingScheduleIds,
  companySchedule,
  onOpenDepartment,
  onSaveDepartmentSchedule,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.emptyResults}>{t('common.loading')}</div>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className={styles.section}>
        <div className={styles.emptyResults}>{t('common.noData')}</div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.list}>
        {departments.map((dept) => {
          const effectiveSchedule = dept.inheritCompany ? companySchedule : dept.schedule;
          const isLoadingSchedule = loadingScheduleIds.includes(dept.id);
          const isSavingSchedule = savingIds.includes(dept.id);
          const isBusy = isLoadingSchedule || isSavingSchedule;
          const statusText = `${dept.inheritCompany ? t('settings.schedules.departments.inherit') : t('settings.schedules.departments.custom')} | ${effectiveSchedule.startTime} - ${effectiveSchedule.endTime}`;

          return (
            <CompanyScheduleCard
              key={dept.id}
              departmentName={dept.name}
              statusText={statusText}
              defaultOpen={false}
              disabled={isBusy}
              useCompanySchedule={dept.inheritCompany}
              initialStartTime={effectiveSchedule.startTime}
              initialEndTime={effectiveSchedule.endTime}
              initialLunch={effectiveSchedule.lunchDuration}
              initialDays={effectiveSchedule.workDays}
              onOpenChange={(open) => {
                if (open) {
                  onOpenDepartment(dept.id);
                }
              }}
              onSubmit={(values) => {
                onSaveDepartmentSchedule(dept.id, values);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
