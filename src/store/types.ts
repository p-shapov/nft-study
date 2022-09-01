import { DataProvider } from './data-provider';
import { Wallet } from './ethereum/wallet';
import { Modal } from './ui';

export type Store = {
  modal: Modal;
  wallet: Wallet;
  dataProvider: DataProvider;
};
