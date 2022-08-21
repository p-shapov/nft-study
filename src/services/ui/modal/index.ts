import { action, computed, makeAutoObservable, observable } from 'mobx';

export class Modal {
  public get current() {
    return this.stack.at(-1) || null;
  }

  public stack: Array<string> = [];

  public push = (modal: string) => {
    this.stack.push(modal);
  };

  public pop = () => {
    this.stack.pop();
  };

  public clear = () => {
    this.stack = [];
  };

  constructor() {
    makeAutoObservable(this, {
      current: computed,
      stack: observable,
      push: action.bound,
      pop: action.bound,
      clear: action.bound,
    });
  }
}
