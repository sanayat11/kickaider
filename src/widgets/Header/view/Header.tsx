import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import logo from "@/shared/assets/images/logo.svg";
import { LanguageSelector } from "@/features/languageSelector";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <img src={logo} alt="KickAider Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>KickAider</span>
        </div>
        <nav className={styles.nav}>
          <a href="#">{t("header.aboutCompany")}</a>
          <a href="#">{t("header.features")}</a>
          <a href="#">{t("header.faq")}</a>


          <div className={styles.lang}>
            <LanguageSelector />
          </div>
        </nav>

        <button className={styles.button}>{t("header.login")}</button>
      </div>
    </header>
  );
};
