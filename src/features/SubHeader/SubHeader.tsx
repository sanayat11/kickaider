import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SubHeader.module.scss";

const sections = [
  { id: "team", label: "subHeader.team" },
  { id: "boost", label: "subHeader.boost" },
  { id: "slider", label: "subHeader.slider" },
  { id: "members", label: "subHeader.members" },
];

export const SubHeader = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToSection = (id: string, index: number) => {
    setIsScrolling(true);
    setActiveIndex(index);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      setIsScrolling(false);
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (!el) return;

        const rect = el.getBoundingClientRect();

        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  return (
    <div className={styles.subHeader}>
      <div className={styles.track}>
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>

      <div className={styles.buttons}>
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id, index)}
          >
            {t(section.label)}
          </button>
        ))}
      </div>
    </div>
  );
};