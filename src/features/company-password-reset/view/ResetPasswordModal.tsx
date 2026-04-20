import type { FC } from 'react';
import { Modal } from '@/shared/ui/modal/view/Modal';
import { Button } from '@/shared/ui/button/view/Button';
import styles from './Modals.module.scss';
import { useResetPassword } from '@/features/auth/loginForm/model/useLogin';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';


interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  email: string;
}

export const ResetPasswordModal: FC<ResetPasswordModalProps> = ({
  open,
  onClose,
  userId,
  email,
}) => {
  const resetPasswordMutation = useResetPassword();

  const handleReset = async () => {
    if (!userId || !email) return;

    try {
      await resetPasswordMutation.mutateAsync({
        userId,
        email,
      });

      alert('Письмо для сброса пароля отправлено');
      onClose();
    } catch (e) {
      console.error('Не удалось сбросить пароль', e);
      alert('Не удалось сбросить пароль');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Сбросить пароль"
      size="sm"
      footer={
        <div className={styles.footerRow}>
          <Button
            variant="primary"
            size="large"
            onClick={handleReset}
            className={styles.footerBtn}
            disabled={resetPasswordMutation.isPending || !userId || !email}
          >
            {resetPasswordMutation.isPending ? 'Отправка...' : 'Отправить письмо'}
          </Button>

          <Button
            variant="outline"
            size="large"
            onClick={onClose}
            className={styles.footerBtn}
          >
            Отмена
          </Button>
        </div>
      }
    >
      <div className={styles.confirmMessage}>
        Письмо для сброса пароля будет отправлено на:
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email администратора</label>
        <BaseInput value={email} disabled />
      </div>
    </Modal>
  );
};