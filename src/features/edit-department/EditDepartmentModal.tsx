  import { type FC, useState, useEffect } from 'react';
  import { useTranslation } from 'react-i18next';
  import { Modal } from '@/shared/ui/modal/view/Modal';
  import { BaseInput } from '@/shared/ui/input/view/BaseInput';
  import { Button } from '@/shared/ui/button/view/Button';
  import type { Department } from '../../pages/orgStructurePage/model/types';

  interface EditDepartmentModalProps {
    open: boolean;
    onClose: () => void;
    department: Department | null;
    onSave: (name: string) => void;
  }

  export const EditDepartmentModal: FC<EditDepartmentModalProps> = ({
    open,
    onClose,
    department,
    onSave,
  }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');

    useEffect(() => {
      if (department) {
        setName(department.name);
      }
    }, [department]);

    const handleSave = () => {
      if (name.trim()) {
        onSave(name);
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
        title={t('settings.organization.modals.dept.edit')}
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
