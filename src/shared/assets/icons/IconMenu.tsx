import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const MenuIcon: FC<TIcons> = ({
  width = 24,
  height = 24,
  className,
  color = '#5D5A88',
}) => (
  <svg
    width={width}
    color={color}
    className={className}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 5H21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12H21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 19H21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
