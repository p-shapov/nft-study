import { computed, flow, makeObservable, observable, runInAction } from 'mobx';
import type { Connector, ConnectorData } from '@wagmi/core';

import { PREFERRED_CHAIN_ID } from 'shared/constants';

import { WalletChain, WalletConnectorId, WalletLocalStorageKey, WalletStatus } from './types';
import { client, connectors, provider } from './client';

export class Wallet {
  public readonly connectors = connectors;

  public isReady = false;
  public account: string | null = null;
  public status: WalletStatus = 'disconnected';
  public chain: WalletChain | null = null;
  public error: string | null = null;

  public get provider() {
    if (this.chain?.id) return provider({ chainId: this.chain.id });

    return null;
  }

  public get connector() {
    const id = this.connectorId;

    if (id) {
      const connector = connectors[id];

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

  public readonly connect = flow(function* (
    this: Wallet,
    id: WalletConnectorId,
    chainId: number | null = PREFERRED_CHAIN_ID,
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
      } finally {
        if (this.status === 'connecting') this.setState({ status: 'disconnected' });
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

  public readonly storeConnection = (connection: Wallet['currentConnection']) => {
    this.currentConnection = connection;
  };

  constructor() {
    makeObservable(this, {
      provider: computed,
      connect: flow.bound,
      disconnect: flow.bound,
      isReady: observable.ref,
      account: observable.ref,
      status: observable.ref,
      chain: observable.struct,
      error: observable.ref,
    });
    this.initWallet();
  }

  private set currentConnection(value: Wallet['bufferedConnection']) {
    this.bufferedConnection?.cancel();
    this.bufferedConnection = value;
  }

  private bufferedConnection: ReturnType<Wallet['connect']> | null = null;

  private bufferedConnector: Connector | null = null;

  private get connectorId(): WalletConnectorId | null {
    return localStorage.getItem(WalletLocalStorageKey.CONNECTOR_ID) as WalletConnectorId | null;
  }

  private set connectorId(id: WalletConnectorId | null) {
    if (id) localStorage.setItem(WalletLocalStorageKey.CONNECTOR_ID, id);
    else localStorage.removeItem(WalletLocalStorageKey.CONNECTOR_ID);
  }

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
    runInAction(() => this.setState({ status: 'connected', ...data }));

    return true;
  };

  private handleDisconnect = () => {
    runInAction(() => this.setState({ status: 'disconnected', account: null, chain: null, error: null }));

    return true;
  };

  private handleChange = (data: ConnectorData) => {
    runInAction(() => this.setState(data));

    return true;
  };

  private handleError = (error: unknown) => {
    runInAction(() => this.setState({ error: error instanceof Error ? error.message : 'Unknown error' }));

    return true;
  };
}
