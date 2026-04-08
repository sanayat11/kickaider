import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyScheduleCard } from '@/widgets/companyScheduleCard';
import type { DepartmentData, Schedule } from '../../model/types';
import styles from './DepartmentsScheduleSection.module.scss';

type DepartmentsScheduleSectionProps = {
    departments: DepartmentData[];
    companySchedule: Schedule;
    onToggleInheritance: (id: string) => void;
    onChangeSchedule: (id: string, field: keyof Schedule, value: any) => void;
};

export const DepartmentsScheduleSection: FC<DepartmentsScheduleSectionProps> = ({
    departments,
    companySchedule,
    onToggleInheritance,
    onChangeSchedule,
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.section}>
            <div className={styles.list}>
                {departments.map((dept) => {
                    const effectiveSchedule = dept.inheritCompany ? companySchedule : dept.schedule;
                    const statusText = `${dept.inheritCompany ? t('settings.schedules.departments.inherit') : t('settings.schedules.departments.custom')} | ${effectiveSchedule.startTime} - ${effectiveSchedule.endTime}`;

                    return (
                        <CompanyScheduleCard
                            key={dept.id}
                            departmentName={dept.name}
                            statusText={statusText}
                            defaultOpen={false}
                            useCompanySchedule={dept.inheritCompany}
                            initialStartTime={effectiveSchedule.startTime}
                            initialEndTime={effectiveSchedule.endTime}
                            initialLunch={effectiveSchedule.lunchDuration}
                            initialDays={effectiveSchedule.workDays}
                            onSubmit={(values: {
                                useCompanySchedule: boolean;
                                startTime: string;
                                endTime: string;
                                lunch: string;
                                days: string[];
                            }) => {
                                if (values.useCompanySchedule !== dept.inheritCompany) {
                                    onToggleInheritance(dept.id);
                                } else if (!dept.inheritCompany) {
                                    onChangeSchedule(dept.id, 'startTime', values.startTime);
                                    onChangeSchedule(dept.id, 'endTime', values.endTime);
                                    onChangeSchedule(dept.id, 'lunchDuration', values.lunch);
                                    onChangeSchedule(dept.id, 'workDays', values.days);
                                }
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
