import React from 'react';
import classNames from 'classnames';
import styles from './FiltersBar.module.scss';

interface FiltersBarProps {
    children: React.ReactNode;
    rightSection?: React.ReactNode;
    className?: string;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ children, rightSection, className }) => {
    return (
        <section className={classNames(styles.filtersBar, className)}>
            <div className={styles.leftSection}>
                {children}
            </div>
            {rightSection && (
                <div className={styles.rightSection}>
                    {rightSection}
                </div>
            )}
        </section>
    );
};
