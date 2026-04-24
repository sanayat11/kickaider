import type { FC } from 'react';
import { AttachmentIcon } from '@/shared/assets/icons';

import styles from '../styles/EmployeeRatingHeader.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { Button } from '@/shared/ui/button/view/Button';

interface Props {
  onExport?: () => void;
  exporting?: boolean;
}

export const EmployeeRatingHeader: FC<Props> = ({ onExport, exporting }) => {
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
        size="medium"
        tone="primary"
        rightIcon={<AttachmentIcon />}
        onClick={onExport}
        disabled={exporting}
        className={styles.exportBtn}
      >
        {exporting ? 'Экспорт...' : 'Экспорт XLS'}
      </Button>
    </div>
  );
};
