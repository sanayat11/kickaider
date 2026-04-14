import styles from './AuthPage.module.scss';
import logo from '@shared/assets/images/logo.svg';
import { LoginForm } from '@/features/auth/loginForm/view/LoginForm';
import { Typography } from '@/shared/ui';

export const AuthPage = () => {
  return (
    <div className={styles.auth}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.card}>
            <div className={styles.logo}>
              <img src={logo} alt="Logo" />
              <Typography variant="h4" context="landing" weight="bold">
                KickAider
              </Typography>
            </div>

            <div className={styles.title}>
              <Typography variant="h2" context="landing" weight="bold">
                Войти в аккаунт
              </Typography>
            </div>

            <div className={styles.form}>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
