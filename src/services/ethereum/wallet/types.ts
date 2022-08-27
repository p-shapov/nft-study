export type WalletStatus = 'connected' | 'disconnected' | 'connecting';

export type WalletChain = {
  id: number;
  unsupported: boolean;
};

export enum WalletConnectorId {
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
  WALLET_CONNECT = 'wallet_connect',
}

export enum WalletLocalStorageKey {
  CONNECTOR_ID = '--wallet_connector_id',
}
