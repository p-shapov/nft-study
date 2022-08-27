import { action, flow, makeAutoObservable, observable, runInAction } from 'mobx';
import { createClient, configureChains } from '@wagmi/core';
import type { Connector, ConnectorData } from '@wagmi/core';
import { goerli } from '@wagmi/core/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';

import { WalletChain, WalletConnectorId, WalletLocalStorageKey, WalletStatus } from './types';

const { chains, provider, webSocketProvider } = configureChains([goerli], [publicProvider()]);

const connectors: Record<WalletConnectorId, Connector> = {
  [WalletConnectorId.METAMASK]: new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    },
  }),
  [WalletConnectorId.COINBASE]: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Metalamp NFT project',
      headlessMode: true,
      reloadOnDisconnect: false,
      chainId: goerli.id,
    },
  }),
  [WalletConnectorId.WALLET_CONNECT]: new WalletConnectConnector({
    chains,
    options: {
      qrcode: false,
      chainId: goerli.id,
    },
  }),
};

const client = createClient({
  autoConnect: true,
  connectors: Object.values(connectors),
  provider,
  webSocketProvider,
});

export class Wallet {
  public get connectors() {
    return connectors;
  }

  public async getProvider() {
    try {
      const provider = await this.connector?.getProvider();

      return provider || null;
    } catch (error) {
      this.handleError(error);

      return null;
    }
  }

  public async getSigner() {
    try {
      const signer = await this.connector?.getSigner();

      return signer || null;
    } catch (error) {
      this.handleError(error);

      return null;
    }
  }

  public isReady = false;
  public account: string | null = null;
  public chain: WalletChain | null = null;
  public status: WalletStatus = 'disconnected';
  public error: Error | null = null;

  public readonly connect = flow(function* (
    this: Wallet,
    id: WalletConnectorId,
    chainId: number | null = goerli.id,
  ) {
    this.connectorId = id;
    this.setState({ status: 'connecting', error: null });

    if (this.connector) {
      try {
        const data = yield this.connector.connect({ chainId: chainId || undefined });

        this.connector.emit('connect', data);
      } catch (error) {
        this.connectorId = null;
        this.handleError(error);
      }
    }
  });

  public readonly disconnect = flow(function* (this: Wallet) {
    this.setState({ error: null });

    if (this.connector) {
      try {
        yield this.connector.disconnect();

        this.connector.emit('disconnect');
        this.connectorId = null;
      } catch (error) {
        this.handleError(error);
      }
    }
  });

  constructor() {
    makeAutoObservable(this, {
      isReady: observable.ref,
      account: observable.ref,
      chain: observable.struct,
      status: observable.ref,
      error: observable.ref,
      connect: flow.bound,
      disconnect: flow.bound,
      getProvider: action.bound,
      getSigner: action.bound,
    });
    this.initWallet();
  }

  private get connectorId(): WalletConnectorId | null {
    return localStorage.getItem(WalletLocalStorageKey.CONNECTOR_ID) as WalletConnectorId | null;
  }

  private set connectorId(id: WalletConnectorId | null) {
    if (id) localStorage.setItem(WalletLocalStorageKey.CONNECTOR_ID, id);
    else localStorage.removeItem(WalletLocalStorageKey.CONNECTOR_ID);
  }

  private get connector() {
    const id = this.connectorId;

    if (id) {
      const connector = this.connectors[id];

      if (connector !== this.bufferedConnector) {
        this.bufferedConnector?.off('change', this.handleChange);
        this.bufferedConnector?.off('connect', this.handleConnect);
        this.bufferedConnector?.off('disconnect', this.handleDisconnect);
        this.bufferedConnector?.off('error', this.handleError);
        this.bufferedConnector = connector;

        connector.on('change', this.handleChange);
        connector.on('connect', this.handleConnect);
        connector.on('disconnect', this.handleDisconnect);
        connector.on('error', this.handleError);
      }

      return connector;
    }

    return null;
  }

  private bufferedConnector: Connector | null = null;

  private async initWallet() {
    if (this.connectorId) {
      if (client.status !== 'disconnected') await this.connect(this.connectorId, null);
      else if (client.status === 'disconnected') this.connectorId = null;
    }

    runInAction(() => (this.isReady = true));
  }

  private setState = ({
    account,
    chain,
    status,
    error,
  }: Partial<Pick<Wallet, 'account' | 'error' | 'chain' | 'status'>>) => {
    account !== undefined && (this.account = account);
    chain !== undefined && (this.chain = chain);
    status !== undefined && (this.status = status);
    error !== undefined && (this.error = error);
  };

  private handleConnect = (data: ConnectorData) => {
    this.setState({ status: 'connected', ...data });
  };

  private handleDisconnect = () => {
    this.setState({ status: 'disconnected', account: null, chain: null, error: null });
  };

  private handleChange = (data: ConnectorData) => {
    this.setState(data);
  };

  private handleError = (error: unknown) => {
    if (error instanceof Error) this.setState({ error });
  };
}
