import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  showChevron = true,
  leftIcon,
  className,
  menuClassName,
  optionClassName,
  onChange,
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const selectedOption = useMemo(() => getOptionByValue(options, value), [options, value]);

  const enabledOptions = useMemo(() => options.filter((option) => !option.disabled), [options]);

  const updateMenuRect = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuRect({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideRoot = rootRef.current?.contains(event.target as Node);
      const isInsideMenu = menuRef.current?.contains(event.target as Node);

      if (!isInsideRoot && !isInsideMenu) {
        setIsOpen(false);
        setHoveredIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    if (isOpen) {
      updateMenuRect();
      window.addEventListener('scroll', updateMenuRect, true);
      window.addEventListener('resize', updateMenuRect);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateMenuRect, true);
      window.removeEventListener('resize', updateMenuRect);
    };
  }, [isOpen]);

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

        {showChevron && (
          <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].join(' ')}>
            <ChevronIcon />
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            className={[styles.menu, styles[size], menuClassName ?? ''].join(' ')}
            style={{
              position: 'fixed',
              top: menuRect ? `${menuRect.top + 4}px` : '0',
              left: menuRect ? `${menuRect.left}px` : '0',
              width: menuRect ? `${menuRect.width}px` : 'auto',
              zIndex: 1000000,
              visibility: menuRect ? 'visible' : 'hidden',
            }}
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
                      optionClassName ?? '',
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
          </ul>,
          document.body,
        )}
    </div>
  );
};
