import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect, useState } from 'react';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';

import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_metamask } from 'assets/icons/metamask';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';

import { Button } from 'components/button';
import { QRCode } from 'components/qr-code';

import { useWallet } from 'services/ethereum';
import { useModal } from 'services/ui';
import { WalletConnectorId } from 'services/ethereum/wallet';

import { WALLET_CONNECTOR_ID } from 'shared/constants';
import { objectEntries } from 'shared/utils/objectEntries';
import { useConsole } from 'shared/hooks/useConsole';

import { Connection } from './connection';
import { ModalWallet } from './modal-wallet';
import styles from './module.scss';

const walletIcons: Record<string, ReactNode> = {
  [WALLET_CONNECTOR_ID.METAMASK]: ico_metamask,
  [WALLET_CONNECTOR_ID.COINBASE]: ico_coinbase,
  [WALLET_CONNECTOR_ID.WALLET_CONNECT]: ico_wallet_connect,
};

export const ModalConnect: FC = observer(() => {
  const { connectorEntries, connect } = useWallet(({ connectors, connect }) => ({
    connectorEntries: objectEntries(connectors),
    connect,
  }));
  const pushModal = useModal(({ push }) => push);

  const handleConnect = (id: WalletConnectorId) => {
    connect(id);
    pushModal(id);
  };

  return (
    <ModalWallet title="Connect" isRoot>
      {connectorEntries.map(([id, connector]) => {
        return (
          <Button
            key={id}
            onClick={() => handleConnect(id as WalletConnectorId)}
            icon={walletIcons[id]}
            uppercase
          >
            {connector.name}
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
  const qrcode = useQrcode();

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
  const qrcode = useQrcode();

  useConsole(qrcode);

  return (
    <ModalWallet title="Wallet Connect">
      <Connection id={WALLET_CONNECTOR_ID.WALLET_CONNECT}>
        <QRCode value={qrcode || undefined} logo={ico_wallet_connect} />
      </Connection>
    </ModalWallet>
  );
});

const useQrcode = () => {
  const getQrcode = useWallet(({ getProvider }) => async () => {
    try {
      const provider = await getProvider();

      if (provider instanceof WalletConnectProvider) return provider.connector.uri || null;
      if (provider instanceof CoinbaseWalletProvider) return provider.qrUrl || null;

      return null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      return null;
    }
  });
  const [qrcode, setQrcode] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => getQrcode().then(setQrcode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return qrcode;
};
