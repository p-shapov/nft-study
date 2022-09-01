import { FC, ReactNode, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { v4 } from 'uuid';

import { ico_refresh } from 'assets/icons/refresh';

import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';

import { WalletConnectorId } from 'store/ethereum';
import { useWallet } from 'store/hooks/useWallet';
import { useNotification } from 'store/hooks/useNotification';
import { NotificationItem } from 'store/ui';

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
  const pushError = useNotification(
    (notification) => (item: Omit<NotificationItem, 'type'>) => notification.push({ type: 'error', ...item }),
  );

  const handleRetry = () => storeConnection(connect(id));

  useEffect(() => {
    if (error)
      pushError({
        id: v4(),
        title: 'Wallet connection error',
        message: error,
        timeout: 10000,
        tag: 'wallet-connection-error',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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
            <span className={styles['title']}>Connection error</span>
            <div className={styles['retry']}>
              <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
            </div>
          </>
        )}
      </div>
    </>
  );
});
