import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import logo from "@/shared/assets/images/logo.svg";
import { LanguageSelector } from "@/features/languageSelector";
import { Button } from "@/shared/ui/button/view/Button";
import { paths } from "@/shared/constants/constants";
import { Typography } from "@/shared/ui";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <img src={logo} alt="KickAider Logo" className={styles.logoIcon} />
          <Typography context="landing" variant='h3' weight='bold'className={styles.logoText}>Metricon</Typography>
        </div>
        <nav className={styles.nav}>
          <a href="#about">{t("header.aboutCompany")}</a>
          <a href="#features">{t("header.features")}</a>
          <a href="#faq">{t("header.faq")}</a>


          <div className={styles.lang}>
            <LanguageSelector />
          </div>
        </nav>

        <Button type="link" size='giant' to={paths.AUTH} className={styles.button}>{t("header.login")}</Button>
      </div>
    </header>
  );
};
