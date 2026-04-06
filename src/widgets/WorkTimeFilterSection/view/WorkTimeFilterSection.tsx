import React from 'react';
import { FilterBar } from '@/shared/ui';
import styles from './WorkTimeFilterSection.module.scss';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';

type WorkTimeFiltersProps = {
  items: FilterBarItem[];
};

export const WorkTimeFilters: React.FC<WorkTimeFiltersProps> = ({ items }) => {
  return (
    <section className={styles.filtersSection}>
      <FilterBar items={items} />
    </section>
  );
};
