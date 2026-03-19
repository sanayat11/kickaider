import React from 'react';
import cn from 'classnames';
import styles from './Input.module.scss';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  success?: boolean;
  className?: string;
}

export const BaseInput = ({
  label,
  error,
  icon,
  success,
  className,
  disabled,
  id,
  ...rest
}: BaseInputProps) => {
  const inputId = id ?? rest.name;

  return (
    <div className={cn(styles.wrapper, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.fieldInner}>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}

        <input
          id={inputId}
          disabled={disabled}
          className={cn(styles.inputBase, {
            [styles.inputError]: !!error,
            [styles.inputSuccess]: success && !error,
          })}
          {...rest}
        />
      </div>

      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
};
