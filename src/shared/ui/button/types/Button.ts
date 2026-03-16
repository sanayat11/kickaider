import type { ReactNode } from 'react';
import type { To } from 'react-router-dom';

export interface ButtonProps {
  type?: 'button' | 'link';
  actionType?: 'button' | 'submit' | 'reset';

  to?: To;
  target?: string;
  rel?: string;

  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'giant';

  fullWidth?: boolean;
  rounded?: boolean;
  disabled?: boolean;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;

  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}