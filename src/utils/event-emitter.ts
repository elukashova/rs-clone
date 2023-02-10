import UrlObject from './utils.types';

class EventEmitter {
  private events: Record<string, ((data: UrlObject) => void)[]> = {};

  public on = (event: string, fn: (data: UrlObject) => void): void => {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(fn);
  };

  // eslint-disable-next-line max-len
  public unsubscribe = (event: string, fn: (data: UrlObject) => void): void => {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter((eFn) => eFn.toString() !== fn.toString());
  };

  public emit = (event: string, data: UrlObject): void => {
    const ev: ((data: UrlObject) => void)[] = this.events[event];
    if (ev) {
      ev.forEach((fn) => {
        fn.call(null, data);
      });
    }
  };
}

export default new EventEmitter();
