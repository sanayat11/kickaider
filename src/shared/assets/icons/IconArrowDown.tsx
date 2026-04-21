import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const ArrowDownIcon: FC<TIcons> = ({
  width = 20,
  height = 20,
  className,
  color = '#5D5A88',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    color={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="#5D5A88"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
