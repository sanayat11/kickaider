import type { FC } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import styles from './SliderBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';

import placeholderImage from '@/shared/assets/images/1.png';
import placeholderImage2 from '@/shared/assets/images/2.png';
import placeholderImage3 from '@/shared/assets/images/Container.png';
import placeholderImage4 from '@/shared/assets/images/Frame 116.png';

const slides = [
  { id: 1, image: placeholderImage, alt: 'Slide 1' },
  { id: 2, image: placeholderImage2, alt: 'Slide 2' },
  { id: 3, image: placeholderImage3, alt: 'Slide 3' },
  { id: 4, image: placeholderImage4, alt: 'Slide 4' },
  { id: 5, image: placeholderImage, alt: 'Slide 5' },
  { id: 6, image: placeholderImage2, alt: 'Slide 6' },
];

export const SliderBlock: FC = () => {
  const { t } = useTranslation();
  const sliderRef = useRef<HTMLDivElement>(null);

  const getSlidesPerView = () => {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = sliderRef.current;
    if (!container) return;

    const firstSlide = container.querySelector<HTMLElement>(`.${styles.slide}`);
    if (!firstSlide) return;

    const gap = 24;
    const slidesPerView = getSlidesPerView();
    const scrollStep = (firstSlide.offsetWidth + gap) * slidesPerView;

    container.scrollBy({
      left: direction === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth',
    });
  };

  return (
    <section id="slider" className={styles.sliderBlock}>
      <div className={styles.sliderWrapper} ref={sliderRef}>
        {slides.map((slide) => (
          <article key={slide.id} className={styles.slide}>
            <img className={styles.slideImage} src={slide.image} alt={slide.alt} />
          </article>
        ))}
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.titleWrap}>
          <Typography variant="h4" weight="bold" context='landing'className={styles.title}>
            {t('carousel.title')}
          </Typography>
        </div>

        <div className={styles.descriptionWrap}>
          <Typography variant="h5" weight="regular" className={styles.description}>
            {t('carousel.text')}
          </Typography>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => handleScroll('left')}
            aria-label="Previous slide"
          >
            <MdChevronLeft size={24} />
          </button>

          <button
            type="button"
            className={styles.controlButton}
            onClick={() => handleScroll('right')}
            aria-label="Next slide"
          >
            <MdChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};
