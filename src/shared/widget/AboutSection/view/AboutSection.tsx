import React from "react";
import styles from "./AboutSection.module.scss";

export const AboutSection: React.FC = () => {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About company</h2>

        <p className={styles.subtitle}>
          «When applied to building block a website or similar work product,
          a Visual Guide can be an intermediate step toward the end goal of a
          complete website. By creating a visual guide along the way, the
          designer or developer can get input from the other people involved
          in the website such as the customer»
        </p>

        <div className={styles.imagesWrapper}>
          <div className={styles.imageLeft} />
          <div className={styles.imageRight} />
        </div>
      </div>
    </section>
  );
};

