/* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace svelte.JSX {
  interface HTMLAttributes {
    ondragend?: (event: DraggedEvent) => void;
  }
}

declare interface DraggedEvent extends Event {
  retract: (target?: HTMLElement | null) => void;
  canceled: boolean;
}
