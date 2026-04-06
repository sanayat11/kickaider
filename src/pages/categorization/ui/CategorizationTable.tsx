import type { FC, ReactNode } from 'react';
import styles from '../view/CategorizationPage.module.scss';

interface CategorizationTableProps {
  children: ReactNode;
}

export const CategorizationTable: FC<CategorizationTableProps> = ({ children }) => {
  return (
    <div className={styles.tableCard}>
      <header className={styles.tableHeader}>
        <div className={styles.hColName}>Сайт\Программа</div>
        <div className={styles.hColSource}>Источник</div>
        <div className={styles.hColStatus}>Status</div>
        <div className={styles.hColAction} />
      </header>
      
      <div className={styles.tableBody}>
        {children}
      </div>
    </div>
  );
};
