/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Audio } from "models/audio";

const BUFFER_COUNT = 4;

const empty =
  "data:audio/mp3;base64,//MkxAAHiAICWABElBeKPL/RANb2w+yiT1g/gTok//lP/W/l3h8QO/OCdCqCW2Cw//MkxAQHkAIWUAhEmAQXWUOFW2dxPu//9mr60ElY5sseQ+xxesmHKtZr7bsqqX2L//MkxAgFwAYiQAhEAC2hq22d3///9FTV6tA36JdgBJoOGgc+7qvqej5Zu7/7uI9l//MkxBQHAAYi8AhEAO193vt9KGOq+6qcT7hhfN5FTInmwk8RkqKImTM55pRQHQSq//MkxBsGkgoIAABHhTACIJLf99nVI///yuW1uBqWfEu7CgNPWGpUadBmZ////4sL//MkxCMHMAH9iABEmAsKioqKigsLCwtVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVV//MkxCkECAUYCAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
const buffers: Buffer[] = [];

export function isiOS(): boolean {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

export default function unlock(): void {
  if (!("Audio" in globalThis)) return;

  const orig = Audio;
  (globalThis as any).Audio = function (src?: string) {
    const available = buffers.find((x) => !x.used);
    if (!available) {
      throw new Error("Unable to allocate new audio! Not enough buffers!");
    }
    available.used = true;
    if (src) available.data.src = src;

    Object.defineProperty(available.data, "destroyed", {
      set(value) {
        if (value) {
          available.used = false;
          available.data.src = "";
          available.data.autoplay = true;
        }
      },
      get() {
        return available.used;
      },
    });

    available.data.addEventListener(
      "canplay",
      () => {
        available.data.autoplay = false;
        if (!available.data.paused) available.data.pause();
      },
      { once: true }
    );
    return new Proxy(available.data, {
      set(target, prop, value) {
        if (prop === "src") {
          available.used = !!value;
          if (!value) available.data.autoplay = true;
        }
        return Reflect.set(target, prop, value, available.data);
      },
      get(target, prop) {
        let data = (target as any)[prop];
        if (typeof data === "function") {
          data = data.bind(available.data);
        }
        return data;
      },
    });
  };

  const allocate = () => {
    for (let i = 0; i < BUFFER_COUNT; i++) {
      const buffer = new orig(empty) as Audio;
      buffer.autoplay = true;
      buffer.destroyed = false;
      buffers.push({ used: false, data: buffer });
    }
  };

  document.addEventListener("pointerup", allocate, { once: true });

  const stop = Event.prototype.stopPropagation;
  Event.prototype.stopPropagation = function () {
    if (this instanceof TouchEvent && this.type === "pointerup") {
      allocate();
      document.removeEventListener("pointerup", allocate);
      Event.prototype.stopPropagation = stop;
    }
    return stop.bind(this)();
  };
}

interface Buffer {
  used: boolean;
  data: Audio;
}
