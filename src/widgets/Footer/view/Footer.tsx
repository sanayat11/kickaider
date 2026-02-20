import React from "react";
import styles from "./Footer.module.scss";
import logo from "@/shared/assets/images/logo.svg";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoIcon} />
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
            <a href="#" className={styles.social}>
                <FaFacebookF />
            </a>
            <a href="#" className={styles.social}>
                <FaTwitter />
            </a>
            <a href="#" className={styles.social}>
                <FaInstagram />
            </a>
            <a href="#" className={styles.social}>
                <FaLinkedinIn />
            </a>
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
