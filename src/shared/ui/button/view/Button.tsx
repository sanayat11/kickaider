import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { ButtonProps } from '../types/Button';
import classNames from 'classnames';
import styles from './Button.module.scss';

export const Button: FC<ButtonProps> = ({
  type = 'button',
  actionType = 'button',
  to,
  target,
  rel,
  variant = 'primary',
  size = 'large',
  fullWidth = false,
  rounded = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  className,
  children,
  onClick,
}) => {
  const isExternal = typeof to === 'string' && to.startsWith('http');

  const classes = classNames(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.fullWidth]: fullWidth,
      [styles.rounded]: rounded,
      [styles.iconOnly]: iconOnly,
      [styles.disabled]: disabled,
      [styles.withLeftIcon]: Boolean(leftIcon),
      [styles.withRightIcon]: Boolean(rightIcon),
    },
    className,
  );

  const content = (
    <>
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {!iconOnly && children && <span className={styles.label}>{children}</span>}
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
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
          onClick={(event) => {
            if (disabled) event.preventDefault();
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
        onClick={(event) => {
          if (disabled) event.preventDefault();
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