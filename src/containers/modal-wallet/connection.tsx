import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { ico_refresh } from 'assets/icons/refresh';

import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';

import { useWallet } from 'services/ethereum';

import { Errors } from 'shared/constants';

import styles from './module.scss';

export type Props = {
  children: ReactNode;
};

export const Connection: FC<Props> = observer(({ children }) => {
  const {
    connector,
    connect,
    hasError,
    errorName = '',
    errorMessage = '',
  } = useWallet(({ error, connector, connect }) => ({
    connector,
    connect,
    hasError: !!error,
    errorName: error?.name,
    errorMessage: error?.message,
  }));

  const handleRetry = () => {
    if (connector) connect(connector);
  };

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
      {hasError && errorName === Errors.WAGMI_USER_REJECTED_ERROR && (
        <div className={styles['retry']}>
          <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
        </div>
      )}
    </>
  );
});
