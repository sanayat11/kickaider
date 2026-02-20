import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { To } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Button.module.scss';
import type { CustomButtonProps } from '@/shared/ui/button/types/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { FaArrowRight } from "react-icons/fa6";

export const Button: FC<CustomButtonProps> = ({
  type = 'button',
  variant = 'primary',
  onClick,
  children,
  disabled = false,
  to,
  className,
  actionType = 'button',
  rounded = false,
  iconButton = false,
  size = 'large',
  target,
  rel,
}) => {
  const isLink = type === 'link';
  const isExternal = to?.startsWith('http');

  const combinedClassName = classNames(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.disabled]: disabled,
      [styles.rounded]: rounded,
    },
    className,
  );

  if (isLink && to) {
    if (isExternal) {
      return (
        <a href={to} target={target} rel={rel} className={combinedClassName}>
          <Typography variant="small" weight="regular">
            {children}
          </Typography>
          {iconButton && (
            <div className={styles.iconWrapper}>
              <FaArrowRight className={styles.icon} color="white" />
            </div>
          )}
        </a>
      );
    }
    return (
      <Link to={to as To} className={combinedClassName}>
        <Typography variant="medium" weight="regular">
          {children}
        </Typography>
        {iconButton && (
          <div className={styles.iconWrapper}>
            <FaArrowRight className={styles.icon} color="white" />
          </div>
        )}
      </Link>
    );
  }

  return (
    <button
      type={actionType}
      onClick={!disabled ? onClick : undefined}
      className={combinedClassName}
      disabled={disabled}
    >
      <Typography variant="body" weight="regular" className={styles.typography}>
        {children}
      </Typography>
      {iconButton && (
        <div className={styles.iconWrapper}>
          <FaArrowRight className={styles.icon} color="white" />
        </div>
      )}
    </button>
  );
};
