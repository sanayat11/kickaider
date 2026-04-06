import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const CancelIcon: FC<TIcons> = ({
  width = 24,
  height = 24,
  className,
  color = '#6D717F',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={className}
    color={color}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
      stroke={color}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
