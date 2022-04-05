let EventEmmiter = globalThis.EventTarget;

try {
  new EventEmmiter();
} catch {
  //Polyfill for safari <=13
  EventEmmiter = class {
    private _listeners: any[] = [];

    addEventListener(
      type: string,
      listener: () => void,
      options = { once: false }
    ): void {
      this._listeners.push({ type, listener, options });
    }

    removeEventListener(type: string, listener: () => void): void {
      const index = this._listeners.findIndex(
        (item) => item.type === type && item.listener === listener
      );
      if (index >= 0) this._listeners.splice(index, 1);
    }

    dispatchEvent(evt: Event): void {
      this._listeners
        .filter((item) => item.type === evt.type)
        .forEach((item) => {
          const {
            type,
            listener,
            options: { once },
          } = item;
          listener.call(this, evt);
          if (once === true) this.removeEventListener(type, listener);
        });
    }
  } as any;
}

export default EventEmmiter;
