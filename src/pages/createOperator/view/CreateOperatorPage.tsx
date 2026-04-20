import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button/view/Button';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { IoEyeOutline } from 'react-icons/io5';
import styles from './CreateOperatorPage.module.scss';
import { paths } from '@/shared/constants/constants';
import { useAuthStore } from '@/shared/lib/model/AuthStore';
import { useCreateOperator } from '../model/useDepartment';

export const CreateOperatorPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [fio, setFio] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const createOperatorMutation = useCreateOperator();

  const handleSave = async () => {
    if (!fio.trim()) {
      alert('Введите ФИО');
      return;
    }

    if (!login.trim()) {
      alert('Введите email / логин');
      return;
    }

    if (!password.trim()) {
      alert('Введите пароль');
      return;
    }

    if (!user?.companyId) {
      alert('Не удалось определить компанию текущего пользователя');
      return;
    }

    try {
      await createOperatorMutation.mutateAsync({
        name: fio.trim(),
        email: login.trim(),
        password,
        role: 'OPERATOR',
        companyId: user.companyId,
      });

      navigate(paths.DASHBOARD_REPORTS, { replace: true });
    } catch (e) {
      console.error('Не удалось создать оператора', e);

      if (e instanceof Error) {
        alert(e.message);
        return;
      }

      alert('Не удалось создать оператора');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography
          variant="h1"
          weight="bold"
          context="dashboard"
          className={styles.pageTitle}
        >
          Создать оператора
        </Typography>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitle}>Данные оператора</div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>ФИО</label>
              <BaseInput
                value={fio}
                onChange={(e) => setFio(e.target.value)}
                placeholder="Иванов Иван Иванович"
                className={styles.inputField}
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Логин / Email</label>
              <BaseInput
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="operator@company.com"
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Пароль</label>
              <BaseInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<IoEyeOutline />}
                placeholder="••••••••"
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              variant="outline"
              className={styles.btn}
              size="giant"
              onClick={handleCancel}
            >
              Отмена
            </Button>

            <Button
              variant="primary"
              className={styles.btn}
              size="giant"
              onClick={handleSave}
              disabled={createOperatorMutation.isPending}
            >
              {createOperatorMutation.isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};