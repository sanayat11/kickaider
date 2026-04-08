import { useState, type FC } from 'react';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { ScheduleForm } from '@/features/scheduleForm/view/ScheduleForm';
import { Avatar } from '@/shared/ui';
import type { EmployeeScheduleCardProps } from '../types/EmployeeScheduleCard';
import styles from './EmployeeScheduleCard.module.scss';

const Chevron: FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`${styles.chevronIcon} ${open ? styles.chevronOpen : ''}`}
    aria-hidden="true"
  >
    <path
      d="M5 6.5L8 9.5L11 6.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EmployeeScheduleCard: FC<EmployeeScheduleCardProps> = ({
  name,
  department,
  statusText,
  avatarUrl,
  defaultOpen = false,
  useParentSchedule = false,
  initialStartTime,
  initialEndTime,
  initialLunch,
  initialDays,
  onSubmit,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className={styles.employeeCol}>
          <Avatar src={avatarUrl} initials={name} size="sm" status="online" />

          <div className={styles.meta}>
            <Typography variant="h5" weight="bold" className={styles.name}>
              {name}
            </Typography>

            <Typography variant="h5" weight="regular" className={styles.department}>
              {department}
            </Typography>
          </div>
        </div>

        <div className={styles.statusCol}>
          <Typography variant="h5" weight="bold" className={styles.status}>
            {statusText}
          </Typography>
        </div>

        <div className={styles.chevronCol}>
          <Chevron open={open} />
        </div>
      </button>

      {open && (
        <div className={styles.body}>
          <ScheduleForm
            initialUseCompanySchedule={useParentSchedule}
            initialStartTime={initialStartTime}
            initialEndTime={initialEndTime}
            initialLunch={initialLunch}
            initialDays={initialDays}
            onSubmit={onSubmit}
          />
        </div>
      )}
    </div>
  );
};