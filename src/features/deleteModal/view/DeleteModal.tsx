import type { FC } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import styles from './DeleteModal.module.scss';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
}

export const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Удалить',
}) => {
  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>

      <Button tone="red" onClick={onConfirm}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal open={open} onClose={onClose} title={title} footer={footer} size="sm">
      <div className={styles.content}>
        <Typography variant="h5" color="secondary" className={styles.description}>
          {description}
        </Typography>
      </div>
    </Modal>
  );
};