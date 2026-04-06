import type { ReactNode } from 'react';

export type FilterBarItemBase = {
  id: string;
  label?: string;
  className?: string;
};

export type FilterSelectItem = FilterBarItemBase & {
  type: 'select';
  value: string;
  placeholder?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
  onChange?: (value: string) => void;
};

export type FilterDateNavItem = FilterBarItemBase & {
  type: 'date-nav';
  value: string | Date;
  displayValue?: string;
  onPrev?: () => void;
  onNext?: () => void;
  onChange?: (value: string) => void;
};

export type FilterCheckboxItem = FilterBarItemBase & {
  type: 'checkbox';
  checked: boolean;
  text: string;
  onChange?: (checked: boolean) => void;
};

export type FilterSearchItem = FilterBarItemBase & {
  type: 'search';
  value: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export type FilterIconItem = FilterBarItemBase & {
  type: 'icon';
  icon: ReactNode;
  onClick?: () => void;
};

export type FilterSegmentedItem = FilterBarItemBase & {
  type: 'segmented';
  content: ReactNode;
};

export type FilterBarItem =
  | FilterSelectItem
  | FilterDateNavItem
  | FilterCheckboxItem
  | FilterSearchItem
  | FilterIconItem
  | FilterSegmentedItem;

export type FilterBarProps = {
  items: FilterBarItem[];
  className?: string;
};
