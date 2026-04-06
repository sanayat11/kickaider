import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const EditIcon: FC<TIcons> = ({
  width = 24,
  height = 24,
  className,
  color = '#5D5A88',
}) => (
  <svg
    width={width}
    height={height}
    className={className}
    color={color}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21L12 21H21"
      stroke="#5D5A88"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.2218 5.8279L15.0503 2.99947L20 7.94922L17.1716 10.7776M12.2218 5.8279L6.61522 11.4345C6.42769 11.622 6.32233 11.8764 6.32233 12.1416L6.32233 16.6771L10.8579 16.6771C11.1231 16.6771 11.3774 16.5718 11.565 16.3842L17.1716 10.7776M12.2218 5.8279L17.1716 10.7776"
      stroke="#5D5A88"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
