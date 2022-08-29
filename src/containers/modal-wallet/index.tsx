import { observer } from 'mobx-react-lite';
import { FC, useEffect, useState } from 'react';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';

import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_metamask } from 'assets/icons/metamask';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';

import { QRCode } from 'components/qr-code';

import { useWallet } from 'services/ethereum';
import { WalletConnectorId } from 'services/ethereum/wallet/types';

import { objectEntries } from 'shared/utils/objectEntries';

import { Connection } from './connection';
import { ModalWallet } from './modal-wallet';
import styles from './module.scss';
import { WalletButton } from './wallet-button';

export const ModalConnect: FC = observer(() => {
  const connectorEntries = useWallet((wallet) => objectEntries(wallet.connectors));

  return (
    <ModalWallet title="Connect" isRoot>
      {connectorEntries.map(([id, connector]) => {
        return (
          <WalletButton key={id} id={id}>
            {connector.name}
          </WalletButton>
        );
      })}
    </ModalWallet>
  );
});

export const ModalMetamask: FC = () => {
  return (
    <ModalWallet title="MetaMask">
      <Connection id={WalletConnectorId.METAMASK}>
        <div className={styles['logo']}>{ico_metamask}</div>
      </Connection>
    </ModalWallet>
  );
};

export const ModalCoinbase: FC = observer(() => {
  const qrcode = useQrcode();

  return (
    <ModalWallet title="Coinbase">
      <Connection id={WalletConnectorId.COINBASE}>
        {qrcode && <QRCode value={qrcode} logo={ico_coinbase} />}
        {!qrcode && <div className={styles['logo']}>{ico_coinbase}</div>}
      </Connection>
    </ModalWallet>
  );
});

export const ModalWalletConnect: FC = () => {
  const qrcode = useQrcode();

  return (
    <ModalWallet title="Wallet Connect">
      <Connection id={WalletConnectorId.WALLET_CONNECT}>
        <QRCode value={qrcode || undefined} logo={ico_wallet_connect} />
      </Connection>
    </ModalWallet>
  );
};

const useQrcode = () => {
  const getQrcode = useWallet((wallet) => async () => {
    const provider = await wallet.getProvider();

    if (provider instanceof WalletConnectProvider) return provider.connector.uri || null;
    if (provider instanceof CoinbaseWalletProvider) return provider.qrUrl || null;

    return null;
  });
  const [qrcode, setQrcode] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    const asyncSetQrcode = async () => {
      const qrcode = await getQrcode();

      if (!canceled) setQrcode(qrcode);
    };

    setTimeout(() => asyncSetQrcode());

    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return qrcode;
};
