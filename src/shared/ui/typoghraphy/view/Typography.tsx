import type { FC, JSX } from 'react';
import classNames from 'classnames';
import styles from './Typography.module.scss';
import type { TypographyProps, TypographyVariant } from '../types/Typography';

export const Typography: FC<TypographyProps> = ({
  variant,
  color,
  weight = 'regular',
  children,
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
    h6: 'h6',
    large: 'p',
    body: 'p',
    medium: 'p',
    small: 'p',
  };

  const TagName = (as ?? Tags[variant]) as keyof JSX.IntrinsicElements;

  const combinedClassName = classNames(
    styles[variant],
    color && styles[`color-${color}`],
    weight && styles[`weight-${weight}`],
    className,
  );

  const renderChildren = () => {
    if (truncate && typeof children === 'string') {
      return children.length <= truncate
        ? children
        : children.slice(0, truncate) + '...';
    }
    return children;
  };

  return (
    <TagName onClick={onClick} className={combinedClassName} style={style}>
      {renderChildren()}
    </TagName>
  );
};
