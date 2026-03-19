import { useEffect, useRef } from 'react';
import type { CheckboxProps } from '../types/CheckBox';
import styles from './CheckBox.module.scss';

export const Checkbox = ({
  label,
  indeterminate = false,
  disabled = false,
  className,
  reverse = false,
  ...props
}: CheckboxProps & { reverse?: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={[
        styles.checkbox,
        reverse ? styles.reverse : '',
        disabled ? styles.disabled : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input ref={inputRef} type="checkbox" disabled={disabled} {...props} />

      <span className={styles.box}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            className={styles.check}
            d="M6.5 12.5L10.2 16.2L17.8 8.6"
          />
          <path
            className={styles.minus}
            d="M7 12H17"
          />
        </svg>
      </span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};