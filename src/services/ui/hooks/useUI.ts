import { useContext } from 'react';

import { UIContext } from '../context';
import { UI } from '../types';

export const useUI = <T = UI>(sel?: { (ui: UI): T }) => {
  const ui = useContext(UIContext);

  if (!ui) throw new Error('UI initialization error');

  return (sel?.(ui) || ui) as T;
};
