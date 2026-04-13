import type { FC } from 'react';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './Modals.module.scss';

interface CreateCompanyModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCompanyModal: FC<CreateCompanyModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('IT отдел');
  const [admin, setAdmin] = useState('IT отдел');
  const [login, setLogin] = useState('IT отдел');
  const [password, setPassword] = useState('IT отдел');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Создать компанию"
      size="md"
      footer={
        <div className={styles.footerRow}>
          <Button variant="primary" size='giant' onClick={onClose} className={styles.footerBtn}>Сохранить</Button>
          <Button variant="outline" size='giant' onClick={onClose} className={styles.footerBtn}>Отмена</Button>
        </div>
      }
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>Название компании</label>
        <BaseInput value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>ФИО админа</label>
        <SelectDropdown 
          value={admin} 
          onChange={val => setAdmin(val || '')} 
          options={[{label: 'IT отдел', value: 'IT отдел'}]} 
          className={styles.fullWidthSelect}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Логин</label>
        <BaseInput value={login} onChange={e => setLogin(e.target.value)} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Пароль</label>
        <BaseInput type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
    </Modal>
  );
};
