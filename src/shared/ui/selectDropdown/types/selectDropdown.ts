import type { ReactNode } from 'react';

export type SelectDropdownOption = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectDropdownVariant = 'bordered' | 'ghost';
export type SelectDropdownSize = 'sm' | 'md';

export interface SelectDropdownProps {
  variant?: SelectDropdownVariant;
  showChevron?: boolean;
  options: SelectDropdownOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectDropdownSize;
  leftIcon?: ReactNode;
  className?: string;
  menuClassName?: string;
  optionClassName?: string;
  onChange?: (value: string) => void;
}