import { createContext, FC, ReactNode } from 'react';

import { DataProvider } from './data-provider';
import { Store } from './types';
import { Wallet } from './ethereum';
import { Modal } from './ui';

export const StoreContext = createContext<Store | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const modal = new Modal();
  const wallet = new Wallet();
  const dataProvider = new DataProvider(wallet);

  return <StoreContext.Provider value={{ modal, wallet, dataProvider }}>{children}</StoreContext.Provider>;
};
