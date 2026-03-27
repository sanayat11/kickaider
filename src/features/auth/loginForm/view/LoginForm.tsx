import { Checkbox } from '@/shared/ui/index';
import { Input } from '@/shared/ui/input/view/Input';
import { useLoginForm } from '../model/useLoginForm';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        name="email"
        label="Email"
        placeholder="Input email"
        type="email"
        control={control}
        error={errors.email?.message}
        className={styles.loginInput}
      />

      <Input
        name="password"
        label="Пароль"
        placeholder="Input password"
        type="password"
        control={control}
        error={errors.password?.message}
        className={styles.loginInput}
      />

      <Input
        name="confirmPassword"
        label="Подтвердите пароль"
        placeholder="Input password"
        type="password"
        control={control}
        error={errors.confirmPassword?.message}
        className={styles.loginInput}
      />

      <Checkbox label="Запомнить меня" {...register('remember')} className={styles.checkbox} />
    </form>
  );
};
