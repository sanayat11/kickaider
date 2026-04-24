import { type FC, useEffect, useMemo, useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import type { Department, Employee } from '@/pages/orgStructurePage/model/types';
import styles from './EditEmployeeModal.module.scss';

interface EditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  departments: Department[];
  onSave: (data: {
    employeeId: string;
    departmentId: string;
    position: string;
  }) => void;
  onChangePassword: (employeeId: string, newPassword: string) => Promise<void>;
}

export const EditEmployeeModal: FC<EditEmployeeModalProps> = ({
  open,
  onClose,
  employee,
  departments,
  onSave,
  onChangePassword,
}) => {
  const defaultDepartmentId = useMemo(() => {
    if (employee?.departmentId) return employee.departmentId;
    return departments[0]?.id ?? '';
  }, [employee, departments]);

  const [position, setPosition] = useState(employee?.position ?? '');
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setPosition(employee?.position ?? '');
    setDepartmentId(employee?.departmentId ?? departments[0]?.id ?? '');
    setNewPassword('');
  }, [employee, departments]);

  const handleSave = async () => {
    if (!employee?.id) return;
    if (!position.trim()) return;
    if (!departmentId) return;

    onSave({
      employeeId: employee.id,
      departmentId,
      position: position.trim(),
    });

    if (newPassword.trim()) {
      await onChangePassword(employee.id, newPassword.trim());
    }

    onClose();
  };

  const footer = (
    <>
      <Button variant="primary" onClick={handleSave} disabled={!position.trim() || !departmentId}>
        Сохранить
      </Button>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Редактировать сотрудника"
      footer={footer}
    >
      <div className={styles.form}>
        {employee?.name && (
          <p className={styles.employeeName}>{employee.name}</p>
        )}

        <BaseInput
          label="Должность"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Например, Java Developer"
        />

        <div className={styles.field}>
          <label className={styles.label}>Отдел</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className={styles.select}
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <hr className={styles.divider} />

        <BaseInput
          label="Новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Оставьте пустым, чтобы не менять"
          type="password"
        />
      </div>
    </Modal>
  );
};
