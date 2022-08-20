import { FC } from 'react';

import { Button } from 'components/button';
import { Loader } from 'components/loader';

import styles from './module.scss';

export const UiKit: FC = () => {
  return (
    <div className={styles['container']}>
      <div className={styles['layout']}>
        <Button onClick={() => null}>Button</Button>
        <Button onClick={() => null} icon={<Loader />}>
          Button
        </Button>
      </div>
    </div>
  );
};
