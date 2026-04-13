  import { type FC, useState } from 'react';
  import { useTranslation } from 'react-i18next';
  import { Modal } from '@/shared/ui/modal/view/Modal';
  import { BaseInput } from '@/shared/ui/input/view/BaseInput';
  import { Button } from '@/shared/ui/button/view/Button';

  interface CreateDepartmentModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
  }

  export const CreateDepartmentModal: FC<CreateDepartmentModalProps> = ({
    open,
    onClose,
    onSave,
  }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');

    const handleSave = () => {
      if (name.trim()) {
        onSave(name);
        setName('');
        onClose();
      }
    };

    const footer = (
      <>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={!name.trim()}
        >
          {t('common.save')}
        </Button>
        <Button variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
      </>
    );

    return (
      <Modal
        open={open}
        onClose={onClose}
        title={t('settings.organization.modals.dept.create')}
        footer={footer}
      >
        <BaseInput
          label={t('settings.organization.modals.dept.name')}
          placeholder={t('settings.organization.modals.dept.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </Modal>
    );
  };
