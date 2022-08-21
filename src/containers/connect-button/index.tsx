import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from 'components/button';

import { useModal } from 'services/ui';
import { useWallet } from 'services/ethereum';

import { Modals } from 'shared/constants';

export const ConnectButton: FC = observer(() => {
  const pushModal = useModal(({ push }) => push);
  const { isConnected, account, disconnect } = useWallet(({ status, account, disconnect }) => ({
    account,
    disconnect,
    isConnected: status === 'connected',
  }));

  const handleDisconnect = () => disconnect();
  const handleConnect = () => pushModal(Modals.WALLET);

  return (
    <Button onClick={!isConnected ? handleConnect : handleDisconnect} inverse={isConnected} shrink>
      {isConnected && `${(account || 'Error').slice(0, 6)}...${(account || 'Error').slice(-5, -1)}`}
      {!isConnected && 'Connect wallet'}
    </Button>
  );
});
