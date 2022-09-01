import { useContext } from 'react';

import { StoreContext } from '../context';
import { Store } from '../types';

export const useStore = <T = Store>(sel: { (store: Store): T } = (x) => x as unknown as T) => {
  const store = useContext(StoreContext);

  if (!store) throw new Error('Store initialization error');

  return sel(store);
};
