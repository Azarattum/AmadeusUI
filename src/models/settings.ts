import { writable } from "svelte/store";

export enum QuickAction {
  QueueNext = "Play Next",
  QueueLast = "Play Last",
}

let defaults: Settings = {
  hostname: "",
  login: "",
  password: "",

  defaultPlaylist: null,
  quickAction: QuickAction.QueueNext,
};
try {
  if ("localStorage" in globalThis) {
    defaults = JSON.parse(localStorage.getItem("settings") as string);
  }
  // eslint-disable-next-line no-empty
} catch {}

export const settings = writable(defaults);

settings.subscribe((x) => {
  localStorage.setItem("settings", JSON.stringify(x));
});

interface Settings {
  hostname: string;
  login: string;
  password: string;
  defaultPlaylist: string | null;
  quickAction: QuickAction;
}
