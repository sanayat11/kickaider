import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TeamBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import teamImage from '@/shared/assets/images/Image Placeholder.png';

export const TeamBlock: FC = () => {
    const { t } = useTranslation();
    return (
        <section id="team" className={styles.teamBlock}>
            <div className={styles.imageWrapper}>
                <img src={teamImage} alt="Team working" className={styles.image} />
            </div>

            <div className={styles.content}>
                <Typography context='landing' variant="h2" weight="bold" className={styles.title}>
                    {t('aboutCompany.title')}
                </Typography>
                <div className={styles.descriptionWrapper}>
                    <Typography context='landing'variant="h5" className={styles.description}>
                        {t('aboutCompany.text')}
                    </Typography>
                </div>
            </div>
        </section>
    );
};
