import { createPortal } from 'react-dom';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivityDetailsPopup.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import { MdOutlineArrowForward } from 'react-icons/md';
import type { ActivityEmployeeRow } from './ActivityTable';

interface ActivityDetailsPopupProps {
  employee: ActivityEmployeeRow;
  date: string;
  onClose: () => void;
  coords: { top: number; left: number };
}

export const ActivityDetailsPopup: FC<ActivityDetailsPopupProps> = ({
  employee,
  date,
  onClose,
  coords,
}) => {
  const navigate = useNavigate();

  const handleShowDetails = () => {
    navigate(`/activity/${employee.employeeId}?date=${date}`);
    onClose();
  };

  return createPortal(
    <div
      className={styles.popup}
      style={{
        top: coords.top,
        left: coords.left - 48,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.header}>
        <div className={styles.info}>
          <Typography variant="body1" className={styles.name}>
            {employee.fullName}
          </Typography>
          <Typography variant="caption" className={styles.desktop}>
            {employee.hostname}
          </Typography>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <Typography variant="body2" className={styles.statLabel}>
            Активность
          </Typography>
          <Typography variant="body2" className={styles.statValue}>
            {employee.totalActiveTime}
          </Typography>
        </div>

        <div className={styles.statRow}>
          <Typography variant="body2" className={styles.statLabel}>
            Бездействие
          </Typography>
          <Typography variant="body2" className={styles.statValue}>
            {employee.totalIdleTime}
          </Typography>
        </div>
      </div>

      <Button
        variant="outline"
        size="large"
        className={styles.moreBtn}
        rightIcon={<MdOutlineArrowForward />}
        onClick={handleShowDetails}
      >
        Показать подробнее
      </Button>
    </div>,
    document.body,
  );
};