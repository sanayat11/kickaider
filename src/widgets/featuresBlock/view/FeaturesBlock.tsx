import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FeaturesBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';

const featuresKeys = ['basicReports', 'activityHistory', 'ratingAndDetails', 'insightsAndRecommendations'];



export const FeaturesBlock: FC = () => {
    const { t } = useTranslation();
    return (
        <section className={styles.featuresBlock}>
            <div className={styles.header}>
                <Typography variant="h2" color="white" weight="bold" className={styles.title}>
                    {t('features.title')}
                </Typography>
                <Typography variant="h5" color="white" weight="regular" className={styles.description}>
                    {t('features.description')}
                </Typography>
            </div>

            <div className={styles.grid}>
                {featuresKeys.map((key, index) => (
                    <div key={key} className={styles.card}>
                        <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                        <Typography variant="h4" weight="bold" className={styles.cardTitle}>
                            {t(`features.cards.${key}.title`)}
                        </Typography>
                        <Typography variant="h5" className={styles.cardDescription}>
                            {t(`features.cards.${key}.description`)}
                        </Typography>
                    </div>
                ))}
            </div>
        </section>
    );
};
