/* eslint-disable @typescript-eslint/no-unused-vars */

declare namespace svelte.JSX {
  interface HTMLAttributes {
    onopen?: () => void;
    onclose?: () => void;
  }
}
