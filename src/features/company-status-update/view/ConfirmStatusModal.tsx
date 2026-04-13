import type { FC } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './Modals.module.scss';

interface ConfirmStatusModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  status: string; // 'Active' or 'Suspended'
}

export const ConfirmStatusModal: FC<ConfirmStatusModalProps> = ({ open, onClose, onConfirm, status }) => {
  const isBlocking = status === 'Active';
  
  const titleText = isBlocking ? 'Вы уверены в блокировке компании?' : 'Вы уверены в снятии блокировки компании?';
  const confirmBtnText = isBlocking ? 'Заблокировать компанию' : 'Разблокировать компанию';
  
  // Design specifies red button for block, teal/success for unblock
  const btnClass = isBlocking ? styles.dangerBtn : styles.successBtn;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      closable={false}
    >
      <div className={styles.confirmMessage}>
        {titleText}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onConfirm} 
          className={btnClass}
        >
          {confirmBtnText}
        </Button>

        <Button 
          variant="outline" 
          fullWidth 
          onClick={onClose}
        >
          Отмена
        </Button>
      </div>
    </Modal>
  );
};
