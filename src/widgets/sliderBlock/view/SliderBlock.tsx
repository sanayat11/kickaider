import type { FC } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SliderBlock.module.scss';
import { Typography } from '@/shared/ui/typoghraphy/view/Typography';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
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
    { id: 6, image: placeholderImage, alt: 'Slide 6' },
];

export const SliderBlock: FC = () => {
    const { t } = useTranslation();
    const trackRef = useRef<HTMLDivElement>(null);


    const handleScroll = (direction: 'left' | 'right') => {
        if (trackRef.current) {
            const container = trackRef.current;
            const scrollAmount = container.clientWidth / (window.innerWidth < 600 ? 1 : window.innerWidth < 1024 ? 2 : 3);
            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section id="slider" className={styles.sliderBlock}>
            <div className={styles.sliderWrapper} ref={trackRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                <div className={styles.track} style={{ width: 'max-content' }}>

                    {slides.map((slide) => (
                        <div key={slide.id} className={styles.slide} style={{ scrollSnapAlign: 'start' }}>
                            <img src={slide.image} alt={slide.alt} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.bottomContent}>
                <div className={styles.textContent}>
                    <Typography variant="h2" weight="bold" className={styles.title}>
                        {t('carousel.title')}
                    </Typography>
                    <Typography variant="h5" weight="regular" className={styles.description}>
                        {t('carousel.text')}
                    </Typography>
                </div>

                <div className={styles.controls}>
                    <button
                        className={styles.controlButton}
                        onClick={() => handleScroll('left')}
                        aria-label="Previous slide"
                    >
                        <MdChevronLeft size={24} />
                    </button>
                    <button
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
