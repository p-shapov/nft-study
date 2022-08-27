// TODO :: Add error handling.

import { action, flow, makeAutoObservable, observable, runInAction } from 'mobx';
import { createClient, configureChains } from '@wagmi/core';
import type { ConnectorData } from '@wagmi/core';
import { goerli } from '@wagmi/core/chains';
import { publicProvider } from '@wagmi/core/providers/public';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';

import { LOCAL_STORAGE_KEY, WALLET_CONNECTOR_ID } from 'shared/constants';

export type WalletStatus = 'connected' | 'disconnected' | 'connecting';
export type WalletConnectorId = keyof typeof connectors;

const { chains, provider, webSocketProvider } = configureChains([goerli], [publicProvider()]);

const connectors = {
  [WALLET_CONNECTOR_ID.METAMASK]: new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    },
  }),
  [WALLET_CONNECTOR_ID.COINBASE]: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Metalamp NFT project',
      headlessMode: true,
      reloadOnDisconnect: false,
      chainId: goerli.id,
    },
  }),
  [WALLET_CONNECTOR_ID.WALLET_CONNECT]: new WalletConnectConnector({
    chains,
    options: {
      qrcode: false,
      chainId: goerli.id,
    },
  }),
} as const;

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
  public chain: { id: number; unsupported: boolean } | null = null;
  public status: WalletStatus = 'disconnected';
  public error: Error | null = null;

  public readonly connect = flow(function* (
    this: Wallet,
    id: WalletConnectorId,
    chainId: number | null = goerli.id,
  ) {
    this.connectorId = id;
    this.setState({ status: 'connecting', error: null });

    try {
      if (this.connector) {
        const data = yield this.connector.connect({ chainId: chainId || undefined });

        this.connector.on('change', this.handleChange);
        this.connector.on('connect', this.handleConnect);
        this.connector.on('disconnect', this.handleDisconnect);
        this.connector.on('error', this.handleError);
        this.connector.emit('connect', data);
      }
    } catch (error) {
      this.setState({ status: 'disconnected' });
      this.handleError(error);
    }
  });

  public readonly disconnect = flow(function* (this: Wallet) {
    this.setState({ error: null });

    try {
      if (this.connector) {
        yield this.connector.disconnect();

        this.connector.emit('disconnect');
      }
    } catch (error) {
      this.handleError(error);
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
    return localStorage.getItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR) as WalletConnectorId | null;
  }

  private set connectorId(id: WalletConnectorId | null) {
    if (id) localStorage.setItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR, id);
    else localStorage.removeItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR);
  }

  private get connector() {
    const id = this.connectorId;

    if (id) return this.connectors[id];

    return null;
  }

  private async initWallet() {
    if (this.connectorId && client.status !== 'disconnected') await this.connect(this.connectorId, null);
    if (client.status === 'disconnected') this.connectorId = null;

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

    if (this.connector) {
      this.connector.off('change', this.handleChange);
      this.connector.off('connect', this.handleConnect);
      this.connector.off('disconnect', this.handleDisconnect);
      this.connector.off('error', this.handleError);
    }

    this.connectorId = null;
  };

  private handleChange = (data: ConnectorData) => {
    this.setState(data);
  };

  private handleError = (error: unknown) => {
    if (error instanceof Error) this.setState({ error });
  };
}
