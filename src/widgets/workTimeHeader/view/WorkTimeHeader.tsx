import React from 'react';
import styles from './WorkTimeHeader.module.scss';
import { Typography } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { AttachmentIcon } from '@/shared/assets/icons';

type WorkTimeHeaderProps = {
  title: string;
  subtitle: string;
  exportLabel: string;
  onExport?: () => void;
};

export const WorkTimeHeader: React.FC<WorkTimeHeaderProps> = ({
  title,
  subtitle,
  exportLabel,
  onExport,
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <Typography variant='h1' color='primary' context='dashboard' weight='bold'>{title}</Typography>
        <Typography variant='h5' color='gray' context='dashboard' weight='regular'>{subtitle}</Typography>
      </div>

      <Button type="button" variant='primary' size='large' className={styles.exportBtn} onClick={onExport}>
        {exportLabel} <AttachmentIcon className={styles.icon} />
      </Button>
    </header>
  );
};
