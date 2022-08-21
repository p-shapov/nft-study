import { createContext, FC, ReactNode } from 'react';

import { Ethereum } from './types';
import { Wallet } from './wallet';

export const EthereumContext = createContext<Ethereum | null>(null);

export const EthereumProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = new Wallet();

  return <EthereumContext.Provider value={{ wallet }}>{children}</EthereumContext.Provider>;
};
