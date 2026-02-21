import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.scss';
import classNames from 'classnames';

export const LanguageSelector: FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentLang = i18n.language === 'en' ? 'En' : 'Ru';

    const toggleOpen = () => setIsOpen(!isOpen);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.selected} onClick={toggleOpen}>
                {currentLang}
                <span className={classNames(styles.arrow, { [styles.open]: isOpen })}>▾</span>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div
                        className={classNames(styles.option, { [styles.active]: i18n.language === 'ru' })}
                        onClick={() => changeLanguage('ru')}
                    >
                        Ru
                    </div>
                    <div
                        className={classNames(styles.option, { [styles.active]: i18n.language === 'en' })}
                        onClick={() => changeLanguage('en')}
                    >
                        En
                    </div>
                </div>
            )}
        </div>
    );
};
