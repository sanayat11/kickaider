import type { ReactNode, MouseEvent } from 'react';

export interface ChipProps {
  children: ReactNode;
  tone?: 'purple' | 'red' | 'yellow' | 'green' | 'blue' | 'gray';
  variant?: 'list' | 'filter'; 
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
}