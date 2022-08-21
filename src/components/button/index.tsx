import cn from 'classnames';
import { FC, ReactNode } from 'react';

import styles from './module.scss';

export type Props = {
  type?: 'button' | 'submit';
  children: ReactNode;
  icon?: ReactNode;
  inverse?: boolean;
  uppercase?: boolean;
  shrink?: boolean;
  withSpinner?: boolean;
  onClick(): void;
};

export const Button: FC<Props> = ({
  type = 'button',
  children,
  icon,
  inverse,
  uppercase,
  shrink,
  withSpinner,
  onClick,
}) => (
  <button
    type={type}
    className={cn(
      styles['button'],
      inverse && styles['button--inverse'],
      uppercase && styles['button--uppercase'],
      shrink && styles['button--shrink'],
      withSpinner && styles['button--with-spinner'],
    )}
    onClick={onClick}
  >
    <span className={styles['text']}>{children}</span>
    {icon && <span className={styles['icon']}>{icon}</span>}
  </button>
);
