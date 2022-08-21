import { useContext } from 'react';

import { EthereumContext } from '../context';
import { Ethereum } from '../types';

export const useEthereum = <T = Ethereum>(sel: { (ethereum: Ethereum): T } = (x) => x as unknown as T) => {
  const ethereum = useContext(EthereumContext);

  if (!ethereum) throw new Error('Ethereum initialization error');

  return sel(ethereum);
};
