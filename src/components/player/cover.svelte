<script lang="ts">
  import { empty } from "utils/cover";

  export let image: string | undefined | null;
  export let size = "100%";
</script>

<img
  on:click
  src={image || empty}
  alt=""
  loading="lazy"
  style="
    height: {size};
    min-height: {size};
    min-width: {size};
  "
/>

<style lang="postcss">
  img {
    background-color: transparent;
    background-size: cover;
  }
</style>
