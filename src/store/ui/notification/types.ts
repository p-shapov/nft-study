export type NotificationItem = {
  id: string;
  type: 'error' | 'message';
  title: string;
  message?: string;
  timeout?: number;
  tag?: string;
};
