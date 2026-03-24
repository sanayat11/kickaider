import type { FC } from 'react';
import type { ToggleProps } from '../types/Toggle';
import classNames from 'classnames';
import styles from './Toggle.module.scss';

export const Toggle: FC<ToggleProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  className,
}) => {
  return (
    <label className={classNames(styles.wrapper, className)}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <div className={styles.track}>
        <div className={styles.thumb} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
