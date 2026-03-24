import { useTranslation } from "react-i18next";
import styles from "./AboutSection.module.scss";
import { Typography } from "@/shared/ui";

export const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <Typography variant='h2' weight="bold" context="landing"  className={styles.title}>{t("aboutSection.title")}</Typography>

        <Typography variant='h5' context="landing" weight="regular" className={styles.subtitle}>
          {t("aboutSection.subtitle")}
        </Typography>

        <div className={styles.imagesWrapper}>
          <div className={styles.imageLeft} />
          <div className={styles.imageRight} />
        </div>
      </div>
    </section>
  );
};

