<script lang="ts">
  import type { Playlist } from "models/playlist";
  import { Diretion, type Track as TrackData } from "models/tracks";
  import { scroller } from "actions/scroller";
  import draggable from "actions/draggable";
  import { fade } from "svelte/transition";
  import tappable from "actions/tappable";

  import VirtualList from "components/common/virtuallist.svelte";
  import Context from "./common/context.svelte";
  import Card from "./common/card.svelte";
  import Track from "./track.svelte";
  import tracks from "models/tracks";
  import { cloneArray } from "utils/utils";

  export let playlist: Playlist;

  let opened = false;
  $: items = playlist.tracks;
  $: if (!opened && viewport) viewport.scrollTo(0, 0);

  function formatDuration(seconds: number) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor((seconds % 3600) % 60);
    m += Math.round(s / 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";
    return hDisplay + mDisplay;
  }

  function getSummary(tracks?: TrackData[]) {
    if (!tracks || !tracks.length) return "";
    const n = tracks.length;
    const t = tracks.reduce((a, b) => a + b.length, 0);
    return `${n} ${n == 1 ? "song" : "songs"}, ${formatDuration(t)}`;
  }

  async function play(track: TrackData) {
    if (!$items) return;
    const index = $items.indexOf(track);
    if (!~index) return;

    tracks.clear();
    tracks.pushPlaylist(cloneArray($items), index);
  }

  async function shuffle() {
    if (!$items) return;
    tracks.clear();
    tracks.pushPlaylist(cloneArray($items));
    tracks.direct(Diretion.Shuffled);
  }

  async function queueNext() {
    if (!$items) return;
    tracks.pushNext(...cloneArray($items));
  }

  async function queueLast() {
    if (!$items) return;
    tracks.pushLast(...cloneArray($items));
  }

  function swap({ detail }: SwapEvent) {
    if (!$items) return;
    const { from, to } = detail;
    if (from < 0 || from >= $items.length) return;
    if (to < 0 || to >= $items.length) return;
    if (from === to) return;

    const item = $items.splice(from, 1)[0];
    if (!item) return;
    $items.splice(to, 0, item);
    $items = $items;
  }

  const standalone = !!(navigator as any).standalone;
  const itemHeight = 56;
  let viewport: HTMLElement;
  let container: HTMLElement;
</script>

<Card
  title={playlist.title}
  height={115}
  bind:opened
  on:click={() => opened || !$items || (opened = !opened)}
>
  <div
    class="viewport"
    bind:this={viewport}
    class:opened
    use:scroller={{ header: "h2" }}
  >
    {#if $items}
      <div
        on:swap={swap}
        class="container"
        bind:this={container}
        in:fade={{ delay: 300 }}
        use:draggable={{
          offsetTop: standalone ? 46.5 : 0,
          offsetLeft: 8,
          offsetBottom: standalone ? 114 : 92,
          margin: 0,
        }}
      >
        <VirtualList
          items={$items}
          {container}
          {itemHeight}
          {viewport}
          let:item={track}
          let:index
        >
          <div
            use:tappable
            class="track"
            data-index={index}
            class:tapped={false}
            class:dragging={false}
            on:click={(e) => {
              if (!opened) return;
              e.stopPropagation();
              play(track);
            }}
          >
            <Track {track} on:play={({ detail }) => play(detail)} />
          </div>
        </VirtualList>
        <p>{getSummary($items)}</p>
      </div>
    {:else}
      <div class="container" out:fade={{ duration: 300 }}>
        <div class="track"><Track /></div>
        <div class="track"><Track /></div>
      </div>
    {/if}
  </div>
  <Context>
    <button
      class="option edit"
      class:active={false}
      aria-label="Edit Playlist"
    />
    <button class="option next" aria-label="Queue Next" on:click={queueNext} />
    <button class="option last" aria-label="Queue Last" on:click={queueLast} />
    <button
      class="option shuffle"
      aria-label="Play Shuffled"
      on:click={shuffle}
    />
    <button
      slot="activator"
      class="options play"
      aria-label="Play Options"
      class:active={false}
    />
  </Context>
</Card>

<style lang="postcss">
  @import "../styles/mixins.pcss";

  .viewport {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    height: calc(var(--view-height) - 46px);
    overflow-y: hidden;
    margin: 0 -16px;

    & > div {
      grid-row: 1;
      grid-column: 1;

      &:before {
        display: block;
        content: "";
        height: 10px;
      }

      &:after {
        display: block;
        content: "";
        height: 90px;
      }
    }

    & + :global(.context .menu) {
      display: flex;
      flex-direction: column;
      background-color: transparent;
      backdrop-filter: none;
      min-width: min-content;
      transform-origin: calc(100% - 17px) 100% !important;
      overflow: visible;
    }
  }
  .container {
    margin-top: 4px;
    padding: 0 16px;
  }
  .track {
    padding: 4px;
    border-radius: 4px;
    pointer-events: none;
    transition: background-color 0.4s ease;
    width: calc(100% - 8px);

    &.tapped {
      transition-duration: 0s;
      background-color: var(--color-highlight);
    }

    :global(img) {
      cursor: pointer;
      pointer-events: all;
    }
  }
  .options,
  .option {
    position: relative;
    box-sizing: content-box;
    width: 24px;
    height: 24px;
    padding: 10px;
    padding-bottom: 18px;

    &:before {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      content: "";
      width: 44px;
      height: 44px;
      box-shadow: 0px 0px 8px var(--color-shadow);
      border-radius: 100%;
      transition: background-color 0.3s ease;
    }
  }
  .options {
    position: absolute;
    right: 8px;
    bottom: 99px;

    color: #fff;

    cursor: default;
    display: none;

    &:before {
      background-color: var(--color-accent-0);
    }
    &.active:before {
      transition-duration: 0.05s;
      background-color: var(--color-accent-75);
    }
  }
  .option {
    border: none !important;
    background-color: transparent !important;
    font-size: var(--font-tiny);

    color: var(--color-accent-75);

    &:before {
      background-color: var(--color-element);
    }
    &.active:before {
      transition-duration: 0.05s;
      background-color: var(--color-highlight-active) !important;
    }
  }
  button {
    &.options:after {
      icon: playlist 24px;
    }
    &.shuffle:after {
      icon: shuffle 24px;
    }
    &.next:after {
      icon: next 24px;
    }
    &.last:after {
      transform: scaleY(-1);
      icon: next 24px;
    }
    &.edit:after {
      icon: settings 24px;
    }
  }

  .viewport.opened {
    overflow-y: auto;
    .track {
      cursor: pointer;
      pointer-events: all;
      :global(*) {
        pointer-events: none;
      }

      transition: box-shadow 0.3s ease, border-radius 0.3s ease,
        transform 0.3s ease;
      &.dragging {
        background: var(--color-background);
        transition: box-shadow 0.3s ease, border-radius 0.3s ease;
        position: relative;
        box-shadow: 0 0 16px var(--color-shadow);
        border-radius: 8px;
        z-index: 1;
      }
    }
    & + :global(.context .options) {
      display: block;
    }
  }
  :global(.standalone) {
    .viewport > :global(div)::after {
      height: 158px;
    }
    .options {
      bottom: 167px;
    }
  }
</style>
