import { writable } from "svelte/store";

export enum QuickAction {
  QueueNext = "Play Next",
  QueueLast = "Play Last",
}

let defaults: Settings = {
  hostname: "",
  login: "",
  token: "",

  defaultPlaylist: null,
  quickAction: QuickAction.QueueNext,
};
try {
  if ("localStorage" in globalThis) {
    defaults =
      JSON.parse(localStorage.getItem("settings") as string) || defaults;
  }
  // eslint-disable-next-line no-empty
} catch {}

export const settings = writable(defaults);

settings.subscribe((x) => {
  globalThis.localStorage?.setItem("settings", JSON.stringify(x));
});

interface Settings {
  hostname: string;
  login: string;
  token: string;
  defaultPlaylist: string | null;
  quickAction: QuickAction;
}
