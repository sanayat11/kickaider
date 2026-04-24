import { type FC, useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import styles from '../editEmployeeModal/view/EditEmployeeModal.module.scss';

interface CreateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  departmentId: number;
  departmentName: string;
  onSave: (data: {
    email: string;
    password: string;
    name: string;
    departmentId: number;
    position: string;
    hireDate: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateEmployeeModal: FC<CreateEmployeeModalProps> = ({
  open,
  onClose,
  departmentId,
  departmentName,
  onSave,
  isLoading,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [hireDate, setHireDate] = useState('');

  const isValid = email.trim() && password.trim() && name.trim() && position.trim() && hireDate;

  const handleSave = async () => {
    if (!isValid) return;
    await onSave({
      email: email.trim(),
      password: password.trim(),
      name: name.trim(),
      departmentId,
      position: position.trim(),
      hireDate,
    });
    setEmail('');
    setPassword('');
    setName('');
    setPosition('');
    setHireDate('');
  };

  const footer = (
    <>
      <Button variant="primary" onClick={handleSave} disabled={!isValid || isLoading}>
        {isLoading ? 'Создание...' : 'Создать'}
      </Button>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>
    </>
  );

  return (
    <Modal open={open} onClose={onClose} title={`Добавить сотрудника — ${departmentName}`} footer={footer}>
      <div className={styles.form}>
        <BaseInput
          label="ФИО"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Иван Иванов"
          autoFocus
        />
        <BaseInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="employee@company.com"
        />
        <BaseInput
          label="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          type="password"
        />
        <BaseInput
          label="Должность"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Java Developer"
        />
        <BaseInput
          label="Дата найма"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          type="date"
        />
      </div>
    </Modal>
  );
};
