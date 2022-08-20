import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { configureChains, Connector, createClient, chain } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

import { SetNonNullable } from 'shared/types';

import { WalletChain, WalletStatus } from './types';

const { chains, provider, webSocketProvider } = configureChains([chain.goerli], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({ chains, options: { appName: 'nft-study' } }),
    new WalletConnectConnector({ chains, options: { qrcode: true } }),
  ],
  provider,
  webSocketProvider,
});

export class Wallet {
  public readonly connectors = client.connectors;

  public account: string | null = null;
  public chain: WalletChain | null = null;
  public connector: Connector | null = null;
  public error: string | null = null;
  public status: WalletStatus = 'disconnected';

  public async connect(connector: Connector) {
    try {
      if (this.connector) throw new Error('Already connected');

      this.setState({ status: 'connecting', error: null });

      const { account, chain } = await connector.connect();

      runInAction(() => this.handleConnect({ account, chain, connector }));
    } catch (err) {
      this.handleError(err);
    }
  }

  public async disconnect() {
    try {
      if (!this.connector) throw new Error('No active connection');

      this.setState({ error: null });

      await this.connector.disconnect();

      runInAction(this.handleDisconnect);
    } catch (err) {
      this.handleError(err);
    }
  }

  constructor() {
    makeAutoObservable(this, {
      account: observable.ref,
      chain: observable.ref,
      connector: observable.ref,
      error: observable.ref,
      status: observable.ref,
      connect: action.bound,
      disconnect: action.bound,
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
  }: Partial<Pick<Wallet, 'account' | 'chain' | 'connector' | 'status' | 'error'>>) {
    account !== undefined && (this.account = account);
    chain !== undefined && (this.chain = chain);
    connector !== undefined && (this.connector = connector);
    status !== undefined && (this.status = status);
    error !== undefined && (this.error = error);
  }

  private handleChange = ({ account, chain }: Partial<Pick<Wallet, 'account' | 'chain'>>) => {
    this.setState({
      account,
      chain,
    });
  };

  private handleConnect = ({
    account,
    chain,
    connector,
  }: SetNonNullable<Pick<Wallet, 'account' | 'chain' | 'connector'>>) => {
    this.subscribeTo(connector);
    this.setState({
      account,
      chain,
      connector,
      status: 'connected',
    });
  };

  private handleDisconnect = () => {
    if (this.connector) this.unsubscribeFrom(this.connector);
    this.setState({
      account: null,
      chain: null,
      connector: null,
      status: 'disconnected',
    });
  };

  private handleError = (err: unknown) => {
    this.setState({
      error: err instanceof Error ? err.message : 'Connection error',
      status: this.status === 'connecting' ? 'disconnected' : undefined,
    });
  };
}
