import type { FC } from 'react';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { CollapsibleCard } from '@/shared/ui/collapsibleCard/view/CollapsibleCard';
import { ScheduleForm } from '@/features/scheduleForm/view/ScheduleForm';
import styles from './EmployeeScheduleCard.module.scss';
import { Avatar } from '@/shared/ui';

type EmployeeScheduleCardProps = {
  name: string;
  department: string;
  statusText: string;
  avatarUrl?: string;
  defaultOpen?: boolean;
  useCompanySchedule?: boolean;
};

export const EmployeeScheduleCard: FC<EmployeeScheduleCardProps> = ({
  name,
  department,
  statusText,
  defaultOpen = true,
  useCompanySchedule = false,
}) => {
  return (
    <CollapsibleCard
      defaultOpen={defaultOpen}
      left={
        <div className={styles.person}>
          <div >
            <Avatar initials="h" size="sm" />
          </div>

          <div className={styles.meta}>
            <Typography variant="h4" weight='semiBold' className={styles.name}>
              {name}
            </Typography>
            <Typography variant="h4" className={styles.department}>
              {department}
            </Typography>
          </div>
        </div>
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