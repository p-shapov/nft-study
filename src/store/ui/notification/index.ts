import { action, makeObservable, observable } from 'mobx';

import { NotificationItem } from './types';

export class Notification {
  public stack: Array<NotificationItem> = [];

  public push(item: NotificationItem) {
    if (this.hasUniqId(item.id)) this.stack.push(item);
  }

  public pop(item: NotificationItem, pred: (item: NotificationItem) => boolean = ({ id }) => id !== item.id) {
    this.stack = this.stack.filter(pred);
  }

  public clear() {
    this.stack = [];
  }

  constructor() {
    makeObservable(this, {
      stack: observable,
      push: action.bound,
      pop: action.bound,
      clear: action.bound,
    });
  }

  private hasUniqId = (id: string) => {
    return this.stack.every((item) => id !== item.id);
  };
}
