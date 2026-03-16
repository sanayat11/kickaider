import type { FC, JSX } from 'react';
import classNames from 'classnames';
import styles from './Typography.module.scss';
import type { TypographyProps, TypographyVariant } from '../types/Typography';

export const Typography: FC<TypographyProps> = ({
  variant,
  color,
  weight = 'regular',
  children,
  context,
  onClick,
  className,
  truncate,
  style,
  as,
}) => {
  const Tags: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
  };

  const TagName = (as ?? Tags[variant] ?? 'span') as keyof JSX.IntrinsicElements;

  const contextClass = context ? styles[`context-${context}-${variant}`] : undefined;

  const combinedClassName = classNames(
    styles[variant],
    contextClass,
    color && styles[`color-${color}`],
    weight && styles[`weight-${weight}`],
    truncate && styles.truncate,
    className,
  );
  const renderChildren = () => {
    if (truncate && typeof children === 'string') {
      return children.length <= truncate ? children : children.slice(0, truncate) + '...';
    }
    return children;
  };

  return (
    <TagName onClick={onClick} className={combinedClassName} style={style}>
      {renderChildren()}
    </TagName>
  );
};
