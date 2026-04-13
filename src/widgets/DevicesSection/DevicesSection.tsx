import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from './DevicesSection.module.scss';

interface DevicesSectionProps {
  children: ReactNode;
}

export const DevicesSection: FC<DevicesSectionProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Typography variant="h3" weight="bold">
          {t('settings.organization.devices.title')}
        </Typography>
        <Typography variant="h5" color="secondary" className={styles.subtitle}>
          {t('settings.organization.devices.subtitle')}
        </Typography>
      </div>

      <div className={styles.instruction}>
        <Typography variant="h5" color="secondary">
          {t('settings.organization.devices.instruction') || 'Эти устройства подключились к серверу, но не привязаны ни к одному сотруднику.'}
        </Typography>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
