import { FC } from 'react';

import styles from './module.scss';

export type Props = {
  title: string;
  description?: string;
};

export const MintingForm: FC<Props> = () => {
  return (
    <form className={styles['minting-form']}>
      <dl className={styles['info']}>
        <div className={styles['info-item']}>
          <dt></dt>
          <dd></dd>
        </div>

        <div className={styles['info-item']}>
          <dt></dt>
          <dd></dd>
        </div>

        <div className={styles['info-item']}>
          <dt></dt>
          <dd></dd>
        </div>
      </dl>
    </form>
  );
};
