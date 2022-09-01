import { FC, useState } from 'react';
import cn from 'classnames';

import { ico_cross } from 'assets/icons/cross';

import { IconButton } from 'components/icon-button';

import { useTimeout } from 'shared/hooks/useTimeout';

import styles from './module.scss';

export type Props = {
  title: string;
  message?: string;
  theme?: 'error' | 'default';
  timeout?: number;
  onClose(): void;
};

export const Notification: FC<Props> = ({ title, message, theme = 'default', timeout = null, onClose }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => setHovered(false);

  useTimeout(onClose, hovered ? null : timeout);

  return (
    <div
      className={cn(styles['notification'], theme !== 'default' && styles[`notification--theme_${theme}`])}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles['title']}>{title}</span>
      <span className={styles['message']}>{message}</span>
      <div className={styles['close']}>
        <IconButton onClick={onClose}>{ico_cross}</IconButton>
      </div>
    </div>
  );
};
