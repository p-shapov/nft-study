import { useStore } from './useStore';
import { Wallet } from '../ethereum/wallet';

export const useWallet = <T = Wallet>(sel: { (wallet: Wallet): T } = (x) => x as unknown as T) => {
  const wallet = useStore(({ wallet }) => wallet);

  return sel(wallet);
};
