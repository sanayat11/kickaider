import type { ReactNode } from 'react';

export interface CustomButtonProps {
  type?: 'button' | 'link' | 'submit';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text';
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  className?: string;
  actionType?: 'button' | 'submit' | 'reset';
  rounded?: boolean;
  iconButton?: boolean;
  size?: 'small' | 'large' | 'fullWidth';
  target?: string;
  rel?: string;
}
