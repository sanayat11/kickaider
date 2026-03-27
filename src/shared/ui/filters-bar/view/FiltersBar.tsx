import type { FC } from 'react';
import classNames from 'classnames';
import { MdChevronLeft, MdChevronRight, MdExpandMore, MdSearch } from 'react-icons/md';

import styles from './FiltersBar.module.scss';
import type { FilterBarItem, FilterBarProps } from '../types/FilterBar';

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
          {item.icon}
        </button>
      );

    case 'select':
      return (
        <label className={styles.selectField}>
          {item.label ? <span className={styles.fieldLabel}>{item.label}</span> : null}

          <div className={styles.selectValue}>
            <select
              className={styles.nativeSelect}
              value={item.value}
              onChange={(e) => item.onChange?.(e.target.value)}
            >
              {item.placeholder ? (
                <option value="" disabled>
                  {item.placeholder}
                </option>
              ) : null}

              {item.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <MdExpandMore size={20} className={styles.selectIcon} />
          </div>
        </label>
      );

    case 'date-nav':
      return (
        <div className={styles.dateNav}>
          {item.label ? <span className={styles.fieldLabel}>{item.label}</span> : null}

          <div className={styles.dateNavInner}>
            <button
              type="button"
              className={styles.navButton}
              onClick={item.onPrev}
              aria-label="Previous period"
            >
              <MdChevronLeft size={20} />
            </button>

            <span className={styles.dateValue}>{item.value}</span>

            <button
              type="button"
              className={styles.navButton}
              onClick={item.onNext}
              aria-label="Next period"
            >
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <label className={styles.checkboxRow}>
          <span className={styles.checkboxText}>{item.text}</span>
          <input
            className={styles.checkboxInput}
            type="checkbox"
            checked={item.checked}
            onChange={(e) => item.onChange?.(e.target.checked)}
          />
          <span className={styles.checkboxMark} />
        </label>
      );

    case 'search':
      return (
        <label className={styles.searchField}>
          <MdSearch size={20} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            value={item.value}
            placeholder={item.placeholder}
            onChange={(e) => item.onChange?.(e.target.value)}
          />
        </label>
      );

    case 'segmented':
      return <div className={styles.segmentedWrap}>{item.content}</div>;

    default:
      return null;
  }
};

export const FilterBar: FC<FilterBarProps> = ({ items, className }) => {
  return (
    <div className={classNames(styles.root, className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={classNames(styles.item, item.className, {
            [styles.withDivider]: index !== items.length - 1,
          })}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};
