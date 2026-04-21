import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const ArrowLeftIcon: FC<TIcons> = ({
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
    className={className}
    color={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5 5L7.5 10L12.5 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
