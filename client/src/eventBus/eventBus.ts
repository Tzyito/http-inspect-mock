/*
 * @Author: tzyito
 * @Date: 2022-11-22
 * @LastEditTime: 2022-11-22
 * @LastEditors: tzyito
 * @Description:
 */
import { InjectionKey } from "vue";
export interface Bus {
  on(name: string, cb: (...args: any) => any): void;
  emit(name: string, data?: any): void;
  off(name: string, cb: (...args: any) => any): void;
}
export class EventBus implements Bus {
  events: Record<string, any>;
  constructor() {
    this.events = {};
  }

  on(name: string, cb: (...args: any) => any) {
    this.events[name] = this.events[name] || [];
    this.events[name].push(cb);
  }

  emit(name: string, data?: any) {
    if (this.events[name]) {
      this.events[name].forEach((func: (...args: any) => any) => {
        func(data);
      });
    }
  }

  off(name: string, cb: (...args: any) => any) {
    if (this.events[name]) {
      for (let i = 0; i < this.events[name].length; i++) {
        if (this.events[name][i] === cb) {
          this.events[name].splice(i, 1);
          break;
        }
      }
    }
  }
}

export const injectBusKey: InjectionKey<Bus> = Symbol();
