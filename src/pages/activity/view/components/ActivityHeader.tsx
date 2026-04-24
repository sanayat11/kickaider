import type { FC } from 'react';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from '../ActivityPage.module.scss';
import { AttachmentIcon } from '@/shared/assets/icons';

interface ActivityHeaderProps {
  onExport?: () => void;
  exporting?: boolean;
}

export const ActivityHeader: FC<ActivityHeaderProps> = ({ onExport, exporting }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <Typography variant="h1" weight='bold' className={styles.title}>История активности</Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Общий аналитический обзор по компании или сотруднику
        </Typography>
      </div>
      <Button
        variant="primary"
        size="large"
        rightIcon={<AttachmentIcon />}
        className={styles.exportButton}
        onClick={onExport}
        disabled={exporting}
      >
        {exporting ? 'Экспорт...' : 'Экспорт XLS'}
      </Button>
    </header>
  );
};
