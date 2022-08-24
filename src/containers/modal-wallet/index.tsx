import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect, useState } from 'react';

import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_metamask } from 'assets/icons/metamask';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';

import { Button } from 'components/button';
import { QRCode } from 'components/qr-code';

import { useWallet } from 'services/ethereum';
import { useModal } from 'services/ui';
import { WalletConnectorID } from 'services/ethereum/wallet';

import { WALLET_CONNECTOR_ID } from 'shared/constants';

import { Connection } from './connection';
import { ModalWallet } from './modal-wallet';
import styles from './module.scss';

const walletIcons: Record<WalletConnectorID, ReactNode> = {
  [WALLET_CONNECTOR_ID.METAMASK]: ico_metamask,
  [WALLET_CONNECTOR_ID.COINBASE]: ico_coinbase,
  [WALLET_CONNECTOR_ID.WALLET_CONNECT]: ico_wallet_connect,
};

export const ModalConnect: FC = observer(() => {
  const { connectors, connect } = useWallet(({ status, connectors, connect }) => ({
    isDisconnected: status === 'disconnected',
    connectors,
    connect,
  }));
  const pushModal = useModal(({ push }) => push);

  const handleConnect = (id: WalletConnectorID) => {
    connect(id);
    pushModal(id);
  };

  return (
    <ModalWallet title="Connect" isRoot>
      {Object.entries(connectors).map(([id, { name }]) => {
        const walletConnectorId = id as WalletConnectorID;

        return (
          <Button
            key={id}
            onClick={() => handleConnect(walletConnectorId)}
            icon={walletIcons[walletConnectorId]}
            uppercase
          >
            {name}
          </Button>
        );
      })}
    </ModalWallet>
  );
});

export const ModalMetamask: FC = observer(() => {
  return (
    <ModalWallet title="MetaMask">
      <Connection id={WALLET_CONNECTOR_ID.METAMASK}>
        <div className={styles['logo']}>{ico_metamask}</div>
      </Connection>
    </ModalWallet>
  );
});

export const ModalCoinbase: FC = observer(() => {
  const getQrcode = useWallet(({ getQrcode }) => getQrcode);
  const [qrcode, setQrcode] = useState<string | null>(null);

  useEffect(() => {
    getQrcode().then(setQrcode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalWallet title="Coinbase">
      <Connection id={WALLET_CONNECTOR_ID.COINBASE}>
        {qrcode && <QRCode value={qrcode} logo={ico_coinbase} />}
        {!qrcode && <div className={styles['logo']}>{ico_coinbase}</div>}
      </Connection>
    </ModalWallet>
  );
});

export const ModalWalletConnect: FC = observer(() => {
  const getQrcode = useWallet(({ getQrcode }) => getQrcode);
  const [qrcode, setQrcode] = useState<string | null>(null);

  useEffect(() => {
    getQrcode().then(setQrcode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalWallet title="Wallet Connect">
      <Connection id={WALLET_CONNECTOR_ID.WALLET_CONNECT}>
        <QRCode value={qrcode || undefined} logo={ico_wallet_connect} />
      </Connection>
    </ModalWallet>
  );
});
