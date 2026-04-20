import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Button } from '@/shared/ui/button/view/Button';
import { IoEyeOutline } from 'react-icons/io5';
import styles from './Modals.module.scss';
import type { FC } from 'react';
import { useSetPassword } from '@/features/auth/loginForm/model/useLogin';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  token,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const setPasswordMutation = useSetPassword();

  const handleSave = async () => {
    if (!password || password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      await setPasswordMutation.mutateAsync({
        token,
        newPassword: password,
      });

      alert('Пароль успешно обновлён');
      onClose();
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.error('Не удалось установить новый пароль', e);
      alert('Не удалось установить новый пароль');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Изменить пароль" size="sm">
      <div className={styles.formGroup}>
        <label className={styles.label}>Пароль</label>
        <BaseInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Новый пароль"
          icon={<IoEyeOutline />}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Подтвердите пароль</label>
        <BaseInput
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите пароль"
          icon={<IoEyeOutline />}
        />
      </div>

      <div className={styles.footerRow}>
        <Button
          variant="primary"
          className={styles.footerBtn}
          onClick={handleSave}
          disabled={setPasswordMutation.isPending}
        >
          {setPasswordMutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </Modal>
  );
};