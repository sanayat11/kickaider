import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/SelectDropdown';
import { Button } from '@/shared/ui/button/view/Button';
import { IoCopyOutline } from 'react-icons/io5';
import styles from './Modals.module.scss';
import type { FC } from 'react';

interface GeneratePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const GeneratePasswordModal: FC<GeneratePasswordModalProps> = ({ open, onClose }) => {
  const [password, setPassword] = useState('Input email');

  const handleGenerate = () => {
    setPassword(Math.random().toString(36).slice(-8));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <Modal open={open} onClose={onClose} title="Новый администратор" size="sm">
      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль</label>
          <SelectDropdown 
            value={password} 
            onChange={(val) => setPassword(val || '')} 
            options={[{label: password, value: password}]} 
            className={styles.inputField} 
          />
        </div>
      </div>

      <div className={styles.formGroup} style={{ gap: '16px' }}>
        <Button variant="outline" className={styles.submitBtn} onClick={handleGenerate}>Сгенерировать пароль</Button>
        <Button variant="primary" className={styles.submitBtn} rightIcon={<IoCopyOutline />} onClick={handleCopy}>Скопировать пароль</Button>
      </div>
    </Modal>
  );
};
