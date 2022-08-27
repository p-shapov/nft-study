import { FC, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from 'components/button';

import { useModal } from 'services/ui';
import { useWallet } from 'services/ethereum';

import { MODAL_KEY } from 'shared/constants';

import styles from './module.scss';

export type Props =
  | {
      type: 'connect';
      children: ReactNode;
    }
  | {
      type: 'disconnect';
    };

export const WalletButton: FC<Props> = observer((props) => {
  const pushModal = useModal(({ push }) => push);
  const { isConnected, account, disconnect } = useWallet(({ status, account, disconnect }) => ({
    account,
    disconnect,
    isConnected: status === 'connected',
  }));

  const handleClick = () => {
    switch (props.type) {
      case 'connect':
        return pushModal(MODAL_KEY.WALLET);
      case 'disconnect':
        return disconnect();
    }
  };

  return (
    <Button onClick={handleClick} inverse={isConnected} withSpinner={isConnected} shrink>
      {props.type === 'disconnect' && (
        <>
          {!!account && (
            <span>
              {account.slice(0, 6)}...{account.slice(-5, -1)}
            </span>
          )}

          <span className={styles['uppercase']}>Disconnect</span>
        </>
      )}
      {props.type === 'connect' && (props.children || 'Connect wallet')}
    </Button>
  );
});

export const ConnectButton: FC<{ children: ReactNode }> = (props) => (
  <WalletButton type="connect" {...props} />
);

export const DisconnectButton: FC<Omit<Props, 'type'>> = (props) => (
  <WalletButton type="disconnect" {...props} />
);
