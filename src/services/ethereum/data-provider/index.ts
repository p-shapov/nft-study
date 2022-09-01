import { Wallet } from '../wallet';
import { BalanceLoader } from './balance-loader';
import { QrcodeLoader } from './qrcode-loader';

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
