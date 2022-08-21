import { Modal } from '../modal';
import { useUI } from './useUI';

export const useModal = <T = Modal>(sel?: { (modal: Modal): T }) => {
  const modal = useUI(({ modal }) => modal);

  return (sel?.(modal) || modal) as T;
};
