import type { FC } from 'react';
import styles from './FeaturesBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';

const features = [
    {
        number: '01',
        title: 'Desktop app',
        description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitolm.'
    },
    {
        number: '02',
        title: 'Multiple users',
        description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitolm.'
    },
    {
        number: '03',
        title: 'Granular permissions',
        description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitolm.'
    },
    {
        number: '04',
        title: 'Monthly reports',
        description: 'Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitolm.'
    }
];

export const FeaturesBlock: FC = () => {
    return (
        <section className={styles.featuresBlock}>
            <div className={styles.header}>
                <Typography variant="h2" color="white" weight="bold" className={styles.title}>
                    Browse our set of features
                </Typography>
                <Typography variant="h5" color="white" weight="regular" className={styles.description}>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.
                </Typography>
            </div>

            <div className={styles.grid}>
                {features.map((feature) => (
                    <div key={feature.number} className={styles.card}>
                        <span className={styles.cardNumber}>{feature.number}</span>
                        <Typography variant="h4" weight="bold" className={styles.cardTitle}>
                            {feature.title}
                        </Typography>
                        <Typography variant="h5" className={styles.cardDescription}>
                            {feature.description}
                        </Typography>
                    </div>
                ))}
            </div>
        </section>
    );
};
