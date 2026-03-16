import type { FC } from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import type { SelectTriggerProps } from '../types/SelectTrigger';
import styles from './SelectTrigger.module.scss';

export const SelectTrigger: FC<SelectTriggerProps> = ({
  label,
  opened = false,
  disabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={classNames(
        styles.trigger,
        {
          [styles.opened]: opened,
        },
        className,
      )}
    >
      <span className={styles.label}>{label}</span>
      <FiChevronDown className={styles.icon} />
    </button>
  );
};