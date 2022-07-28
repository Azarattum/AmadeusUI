<script lang="ts">
  import { image as empty } from "utils/empty";

  export let image: string | undefined | null;
  export let size = "100%";
</script>

<img
  on:click
  draggable="false"
  src={image || empty}
  alt=""
  loading="lazy"
  style="
    height: {size};
    width: {size};
    min-height: {size};
    min-width: {size};
    background-image: url({image});
  "
/>

<style lang="postcss">
  img {
    background-color: transparent;
    background-size: cover;
    object-fit: cover;
  }
</style>
