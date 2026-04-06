import { useEffect, useRef, useState, type FC } from 'react';
import classNames from 'classnames';
import { MdChevronLeft, MdChevronRight, MdSearch } from 'react-icons/md';

import styles from './FiltersBar.module.scss';
import type { FilterBarItem, FilterBarProps } from '../types/FilterBar';
import { Calendar } from '@/shared/ui/calendar/view/Calendar';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { Checkbox } from '@/shared/ui/checkbox/view/CheckBox';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { FilterIcon } from '@/shared/assets/icons';

const formatDate = (value: string | Date) => {
  if (typeof value === 'string') return value;

  const day = String(value.getDate()).padStart(2, '0');
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const year = value.getFullYear();

  return `${day}.${month}.${year}`;
};

const parseDateValue = (value: string | Date) => {
  if (value instanceof Date) return value;

  const parts = value.split('.');
  if (parts.length !== 3) return new Date();

  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
};

export const FilterBar: FC<FilterBarProps> = ({ items, className }) => {
  const [openedCalendarId, setOpenedCalendarId] = useState<string | null>(null);
  const calendarRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openedCalendarId) return;

      const currentRef = calendarRefs.current[openedCalendarId];
      if (!currentRef?.contains(event.target as Node)) {
        setOpenedCalendarId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openedCalendarId]);

  const renderItem = (item: FilterBarItem) => {
    switch (item.type) {
      case 'icon':
        return (
          <button
            type="button"
            className={styles.iconButton}
            onClick={item.onClick}
            aria-label={item.label || 'Filter action'}
          >
            <FilterIcon />
          </button>
        );

      case 'select':
        return (
          <SelectDropdown
            value={item.value}
            options={item.options}
            placeholder={item.placeholder}
            onChange={item.onChange}
          />
        );

      case 'date-nav': {
        const isOpen = openedCalendarId === item.id;
        const selectedDate = parseDateValue(item.value);

        return (
          <div
            ref={(node) => {
              calendarRefs.current[item.id] = node;
            }}
            className={styles.dateNav}
          >
            {item.label ? (
              <Typography variant="h5" className={styles.label}>
                {item.label}
              </Typography>
            ) : null}

            {item.label && <div className={styles.internalDivider} />}

            <div className={styles.dateControls}>
              <button
                type="button"
                className={styles.navButton}
                onClick={item.onPrev}
                aria-label="Previous period"
              >
                <MdChevronLeft size={18} />
              </button>

              <button
                type="button"
                className={styles.dateButton}
                onClick={() => setOpenedCalendarId((prev) => (prev === item.id ? null : item.id))}
                aria-label="Choose date"
                aria-expanded={isOpen}
              >
                {item.displayValue || formatDate(item.value)}
              </button>

              <button
                type="button"
                className={styles.navButton}
                onClick={item.onNext}
                aria-label="Next period"
              >
                <MdChevronRight size={18} />
              </button>
            </div>

            {isOpen && (
              <div className={styles.calendarPopover}>
                <Calendar
                  variant="day"
                  value={selectedDate}
                  onSelectDate={(date) => {
                    item.onChange?.(formatDate(date));
                    setOpenedCalendarId(null);
                  }}
                />
              </div>
            )}
          </div>
        );
      }

      case 'checkbox':
        return (
          <Checkbox
            label={item.text}
            checked={item.checked}
            onChange={(event) => item.onChange?.(event.target.checked)}
            reverse
            className={styles.checkboxItemInner}
          />
        );

      case 'search':
        return (
          <BaseInput
            value={item.value}
            placeholder={item.placeholder}
            onChange={(event) => item.onChange?.(event.target.value)}
            icon={<MdSearch size={18} />}
            className={styles.searchInputWrap}
          />
        );

      case 'segmented':
        return <div className={styles.segmentedWrap}>{item.content}</div>;

      default:
        return null;
    }
  };

  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={classNames(
            styles.item,
            styles[`${item.type}Item` as keyof typeof styles],
            item.className,
            {
              [styles.withDivider]: index !== items.length - 1,
            },
          )}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};
