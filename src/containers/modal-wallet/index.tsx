import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { computed } from 'mobx';

import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_metamask } from 'assets/icons/metamask';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';

import { QRCode } from 'components/qr-code';

import { objectEntries } from 'shared/utils/object-entries';

import { WalletConnectorId } from 'store/ethereum';
import { useDataProvider } from 'store/hooks/useDataProvider';
import { useWallet } from 'store/hooks/useWallet';

import { Connection } from './connection';
import { ModalWallet } from './modal-wallet';
import { WalletButton } from './wallet-button';
import styles from './module.scss';

export const ModalConnect: FC = observer(() => {
  const connectors = useWallet((wallet) => objectEntries(wallet.connectors));

  return (
    <ModalWallet title="Connect" isRoot>
      {connectors.map(([id, connector]) => {
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
  const { qrcode, hasQrcode } = useDataProvider((data) => ({
    qrcode: data.qrcode.value,
    hasQrcode: computed(() => data.qrcode.status === 'succeed').get(),
  }));

  return (
    <ModalWallet title="Coinbase">
      <Connection id={WalletConnectorId.COINBASE}>
        {hasQrcode && <QRCode value={qrcode || undefined} logo={ico_coinbase} />}
        {!hasQrcode && <div className={styles['logo']}>{ico_coinbase}</div>}
      </Connection>
    </ModalWallet>
  );
});

export const ModalWalletConnect: FC = observer(() => {
  const qrcode = useDataProvider((data) => data.qrcode.value);

  return (
    <ModalWallet title="Wallet Connect">
      <Connection id={WalletConnectorId.WALLET_CONNECT}>
        <QRCode value={qrcode || undefined} logo={ico_wallet_connect} />
      </Connection>
    </ModalWallet>
  );
});
