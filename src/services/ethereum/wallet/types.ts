export type WalletStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export type WalletChain = {
  id: number;
  unsupported: boolean;
};
