import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './selectDropdown.module.scss';
import type { SelectDropdownOption, SelectDropdownProps } from '../types/selectDropdown';

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4.5 6.5L8 10L11.5 6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function getOptionByValue(
  options: SelectDropdownOption[],
  value?: string,
): SelectDropdownOption | undefined {
  return options.find((option) => option.value === value);
}

function getInitialHoveredIndex(options: SelectDropdownOption[], value?: string): number {
  const selectedIndex = options.findIndex((option) => option.value === value);

  if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
    return selectedIndex;
  }

  return options.findIndex((option) => !option.disabled);
}

export const SelectDropdown = ({
  options,
  value,
  placeholder = 'Select',
  disabled = false,
  size = 'md',
  variant = 'bordered',
  leftIcon,
  className,
  menuClassName,
  onChange,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedOption = useMemo(() => getOptionByValue(options, value), [options, value]);

  const enabledOptions = useMemo(() => options.filter((option) => !option.disabled), [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setHoveredIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openMenu = () => {
    if (disabled) return;

    setHoveredIndex(getInitialHoveredIndex(options, value));
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setHoveredIndex(-1);
  };

  const toggleOpen = () => {
    if (disabled) return;

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  };

  const selectOption = (option: SelectDropdownOption) => {
    if (option.disabled) return;

    onChange?.(option.value);
    closeMenu();
    buttonRef.current?.focus();
  };

  const moveHover = (direction: 1 | -1) => {
    if (!enabledOptions.length) return;

    const currentEnabledIndex = enabledOptions.findIndex(
      (option) => option.value === options[hoveredIndex]?.value,
    );

    const nextEnabledIndex =
      currentEnabledIndex === -1
        ? 0
        : (currentEnabledIndex + direction + enabledOptions.length) % enabledOptions.length;

    const nextValue = enabledOptions[nextEnabledIndex]?.value;
    const nextIndex = options.findIndex((option) => option.value === nextValue);

    setHoveredIndex(nextIndex);
  };

  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
      }
      return;
    }

    if (event.key === 'Escape') {
      closeMenu();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveHover(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveHover(-1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      const option = options[hoveredIndex];
      if (option && !option.disabled) {
        selectOption(option);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      ref={rootRef}
      className={[styles.root, styles[size], styles[variant], className ?? ''].join(' ')}
    >
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          styles.trigger,
          isOpen ? styles.triggerOpen : '',
          disabled ? styles.disabled : '',
        ].join(' ')}
        onClick={toggleOpen}
        onKeyDown={handleButtonKeyDown}
      >
        <span className={styles.left}>
          {(selectedOption?.icon || leftIcon) && (
            <span className={styles.icon}>{selectedOption?.icon ?? leftIcon}</span>
          )}

          <span className={[styles.value, !selectedOption ? styles.placeholder : ''].join(' ')}>
            {selectedOption?.label ?? placeholder}
          </span>
        </span>

        <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].join(' ')}>
          <ChevronIcon />
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className={[styles.menu, menuClassName ?? ''].join(' ')}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHovered = index === hoveredIndex;

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={[
                    styles.option,
                    isSelected ? styles.optionSelected : '',
                    isHovered ? styles.optionHovered : '',
                    option.disabled ? styles.optionDisabled : '',
                  ].join(' ')}
                  disabled={option.disabled}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {option.icon && <span className={styles.icon}>{option.icon}</span>}

                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
