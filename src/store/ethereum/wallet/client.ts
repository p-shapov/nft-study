import { configureChains, Connector, createClient } from '@wagmi/core';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { publicProvider } from '@wagmi/core/providers/public';

import { PREFERRED_CHAIN_ID, SUPPORTED_CHAINS } from 'shared/constants';

import { WalletConnectorId } from './types';

export const { chains, provider, webSocketProvider } = configureChains(SUPPORTED_CHAINS, [
  alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }),
  publicProvider(),
]);

export const connectors: Record<WalletConnectorId, Connector> = {
  [WalletConnectorId.METAMASK]: new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    },
  }),
  [WalletConnectorId.COINBASE]: new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Metalamp NFT project',
      headlessMode: true,
      reloadOnDisconnect: false,
      chainId: PREFERRED_CHAIN_ID,
    },
  }),
  [WalletConnectorId.WALLET_CONNECT]: new WalletConnectConnector({
    chains,
    options: {
      qrcode: false,
      chainId: PREFERRED_CHAIN_ID,
    },
  }),
};

export const client = createClient({
  autoConnect: true,
  connectors: Object.values(connectors),
  provider,
  webSocketProvider,
});
