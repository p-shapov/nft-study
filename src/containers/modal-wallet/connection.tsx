import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { ico_refresh } from 'assets/icons/refresh';

import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';

import { useWallet } from 'services/ethereum';
import { WalletConnectorID } from 'services/ethereum/wallet';

import styles from './module.scss';

export type Props = {
  id: WalletConnectorID;
  children: ReactNode;
};

export const Connection: FC<Props> = observer(({ id, children }) => {
  const {
    connect,
    hasError,
    errorMessage = '',
  } = useWallet(({ error, connector, connect }) => ({
    connect,
    connector,
    hasError: !!error,
    errorMessage: error?.message,
  }));

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
        <div className={styles['description']}>
          <span className={styles['title']}>Request failed:</span>
          <span className={styles['error']}>{errorMessage}</span>
        </div>
      )}
      {hasError && (
        <div className={styles['retry']}>
          <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
        </div>
      )}
    </>
  );
});
