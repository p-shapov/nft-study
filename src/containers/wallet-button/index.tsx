import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from 'components/button';

import { useModal } from 'services/ui';
import { useWallet } from 'services/ethereum';

import { MODAL_KEY } from 'shared/constants';

import styles from './module.scss';

export type Props = {
  children?: ReactNode;
};

export const WalletButton: FC<Props> = observer(({ children = 'Connect wallet' }) => {
  const pushModal = useModal(({ push }) => push);
  const { isConnected, account, disconnect } = useWallet(({ status, account, disconnect }) => ({
    account,
    disconnect,
    isConnected: status === 'connected',
  }));

  const handleDisconnect = () => {
    disconnect();
  };

  const handleConnect = () => {
    pushModal(MODAL_KEY.WALLET);
  };

  return (
    <Button
      onClick={!isConnected ? handleConnect : handleDisconnect}
      inverse={isConnected}
      withSpinner={isConnected}
      shrink
    >
      {isConnected && (
        <>
          <span>
            {(account || 'Error').slice(0, 6)}...{(account || 'Error').slice(-5, -1)}
          </span>
          <span className={styles['uppercase']}>Disconnect</span>
        </>
      )}
      {!isConnected && children}
    </Button>
  );
});
