import { Checkbox } from "@/shared/ui/checkbox/view/CheckBox"
import { useLoginForm } from "../model/useLoginForm"
import { Input } from "@/shared/ui/input/view/Input"
import styles from "./LoginForm.module.scss"

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useLoginForm()

  const onSubmit = (data: unknown) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        control={control}
        error={errors.email?.message}
      />

      <Input
        name="password"
        label="Пароль"
        type="password"
        placeholder="enter your password"
        control={control}
        error={errors.password?.message}
      />

      <Input
        name="confirmPassword"
        label="Подтвердите пароль"
        type="password"
        placeholder="confirm password"
        control={control}
        error={errors.confirmPassword?.message}
      />

      <Checkbox
        label="Запомнить меня"
        name="remember"
      />
    </form>
  )
}