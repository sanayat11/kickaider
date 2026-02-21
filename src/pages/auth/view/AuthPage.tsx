import styles from "./AuthPage.module.scss"
import image from "@/shared/assets/images/imgAuth.png"
import logo from "@shared/assets/images/logo.svg"
import { LoginForm } from "@/features/auth/loginForm/view/LoginForm"
import { Button } from "@/shared/ui/button/view/Button"

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
              <p>
                Смотрите фильмы и мультфильмы в оригинальной озвучке.
                Продолжайте просмотр с любого устройства.
              </p>
            </div>

            <LoginForm />
            <Button className={styles.button} size="fullWidth">
              Войти
            </Button>
          </div>
        </div>

        <div className={styles.right}>
          <img src={image} alt="img" />
        </div>
      </div>
    </div>
  )
} 