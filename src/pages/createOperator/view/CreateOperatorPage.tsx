import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button/view/Button';
import { BaseInput } from '@/shared/ui/input/view/BaseInput';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { IoEyeOutline } from 'react-icons/io5';
import styles from './CreateOperatorPage.module.scss';
import { paths } from '@/shared/constants/constants';

export const CreateOperatorPage = () => {
  const navigate = useNavigate();

  const [fio, setFio] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    navigate(paths.COMPANIES);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography variant="h1" weight='bold' context='dashboard' className={styles.pageTitle}>Создать оператора</Typography>
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
                onChange={e => setFio(e.target.value)} 
                placeholder="Иванов Иван Иванович"
                className={styles.inputField} 
                fullWidth
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Логин</label>
              <BaseInput 
                value={login} 
                onChange={e => setLogin(e.target.value)} 
                placeholder="admin_kickaider"
                className={styles.inputField} 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Пароль</label>
              <BaseInput 
                type="password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                icon={<IoEyeOutline />}
                placeholder="••••••••"
                className={styles.inputField} 
              />
            </div>
          </div>

          <div className={styles.footer}>
            <Button variant="outline" className={styles.btn} size="giant" onClick={handleCancel}>Отмена</Button>
            <Button variant="primary" className={styles.btn} size="giant" onClick={handleSave}>Сохранить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
