import { useTranslation, Trans } from "react-i18next";
import styles from "./BoostBlock.module.scss";
import imgLeft from "@/shared/assets/images/imgBoost.png";
import imgMain from "@/shared/assets/images/imgBoost2.png";
import imgBottomRight from "@/shared/assets/images/imgBoost3.png";
import imgTopRight from "@/shared/assets/images/imgBoost4.png";

export const BoostBlock: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="boost" className={styles.boost}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            <Trans i18nKey="boost.title" />
          </h2>

          <p className={styles.text}>
            {t("boost.text1")}
          </p>

          <p className={styles.text}>
            {t("boost.text2")}
          </p>
        </div>

        <div className={styles.images}>
          <img src={imgLeft} alt="" className={styles.imageLeft} />
          <img src={imgMain} alt="" className={styles.imageMain} />
          <img src={imgTopRight} alt="" className={styles.imageTopRight} />
          <img src={imgBottomRight} alt="" className={styles.imageBottomRight} />
        </div>

      </div>
    </section>
  );
};