import { FormHint } from "@/shared/ui/formHint/view/FormHint"
import { Checkbox } from "@/shared/ui/checkbox/view/CheckBox"
import { useLoginForm } from "../model/useLoginForm"
import styles from "./LoginForm.module.scss"

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <label>Email</label>
      <input
        type="email"
        placeholder="example@gmail.com"
        {...register("email")}
      />
      {errors.email && (
        <FormHint type="error">{errors.email.message}</FormHint>
      )}

      <label>Пароль</label>
      <input
        type="password"
        placeholder="enter your password"
        {...register("password")}
      />

      {errors.password && (
        <FormHint type="error">{errors.password.message}</FormHint>
      )}

      <label>Подтвердите пароль</label>
      <input
        type="password"
        placeholder="confirm password"
        {...register("confirmPassword")}
      />

      {errors.confirmPassword && (
        <FormHint type="error">
          {errors.confirmPassword.message}
        </FormHint>
      )}

      <Checkbox
        label="Запомнить меня"
        {...register("remember")}
      />
    </form>
  )
}