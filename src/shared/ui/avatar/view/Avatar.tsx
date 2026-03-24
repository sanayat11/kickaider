import type { FC } from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.scss';
import type { AvatarProps } from '../types/Avatar';

export const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  initials,
  icon,
  size = 'md',
  status = 'none',
  className,
}) => {
  const renderContent = () => {
    if (src) {
      return <img src={src} alt={alt} className={styles.image} />;
    }

    if (initials) {
      return <span className={styles.initials}>{initials}</span>;
    }

    if (icon) {
      return <span className={styles.icon}>{icon}</span>;
    }

    return null;
  };

  return (
    <div
      className={classNames(
        styles.avatar,
        styles[size],
        {
          [styles.withStatus]: status !== 'none',
        },
        className,
      )}
    >
      {renderContent()}

      {status === 'online' && <span className={styles.status} />}
    </div>
  );
};