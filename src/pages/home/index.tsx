import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { ConnectButton } from 'containers/connect-button';

import { useWallet } from 'services/ethereum';

import styles from './module.scss';

export const Home: FC = observer(() => {
  const { status, account, chainId, error } = useWallet();

  return (
    <div className={styles['container']}>
      <div className={styles['layout']}>
        <ConnectButton />
        status: {status} | account: {account} | chainId: {chainId} | error: {error?.message}
      </div>
    </div>
  );
});
