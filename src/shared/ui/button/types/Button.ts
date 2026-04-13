import type { ReactNode, CSSProperties } from 'react';
import type { To } from 'react-router-dom';

export type ButtonVariant =
  | 'primary'
  | 'solid'
  | 'outline'
  | 'ghost'
  | 'iconSolid'
  | 'iconOutline'
  | 'iconGhost'
  | 'metric'
  | 'dangerBlock';

export type ButtonSize = 'giant' | 'large' | 'medium' | 'small';

export type ButtonTone =
  | 'primary'
  | 'blue'
  | 'red'
  | 'yellow'
  | 'gray'
  | 'mint';

export interface ButtonProps {
  type?: 'button' | 'link';
  actionType?: 'button' | 'submit' | 'reset';

  to?: To;
  target?: string;
  rel?: string;

  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;

  fullWidth?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}