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
      <div className={styles.instruction}>
        <Typography variant="h5" color="secondary">
          {t('settings.organization.devices.instruction', { defaultValue: 'Эти устройства подключились к серверу, но не привязаны ни к одному сотруднику.' })}
        </Typography>
      </div>

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
