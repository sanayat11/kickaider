import type { FC } from 'react';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { CollapsibleCard } from '@/shared/ui/collapsibleCard/view/CollapsibleCard';
import { ScheduleForm } from '@/features/scheduleForm/view/ScheduleForm';
import styles from './CompanyScheduleCard.module.scss';

type CompanyScheduleCardProps = {
  departmentName: string;
  statusText: string;
  defaultOpen?: boolean;
  disabled?: boolean;
  useCompanySchedule?: boolean;
  initialStartTime?: string;
  initialEndTime?: string;
  initialLunch?: string;
  initialDays?: string[];
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (values: {
    useCompanySchedule: boolean;
    startTime: string;
    endTime: string;
    lunch: string;
    days: string[];
  }) => void;
};

export const CompanyScheduleCard: FC<CompanyScheduleCardProps> = ({
  departmentName,
  statusText,
  defaultOpen = true,
  disabled = false,
  useCompanySchedule = false,
  initialStartTime,
  initialEndTime,
  initialLunch,
  initialDays,
  onOpenChange,
  onSubmit,
}) => {
  const formKey = `${useCompanySchedule ? 'inherit' : 'custom'}-${initialStartTime ?? ''}-${initialEndTime ?? ''}-${initialLunch ?? ''}-${(initialDays ?? []).join(',')}`;

  return (
    <CollapsibleCard
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
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
      <ScheduleForm
        key={formKey}
        disabled={disabled}
        initialUseCompanySchedule={useCompanySchedule}
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        initialLunch={initialLunch}
        initialDays={initialDays}
        onSubmit={onSubmit}
      />
    </CollapsibleCard>
  );
};
