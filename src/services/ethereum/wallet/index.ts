import { action, flow, makeAutoObservable, observable } from 'mobx';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect } from '@web3-react/walletconnect';
import { MetaMask } from '@web3-react/metamask';
import { CancellablePromise } from 'mobx/dist/internal';

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

  public readonly connect = flow(function* (this: Wallet, connectorId: WalletConnectorID) {
    const connector = this.connectors[connectorId].instance;

    this.setState({ connector, provider: connector.provider, status: 'connecting', error: null });

    try {
      this.connectPromise = yield connector.activate();

      this.setState({ status: 'connected' });

      localStorage.setItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR, connectorId);
    } catch (error) {
      this.handleError(error);
      this.setState({ connector: null, provider: null, status: 'disconnected' });
    }
  });

  public readonly disconnect = flow(function* (this: Wallet) {
    try {
      this.setState({ error: null });

      this.disconnectPromise = yield this.connector?.deactivate?.();

      this.setState({
        connector: null,
        provider: null,
        account: null,
        chainId: null,
        status: 'disconnected',
      });

      localStorage.removeItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR);
    } catch (error) {
      this.handleError(error);
    }
  });

  public readonly reject = () => {
    this.connectPromise?.cancel();
    this.disconnectPromise?.cancel();
    this.setState({ connector: null, provider: null, status: 'disconnected' });
  };

  constructor() {
    makeAutoObservable(this, {
      connector: observable.ref,
      provider: observable.ref,
      account: observable.ref,
      chainId: observable.ref,
      status: observable.ref,
      error: observable.ref,
      connect: flow.bound,
      disconnect: flow.bound,
      reject: action.bound,
    });
    this.initWallet();
  }

  private connectPromise: CancellablePromise<unknown> | null = null;
  private disconnectPromise: CancellablePromise<unknown> | null = null;

  private handleUpdate = ({ accounts, chainId }: { accounts?: Array<string>; chainId?: number }) => {
    if (!!accounts?.length) this.setState({ account: accounts[0], chainId });
    else this.disconnect();
  };

  private handleError = (error: unknown) => {
    if (error instanceof Error) this.setState({ error });
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
}
