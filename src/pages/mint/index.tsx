import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';
import { formatEther } from 'ethers/lib/utils';

import { Button } from 'components/button';

import { Path, useGoTo } from 'shared/hooks/useGoTo';

import { useWallet } from 'store/hooks/useWallet';
import { useDataProvider } from 'store/hooks/useDataProvider';

import styles from './module.scss';

export const Mint: FC = observer(() => {
  const isDisconnected = useWallet((wallet) => computed(() => wallet.status === 'disconnected').get());
  const goToHome = useGoTo(true, Path.HOME);
  const balance = useDataProvider((data) => data.balance);

  useEffect(() => {
    if (isDisconnected) goToHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected]);

  return (
    <div className={styles['mint']}>
      <div className={styles['layout']}>
        <span>status: {balance.status}</span>
        <span>value: {balance.value ? formatEther(balance.value) : 'NaN'}</span>
        <span>error: {balance.error}</span>

        <Button
          onClick={async () => {
            //
          }}
        >
          test
        </Button>
      </div>
    </div>
  );
});
