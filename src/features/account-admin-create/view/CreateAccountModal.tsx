import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import { IoMailOutline, IoEyeOutline } from 'react-icons/io5';
import styles from './Modals.module.scss';
import type { FC } from 'react';

interface CreateAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateAccountModal: FC<CreateAccountModalProps> = ({ open, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    onSubmit({ email, password });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Новый администратор" size="sm">
      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <BaseInput 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Input email"
            icon={<IoMailOutline />} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль</label>
          <BaseInput 
            type="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Input email" // As in design mock
            icon={<IoEyeOutline />} 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Подтвердите пароль</label>
          <BaseInput 
            type="password"
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            placeholder="Input email" // As in design mock
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
