import type { FC } from 'react';
import styles from '../view/CategorizationPage.module.scss';
import classNames from 'classnames';

export const CategorizationSkeleton: FC = () => {
    return (
        <div className={styles.tableCard}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={classNames(styles.row, styles.skeletonRow)}>
                    <div className={styles.colName}>
                        <div className={classNames(styles.skeletonBox, styles.avatar)} />
                        <div className={styles.appInfo}>
                            <div className={classNames(styles.skeletonBox, styles.textMd)} />
                            <div className={classNames(styles.skeletonBox, styles.textSm)} />
                        </div>
                    </div>
                    <div className={styles.colSource}>
                        <div className={classNames(styles.skeletonBox, styles.textSm)} />
                    </div>
                    <div className={styles.colStatus}>
                        <div className={classNames(styles.skeletonBox, styles.pill)} />
                    </div>
                </div>
            ))}
        </div>
    );
};
