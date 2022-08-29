import { action, computed, makeObservable, observable } from 'mobx';

import { ModalName } from './types';

export class Modal {
  public get current() {
    return this.stack.at(-1) || null;
  }

  public stack: Array<ModalName> = [];

  public push(modal: ModalName) {
    this.stack.push(modal);
  }

  public pop() {
    this.stack.pop();
  }

  public clear() {
    this.stack = [];
  }

  constructor() {
    makeObservable(this, {
      current: computed,
      stack: observable,
      push: action.bound,
      pop: action.bound,
      clear: action.bound,
    });
  }
}
