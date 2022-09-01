import { observer } from 'mobx-react-lite';
import { FC, ReactElement } from 'react';

import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_metamask } from 'assets/icons/metamask';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';

import { Button } from 'components/button';

import { ModalName } from 'store/ui';
import { WalletConnectorId } from 'store/ethereum';
import { useModal } from 'store/hooks/useModal';
import { useWallet } from 'store/hooks/useWallet';

const walletIcons: Record<WalletConnectorId, ReactElement> = {
  [WalletConnectorId.METAMASK]: ico_metamask,
  [WalletConnectorId.COINBASE]: ico_coinbase,
  [WalletConnectorId.WALLET_CONNECT]: ico_wallet_connect,
};

const walletModals: Record<WalletConnectorId, ModalName> = {
  [WalletConnectorId.METAMASK]: ModalName.METAMASK,
  [WalletConnectorId.COINBASE]: ModalName.COINBASE,
  [WalletConnectorId.WALLET_CONNECT]: ModalName.WALLET_CONNECT,
};

export type Props = {
  id: WalletConnectorId;
  children: string;
};

export const WalletButton: FC<Props> = observer(({ id, children }) => {
  const { connect, storeConnection } = useWallet((wallet) => ({
    connect: wallet.connect,
    storeConnection: wallet.storeConnection,
  }));
  const pushModal = useModal((modal) => modal.push);

  const handleConnect = () => {
    storeConnection(connect(id));
    pushModal(walletModals[id]);
  };

  return (
    <Button onClick={handleConnect} icon={walletIcons[id]} uppercase>
      {children}
    </Button>
  );
});
