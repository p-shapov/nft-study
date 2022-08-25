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

export const HEADER_NAV = [
  { href: 'change/me', text: 'About' },
  { href: 'change/me', text: 'Roadmap' },
  { href: 'change/me', text: 'Team' },
  { href: 'change/me', text: 'Gallery' },
];

export const FOOTER_NAV = [
  { href: 'change/me', text: 'Instagram' },
  { href: 'change/me', text: 'Discord' },
  { href: 'change/me', text: 'Facebook' },
  { href: 'change/me', text: 'Telegram' },
  { href: 'change/me', text: 'Be' },
];

export const SUPPORTED_CHAIN_ID = 5;
