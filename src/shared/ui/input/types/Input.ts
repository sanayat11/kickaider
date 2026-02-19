import type { ReactNode } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';

export interface InputTypes<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  control: Control<T>;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}
