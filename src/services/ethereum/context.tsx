import { createContext, FC, ReactNode } from 'react';

import { DataProvider } from './data-provider';
import { Ethereum } from './types';
import { Wallet } from './wallet';

export const EthereumContext = createContext<Ethereum | null>(null);

export const EthereumProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = new Wallet();
  const dataProvider = new DataProvider(wallet);

  return <EthereumContext.Provider value={{ wallet, dataProvider }}>{children}</EthereumContext.Provider>;
};
