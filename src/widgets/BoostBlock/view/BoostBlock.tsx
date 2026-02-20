import React from "react";
import styles from "./BoostBlock.module.scss";
import imgLeft from "@/shared/assets/images/imgBoost.png";
import imgMain from "@/shared/assets/images/imgBoost2.png";
import imgBottomRight from "@/shared/assets/images/imgBoost3.png";
import imgTopRight from "@/shared/assets/images/imgBoost4.png";

export const BoostBlock: React.FC = () => {
  return (
    <section id="boost" className={styles.boost}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Boost your <br /> productivity
          </h2>

          <p className={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipiscing eli
            mattis sit phasellus mollis sit aliquam sit nullam.
          </p>

          <p className={styles.text}>
            Lorem ipsum dolor sit amet consectetur adipiscing eli
            mattis sit phasellus mollis sit aliquam sit nullam.
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