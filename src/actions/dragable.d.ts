/* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace svelte.JSX {
  interface HTMLAttributes {
    onswap?: (event: SwapEvent) => void;
  }
}

declare interface SwapEvent {
  detail: { from: number; to: number };
}
