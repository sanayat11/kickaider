import type { FC } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './Modals.module.scss';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: FC<ConfirmDeleteModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose} size="sm" closable={false}>
      <div className={styles.confirmMessage}>
        <span className={styles.titleBlue}>Удалить файлы ?</span>
      </div>

      <div className={styles.confirmRow}>
        <Button variant="primary" className={styles.dangerBtn} onClick={onConfirm}>Удалить</Button>
        <Button variant="outline" className={styles.btn} onClick={onClose}>Отмена</Button>
      </div>
    </Modal>
  );
};
