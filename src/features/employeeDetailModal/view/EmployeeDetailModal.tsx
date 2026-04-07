import type { FC } from 'react';
import { MdArrowForward } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Avatar } from '@/shared/ui/avatar/view/Avatar';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { paths } from '@/shared/constants/constants';

import styles from './EmployeeDetailModal.module.scss';

type Props = {
  employee: {
    name: string;
    hostname: string;
    avatar?: string;
    initials?: string;
    isOnline?: boolean;
  };
  onClose?: () => void;
};

export const EmployeeDetailsPopover: FC<Props> = ({ employee, onClose }) => {
  const navigate = useNavigate();

  const handleOpenDetails = () => {
    onClose?.();

    navigate(paths.DASHBOARD_DAY_DETAILS, {
      state: { selectedEmployee: employee.name },
    });
  };

  return (
    <div className={styles.popover}>
      <div className={styles.content}>
        <div className={styles.employeeBlock}>
          <div className={styles.avatarWrap}>
            <Avatar
              src={employee.avatar}
              alt={employee.name}
              initials={employee.initials}
              size="sm"
              status={employee.isOnline ? 'online' : 'none'}
              className={styles.avatar}
            />
          </div>

          <div className={styles.info}>
            <Typography variant="h4" weight="medium" className={styles.name}>
              {employee.name}
            </Typography>

            <Typography variant="h5" weight="regular" className={styles.hostname}>
              {employee.hostname}
            </Typography>
          </div>
        </div>

        <Button
          variant="outline"
          tone="blue"
          size="medium"
          fullWidth
          className={styles.detailsButton}
          rightIcon={<MdArrowForward size={20} />}
          onClick={handleOpenDetails}
        >
          Показать подробнее
        </Button>
      </div>
    </div>
  );
};