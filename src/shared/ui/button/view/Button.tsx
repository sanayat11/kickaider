import type { FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Button.module.scss';
import type { ButtonProps } from '../types/Button';

export const Button: FC<ButtonProps> = ({
  type = 'button',
  actionType = 'button',
  to,
  target,
  rel,
  variant = 'primary',
  size = 'medium',
  tone = 'primary',
  fullWidth = false,
  rounded = false,
  disabled = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  className,
  children,
  onClick,
}) => {
  const isExternal = typeof to === 'string' && to.startsWith('http');

  const classes = classNames(
    styles.button,
    styles[variant],
    styles[size],
    styles[tone],
    {
      [styles.fullWidth]: fullWidth,
      [styles.rounded]: rounded,
      [styles.iconOnly]: iconOnly,
      [styles.disabled]: disabled,
    },
    className,
  );

  const content = (
    <>
      {leftIcon && <span className={styles.iconInner}>{leftIcon}</span>}
      {!iconOnly && children && <span className={styles.label}>{children}</span>}
      {rightIcon && <span className={styles.iconInner}>{rightIcon}</span>}
    </>
  );

  if (type === 'link' && to) {
    if (isExternal) {
      return (
        <a
          href={String(to)}
          target={target}
          rel={rel}
          className={classes}
          aria-disabled={disabled}
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        to={to}
        className={classes}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={actionType}
      className={classes}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      {content}
    </button>
  );
};