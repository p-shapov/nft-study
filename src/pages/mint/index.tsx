import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useWallet } from 'services/ethereum';

import { ROUTES } from 'shared/constants';
import { useGoTo } from 'shared/hooks/useGoTo';

import styles from './module.scss';

export const Mint: FC = () => <Content />;

const Content = observer(() => {
  const isDisconnected = useWallet(({ status }) => status === 'disconnected');
  const goToHome = useGoTo(true, ROUTES.HOME);

  useEffect(() => {
    if (isDisconnected) goToHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected]);

  return (
    <div className={styles['container']}>
      <div className={styles['layout']}>Minting page</div>
    </div>
  );
});
