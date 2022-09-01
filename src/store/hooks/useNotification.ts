import { Notification } from '../ui';
import { useStore } from './useStore';

export const useNotification = <T = Notification>(sel?: { (notification: Notification): T }) => {
  const notification = useStore(({ notification }) => notification);

  return (sel?.(notification) || notification) as T;
};
