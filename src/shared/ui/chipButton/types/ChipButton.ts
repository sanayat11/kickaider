import type { ReactNode } from 'react';

export interface ChipButtonProps {
  children: ReactNode;
  color?: 'purple' | 'red' | 'yellow' | 'green' | 'blue';
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}