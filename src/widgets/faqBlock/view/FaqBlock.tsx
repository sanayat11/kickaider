import type { FC } from 'react';
import { useState } from 'react';
import styles from './FaqBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { MdKeyboardArrowDown } from 'react-icons/md';
import classNames from 'classnames';

const faqItems = [
    {
        id: 1,
        question: 'What is Webflow and why is it the best website builder?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes. Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus'
    },
    {
        id: 2,
        question: 'What is Webflow and why is it the best website builder?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in.'
    },
    {
        id: 3,
        question: 'What is Webflow and why is it the best website builder?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in.'
    },
    {
        id: 4,
        question: 'What is Webflow and why is it the best website builder?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in.'
    }
];

export const FaqBlock: FC = () => {
    const [openId, setOpenId] = useState<number | null>(0); 

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className={styles.faqBlock}>
            <div className={styles.header}>
                <Typography variant="h2" weight="bold" className={styles.title}>
                    Frequently Asked Questions
                </Typography>
                <Typography variant="body" className={styles.description}>
                    Lorem ipsum dolor sit amet consectetur adipiscing elit aenean id volutpat imperdiet quis at pellentesque nunc commodo nunc purus pulvinar nisi fusce.
                </Typography>
            </div>

            <div className={styles.list}>
                {faqItems.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                        <div
                            key={item.id}
                            className={classNames(styles.item, { [styles.open]: isOpen })}
                            onClick={() => toggle(item.id)}
                        >
                            <div className={styles.question}>
                                <span>{item.question}</span>
                                <MdKeyboardArrowDown
                                    className={classNames(styles.icon, { [styles.rotate]: isOpen })}
                                />
                            </div>
                            {isOpen && (
                                <div className={styles.answer}>
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
