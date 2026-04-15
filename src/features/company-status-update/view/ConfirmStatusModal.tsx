import type { FC } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './Modals.module.scss';

interface ConfirmStatusModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: 'ACTIVE' | 'SUSPENDED';
}

export const ConfirmStatusModal: FC<ConfirmStatusModalProps> = ({
  open,
  onClose,
  onConfirm,
  status,
}) => {
  const isBlocking = status === 'ACTIVE';

  const titleText = isBlocking
    ? 'Вы уверены в блокировке компании?'
    : 'Вы уверены в снятии блокировки компании?';

  const confirmBtnText = isBlocking
    ? 'Заблокировать компанию'
    : 'Разблокировать компанию';

  const btnClass = isBlocking ? styles.dangerBtn : styles.successBtn;

  return (
    <Modal open={open} onClose={onClose} size="sm" closable={false}>
      <div className={styles.confirmMessage}>{titleText}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={onConfirm}
          className={btnClass}
        >
          {confirmBtnText}
        </Button>

        <Button type="button" variant="outline" fullWidth onClick={onClose}>
          Отмена
        </Button>
      </div>
    </Modal>
  );
};