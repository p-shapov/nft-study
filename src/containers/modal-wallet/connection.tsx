import { FC, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';

import { ico_refresh } from 'assets/icons/refresh';

import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';

import { useWallet } from 'services/ethereum';
import { WalletConnectorId } from 'services/ethereum/wallet/types';

import styles from './module.scss';

export type Props = {
  id: WalletConnectorId;
  children: ReactNode;
};

export const Connection: FC<Props> = observer(({ id, children }) => {
  const { connect, hasError, errorMessage } = useWallet((wallet) => ({
    connect: wallet.connect,
    hasError: computed(() => !!wallet.error).get(),
    errorMessage: computed(() => wallet.error?.message).get(),
  }));

  useEffect(() => {
    const connection = connect(id);

    return () => connection.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRetry = () => connect(id);

  return (
    <>
      {children}
      {!hasError && (
        <div className={styles['description']}>
          <span className={styles['title']}>Requesting...</span>
          <div className={styles['loader']}>
            <LoaderLine />
          </div>
        </div>
      )}
      {hasError && (
        <>
          <div className={styles['description']}>
            <span className={styles['title']}>Request failed:</span>
            <span className={styles['error']}>{errorMessage}</span>
          </div>
          <div className={styles['retry']}>
            <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
          </div>
        </>
      )}
    </>
  );
});
