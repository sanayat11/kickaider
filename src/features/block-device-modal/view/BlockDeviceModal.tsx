import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import type { DeviceApiItem } from '../../../pages/orgStructurePage/model/types';

interface BlockDeviceModalProps {
  open: boolean;
  onClose: () => void;
  device: DeviceApiItem | null;
  onConfirm: (deviceId: number, reason: string) => void;
  isLoading?: boolean;
}

export const BlockDeviceModal: FC<BlockDeviceModalProps> = ({
  open,
  onClose,
  device,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!device || !reason.trim()) return;
    onConfirm(device.id, reason.trim());
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        {t('common.cancel', { defaultValue: 'Отмена' })}
      </Button>
      <Button tone="red" onClick={handleConfirm} disabled={!reason.trim() || isLoading}>
        {t('devices.management.blockBtn', { defaultValue: 'Заблокировать' })}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('devices.management.modals.block.title', {
        defaultValue: 'Заблокировать устройство',
      })}
      footer={footer}
      size="sm"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Typography variant="h5" color="secondary">
          {t('devices.management.modals.block.description', {
            defaultValue: 'Укажите причину блокировки для устройства {{deviceName}}.',
            deviceName: device?.hostname || device?.deviceName || `Device #${device?.id ?? ''}`,
          })}
        </Typography>

        <BaseInput
          label={t('devices.management.modals.block.reasonLabel', {
            defaultValue: 'Причина блокировки',
          })}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder={t('devices.management.modals.block.reasonPlaceholder', {
            defaultValue: 'Например: утеряно устройство',
          })}
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};
