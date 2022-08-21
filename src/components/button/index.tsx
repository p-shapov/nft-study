import { FC, ReactNode } from 'react';

import styles from './module.scss';

export type Props = {
  type?: 'button' | 'submit';
  children: string;
  icon?: ReactNode;
  onClick(): void;
};

export const Button: FC<Props> = ({ type = 'button', children, icon, onClick }) => (
  <button type={type} className={styles['button']} onClick={onClick}>
    <span className={styles['text']}>{children}</span>
    {icon && <span className={styles['icon']}>{icon}</span>}
  </button>
);
