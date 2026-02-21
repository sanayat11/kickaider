import { useTranslation } from "react-i18next";
import styles from "./MemberBlock.module.scss";
import img1 from "@/shared/assets/images/imgMember.png";
import img2 from "@/shared/assets/images/imgMember2.png";
import img3 from "@/shared/assets/images/imgMember3.png";

export const MemberBlock: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="members" className={styles.team}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("members.title")}</h2>

        <p className={styles.subtitle}>
          {t("members.subtitle")}
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <img src={img1} alt="" />
          </div>

          <div className={styles.card}>
            <img src={img2} alt="" />
          </div>

          <div className={styles.card}>
            <img src={img3} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};