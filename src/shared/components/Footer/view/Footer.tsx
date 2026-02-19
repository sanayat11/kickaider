import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.logo}>
            <div className={styles.logoCircle} />
            <span className={styles.logoText}>KickAider</span>
          </div>

          <nav className={styles.nav}>
            <a href="#">О компании</a>
            <a href="#">Возможности</a>
            <a href="#">FAQ</a>
            <div className={styles.lang}>
              Ru <span className={styles.arrow}>▾</span>
            </div>
          </nav>

          <div className={styles.socials}>
            <a href="#" className={styles.social}>f</a>
            <a href="#" className={styles.social}>t</a>
            <a href="#" className={styles.social}>ig</a>
            <a href="#" className={styles.social}>in</a>
          </div>
        </div>

        <div className={styles.line} />

        <div className={styles.bottom}>
          Copyright © 2026 KickAider | All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;