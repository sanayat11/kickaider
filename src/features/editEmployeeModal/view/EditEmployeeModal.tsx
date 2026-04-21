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
    employeeNumber: string;
  }) => void;
}

export const EditEmployeeModal: FC<EditEmployeeModalProps> = ({
  open,
  onClose,
  employee,
  departments,
  onSave,
}) => {
  const defaultDepartmentId = useMemo(() => {
    if (employee?.departmentId) return employee.departmentId;
    return departments[0]?.id ?? '';
  }, [employee, departments]);

  const [position, setPosition] = useState(employee?.position ?? '');
  const [employeeNumber, setEmployeeNumber] = useState(employee?.employeeNumber ?? '');
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId);

  useEffect(() => {
    setPosition(employee?.position ?? '');
    setEmployeeNumber(employee?.employeeNumber ?? '');
    setDepartmentId(employee?.departmentId ?? departments[0]?.id ?? '');
  }, [employee, departments]);

  const handleSave = () => {
    if (!employee?.id) return;
    if (!position.trim()) return;
    if (!departmentId) return;

    onSave({
      employeeId: employee.id,
      departmentId,
      position: position.trim(),
      employeeNumber: employeeNumber.trim(),
    });

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
    <Modal open={open} onClose={onClose} title="Редактировать сотрудника" footer={footer}>
      <div className={styles.form}>
        <BaseInput
          label="ФИО сотрудника"
          value={employee?.name ?? ''}
          disabled
        />

        <BaseInput
          label="Должность"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Например, Java Developer"
        />

        <BaseInput
          label="Табельный номер"
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          placeholder="EMP-001"
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
      </div>
    </Modal>
  );
};