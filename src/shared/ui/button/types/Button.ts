import type { ReactNode } from 'react';
import type { To } from 'react-router-dom';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'text'
  | 'danger'
  | 'icon'
  | 'badge'
  | 'select';

export type ButtonSize = 'small' | 'medium' | 'large' | 'giant';

export interface ButtonProps {
  type?: 'button' | 'link';
  actionType?: 'button' | 'submit' | 'reset';

  to?: To;
  target?: string;
  rel?: string;

  variant?: ButtonVariant;
  size?: ButtonSize;

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