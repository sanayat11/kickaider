import type { FC } from 'react';
import { IoGlobeOutline, IoLaptopOutline, IoTrashOutline } from 'react-icons/io5';
import classNames from 'classnames';
import styles from '../view/CategorizationPage.module.scss';
import type { CategorizationRow as RowType, Category } from '@/shared/api/mock/categorization.mock';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';

interface CategorizationRowProps {
  row: RowType;
  isUpdating: boolean;
  onCategoryChange: (id: string, cat: Category) => void;
  onReset: (id: string) => void;
}

const CATEGORY_OPTIONS = [
  { label: <Chip tone="green" variant="filter" isActionable={false} className={styles.categoryChip}>Продуктивно</Chip>, value: 'productive' },
  { label: <Chip tone="red" variant="filter" isActionable={false} className={styles.categoryChip}>Непродуктивно</Chip>, value: 'unproductive' },
  { label: <Chip tone="yellow" variant="filter" isActionable={false} className={styles.categoryChip}>Нейтрально</Chip>, value: 'neutral' },
];

export const CategorizationRow: FC<CategorizationRowProps> = ({
  row,
  isUpdating,
  onCategoryChange,
  onReset,
}) => {
  return (
    <div className={classNames(styles.row, { [styles.rowUpdating]: isUpdating })}>
      <div className={styles.colName}>
        <div className={styles.appIconWrapper}>
          {row.type === 'web' ? (
            <IoGlobeOutline className={styles.rowIcon} />
          ) : (
            <IoLaptopOutline className={styles.rowIcon} />
          )}
        </div>

        <div className={styles.appInfo}>
          <div className={styles.appName}>{row.name}</div>
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
        <div className={styles.statusSelectWrapper}>
          <SelectDropdown
            value={row.category}
            onChange={(val) => onCategoryChange(row.id, val as Category)}
            options={CATEGORY_OPTIONS}
            size="sm"
            variant="ghost"
            showChevron={false}
            className={classNames(styles.categorySelect, styles[row.category])}
            menuClassName={styles.categoryMenu}
            optionClassName={styles.categoryOption}
          />
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