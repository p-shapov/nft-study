import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import {
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
  runInAction,
} from 'mobx';

import { fetchData } from 'shared/utils/fetch-data';

import { Wallet } from '../../ethereum/wallet';

export class QrcodeLoader {
  public qrcode = fetchData<string, null>(null);

  constructor(private wallet: Wallet) {
    makeObservable(this, {
      qrcode: observable,
    });

    this.runAutoFetcher();
  }

  private runAutoFetcher() {
    let disposeWalletListener: () => void = () => void 0;

    onBecomeObserved(this, 'qrcode', () => {
      disposeWalletListener = reaction(() => this.wallet.status, this.loadQrcode, {
        fireImmediately: true,
      });
    });

    onBecomeUnobserved(this, 'qrcode', disposeWalletListener);
  }

  private loadQrcode = async (status: Wallet['status']) => {
    if (status === 'connecting') {
      this.qrcode.value = null;
      this.qrcode.status = 'loading';

      setTimeout(this.setQrcode);
    }
  };

  private setQrcode = async () => {
    try {
      const qrcode = await this.getQrcode();

      runInAction(() => {
        this.qrcode.value = qrcode;
        this.qrcode.status = 'succeed';
      });
    } catch (error) {
      runInAction(() => {
        this.qrcode.value = null;
        this.qrcode.status = 'error';

        if (error instanceof Error) this.qrcode.error = error.message;
        else this.qrcode.error = 'Unknown error';
      });
    }
  };

  private getQrcode = async () => {
    const provider = await this.wallet.connector?.getProvider();

    let qrcode: string | null = null;

    if (provider instanceof WalletConnectProvider) qrcode = provider.connector.uri || null;
    if (provider instanceof CoinbaseWalletProvider) qrcode = provider.qrUrl || null;

    if (qrcode) return qrcode;

    throw new Error('Connector does not provide any qrcode');
  };
}
