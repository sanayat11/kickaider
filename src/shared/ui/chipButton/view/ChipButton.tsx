import type { FC } from 'react';
import classNames from 'classnames';
import styles from './ChipButton.module.scss';
import type { ChipProps } from '../types/ChipButton';

export const Chip: FC<ChipProps> = ({
  children,
  tone = 'purple',
  variant = 'filter',
  selected,
  disabled,
  isActionable = true,
  className,
  onClick,
}) => {
  const Component = isActionable ? 'button' : 'div';
  
  return (
    <Component
      type={isActionable ? "button" : undefined}
      onClick={isActionable ? onClick : undefined}
      disabled={isActionable ? disabled : undefined}
      className={classNames(
        styles.chip,
        styles[tone],
        styles[variant], 
        {
          [styles.selected]: selected && variant === 'filter',
          [styles.disabled]: disabled,
          [styles.static]: !isActionable,
        },
        className,
      )}
    >
      <span className={styles.label}>{children}</span>
    </Component>
  );
};
