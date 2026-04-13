import type { FC } from 'react';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { Chip } from '@/shared/ui/chipButton/view/ChipButton';
import { IoSearchOutline } from 'react-icons/io5';
import styles from '../view/CategorizationPage.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
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
    <div className={styles.filtersBlock}>
      <div className={styles.filtersTopRow}>
        <Typography variant='h1' weight='bold' className={styles.title}>Управление продуктивностью</Typography>

        <div className={styles.filterActions}>
          <div className={styles.searchWrapper}>
            <BaseInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по приложению"
              icon={<IoSearchOutline />}
            />
          </div>

          <SelectDropdown
            value={filter}
            variant="bordered"
            onChange={(val) => setFilter(val as FilterType)}
            options={[
              { label: 'По времени', value: 'all' },
              { label: 'Некатегоризированные', value: 'uncategorized' },
              { label: 'Ручные изменения', value: 'manual' },
            ]}
            className={styles.typeSelect}
          />
        </div>
      </div>

      <div className={styles.categoryChips}>
        <Chip tone="red" variant="filter" className={styles.cChip}>
          Непродуктивно
        </Chip>
        <Chip tone="green" variant="filter" className={styles.cChip}>
          Продуктивно
        </Chip>
        <Chip tone="yellow" variant="filter" className={styles.cChip}>
          Нейтрально
        </Chip>
      </div>
    </div>
  );
};