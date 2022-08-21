import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';
import { Connector } from 'wagmi';

import svg_coinbase from 'assets/icons/coinbase.svg';
import svg_wallet_connect from 'assets/icons/wallet-connect.svg';
import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_metamask } from 'assets/icons/metamask';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';

import { Button } from 'components/button';
import { QRCode } from 'components/qr-code';

import { useWallet } from 'services/ethereum';
import { useModal } from 'services/ui';

import { WalletIDs } from 'shared/constants';

import { Connection } from './connection';
import { ModalWallet } from './modal-wallet';
import styles from './module.scss';

const walletIcons: Record<string, ReactNode> = {
  [WalletIDs.METAMASK]: ico_metamask,
  [WalletIDs.COINBASE]: ico_coinbase,
  [WalletIDs.WALLET_CONNECT]: ico_wallet_connect,
};

export const ModalConnect: FC = observer(() => {
  const { isDisconnected, connectors, connect } = useWallet(({ status, connectors, connect }) => ({
    isDisconnected: status === 'disconnected',
    connectors,
    connect,
  }));
  const pushModal = useModal(({ push }) => push);

  const handleConnect = (connector: Connector) => {
    if (isDisconnected) connect(connector);
    pushModal(connector.id);
  };

  return (
    <ModalWallet title="Connect" isRoot>
      {connectors.map((connector) => (
        <Button
          key={connector.id}
          onClick={() => handleConnect(connector)}
          icon={walletIcons[connector.id]}
          uppercase
        >
          {connector.name}
        </Button>
      ))}
    </ModalWallet>
  );
});

export const ModalMetamask: FC = observer(() => {
  return (
    <ModalWallet title="MetaMask">
      <Connection>
        <div className={styles['metamask-logo']}>{ico_metamask}</div>
      </Connection>
    </ModalWallet>
  );
});

export const ModalCoinbase: FC = observer(() => {
  const qrUrl = useWallet(({ qrUrl }) => qrUrl);

  return (
    <ModalWallet title="Coinbase">
      <Connection>
        <QRCode value={qrUrl || ''} src={svg_coinbase} />
      </Connection>
    </ModalWallet>
  );
});

export const ModalWalletConnect: FC = observer(() => {
  const qrUrl = useWallet(({ qrUrl }) => qrUrl);

  return (
    <ModalWallet title="Wallet Connect">
      <Connection>
        <QRCode value={qrUrl || ''} src={svg_wallet_connect} />
      </Connection>
    </ModalWallet>
  );
});
