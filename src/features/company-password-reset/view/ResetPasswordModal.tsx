import type { FC } from 'react';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { IoCopyOutline, IoEyeOutline } from 'react-icons/io5';
import styles from './Modals.module.scss';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: FC<ResetPasswordModalProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState('Input email');

  const handleGenerate = () => {
    setPassword(Math.random().toString(36).slice(-8));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Новый пароль"
      size="sm"
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>Пароль</label>
        <BaseInput 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          icon={<IoEyeOutline />}
        />
      </div>

      <Button variant="outline" fullWidth onClick={handleGenerate} className={styles.formGroup}>
        Сгенерировать пароль
      </Button>

      <Button variant="primary" fullWidth rightIcon={<IoCopyOutline />} onClick={handleCopy}>
        Скопировать пароль
      </Button>
    </Modal>
  );
};
