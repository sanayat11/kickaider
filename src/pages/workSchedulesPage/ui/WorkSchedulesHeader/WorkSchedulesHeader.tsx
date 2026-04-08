import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from './WorkSchedulesHeader.module.scss';

export const WorkSchedulesHeader: FC = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.header}>
            <Typography variant="h1" context='dashboard' color="primary" weight="bold" className={styles.title}>
                {t('settings.schedules.title')}
            </Typography>
            <Typography variant="h5" context='dashboard' color="gray" weight="regular" className={styles.subtitle}>
                {t('settings.schedules.subtitle')}
            </Typography>
        </div>
    );
};
