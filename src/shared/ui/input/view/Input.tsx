import styles from './Input.module.scss';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';
import cn from 'classnames';
import type { InputTypes } from '@/shared/ui/input/types/Input';
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';

export const Input = <T extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  control,
  error,
  disabled = false,
  className,
  icon,
}: InputTypes<T> & { icon?: React.ReactNode }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const handleToggle = () => {
    if (!disabled) {
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div
      className={cn(styles.wrapper, className, {
        [styles.disabled]: disabled,
      })}
    >
      {label && (
        <label htmlFor={name} className={styles.label}>
          <Typography
            variant="h5"
            color="black"
            weight="regular"
            className={styles.label}
          >
            {label}
          </Typography>
        </label>
      )}

      <div className={styles.fieldInner}>
        {icon && <div className={styles.iconWrapper}>{icon}</div>}

        <Controller
          name={name as Path<T>}
          control={control}
          render={({ field }) => (
            <input
              id={name}
              {...field}
              disabled={disabled}
              placeholder={placeholder}
              type={inputType}
              className={cn(styles.inputBase, {
                [styles.withIcon]: !!icon,
                [styles.withRightIcon]: isPasswordType,
                [styles.inputError]: !!error,
                [styles.inputFilled]: !!field.value,
              })}
            />
          )}
        />

        {isPasswordType && (
          <button
            type="button"
            className={styles.eyeToggle}
            onClick={handleToggle}
            disabled={disabled}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <IoEyeOutline /> : <FaRegEyeSlash />}
          </button>
        )}
      </div>

      {error && (
        <Typography variant="h5" weight="regular" className={styles.errorText}>
          {error}
        </Typography>
      )}
    </div>
  );
};