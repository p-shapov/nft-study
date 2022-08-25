export const WALLET_CONNECTOR_ID = {
  METAMASK: 'metamask_wallet',
  COINBASE: 'coinbase_wallet',
  WALLET_CONNECT: 'walletConnect_wallet',
} as const;

export const MODAL_KEY = {
  WALLET: 'wallet',
  ...WALLET_CONNECTOR_ID,
} as const;

export const LOCAL_STORAGE_KEY = {
  WALLET_CONNECTOR: 'wallet_connector',
} as const;

export const ROUTES = {
  HOME: '/',
  MINT: '/mint',
};

export const SUPPORTED_CHAIN_ID = 5;
