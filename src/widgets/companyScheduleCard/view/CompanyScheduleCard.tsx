import type { FC } from 'react';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { CollapsibleCard } from '@/shared/ui/collapsibleCard/view/CollapsibleCard';
import { ScheduleForm } from '@/features/scheduleForm/view/ScheduleForm';
import styles from './CompanyScheduleCard.module.scss';

type CompanyScheduleCardProps = {
  departmentName: string;
  statusText: string;
  defaultOpen?: boolean;
  useCompanySchedule?: boolean;
};

export const CompanyScheduleCard: FC<CompanyScheduleCardProps> = ({
  departmentName,
  statusText,
  defaultOpen = true,
  useCompanySchedule = false,
}) => {
  return (
    <CollapsibleCard
      defaultOpen={defaultOpen}
      left={
        <Typography variant="h4" weight='bold' className={styles.title}>
          {departmentName}
        </Typography>
      }
      center={
        <Typography variant="h4" weight='bold' className={styles.status}>
          {statusText}
        </Typography>
      }
    >
      <ScheduleForm initialUseCompanySchedule={useCompanySchedule} />
    </CollapsibleCard>
  );
};