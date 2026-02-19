import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.scss';
import logo from '@/shared/assets/images/Frame 1321317829.svg';

export const Logo: FC = () => {
  return (
    <Link to="/" className={styles.logo} aria-label="Go to home page">
      <img src={logo} alt="Logo" className={styles.logo} />
    </Link>
  );
};
