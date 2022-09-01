import { Wallet } from '../ethereum/wallet';
import { BalanceLoader } from './loaders/balance';
import { QrcodeLoader } from './loaders/qrcode';

export class DataProvider {
  public get balance() {
    return this.balanceLoader.balance;
  }

  public get qrcode() {
    return this.qrcodeLoader.qrcode;
  }

  constructor(private wallet: Wallet) {}

  private balanceLoader = new BalanceLoader(this.wallet);
  private qrcodeLoader = new QrcodeLoader(this.wallet);
}
