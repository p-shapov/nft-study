import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { ico_refresh } from 'assets/icons/refresh';

import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';

import { PushError } from 'containers/push-notification';

import { WalletConnectorId } from 'store/ethereum';
import { useWallet } from 'store/hooks/useWallet';

import styles from './module.scss';

export type Props = {
  id: WalletConnectorId;
  children: ReactNode;
};

export const Connection: FC<Props> = observer(({ id, children }) => {
  const { connect, storeConnection, error } = useWallet((wallet) => ({
    connect: wallet.connect,
    storeConnection: wallet.storeConnection,
    error: wallet.error,
  }));

  const handleRetry = () => storeConnection(connect(id));

  return (
    <>
      {children}
      <div className={styles['content']}>
        {!error && (
          <>
            <span className={styles['title']}>Requesting...</span>
            <div className={styles['loader']}>
              <LoaderLine />
            </div>
          </>
        )}
        {error && (
          <>
            <span className={styles['title']}>Connection failed</span>
            <div className={styles['retry']}>
              <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
            </div>
          </>
        )}

        {error && (
          <PushError title="Wallet connection error" message={error} timeout={5000} tag="wallet-connection" />
        )}
      </div>
    </>
  );
});
