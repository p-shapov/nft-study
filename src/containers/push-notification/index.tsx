import { FC, useEffect } from 'react';
import { v4 } from 'uuid';

import { useNotification } from 'store/hooks/useNotification';
import { NotificationItem } from 'store/ui';

export type Props = Omit<NotificationItem, 'id'>;

export const PushNotification: FC<Props> = ({ type, title, message, timeout, tag }) => {
  const { push, pop } = useNotification((notification) => ({
    push: notification.push,
    pop: notification.pop,
  }));

  useEffect(() => {
    const notification = {
      id: v4(),
      type,
      title,
      message,
      timeout,
      tag,
    };

    push(notification);

    return () => pop(notification);
  }, [message, pop, push, tag, timeout, title, type]);

  return null;
};

export const PushError: FC<Omit<Props, 'type'>> = (props) => <PushNotification type="error" {...props} />;

export const PushMessage: FC<Omit<Props, 'type'>> = (props) => <PushNotification type="message" {...props} />;
