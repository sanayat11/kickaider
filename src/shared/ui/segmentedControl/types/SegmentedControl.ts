import type { ReactNode } from 'react';

export type SegmentedOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export type SegmentedControlSize = 'small' | 'medium';

export type SegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
  size?: SegmentedControlSize;
  fullWidth?: boolean;
  className?: string;
};