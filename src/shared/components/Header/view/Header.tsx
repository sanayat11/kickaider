import React from "react";
import styles from "./Header.module.scss";
import logo from "@/shared/assets/images/logo.svg"; 
export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src={logo} alt="KickAider Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>KickAider</span>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#">О компании</a>
          <a href="#">Возможности</a>
          <a href="#">FAQ</a>

          <div className={styles.lang}>
            Ru <span className={styles.arrow}>▾</span>
          </div>
        </nav>

        <button className={styles.button}>Войти</button>
      </div>
    </header>
  );
};
