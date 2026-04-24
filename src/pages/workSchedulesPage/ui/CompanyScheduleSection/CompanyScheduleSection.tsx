import type { FC } from 'react';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { ScheduleForm } from '@/features/scheduleForm/view/ScheduleForm';
import type { Schedule } from '../../model/types';
import styles from './CompanyScheduleSection.module.scss';

type CompanyScheduleSectionProps = {
  schedule: Schedule;
  loading: boolean;
  saving: boolean;
  scheduleKey: number;
  onSave: (values: { startTime: string; endTime: string; lunch: string; days: string[] }) => void;
};

export const CompanyScheduleSection: FC<CompanyScheduleSectionProps> = ({
  schedule,
  loading,
  saving,
  scheduleKey,
  onSave,
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.card}>
        <Typography variant="h3" color="primary" weight="bold" className={styles.title}>
          График компании
        </Typography>
        <Typography variant="h5" color="gray" weight="regular" className={styles.description}>
          Установите рабочее расписание для всей компании
        </Typography>

        {loading ? (
          <div className={styles.skeleton} />
        ) : (
          <div className={styles.formWrapper}>
            <ScheduleForm
              key={scheduleKey}
              hideToggle={true}
              initialUseCompanySchedule={false}
              initialStartTime={schedule.startTime}
              initialEndTime={schedule.endTime}
              initialLunch={schedule.lunchDuration}
              initialDays={schedule.workDays}
              disabled={saving}
              onSubmit={(values) =>
                onSave({
                  startTime: values.startTime,
                  endTime:   values.endTime,
                  lunch:     values.lunch,
                  days:      values.days,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
