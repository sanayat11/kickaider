import type { FC } from 'react';
import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './Modals.module.scss';
import { useCreateCompany } from '@/pages/companies/model/useCompany';

interface CreateCompanyModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCompanyModal: FC<CreateCompanyModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeLimit, setEmployeeLimit] = useState('50');

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const createCompanyMutation = useCreateCompany();

  const resetForm = () => {
    setName('');
    setEmail('');
    setTaxId('');
    setPhone('');
    setEmployeeLimit('50');
    setAdminName('');
    setAdminEmail('');
    setAdminPassword('');
  };

  const handleSave = async () => {
    try {
      await createCompanyMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        taxId: taxId.trim() ? taxId.trim() : null,
        phone: phone.trim() ? phone.trim() : null,
        employeeLimit: Number(employeeLimit) || 0,
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
        adminPassword,
      });

      resetForm();
      onClose();
    } catch (e) {
      console.error('Не удалось создать компанию', e);
      alert('Не удалось создать компанию');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Создать компанию"
      size="sm"
      footer={
        <div className={styles.footerRow}>
          <Button
            variant="primary"
            size="large"
            onClick={handleSave}
            className={styles.footerBtn}
            disabled={createCompanyMutation.isPending}
          >
            {createCompanyMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>

          <Button
            variant="outline"
            size="large"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className={styles.footerBtn}
          >
            Отмена
          </Button>
        </div>
      }
    >
      <div className={styles.formScroll}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Название компании</label>
          <BaseInput
            value={name}
            placeholder="Название компании"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email компании</label>
          <BaseInput
            value={email}
            placeholder="company@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>ИНН / Tax ID</label>
          <BaseInput
            value={taxId}
            placeholder="123456789"
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Телефон</label>
          <BaseInput
            value={phone}
            placeholder="+996700123456"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Лимит сотрудников</label>
          <BaseInput
            type="number"
            value={employeeLimit}
            onChange={(e) => setEmployeeLimit(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>ФИО администратора</label>
          <BaseInput
            value={adminName}
            placeholder="Main Admin"
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email администратора</label>
          <BaseInput
            value={adminEmail}
            placeholder="admin@company.com"
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Пароль администратора</label>
          <BaseInput
            type="password"
            value={adminPassword}
            placeholder="Admin123!"
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};