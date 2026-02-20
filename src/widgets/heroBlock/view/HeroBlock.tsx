import type { FC } from 'react';
import styles from './HeroBlock.module.scss';
import heroImage from '@/shared/assets/images/Image Container.png';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';

export const HeroBlock: FC = () => {
    return (
        <section className={styles.heroBlock}>
            <div className={styles.imageWrapper}>
                <img src={heroImage} alt="Team working together" className={styles.bgImage} />
                <div className={styles.overlay} />
            </div>

            <div className={styles.content}>
                <div className={styles.textContent}>
                    <Typography variant="h1" color="white" weight="bold" className={styles.title}>
                        A dedicated team to grow your company
                    </Typography>
                    <Typography variant="h5" color="white" weight="regular" className={styles.description}>
                        Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
                    </Typography>
                </div>

                <div className={styles.buttons}>
                    <Button variant="primary" size="large" iconButton className={styles.button}>
                        Войти
                    </Button>
                </div>
            </div>
        </section>  
    );
};
