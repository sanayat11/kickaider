import { useNavigate } from 'react-router-dom';
import { Input, Checkbox } from '@/shared/ui';
import { Button } from '@/shared/ui/button/view/Button';
import { useLoginForm } from '../lib/validation';
import { useLogin } from '../model/useLogin';
import { paths } from '@/shared/constants/constants';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const onSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
    remember: boolean;
  }) => {
    console.log('SUBMIT WORKS', data);

    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      console.log('LOGIN RESPONSE', response);
      navigate(paths.ACTIVITY);
    } catch (err) {
      console.error('Login failed:', err);
      alert('Ошибка при входе. Проверьте данные.');
    }
  };

  const onInvalid = (formErrors: unknown) => {
    console.log('FORM INVALID', formErrors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className={styles.form}>
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
        type='button'
        actionType='submit'
        variant='primary'
        className={styles.submitBtn}
        size="giant"
        fullWidth
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Загрузка...' : 'Войти'}
      </Button>
    </form>
  );
};