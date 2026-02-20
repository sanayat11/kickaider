import type { FC } from 'react';
import styles from './TeamBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import teamImage from '@/shared/assets/images/Image Placeholder.png'; 

export const TeamBlock: FC = () => {
    return (
        <section id="team" className={styles.teamBlock}>
            <div className={styles.imageWrapper}>
                <img src={teamImage} alt="Team working" className={styles.image} />
            </div>

            <div className={styles.content}>
                <Typography variant="h2" weight="bold" className={styles.title}>
                    A dedicated team to grow your company
                </Typography>
                <div className={styles.descriptionWrapper}>
                    <Typography variant="h5" className={styles.description}>
                        Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
                    </Typography>
                </div>
            </div>
        </section>
    );
};
