import { action, computed, makeAutoObservable, observable } from 'mobx';

import { ModalName } from './types';

export class Modal {
  public get current() {
    return this.stack.at(-1) || null;
  }

  public stack: Array<ModalName> = [];

  public push = (modal: ModalName) => {
    this.stack = [...this.stack, modal];
  };

  public pop = () => {
    this.stack = this.stack.slice(0, -1);
  };

  public clear = () => {
    this.stack = [];
  };

  constructor() {
    makeAutoObservable(this, {
      current: computed,
      stack: observable.ref,
      push: action.bound,
      pop: action.bound,
      clear: action.bound,
    });
  }
}
