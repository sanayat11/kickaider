import type { FC } from 'react';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from '../ActivityPage.module.scss';
import { FiLink } from 'react-icons/fi';

export const ActivityHeader: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.titleBlock}>
        <Typography variant="h1" className={styles.title}>История активности</Typography>
        <Typography variant="body1" className={styles.subtitle}>
          Общий аналитический обзор по компании или сотруднику
        </Typography>
      </div>
      <Button
        variant="primary"
        size="large"
        rightIcon={<FiLink />}
        style={{ backgroundColor: '#4e5bd9', borderRadius: '10px' }}
      >
        Экспорт XLS
      </Button>
    </header>
  );
};
