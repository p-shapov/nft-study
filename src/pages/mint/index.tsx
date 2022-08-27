import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useWallet } from 'services/ethereum';

import { Path, useGoTo } from 'shared/hooks/useGoTo';

import styles from './module.scss';

export const Mint: FC = observer(() => {
  const isDisconnected = useWallet(({ status }) => status === 'disconnected');
  const goToHome = useGoTo(true, Path.HOME);

  useEffect(() => {
    if (isDisconnected) goToHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected]);

  return <div className={styles['mint']}></div>;
});
