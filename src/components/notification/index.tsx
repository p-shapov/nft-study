import { FC } from 'react';
import cn from 'classnames';

import { ico_cross } from 'assets/icons/cross';

import { IconButton } from 'components/icon-button';

import { useTimeout } from 'shared/hooks/useTimeout';

import styles from './module.scss';

export type Props = {
  children: string;
  message?: string;
  theme?: 'error' | 'default';
  timeout?: number;
  onClose(): void;
};

export const Notification: FC<Props> = ({
  children,
  message,
  theme = 'default',
  timeout = null,
  onClose,
}) => {
  useTimeout(onClose, timeout);

  return (
    <div
      className={cn(styles['notification'], theme !== 'default' && styles[`notification--theme_${theme}`])}
    >
      <span className={styles['title']}>{children}</span>
      <span className={styles['message']}>{message}</span>
      <div className={styles['close']}>
        <IconButton onClick={onClose}>{ico_cross}</IconButton>
      </div>
    </div>
  );
};
