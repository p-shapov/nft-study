import { FC } from 'react';

import { ico_minus } from 'assets/icons/minus';
import { ico_plus } from 'assets/icons/plus';

import { IconButton } from 'components/icon-button';

import styles from './module.scss';

export type Props = {
  children: number;
  step?: number;
  min?: number;
  max?: number;
  formatValue?(value: number): string | number;
  onChange(value: number): void;
};

export const Counter: FC<Props> = ({
  children,
  step = 1,
  min = -Infinity,
  max = Infinity,
  formatValue = (x) => x,
  onChange,
}) => {
  const handleDecrease = () => {
    if (children >= min) onChange(children - step);
  };

  const handleIncrease = () => {
    if (children <= max) onChange(children + step);
  };

  return (
    <div className={styles['counter']}>
      <IconButton onClick={handleDecrease}>{ico_minus}</IconButton>
      <span className={styles['field']}>{formatValue(Math.max(Math.min(children, max), min))}</span>
      <IconButton onClick={handleIncrease}>{ico_plus}</IconButton>
    </div>
  );
};
