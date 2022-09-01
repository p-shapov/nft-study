import { createContext, FC, ReactNode } from 'react';

import { DataProvider } from './data-provider';
import { Store } from './types';
import { Wallet } from './ethereum';
import { Modal, Notification } from './ui';

export const StoreContext = createContext<Store | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const modal = new Modal();
  const notification = new Notification();
  const wallet = new Wallet();
  const dataProvider = new DataProvider(wallet);

  return (
    <StoreContext.Provider value={{ modal, notification, wallet, dataProvider }}>
      {children}
    </StoreContext.Provider>
  );
};
