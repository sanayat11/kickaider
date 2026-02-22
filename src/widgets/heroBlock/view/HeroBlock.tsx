import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './HeroBlock.module.scss';
import heroImage from '@/shared/assets/images/Image Container.png';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { paths } from '@/shared/constants/constants';
    
export const HeroBlock: FC = () => {
    const { t } = useTranslation();
    return (
        <section className={styles.heroBlock}>
            <div className={styles.imageWrapper}>
                <img src={heroImage} alt="Team working together" className={styles.bgImage} />
                <div className={styles.overlay} />
            </div>

            <div className={styles.content}>
                <div className={styles.textContent}>
                    <Typography variant="h1" color="white" weight="bold" className={styles.title}>
                        {t('hero.title')}
                    </Typography>
                    <Typography variant="h5" color="white" weight="regular" className={styles.description}>
                        {t('hero.description')}
                    </Typography>
                </div>

                <div className={styles.buttons}>
                    <Button variant="primary" size="large" type="link" to={paths.AUTH} iconButton className={styles.button}>
                        {t('hero.button')}
                    </Button>
                </div>
            </div>
        </section>
    );
};
