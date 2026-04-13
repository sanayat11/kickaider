import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivityDetailsPopup.module.scss';
import { Avatar } from '@/shared/ui/avatar/view/Avatar';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';
import { MdOutlineArrowForward } from 'react-icons/md';
import type { Employee } from '@/shared/api/mock/activity.mock';

interface ActivityDetailsPopupProps {
  employee: Employee;
  date: string;
  onClose: () => void;
  style?: React.CSSProperties;
}

export const ActivityDetailsPopup: FC<ActivityDetailsPopupProps> = ({ 
  employee, 
  date, 
  onClose,
  style 
}) => {
  const navigate = useNavigate();

  const handleShowDetails = () => {
    navigate(`/activity/${employee.id}?date=${date}`);
    onClose();
  };

  return (
    <div className={styles.popup} style={style} onClick={(e) => e.stopPropagation()}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <Avatar 
            initials={employee.fullName[0]} 
            size="lg" 
            status={employee.id === 'emp-1' ? 'online' : 'none'} 
          />
        </div>
        <div className={styles.info}>
          <Typography variant="body1" className={styles.name}>{employee.fullName}</Typography>
          <Typography variant="caption" className={styles.desktop}>{employee.hostname}</Typography>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <Typography variant="body2" className={styles.statLabel}>Активность</Typography>
          <Typography variant="body2" className={styles.statValue}>22:15:33</Typography>
        </div>
        <div className={styles.statRow}>
          <Typography variant="body2" className={styles.statLabel}>Бездействие</Typography>
          <Typography variant="body2" className={styles.statValue}>00:00:00</Typography>
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
    </div>
  );
};
