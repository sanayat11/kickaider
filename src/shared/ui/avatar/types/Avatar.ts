import type { ReactNode } from 'react';

export type AvatarSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export type AvatarStatus = 'online' | 'offline' | 'none';

export type AvatarProps = {
  src?: string;
  alt?: string;

  initials?: string;
  icon?: ReactNode;

  size?: AvatarSize;
  status?: AvatarStatus;

  className?: string;
};