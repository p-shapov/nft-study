import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';

import { useWallet } from 'services/ethereum';

import { Path, useGoTo } from 'shared/hooks/useGoTo';

import styles from './module.scss';

export const Mint: FC = observer(() => {
  const isDisconnected = useWallet((wallet) => computed(() => wallet.status === 'disconnected').get());
  const goToHome = useGoTo(true, Path.HOME);

  useEffect(() => {
    if (isDisconnected) goToHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected]);

  return <div className={styles['mint']}></div>;
});
