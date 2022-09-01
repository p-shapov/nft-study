import { DataProvider } from './data-provider';
import { Wallet } from './ethereum/wallet';
import { Modal, Notification } from './ui';

export type Store = {
  modal: Modal;
  notification: Notification;
  wallet: Wallet;
  dataProvider: DataProvider;
};
