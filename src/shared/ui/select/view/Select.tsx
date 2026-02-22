import React from 'react';
import classNames from 'classnames';
import styles from './Select.module.scss';

interface Option {
    value: string | number;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    onChange,
    className,
    value,
    ...props
}) => {
    return (
        <div className={classNames(styles.selectWrapper, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <select
                className={styles.select}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
