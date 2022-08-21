import { createContext, FC, ReactNode } from 'react';

import { Modal } from './modal';
import { UI } from './types';

export const UIContext = createContext<UI | null>(null);

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const modal = new Modal();

  return <UIContext.Provider value={{ modal }}>{children}</UIContext.Provider>;
};
