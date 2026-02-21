import { useTranslation } from "react-i18next";
import styles from "./AboutSection.module.scss";

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("aboutSection.title")}</h2>

        <p className={styles.subtitle}>
          {t("aboutSection.subtitle")}
        </p>

        <div className={styles.imagesWrapper}>
          <div className={styles.imageLeft} />
          <div className={styles.imageRight} />
        </div>
      </div>
    </section>
  );
};

