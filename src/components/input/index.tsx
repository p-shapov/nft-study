import { FC } from 'react';
import cn from 'classnames';

import styles from './module.scss';

export type Props = {
  text: string;
  children?: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  theme?: 'default' | 'error';
  onChange(value: string): void;
};

export const Input: FC<Props> = ({
  text,
  children = '',
  type = 'text',
  placeholder = 'Fill me',
  theme = 'default',
  onChange,
}) => (
  <label className={cn(styles['root'], theme !== 'default' && styles[`root--theme_${theme}`])}>
    <span className={styles['text']}>{text}</span>
    <input
      className={styles['field']}
      type={type}
      value={children}
      placeholder={placeholder}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  </label>
);
