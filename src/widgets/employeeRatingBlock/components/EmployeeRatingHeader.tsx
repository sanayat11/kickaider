import type { FC } from 'react';
import { MdOutlineFileDownload } from 'react-icons/md';

import styles from '../styles/EmployeeRatingHeader.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';

export const EmployeeRatingHeader: FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <Typography variant="h1" color="primary" weight="bold" context='dashboard'>
          Рейтинг сотрудников
        </Typography>

        <Typography variant="h5" color='gray' weight='regular' context='dashboard'>
          Общий аналитический обзор по компании или сотруднику
        </Typography>
      </div>

      <Button
        variant="primary"
        size="large"
        tone="primary"
        rightIcon={<MdOutlineFileDownload size={18} />}
        onClick={() => undefined}
        className={styles.exportBtn}
      >
        Экспорт XLS
      </Button>
    </div>
  );
};
