import type { ReactNode } from 'react';

export type SelectDropdownOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectDropdownSize = 'sm' | 'md';

export interface SelectDropdownProps {
  options: SelectDropdownOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectDropdownSize;
  leftIcon?: ReactNode;
  className?: string;
  menuClassName?: string;
  onChange?: (value: string) => void;
}