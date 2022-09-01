import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';

import { Notification, Props as NotificationProps } from 'components/notification';

import { useNotification } from 'store/hooks/useNotification';
import { NotificationItem } from 'store/ui';

import styles from './module.scss';

export const NotificationList = observer(() => {
  const {
    hasNotifications,
    stack,
    pop: popNotification,
  } = useNotification((notification) => ({
    hasNotifications: computed(() => notification.stack.length > 0),
    stack: notification.stack,
    pop: notification.pop,
  }));

  const createHandleClose = (item: NotificationItem) => () => popNotification(item);

  return (
    <>
      {hasNotifications && (
        <div className={styles['notification-list']}>
          {stack.map((item) => (
            <Notification
              key={item.id}
              theme={themeMap[item.type]}
              onClose={createHandleClose(item)}
              {...item}
            >
              {item.title}
            </Notification>
          ))}
        </div>
      )}
    </>
  );
});

const themeMap: Record<NotificationItem['type'], NonNullable<NotificationProps['theme']>> = {
  message: 'default',
  error: 'error',
};
