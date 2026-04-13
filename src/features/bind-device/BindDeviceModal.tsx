import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import type { Department, UnassignedDevice } from '../../pages/orgStructurePage/model/types';
import styles from './BindDeviceModal.module.scss';

interface BindDeviceModalProps {
  open: boolean;
  onClose: () => void;
  device: UnassignedDevice | null;
  departments: Department[];
  onSave: (data: {
    employeeName: string;
    position: string;
    deptId: string;
    deviceId?: string;
  }) => void;
}

export const BindDeviceModal: FC<BindDeviceModalProps> = ({
  open,
  onClose,
  device,
  departments,
  onSave,
}) => {
  const { t } = useTranslation();
  const [employeeName, setEmployeeName] = useState('');
  const [position, setPosition] = useState('');
  const [deptId, setDeptId] = useState('');

  useEffect(() => {
    if (open) {
      setEmployeeName('');
      setPosition('');
      setDeptId(departments[0]?.id || '');
    }
  }, [open, departments]);

  const handleSave = () => {
    if (!employeeName.trim() || !position.trim() || !deptId) return;

    onSave({
      employeeName,
      position,
      deptId,
      deviceId: device?.id,
    });

    onClose();
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        {t('common.cancel')}
      </Button>

      <Button
        variant="primary"
        onClick={handleSave}
        disabled={!employeeName.trim() || !position.trim() || !deptId}
      >
        {t('common.save')}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('settings.organization.modals.bind.title')}
      footer={footer}
    >
      <div className={styles.info}>
        <Typography variant="h5" color="secondary">
          {t('settings.organization.modals.bind.description', {
            hostname: device?.hostname,
          })}
        </Typography>
      </div>

      <div className={styles.form}>
        <BaseInput
          label={t('settings.organization.modals.bind.employeeName')}
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />

        <BaseInput
          label={t('settings.organization.modals.bind.position')}
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <div className={styles.field}>
          <label className={styles.label}>
            {t('settings.organization.modals.bind.department')}
          </label>

          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
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