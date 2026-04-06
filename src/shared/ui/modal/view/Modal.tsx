import { useEffect, useRef, type FC } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { useOutsideClick } from '@/shared/hooks/useOutsideClick';
import styles from './Modal.module.scss';
import type { ModalProps } from '../model/types';

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 4L12 12M12 4L4 12"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closable = true,
  closeOnOverlay = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: modalRef,
    handler: onClose,
    enabled: open && closeOnOverlay,
  });

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} role="presentation">
      <div
        ref={modalRef}
        className={classNames(styles.modal, styles[size], className)}
        role="dialog"
        aria-modal="true"
      >
        {(title || closable) && (
          <div className={classNames(styles.header, 'shared-ui-modal-header')}>
            <div className={classNames(styles.titleWrap, 'shared-ui-modal-title-wrap')}>
              {title ? (
                <Typography variant="h3" weight="bold" className={classNames(styles.title, 'shared-ui-modal-title')}>
                  {title}
                </Typography>
              ) : null}
            </div>

            {closable && (
              <button
                type="button"
                className={classNames(styles.closeButton, 'shared-ui-modal-close-button')}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};