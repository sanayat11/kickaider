import type { FC } from 'react';
import { FilterBar } from '@/shared/ui/filters-bar/view/FiltersBar';
import type { FilterBarItem } from '@/shared/ui/filters-bar/types/FilterBar';

type Props = {
  items: FilterBarItem[];
};

export const EmployeeRatingFilters: FC<Props> = ({ items }) => {
  return <FilterBar items={items} />;
};
