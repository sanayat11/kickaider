export const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
};

export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | 'dots')[] => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, 'dots', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightRange = range(totalPages - (3 + siblingCount * 2) + 1, totalPages);
    return [1, 'dots', ...rightRange];
  }

  if (showLeftDots && showRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, 'dots', ...middleRange, 'dots', totalPages];
  }

  return range(1, totalPages);
};
