import { BigNumber, ethers } from 'ethers';
import {
  makeObservable,
  observable,
  onBecomeObserved,
  onBecomeUnobserved,
  reaction,
  runInAction,
} from 'mobx';

import { fetchData } from 'shared/utils/fetch-data';

import { Wallet } from '../wallet';

export class BalanceLoader {
  public balance = fetchData<BigNumber, null>(null);

  constructor(private wallet: Wallet) {
    makeObservable(this, {
      balance: observable,
    });

    this.runAutoFetcher();
  }

  private runAutoFetcher() {
    let disposeWalletListener: () => void = () => void 0;

    onBecomeObserved(this, 'balance', () => {
      disposeWalletListener = reaction(
        () => ({
          account: this.wallet.account,
          chainId: this.wallet.chain?.id || null,
        }),
        this.loadBalance,
        { fireImmediately: true },
      );
    });

    onBecomeUnobserved(this, 'balance', disposeWalletListener);
  }

  private loadBalance = async ({ account, chainId }: { account: string | null; chainId: number | null }) => {
    if (chainId && account) {
      const provider = ethers.getDefaultProvider(chainId);

      this.balance.status = 'loading';
      this.balance.value = null;

      try {
        const balance = await provider.getBalance(account);

        runInAction(() => {
          this.balance.value = balance;
          this.balance.status = 'succeed';
        });
      } catch (error) {
        runInAction(() => {
          this.balance.status = 'error';
          this.balance.value = null;

          if (error instanceof Error) this.balance.error = error.message;
          else this.balance.error = 'Unknown error';
        });
      }
    }
  };
}
