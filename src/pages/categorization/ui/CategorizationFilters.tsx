import type { FC } from 'react';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Select } from '@/shared/ui/select/view/Select';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { IoSearchOutline } from 'react-icons/io5';
import styles from '../view/CategorizationPage.module.scss';
import type { FilterType } from '../model/useCategorization';

interface CategorizationFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export const CategorizationFilters: FC<CategorizationFiltersProps> = ({
  search,
  setSearch,
  filter,
  setFilter,
}) => {
  return (
    <div className={styles.filtersRow}>
      <div className={styles.filterTitle}>Управление продуктивностью</div>
      
      <div className={styles.filterActions}>
        <div className={styles.searchWrapper}>
          <BaseInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по приложению"
            icon={<IoSearchOutline />}
          />
        </div>
        
        <Select
          value={filter}
          onChange={(val) => setFilter(val as any)}
          options={[
            { label: 'По типу', value: 'all' },
            { label: 'Некатегоризированные', value: 'uncategorized' },
            { label: 'Ручные изменения', value: 'manual' },
          ]}
          className={styles.typeSelect}
        />
      </div>

      <div className={styles.categoryChips}>
        <Chip tone="red" variant="filter" className={styles.cChip}>Непродуктивно</Chip>
        <Chip tone="green" variant="filter" className={styles.cChip}>Продуктивно</Chip>
        <Chip tone="yellow" variant="filter" className={styles.cChip}>Нейтрально</Chip>
      </div>
    </div>
  );
};
