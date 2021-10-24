/* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace svelte.JSX {
  interface HTMLAttributes {
    onswap?: (event: { detail: { from: number; to: number } }) => void;
  }
}
