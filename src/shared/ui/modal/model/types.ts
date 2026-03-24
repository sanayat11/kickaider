import type { ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closable?: boolean;
  closeOnOverlay?: boolean;
  className?: string;
};