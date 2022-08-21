import { FC, ReactElement } from 'react';

import styles from './module.scss';

export type Props = {
  children: ReactElement;
  onClick(): void;
};

export const IconButton: FC<Props> = ({ children, onClick }) => (
  <button className={styles['root']} onClick={onClick}>
    {children}
  </button>
);
