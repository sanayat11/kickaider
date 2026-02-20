import cls from './Container.module.scss';
import type { ContainerProps } from '@/shared/ui/container/types/Container';

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={`${cls.container} ${className || ''}`}>{children}</div>
  );
};
