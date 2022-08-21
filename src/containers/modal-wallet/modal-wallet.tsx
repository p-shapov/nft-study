import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';
import cn from 'classnames';
import { Connector } from 'wagmi';

import { ico_metamask } from 'assets/icons/metamask';
import svg_coinbase from 'assets/icons/coinbase.svg';
import { ico_coinbase } from 'assets/icons/coinbase';
import { ico_wallet_connect } from 'assets/icons/wallet-connect';
import svg_wallet_connect from 'assets/icons/wallet-connect.svg';
import { ico_chevron_left } from 'assets/icons/chevron-left';
import { ico_cross_circle } from 'assets/icons/cross-circle';
import { ico_refresh } from 'assets/icons/refresh';

import { Modal } from 'components/modal';
import { Button } from 'components/button';
import { IconButton } from 'components/icon-button';
import { LoaderLine } from 'components/loader-line';
import { QRCode } from 'components/qr-code';

import { useWallet } from 'services/ethereum';
import { useModal } from 'services/ui';

import { Errors, WalletIDs } from 'shared/constants';

import styles from './module.scss';

type Props = {
  title: string;
  children: ReactNode;
  isRoot?: boolean;
};

const ModalWallet: FC<Props> = observer(({ isRoot, title, children }) => {
  const { isConnected, discard } = useWallet(({ status, discard }) => ({
    isConnected: status === 'connected',
    discard,
  }));
  const { pop: popModal, clear: closeAllModals } = useModal(({ pop, clear }) => ({ pop, clear }));

  useEffect(() => {
    if (isConnected) closeAllModals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleBack = () => {
    popModal();
    discard();
  };

  const handleClose = () => {
    closeAllModals();
    if (!isConnected) discard();
  };

  return (
    <Modal className={cn(styles['wrapper'], isRoot && styles['wrapper--is_root'])}>
      <div className={styles['layout']}>
        <div className={styles['header']}>
          <div className={styles['back']}>
            <IconButton onClick={handleBack}>{ico_chevron_left}</IconButton>
          </div>
          <span className={styles['title']}>{title}</span>

          <IconButton onClick={handleClose}>{ico_cross_circle}</IconButton>
        </div>

        {children}
      </div>
    </Modal>
  );
});

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
        <Button key={connector.id} onClick={() => handleConnect(connector)} icon={walletIcons[connector.id]}>
          {connector.name}
        </Button>
      ))}
    </ModalWallet>
  );
});

export const ModalMetamask: FC = observer(() => {
  const {
    connector,
    connect,
    hasError,
    errorName = '',
    errorMessage = '',
  } = useWallet(({ error, connector, connect }) => ({
    connector,
    connect,
    hasError: !!error,
    errorName: error?.name,
    errorMessage: error?.message,
  }));

  const handleRetry = () => {
    if (connector) connect(connector);
  };

  return (
    <ModalWallet title="MetaMask">
      <div className={styles['metamask-logo']}>{ico_metamask}</div>
      {!hasError && (
        <div className={styles['description']}>
          <span className={styles['title']}>Requesting...</span>
          <div className={styles['loader']}>
            <LoaderLine />
          </div>
        </div>
      )}
      {hasError && (
        <div className={styles['description']}>
          <span className={styles['title']}>Request failed:</span>
          <span className={styles['error']}>{errorMessage}</span>
        </div>
      )}
      {hasError && errorName === Errors.WAGMI_USER_REJECTED_ERROR && (
        <div className={styles['retry']}>
          <IconButton onClick={handleRetry}>{ico_refresh}</IconButton>
        </div>
      )}
      {hasError && errorName === Errors.WAGMI_CONNECTOR_NOT_FOUND_ERROR && (
        <a className={styles['link']} href="https://metamask.io/" rel="noopener noreferrer" target="_blank">
          Get browser extension
        </a>
      )}
    </ModalWallet>
  );
});

export const ModalCoinbase: FC = observer(() => {
  const { qrUrl } = useWallet(({ error, qrUrl }) => ({
    qrUrl,
    hasError: !!error,
    errorMessage: error?.message,
  }));

  return (
    <ModalWallet title="Coinbase">
      <QRCode value={qrUrl || ''} src={svg_coinbase} />
      <div className={styles['description']}>
        <span className={styles['title']}>Requesting...</span>
        <div className={styles['loader']}>
          <LoaderLine />
        </div>
      </div>
    </ModalWallet>
  );
});

export const ModalWalletConnect: FC = observer(() => {
  const { qrUrl } = useWallet(({ error, qrUrl }) => ({
    qrUrl,
    hasError: !!error,
    errorMessage: error?.message,
  }));

  return (
    <ModalWallet title="Wallet Connect">
      <QRCode value={qrUrl || ''} src={svg_wallet_connect} />
      <div className={styles['description']}>
        <span className={styles['title']}>Requesting...</span>
        <div className={styles['loader']}>
          <LoaderLine />
        </div>
      </div>
    </ModalWallet>
  );
});
