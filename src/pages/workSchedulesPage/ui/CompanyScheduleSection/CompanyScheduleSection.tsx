import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { ScheduleForm } from '@/features/scheduleForm/view/ScheduleForm';
import type { Schedule } from '../../model/types';
import styles from './CompanyScheduleSection.module.scss';

type CompanyScheduleSectionProps = {
    schedule: Schedule;
    onChange: (field: keyof Schedule, value: any) => void;
};

export const CompanyScheduleSection: FC<CompanyScheduleSectionProps> = ({ schedule, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className={styles.section}>
            <div className={styles.card}>
                <Typography variant="h3" color="primary" weight="bold" className={styles.title}>
                    {t('settings.schedules.company.title')}
                </Typography>
                <Typography variant="h5" color="gray" weight="regular" className={styles.description}>
                    {t('settings.schedules.company.description')}
                </Typography>

                <div className={styles.formWrapper}>
                    <ScheduleForm
                        hideToggle={true}
                        initialUseCompanySchedule={false}
                        initialStartTime={schedule.startTime}
                        initialEndTime={schedule.endTime}
                        initialLunch={schedule.lunchDuration}
                        initialDays={schedule.workDays}
                        onSubmit={(values) => {
                            onChange('startTime', values.startTime);
                            onChange('endTime', values.endTime);
                            onChange('lunchDuration', values.lunch);
                            onChange('workDays', values.days);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
