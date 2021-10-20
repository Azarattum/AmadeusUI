<script lang="ts">
  import { pannable } from "actions/pannable";
</script>

<div class="more" use:pannable={{ gap: 16 }}>
  <div class="mode">
    <button class="lyrics" />
    <button class="queue" />
  </div>
</div>

<style lang="postcss">
  .more {
    z-index: 2;
    margin-bottom: calc(-1 * var(--view-height) + 45px);
    height: var(--view-height);

    background-color: var(--color-element);
    border-radius: 16px 16px 0 0;
    pointer-events: all;
    box-shadow: 0px 0px 8px var(--color-shadow);
  }

  .mode {
    height: 45px;
    display: flex;

    button {
      width: 100%;

      &:before {
        display: block;
        content: "";
        height: 45px;
        opacity: 0.7;
        background-color: var(--color-text-normal);

        transition: background-color 0.5s ease;
      }
      &:active:before {
        transition-duration: 0.05s;
        background-color: var(--color-accent-75);
      }
    }
  }

  .lyrics:before {
    mask: url("/icons/lyrics.svg") no-repeat 50% 50%;
    mask-size: 60% 60%;
  }
  .queue:before {
    mask: url("/icons/queue.svg") no-repeat 50% 55%;
    mask-size: 55% 55%;
  }
</style>
