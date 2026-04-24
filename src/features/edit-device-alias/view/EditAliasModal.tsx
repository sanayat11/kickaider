import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import type { DeviceApiItem } from '../../../pages/orgStructurePage/model/types';

interface EditAliasModalProps {
  open: boolean;
  onClose: () => void;
  device: DeviceApiItem | null;
  onSave: (deviceId: number, alias: string) => void;
  isLoading?: boolean;
}

export const EditAliasModal: FC<EditAliasModalProps> = ({
  open,
  onClose,
  device,
  onSave,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [alias, setAlias] = useState('');

  useEffect(() => {
    if (device) {
      setAlias(device.deviceName || device.hostname || '');
    }
  }, [device]);

  const handleSave = () => {
    if (!device || !alias.trim()) return;
    onSave(device.id, alias.trim());
  };

  const footer = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        {t('common.cancel', { defaultValue: 'Отмена' })}
      </Button>
      <Button
        variant="primary"
        onClick={handleSave}
        disabled={!alias.trim() || isLoading}
      >
        {t('common.save', { defaultValue: 'Сохранить' })}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('devices.management.modals.alias.title', { defaultValue: 'Переименовать устройство' })}
      footer={footer}
    >
      <BaseInput
        label={t('devices.management.modals.alias.label', { defaultValue: 'Новое имя устройства' })}
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        placeholder={device?.hostname ?? ''}
      />
    </Modal>
  );
};
