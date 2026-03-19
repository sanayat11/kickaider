import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
  className?: string;
}