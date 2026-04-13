import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import { IoEyeOutline } from 'react-icons/io5';
import styles from './Modals.module.scss';
import type { FC } from 'react';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = ({ open, onClose, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    onSubmit(password);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Изменить пароль" size="sm">
      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль</label>
          <BaseInput 
            type="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Input email" 
            icon={<IoEyeOutline />} 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Подтвердите пароль</label>
          <BaseInput 
            type="password"
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            placeholder="Input email" 
            icon={<IoEyeOutline />} 
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="primary" className={styles.submitBtn} onClick={handleSave}>Сохранить</Button>
      </div>
    </Modal>
  );
};
