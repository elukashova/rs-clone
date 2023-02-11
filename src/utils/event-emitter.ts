import UrlObject from './utils.types';

class EventEmitter {
  private events: Record<string, ((data: UrlObject) => void)[]> = {};

  public on = (event: string, callback: (data: UrlObject) => void): void => {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  };

  public unsubscribe = (event: string, callback: (data: UrlObject) => void): void => {
    if (!this.events[event]) {
      return;
    }
    // eslint-disable-next-line max-len
    this.events[event] = this.events[event].filter((eventCallback) => eventCallback.toString() !== callback.toString());
  };

  public emit = (event: string, data: UrlObject): void => {
    const ev: ((data: UrlObject) => void)[] = this.events[event];
    if (ev) {
      ev.forEach((callback) => {
        callback.call(null, data);
      });
    }
  };
}

export default new EventEmitter();
