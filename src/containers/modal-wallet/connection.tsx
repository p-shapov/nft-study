import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { ico_refresh } from 'assets/icons/refresh';

import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';

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
      {!error && (
        <div className={styles['description']}>
          <span className={styles['title']}>Requesting...</span>
          <div className={styles['loader']}>
            <LoaderLine />
          </div>
        </div>
      )}
      {error && (
        <>
          <div className={styles['description']}>
            <span className={styles['title']}>Request failed:</span>
            <span className={styles['error']}>{error}</span>
          </div>
          <div className={styles['retry']}>
            <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
          </div>
        </>
      )}
    </>
  );
});
