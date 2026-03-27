import type { ReactNode } from 'react';

export type PaginationVariant = 'full' | 'simple' | 'bar';

export type PaginationItemVariant = 'page' | 'icon';

export type PaginationItemState = 'default' | 'active' | 'disabled';

export type PaginationBaseProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export type PaginationFullProps = PaginationBaseProps & {
  variant?: 'full';
  siblingCount?: number;
};

export type PaginationSimpleProps = PaginationBaseProps & {
  variant: 'simple';
  label?: string;
};

export type PaginationBarProps = PaginationBaseProps & {
  variant: 'bar';
  pageSize: number;
  pageSizeOptions?: number[];
  pageSizeLabel?: string;
  onPageSizeChange: (value: number) => void;
  infoText?: (currentPage: number, totalPages: number) => ReactNode;
};

export type PaginationProps = PaginationFullProps | PaginationSimpleProps | PaginationBarProps;
