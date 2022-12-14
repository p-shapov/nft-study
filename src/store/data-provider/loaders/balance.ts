import { BigNumber } from 'ethers';
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
          provider: this.wallet.provider,
        }),
        this.loadBalance,
        { fireImmediately: true },
      );
    });

    onBecomeUnobserved(this, 'balance', disposeWalletListener);
  }

  private loadBalance = async ({ account, provider }: Pick<Wallet, 'account' | 'provider'>) => {
    if (provider && account) {
      this.balance.value = null;
      this.balance.error = null;
      this.balance.status = 'loading';

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
