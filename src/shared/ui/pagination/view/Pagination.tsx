import type { FC, ReactNode } from 'react';
import cn from 'classnames';
import { MdChevronLeft, MdChevronRight, MdKeyboardArrowDown } from 'react-icons/md';

import styles from './Pagination.module.scss';
import type { PaginationItemState, PaginationItemVariant, PaginationProps } from '../types/Pagination';
import { getPaginationRange } from '@/shared/lib/getPaginationRange';

type PaginationButtonProps = {
  variant?: PaginationItemVariant;
  state?: PaginationItemState;
  onClick?: () => void;
  children: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
};

const PaginationButton: FC<PaginationButtonProps> = ({
  variant = 'page',
  state = 'default',
  onClick,
  children,
  ariaLabel,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={cn(styles.item, styles[variant], styles[state])}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Pagination: FC<PaginationProps> = (props) => {
  const { currentPage, totalPages, onPageChange, className } = props;

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const handlePrev = () => {
    if (!isPrevDisabled) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (!isNextDisabled) onPageChange(currentPage + 1);
  };

  if (props.variant === 'simple') {
    return (
      <nav className={cn(styles.pagination, styles.simpleRoot, className)} aria-label="Pagination">
        <PaginationButton
          variant="icon"
          state={isPrevDisabled ? 'disabled' : 'default'}
          onClick={handlePrev}
          disabled={isPrevDisabled}
          ariaLabel="Previous page"
        >
          <MdChevronLeft size={20} />
        </PaginationButton>

        <div className={styles.info}>
          {props.label ?? `Страница ${currentPage} из ${totalPages}`}
        </div>

        <PaginationButton
          variant="icon"
          state={isNextDisabled ? 'disabled' : 'default'}
          onClick={handleNext}
          disabled={isNextDisabled}
          ariaLabel="Next page"
        >
          <MdChevronRight size={20} />
        </PaginationButton>
      </nav>
    );
  }

  if (props.variant === 'bar') {
    const {
      pageSize,
      pageSizeOptions = [10, 20, 50],
      pageSizeLabel = 'Показать по',
      onPageSizeChange,
      infoText,
    } = props;

    return (
      <div className={cn(styles.barRoot, className)}>
        <div className={styles.pageSizeBlock}>
          <span className={styles.pageSizeLabel}>{pageSizeLabel}</span>

          <label className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <MdKeyboardArrowDown size={20} className={styles.selectIcon} />
          </label>
        </div>

        <div className={styles.simpleRoot}>
          <PaginationButton
            variant="icon"
            state={isPrevDisabled ? 'disabled' : 'default'}
            onClick={handlePrev}
            disabled={isPrevDisabled}
            ariaLabel="Previous page"
          >
            <MdChevronLeft size={20} />
          </PaginationButton>

          <div className={styles.info}>
            {infoText
              ? infoText(currentPage, totalPages)
              : `Страница ${currentPage} из ${totalPages}`}
          </div>

          <PaginationButton
            variant="icon"
            state={isNextDisabled ? 'disabled' : 'default'}
            onClick={handleNext}
            disabled={isNextDisabled}
            ariaLabel="Next page"
          >
            <MdChevronRight size={20} />
          </PaginationButton>
        </div>
      </div>
    );
  }

  const siblingCount = props.siblingCount ?? 1;
  const paginationRange = getPaginationRange(currentPage, totalPages, siblingCount);

  return (
    <nav className={cn(styles.pagination, className)} aria-label="Pagination">
      <PaginationButton
        variant="icon"
        state={isPrevDisabled ? 'disabled' : 'default'}
        onClick={handlePrev}
        disabled={isPrevDisabled}
        ariaLabel="Previous page"
      >
        <MdChevronLeft size={20} />
      </PaginationButton>

      <div className={styles.pages}>
        {paginationRange.map((item, index) => {
          if (item === 'dots') {
            return (
              <span key={`dots-${index}`} className={styles.dots}>
                ...
              </span>
            );
          }

          const state: PaginationItemState = item === currentPage ? 'active' : 'default';

          return (
            <PaginationButton
              key={item}
              variant="page"
              state={state}
              onClick={() => onPageChange(item)}
              ariaLabel={`Page ${item}`}
            >
              {item}
            </PaginationButton>
          );
        })}
      </div>

      <PaginationButton
        variant="icon"
        state={isNextDisabled ? 'disabled' : 'default'}
        onClick={handleNext}
        disabled={isNextDisabled}
        ariaLabel="Next page"
      >
        <MdChevronRight size={20} />
      </PaginationButton>
    </nav>
  );
};
