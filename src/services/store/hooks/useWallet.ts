import { useStore } from './useStore';
import { Wallet } from '../wallet';

export const useWallet = <T = Wallet>(sel?: { (wallet: Wallet): T }) => {
  const wallet = useStore(({ wallet }) => wallet);

  return (sel?.(wallet) || wallet) as T;
};
