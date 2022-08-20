import { createContext, FC, ReactNode } from 'react';

import { Store } from './types';
import { Wallet } from './wallet';

export const StoreContext = createContext<Store | null>(null);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = new Wallet();

  return <StoreContext.Provider value={{ wallet }}>{children}</StoreContext.Provider>;
};
