export enum WalletIDs {
  METAMASK = 'metaMask',
  COINBASE = 'coinbaseWallet',
  WALLET_CONNECT = 'walletConnect',
}

export enum Modals {
  WALLET = 'wallet',
}

export enum Errors {
  WALLET_CONNECTION_ERROR = 'WalletConnectionError',
  WALLET_NO_ACTIVE_CONNECTION_ERROR = 'WalletNoActiveConnectionError',
  WALLET_QR_CODE_DOES_NOT_EXIST_ERROR = 'WalletQrDoesNotExistError',
  WALLET_ALREADY_CONNECTED_ERROR = 'WalletAlreadyConnectedError',

  WAGMI_CONNECTOR_NOT_FOUND_ERROR = 'ConnectorNotFoundError',
  WAGMI_USER_REJECTED_ERROR = 'UserRejectedRequestError',
}

export enum LocalStorageKeys {
  WAGMI_INJECTED_SHIM_DISCONNECT = 'wagmi.injected.shimDisconnect',
}
