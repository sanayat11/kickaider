import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const SearchIcon: FC<TIcons> = ({
  width = 20,
  height = 20,
  className,
  color = '#5D5A88',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill='none'
    color={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.168 14.166L17.5013 17.4993"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0108 15.8333 12.6801 15.0846 13.887 13.8744C15.0897 12.6685 15.8333 11.0044 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
