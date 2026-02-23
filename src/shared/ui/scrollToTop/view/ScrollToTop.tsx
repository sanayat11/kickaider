import React, { useState, useEffect } from 'react';
import { IoArrowUp } from 'react-icons/io5';
import classNames from 'classnames';
import styles from './ScrollToTop.module.scss';

export const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAppeared, setHasAppeared] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                if (!isVisible) {
                    setIsVisible(true);
                    setHasAppeared(true);
                }
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [isVisible]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            className={classNames(styles.scrollToTopBtn, {
                [styles.visible]: isVisible,
                [styles.animateSpin]: hasAppeared && isVisible,
            })}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <IoArrowUp className={styles.icon} />
        </button>
    );
};
