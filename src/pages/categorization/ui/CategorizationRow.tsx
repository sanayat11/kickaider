import type { FC } from 'react';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { IoGlobeOutline, IoCubeOutline, IoTrashOutline } from 'react-icons/io5';
import classNames from 'classnames';
import styles from '../view/CategorizationPage.module.scss';
import type { CategorizationRow as RowType, Category } from '@/shared/api/mock/categorization.mock';

interface CategorizationRowProps {
  row: RowType;
  isUpdating: boolean;
  onCategoryChange: (id: string, cat: Category) => void;
  onReset: (id: string) => void;
}

const CATEGORY_MAP: Record<Category, { label: string; tone: 'green' | 'red' | 'yellow' | 'blue' }> = {
  productive: { label: 'Продуктивно', tone: 'green' },
  unproductive: { label: 'Непродуктивно', tone: 'red' },
  neutral: { label: 'Нейтрально', tone: 'yellow' },
  uncategorized: { label: 'Некатегоризировано', tone: 'blue' },
};

export const CategorizationRow: FC<CategorizationRowProps> = ({
  row,
  isUpdating,
  onCategoryChange,
  onReset,
}) => {
  const status = CATEGORY_MAP[row.category];

  return (
    <div className={classNames(styles.row, { [styles.rowUpdating]: isUpdating })}>
      <div className={styles.colName}>
        <div className={styles.appIconWrapper}>
            {row.type === 'web' ? <IoGlobeOutline className={styles.rowIcon} /> : <IoCubeOutline className={styles.rowIcon} />}
        </div>
        <div className={styles.appInfo}>
          <div className={styles.appName}>{row.name}</div>
          <div className={styles.appSub}>{row.type === 'web' ? 'Website' : 'Application'}</div>
        </div>
      </div>

      <div className={styles.colSource}>
        <div className={classNames(styles.sourceDot, styles[row.source])} />
        <div className={styles.sourceInfo}>
          <div className={styles.sourceName}>
            {row.source === 'manual' ? 'Terminal' : 'System'}
          </div>
          <div className={styles.sourceSub}>Source Code Editor</div>
        </div>
      </div>

      <div className={styles.colStatus}>
        <div 
          className={styles.statusChipWrapper}
          onClick={() => {
              const next: Record<Category, Category> = {
                  productive: 'unproductive',
                  unproductive: 'neutral',
                  neutral: 'productive',
                  uncategorized: 'productive'
              };
              onCategoryChange(row.id, next[row.category]);
          }}
        >
          <Chip 
            tone={status.tone} 
            variant="filter" 
            className={styles.statusChip}
          >
            {status.label}
          </Chip>
        </div>
      </div>

      <div className={styles.colAction}>
        <button 
          className={styles.trashBtn} 
          onClick={() => onReset(row.id)}
          title="Сбросить статус"
        >
          <IoTrashOutline size={18} />
        </button>
      </div>
    </div>
  );
};
