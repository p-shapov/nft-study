import { useEthereum } from './useEthereum';
import { Wallet } from '../wallet';

export const useWallet = <T = Wallet>(sel: { (wallet: Wallet): T } = (x) => x as unknown as T) => {
  const wallet = useEthereum(({ wallet }) => wallet);

  return sel(wallet);
};
