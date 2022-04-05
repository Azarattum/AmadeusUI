<script lang="ts">
  import tracks, { Repeatition, type Track } from "models/tracks";

  import Swiper from "components/common/swiper.svelte";
  import Cover from "components/player/cover.svelte";
  import Options from "./options.svelte";
  import Pause from "./pause.svelte";

  export let paused: boolean;
  export let loading: boolean;

  let view: Track[] = [];
  $: if ($tracks) {
    view[0] = tracks.history[tracks.history.length - 2] || {};
    view[1] = tracks.history[tracks.history.length - 1] || {};
    view[2] = tracks.current || {};
    view[3] = tracks.queue[0] || {};
    view[4] = tracks.queue[1] || {};
    if (tracks.repeatition == Repeatition.All) {
      if (!view[3].title) view[3] = { ...tracks.history[0] };
      if (!view[4].title) view[4] = { ...tracks.history[1] };
    }
  }
</script>

<Swiper
  {view}
  let:item
  let:position
  on:next={() => tracks.next()}
  on:previous={() => tracks.previous()}
>
  <div class="container" class:active={!position}>
    <Cover image={item.cover} />
    {#if position === 0}
      <Pause bind:paused {loading} />
      <Options multiartist={item.artists.length > 1} />
    {/if}
  </div>
</Swiper>

<style lang="postcss">
  .container {
    width: 100%;
    position: relative;
    display: flex;

    overflow: hidden;
    border-radius: 16px;

    &:before {
      float: left;
      padding-top: 100%;
      content: "";
    }

    & > :global(*:first-child) {
      position: absolute;
    }

    cursor: pointer;
    transition: 0.2s ease;
    transition-property: box-shadow;

    &.active {
      box-shadow: 0px 4px 8px var(--color-shadow);
    }
  }
</style>
