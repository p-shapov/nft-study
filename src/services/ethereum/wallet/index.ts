import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { configureChains, Connector, createClient, chain } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

import { SetNonNullable } from 'shared/types';

import { WalletChain, WalletStatus } from './types';
import {
  WalletAlreadyConnectedError,
  WalletConnectionError,
  WalletNoActiveConnectionError,
  WalletQrDoesNotExistError,
} from './errors';

const { chains, provider, webSocketProvider } = configureChains([chain.goerli], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({ chains, options: { appName: 'nft-study', headlessMode: true } }),
    new WalletConnectConnector({ chains, options: { qrcode: false } }),
  ],
  provider,
  webSocketProvider,
});

export class Wallet {
  public readonly connectors = client.connectors;

  public account: string | null = null;
  public chain: WalletChain | null = null;
  public connector: Connector | null = null;
  public error: Error | null = null;
  public status: WalletStatus = 'disconnected';
  public qrUrl: string | null = null;

  public async connect(connector: Connector) {
    try {
      if (this.connector && this.connector !== connector) throw new WalletAlreadyConnectedError();

      this.setState({ connector, status: 'connecting', error: null });

      const qrUrl = await this.getQrCodeFrom(connector);

      runInAction(() => this.setState({ qrUrl }));

      const { account, chain } = await connector.connect();

      runInAction(() => this.handleConnect({ account, chain }));
    } catch (err) {
      this.handleError(err);
    }
  }

  public async disconnect() {
    try {
      if (!this.connector) throw new WalletNoActiveConnectionError();

      this.setState({ error: null });

      await this.connector.disconnect();

      runInAction(this.handleDisconnect);
    } catch (err) {
      this.handleError(err);
    }
  }

  public async discard() {
    this.setState({ status: 'disconnected', connector: null, qrUrl: null, error: null });
  }

  constructor() {
    makeAutoObservable(this, {
      account: observable.ref,
      chain: observable.ref,
      connector: observable.ref,
      error: observable.ref,
      status: observable.ref,
      qrUrl: observable.ref,
      connect: action.bound,
      disconnect: action.bound,
      discard: action.bound,
    });
    this.initConnector();
  }

  private initConnector() {
    client.subscribe(
      ({ connector }) => connector,
      (connector) => {
        if (connector) this.connect(connector);
      },
    );
  }

  private subscribeTo(connector: Connector) {
    connector.on('change', this.handleChange);
    connector.on('disconnect', this.handleDisconnect);
  }

  private unsubscribeFrom(connector: Connector) {
    connector.off('change', this.handleChange);
    connector.off('disconnect', this.handleDisconnect);
  }

  private setState({
    account,
    chain,
    connector,
    status,
    error,
    qrUrl,
  }: Partial<Pick<Wallet, 'account' | 'chain' | 'connector' | 'error' | 'status' | 'qrUrl'>>) {
    account !== undefined && (this.account = account);
    chain !== undefined && (this.chain = chain);
    connector !== undefined && (this.connector = connector);
    status !== undefined && (this.status = status);
    error !== undefined && (this.error = error);
    qrUrl !== undefined && (this.qrUrl = qrUrl);
  }

  private handleChange = ({ account, chain }: Partial<Pick<Wallet, 'account' | 'chain'>>) => {
    this.setState({
      account,
      chain,
    });
  };

  private handleConnect = ({ account, chain }: SetNonNullable<Pick<Wallet, 'account' | 'chain'>>) => {
    if (this.connector) this.subscribeTo(this.connector);
    this.setState({
      account,
      chain,
      status: 'connected',
    });
  };

  private handleDisconnect = () => {
    if (this.connector) this.unsubscribeFrom(this.connector);
    this.setState({
      account: null,
      chain: null,
      connector: null,
      qrUrl: null,
      status: 'disconnected',
    });
  };

  private handleError = (error: unknown) => {
    this.setState({
      error: error instanceof Error ? error : new WalletConnectionError(),
      status: this.status === 'connecting' ? 'disconnected' : undefined,
    });
  };

  private getQrCodeFrom = async (connector: Connector) => {
    if (connector instanceof WalletConnectConnector) {
      const {
        connector: { uri },
      } = await connector.getProvider();

      return uri;
    }

    if (connector instanceof CoinbaseWalletConnector) {
      const { qrUrl } = await connector.getProvider();

      if (!qrUrl) throw new WalletQrDoesNotExistError();

      return qrUrl;
    }

    return null;
  };
}
