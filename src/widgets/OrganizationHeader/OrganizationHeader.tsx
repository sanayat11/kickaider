import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from './OrganizationHeader.module.scss';

interface OrganizationHeaderProps {
  title?: string;
  subtitle?: string;
}

export const OrganizationHeader: FC<OrganizationHeaderProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Typography variant="h2" weight="bold">
        {title || t('settings.organization.title')}
      </Typography>
      <Typography variant="h5" color="secondary" className={styles.subtitle}>
        {subtitle || t('settings.organization.subtitle')}
      </Typography>
    </div>
  );
};
