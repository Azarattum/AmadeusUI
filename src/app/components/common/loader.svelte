<script lang="ts">
  export let color: string = "currentColor";
  export let size: number;
  export let padding = 0;
</script>

<div
  class="spinner"
  style="
  --size:{size}px;
  --padding:{padding}px;
  color:{color};
  "
/>

<style lang="postcss">
  .spinner {
    position: relative;
    width: var(--size);
    height: var(--size);
    flex-shrink: 0;
    padding: var(--padding);

    &:after {
      position: absolute;
      content: "";
      display: block;
      width: calc(var(--size) / 2);
      height: calc(var(--size) / 2);
      margin: calc(var(--size) / 8);
      border-radius: 50%;
      border: calc(var(--size) / 8) solid currentColor;
      border-color: currentColor transparent currentColor transparent;
      animation: spinner-animation 1.2s linear infinite;
    }
  }

  @keyframes spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
