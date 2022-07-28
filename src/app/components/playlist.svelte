<script lang="ts">
  import type { Playlist } from "models/playlist";
  import { Direction, type Track as TrackData } from "models/tracks";
  import autoscroll from "$actions/autoscroll";
  import { scroller } from "actions/scroller";
  import { fade } from "svelte/transition";
  import { cloneArray } from "utils/utils";
  import tracks from "models/tracks";

  import Sortable from "$components/sortable.svelte";
  import Context from "./common/context.svelte";
  import Card from "./common/card.svelte";
  import Track from "./track.svelte";

  export let playlist: Playlist;

  let opened = false;
  $: items = playlist.tracks;

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
    tracks.direct(Direction.Shuffled);
  }

  async function queueNext() {
    if (!$items) return;
    tracks.pushNext(...cloneArray($items));
  }

  async function queueLast() {
    if (!$items) return;
    tracks.pushLast(...cloneArray($items));
  }

  // function swap({ detail }: SwapEvent) {
  //   if (!$items) return;
  //   const { from, to } = detail;
  //   if (from < 0 || from >= $items.length) return;
  //   if (to < 0 || to >= $items.length) return;
  //   if (from === to) return;

  //   const item = $items.splice(from, 1)[0];
  //   if (!item) return;
  //   $items.splice(to, 0, item);
  //   $items = $items;
  // }

  // const standalone = !!(navigator as any).standalone;
  // const itemHeight = 56;
  // let container: HTMLElement;
</script>

<Card title={playlist.title} height={300} width={350}>
  {#if $items}
    <!-- /// Should not clone here! -->
    <Sortable items={cloneArray($items)} let:item animation={300}>
      <Track track={item} on:play={({ detail }) => play(detail)} />
    </Sortable>
    <p>{getSummary($items)}</p>
  {:else}
    <!-- /// Transition ? -->
    <Track />
    <Track />
  {/if}

  <!-- /// Extract to Floating Action Button component -->
  <!-- /// https://www.youtube.com/watch?v=dsMj8_dUJTQ -->
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
  @import "mixins.pcss";

  .playlist {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    /* /// BAD!!! */
    height: calc(var(--view-height) - 46px);
  }

  /* /// THIS */
  .viewport {
    /* display: grid;
    grid-template-columns: minmax(0, 1fr);
    height: calc(var(--view-height) - 46px);
    overflow-y: hidden;
    margin: 0 -16px; */

    /* & > div {
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
    } */

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
  /* /// THIS */
  .container {
    margin-top: 4px;
    padding: 0 16px;
  }
  /* /// THIS */
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
