import { Modal } from '../ui';
import { useStore } from './useStore';

export const useModal = <T = Modal>(sel?: { (modal: Modal): T }) => {
  const modal = useStore(({ modal }) => modal);

  return (sel?.(modal) || modal) as T;
};
