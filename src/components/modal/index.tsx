import { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './module.scss';

export type Props = {
  children: ReactNode;
  className?: string;
  onBackdropClick?(): void;
};

export const Modal: FC<Props> = ({ children, className, onBackdropClick }) => (
  <div className={styles['backdrop']} onClick={onBackdropClick}>
    <div className={cn(styles['wrapper'], className)} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);
