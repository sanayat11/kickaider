import styles from "./AuthPage.module.scss"
import image from "@/shared/assets/images/imgAuth.png"
import logo from "@shared/assets/images/logo.svg"
import { LoginForm } from "@/features/auth/loginForm/view/LoginForm"
import { Button } from "@/shared/ui/button/view/Button"
import { paths } from "@/shared/constants/constants"
import { Calendar } from "@/shared/ui"

export const AuthPage = () => {
  return (
    <div className={styles.auth}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.card}>
            <div className={styles.logo}>
              <img src={logo} alt="Logo" />
              <span>KickAider</span>
            </div>

            <div className={styles.title}>
              <h1>Войти в аккаунт</h1>
            </div>

            <LoginForm />
            <Button type="link" to={paths.DASHBOARD} className={styles.button} size='giant' fullWidth>
              Войти
            </Button>
          </div>
          <Calendar/>
        </div>

        <div className={styles.right}>
          <img src={image} alt="img" />
        </div>
      </div>
    </div>
  )
} 