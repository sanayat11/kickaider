import type { FC } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import styles from '../view/CategorizationPage.module.scss';

export const CategorizationEmpty: FC = () => {
    return (
        <div className={styles.emptyState}>
            <IoInformationCircleOutline className={styles.icon} />
            <h3>Нет данных</h3>
            <p>Ничего не найдено по вашему запросу</p>
        </div>
    );
};
