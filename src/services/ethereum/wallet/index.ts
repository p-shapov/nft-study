// BUG :: Has collision between coinbase and metamask providers.
// BUG :: Unsupported chain reconnection does not work.
// TODO :: Make custom connectors.
// TODO :: Add error handling.

import { action, flow, makeAutoObservable, observable, runInAction } from 'mobx';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { WalletConnect } from '@web3-react/walletconnect';
import { MetaMask } from '@web3-react/metamask';
import type { Connector } from '@web3-react/types';

import { SUPPORTED_CHAIN_ID, LOCAL_STORAGE_KEY, WALLET_CONNECTOR_ID } from 'shared/constants';
import { provideError } from 'shared/utils/provideError';
import { ValueOf } from 'shared/types';

export type WalletStatus = 'connected' | 'disconnected' | 'connecting';
export type WalletConnectorID = ValueOf<typeof WALLET_CONNECTOR_ID>;

export class Wallet {
  public get connectors() {
    return this._connectors;
  }

  public get isSupported() {
    return !this.chainId || this.chainId === SUPPORTED_CHAIN_ID;
  }

  public getProvider() {
    return new Promise((res) => {
      setTimeout(() => res(this.connector?.provider || null));
    });
  }

  public getQrcode() {
    return new Promise<string | null>((res) => {
      setTimeout(() => {
        if (this.connector instanceof WalletConnect) res(this.connector.provider?.connector.uri || null);
        if (this.connector instanceof CoinbaseWallet) res(this.connector.provider?.qrUrl || null);

        res(null);
      });
    });
  }

  public isReady = false;
  public connector: Connector | null = null;
  public account: string | null = null;
  public chainId: number | null = null;
  public status: WalletStatus = 'disconnected';
  public error: Error | null = null;

  public readonly connect = flow(function* (
    this: Wallet,
    connectorId: WalletConnectorID,
    chainId: number | false = SUPPORTED_CHAIN_ID,
  ) {
    const connector = this.connectors[connectorId].instance;

    this.setState({ connector, status: 'connecting', error: null });

    try {
      yield connector.activate(chainId ? chainId : undefined);
      this.setState({ status: 'connected' });
      localStorage.setItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR, connectorId);
    } catch (error) {
      this.handleError(error);
    }
  });

  public readonly disconnect = flow(function* (this: Wallet) {
    this.setState({ error: null });

    try {
      yield this.connector?.deactivate?.();
      this.setState({ status: 'disconnected', account: null, chainId: null, connector: null });
      localStorage.removeItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR);
    } catch (error) {
      this.handleError(error);
    }
  });

  constructor() {
    makeAutoObservable(this, {
      isReady: observable.ref,
      connector: observable.ref,
      account: observable.ref,
      chainId: observable.ref,
      status: observable.ref,
      error: observable.ref,
      connect: flow.bound,
      disconnect: flow.bound,
      getQrcode: action.bound,
      getProvider: action.bound,
    });
    this.initWallet();
  }

  private async initWallet() {
    const connectorId = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR) as WalletConnectorID;

    if (connectorId) await this.connect(connectorId, false);

    runInAction(() => {
      this.isReady = true;
    });
  }

  private setState = ({
    connector,
    account,
    chainId,
    status,
    error,
  }: Partial<Omit<Wallet, 'connect' | 'disconnect' | 'reject' | 'connectors' | 'qrcode' | 'provider'>>) => {
    connector !== undefined && (this.connector = connector);
    account !== undefined && (this.account = account);
    chainId !== undefined && (this.chainId = chainId);
    status !== undefined && (this.status = status);
    error !== undefined && (this.error = error);
  };

  private handleUpdate = ({ accounts, chainId }: { accounts?: Array<string>; chainId?: number }) => {
    const account = accounts?.[0];
    const isDisconnected = !(account || chainId || !localStorage.getItem(LOCAL_STORAGE_KEY.WALLET_CONNECTOR));

    if (isDisconnected) this.disconnect();
    else this.setState({ chainId, account });
  };

  private handleError = (error: unknown) => {
    if (error instanceof Error) this.setState({ error });
  };

  private handleReport = (error?: Error) => {
    if (error) provideError(error);
  };

  private readonly actions = {
    startActivation: () => () => null,
    update: this.handleUpdate,
    reportError: this.handleReport,
  };

  private readonly _connectors: Record<WalletConnectorID, { name: string; instance: Connector }> = {
    [WALLET_CONNECTOR_ID.METAMASK]: {
      name: 'MetaMask',
      instance: new MetaMask(this.actions, false, {
        mustBeMetaMask: true,
      }) as Connector & MetaMask,
    },
    [WALLET_CONNECTOR_ID.COINBASE]: {
      name: 'Coinbase',
      instance: new CoinbaseWallet(this.actions, {
        appName: 'nft-study',
        headlessMode: true,
        reloadOnDisconnect: false,
        url: '',
      }) as Connector & CoinbaseWallet,
    },
    [WALLET_CONNECTOR_ID.WALLET_CONNECT]: {
      name: 'WalletConnect',
      instance: new WalletConnect(this.actions, {
        qrcode: false,
        chainId: SUPPORTED_CHAIN_ID,
      }) as Connector & WalletConnect,
    },
  };
}
