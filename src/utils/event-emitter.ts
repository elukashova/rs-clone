import { EventData } from './event-emitter.types';

class EventEmitter {
  private events: Record<string, ((data: EventData) => void)[]> = {};

  public on = (event: string, callback: (data: EventData) => void): void => {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  };

  public unsubscribe = (event: string, callback: (data: EventData) => void): void => {
    if (!this.events[event]) {
      return;
    }
    // eslint-disable-next-line max-len
    this.events[event] = this.events[event].filter((eventCallback) => eventCallback.toString() !== callback.toString());
  };

  public emit = (event: string, data: EventData): void => {
    const ev: ((data: EventData) => void)[] = this.events[event];
    if (ev) {
      ev.forEach((callback) => {
        callback.call(null, data);
      });
    }
  };
}

export default new EventEmitter();
