import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const ArrowRightIcon: FC<TIcons> = ({
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
      d="M7.5 15L12.5 10L7.5 5"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
