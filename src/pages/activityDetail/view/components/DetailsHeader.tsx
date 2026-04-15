import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { IoChevronBackOutline } from 'react-icons/io5';
import styles from '../ActivityDetailsPage.module.scss';

interface DetailsHeaderProps {
  fullName: string;
  hostname: string;
}

export const DetailsHeader: FC<DetailsHeaderProps> = ({ fullName, hostname }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <button
        onClick={() => navigate(-1)}
        className={styles.backBtn}
      >
        <IoChevronBackOutline size={20} />
        <Typography variant="h3">Назад</Typography>
      </button>
      
      <Typography variant="h1" className={styles.pageTitle}>
        {fullName} {hostname}
      </Typography>
    </div>
  );
};
