import type { FC } from 'react';
import type { TIcons } from './IconsType';

export const FilterIcon: FC<TIcons> = ({
  width = 20,
  height = 20,
  className,
  color = '#5D5A88',
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 24"
    fill="none"
    color={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.75 9.55C16.2728 9.55 20.75 7.58005 20.75 5.15C20.75 2.71995 16.2728 0.75 10.75 0.75C5.22715 0.75 0.75 2.71995 0.75 5.15C0.75 7.58005 5.22715 9.55 10.75 9.55Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.75 5.15039C0.752595 9.56553 3.93579 13.4009 8.44231 14.4187V20.5504C8.44231 21.7654 9.4755 22.7504 10.75 22.7504C12.0245 22.7504 13.0577 21.7654 13.0577 20.5504V14.4187C17.5642 13.4009 20.7474 9.56553 20.75 5.15039"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
