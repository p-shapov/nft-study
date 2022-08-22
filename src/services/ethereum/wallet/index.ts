import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect } from '@web3-react/walletconnect';
import { MetaMask } from '@web3-react/metamask';

import { LOCAL_STORAGE_KEY, WALLET_CONNECTOR_ID } from 'shared/constants';
import { provideError } from 'shared/utils/provideError';

export type WalletStatus = 'connected' | 'disconnected' | 'connecting';

export type WalletConnectorID = typeof WALLET_CONNECTOR_ID[keyof typeof WALLET_CONNECTOR_ID];

export type WalletConnector = CoinbaseWallet | WalletConnect | MetaMask;

export class Wallet {
  public get connectors() {
    return this._connectors;
  }

  public connector: WalletConnector | null = null;
  public provider: NonNullable<WalletConnector['provider']> | null = null;
  public account: string | null = null;
  public chainId: number | null = null;
  public status: WalletStatus = 'disconnected';
  public error: Error | null = null;

  public async connect(connectorId: WalletConnectorID) {
    const connector = this.connectors[connectorId].instance;

    this.setState({ connector, provider: connector.provider, status: 'connecting', error: null });

    try {
      await connector.activate();

      runInAction(() => this.setState({ status: 'connected' }));

      localStorage.setItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR, connectorId);
    } catch (error) {
      this.handleError(error);
      this.setState({ connector: null, provider: null, status: 'disconnected' });
    }
  }

  public async disconnect() {
    try {
      this.setState({ error: null });

      await this.connector?.deactivate?.();

      runInAction(() =>
        this.setState({
          connector: null,
          provider: null,
          account: null,
          chainId: null,
          status: 'disconnected',
        }),
      );

      localStorage.removeItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async reject() {
    this.setState({ connector: null, provider: null, status: 'disconnected' });
  }

  constructor() {
    makeAutoObservable(this, {
      connector: observable.ref,
      provider: observable.ref,
      account: observable.ref,
      chainId: observable.ref,
      status: observable.ref,
      error: observable.ref,
      connect: action.bound,
      disconnect: action.bound,
      reject: action.bound,
    });
    this.initWallet();
  }

  private setState({
    connector,
    provider,
    account,
    chainId,
    status,
    error,
  }: Partial<Omit<Wallet, 'connect' | 'disconnect' | 'reject' | 'connectors'>>) {
    connector !== undefined && (this.connector = connector);
    provider !== undefined && (this.provider = provider);
    account !== undefined && (this.account = account);
    chainId !== undefined && (this.chainId = chainId);
    status !== undefined && (this.status = status);
    error !== undefined && (this.error = error);
  }

  private handleUpdate = ({ accounts, chainId }: { accounts?: Array<string>; chainId?: number }) => {
    runInAction(() =>
      !!accounts?.length ? this.setState({ account: accounts[0], chainId }) : this.disconnect(),
    );
  };

  private handleError = (error: unknown) => {
    if (error instanceof Error) runInAction(() => this.setState({ error }));
  };

  private initWallet() {
    const connectorId = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR);

    if (connectorId) this.connect(connectorId as WalletConnectorID);
  }

  private actions = {
    startActivation: () => () => null,
    update: this.handleUpdate,
    reportError: provideError,
  };

  private readonly _connectors: Record<WalletConnectorID, { name: string; instance: WalletConnector }> = {
    [WALLET_CONNECTOR_ID.METAMASK]: {
      name: 'MetaMask',
      instance: new MetaMask(this.actions, false, { mustBeMetaMask: true }),
    },
    [WALLET_CONNECTOR_ID.COINBASE]: {
      name: 'Coinbase',
      instance: new CoinbaseWallet(
        this.actions,
        {
          appName: 'nft-study',
          headlessMode: true,
          url: '',
        },
        true,
      ),
    },
    [WALLET_CONNECTOR_ID.WALLET_CONNECT]: {
      name: 'WalletConnect',
      instance: new WalletConnect(this.actions, { qrcode: false }, true),
    },
  };
}
