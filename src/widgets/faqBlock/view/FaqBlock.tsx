import type { FC } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FaqBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { MdKeyboardArrowDown } from 'react-icons/md';
import classNames from 'classnames';

interface FaqItem {
    question: string;
    answer: string;
}

export const FaqBlock: FC = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqItems = t('faq.questions', { returnObjects: true }) as FaqItem[];

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faqBlock}>
            <div className={styles.header}>
                <Typography variant="h2" weight="bold" className={styles.title}>
                    {t('faq.title')}
                </Typography>
                <Typography variant="body" className={styles.description}>
                    {t('faq.description')}
                </Typography>
            </div>

            <div className={styles.list}>
                {faqItems.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={classNames(styles.item, { [styles.open]: isOpen })}
                            onClick={() => toggle(index)}
                        >
                            <div className={styles.question}>
                                <span>{item.question}</span>
                                <MdKeyboardArrowDown
                                    className={classNames(styles.icon, { [styles.rotate]: isOpen })}
                                />
                            </div>
                            <div className={classNames(styles.answerWrapper, { [styles.open]: isOpen })}>
                                <div className={styles.answerContent}>
                                    <div className={styles.answer}>
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
