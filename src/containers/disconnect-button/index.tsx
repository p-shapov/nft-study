import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from 'components/button';

import { useWallet } from 'services/ethereum';

import styles from './module.scss';

export const DisconnectButton: FC = observer(() => {
  const { account, disconnect } = useWallet((wallet) => ({
    account: wallet.account,
    disconnect: wallet.disconnect,
  }));

  const handleClick = () => {
    disconnect();
  };

  const trimmedAccount = account && `${account.slice(0, 6)}…${account.slice(-5, -1)}`;

  return (
    <div className={styles['disconnect-button']}>
      <Button onClick={handleClick} inverse withSpinner={!!trimmedAccount}>
        {!!trimmedAccount && <span>{trimmedAccount}</span>}

        <span>Disconnect</span>
      </Button>
    </div>
  );
});
