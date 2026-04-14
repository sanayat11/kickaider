import { useNavigate } from 'react-router-dom';
import { Input, Checkbox } from '@/shared/ui';
import { Button } from '@/shared/ui/button/view/Button';
import { useLoginForm } from '../model/useLoginForm';
import { useLoginMutation } from '../api/authApi';
import { paths } from '@/shared/constants/constants';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password
      }).unwrap();
      
      localStorage.setItem('accessToken', response.accessToken);
      navigate(paths.ACTIVITY);
    } catch (err) {
      console.error('Login failed:', err);
      alert('Ошибка при входе. Проверьте данные.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        name="email"
        label="Email"
        placeholder="Input email"
        type="email"
        control={control as any}
        error={errors.email?.message}
        className={styles.loginInput}
      />

      <Input
        name="password"
        label="Пароль"
        placeholder="Input password"
        type="password"
        control={control as any}
        error={errors.password?.message}
        className={styles.loginInput}
      />

      <Input
        name="confirmPassword"
        label="Подтвердите пароль"
        placeholder="Input password"
        type="password"
        control={control as any}
        error={errors.confirmPassword?.message}
        className={styles.loginInput}
      />

      <div className={styles.checkboxWrap}>
        <Checkbox 
          label="Запомнить меня" 
          {...register('remember')} 
          className={styles.checkbox} 
        />
      </div>

      <Button
        actionType="submit"
        className={styles.submitBtn}
        size="giant"
        fullWidth
        disabled={isLoading}
      >
        {isLoading ? 'Загрузка...' : 'Войти'}
      </Button>
    </form>
  );
};
