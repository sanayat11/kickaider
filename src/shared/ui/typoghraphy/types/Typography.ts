import type { ReactNode, CSSProperties } from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'large'
  | 'body'
  | 'medium'
  | 'small';

export type TypographyWeight = 'regular' | 'medium' | 'bold' | 'semiBold';

export type TypographyColor =
  | 'black'
  | 'gray'
  | 'white'
  | 'primary'
  | 'secondary';

export type AllowedTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div';

export interface TypographyProps {
  variant: TypographyVariant;
  weight?: TypographyWeight;
  color?: TypographyColor;
  className?: string;
  truncate?: number;
  onClick?: () => void;
  style?: CSSProperties;
  children: ReactNode;
  as?: AllowedTag;
}
