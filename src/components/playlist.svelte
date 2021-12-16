<script lang="ts">
  import type { Track as ITrack } from "models/tracks";
  import type Playlist from "models/playlist";
  import { createEventDispatcher } from "svelte";
  import { scroller } from "actions/scroller";
  import draggable from "actions/draggable";
  import { fade } from "svelte/transition";
  import tappable from "actions/tappable";

  import VirtualList from "components/common/virtuallist.svelte";
  import Context from "./common/context.svelte";
  import Card from "./common/card.svelte";
  import Track from "./track.svelte";

  const dispatch = createEventDispatcher();

  export let title: Promise<string> | string | null = null;
  export let playlist: Promise<Playlist>;

  let opened = false;
  let loaded = false;
  let name =
    typeof title === "string"
      ? title
      : (Promise.race(
          [title, playlist.then((x) => x.title)].filter(Boolean)
        ) as Promise<string>);
  let tracks: ITrack[] = [];
  playlist.then((x) => (tracks = x.tracks));

  $: if (!opened && viewport) viewport.scrollTo(0, 0);
  playlist.then(() => setTimeout(() => (loaded = true), 300));

  function formatDuration(seconds: number) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor((seconds % 3600) % 60);
    m += Math.round(s / 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes") : "";
    return hDisplay + mDisplay;
  }

  function getSummary(tracks: ITrack[]) {
    const n = tracks.length;
    const t = tracks.reduce((a, b) => a + b.length, 0);
    return `${n} ${n == 1 ? "song" : "songs"}, ${formatDuration(t)}`;
  }

  async function play(track: ITrack) {
    const loaded = tracks;
    const index = loaded.indexOf(track);
    if (index === -1) return;
    dispatch("playlist", { tracks: loaded, index });
  }

  async function shuffle() {
    const loaded = tracks;
    dispatch("playlist", { tracks: loaded });
  }

  async function queueNext() {
    const loaded = tracks;
    dispatch("next", loaded);
  }

  async function queueLast() {
    const loaded = tracks;
    dispatch("last", loaded);
  }

  function swap({ detail }: SwapEvent) {
    const { from, to } = detail;
    if (from < 0 || from >= tracks.length) return;
    if (to < 0 || to >= tracks.length) return;
    if (from === to) return;

    const item = tracks.splice(from, 1)[0];
    if (!item) return;
    tracks.splice(to, 0, item);
    tracks = tracks;
    /// FIRE EVENT TO SYNC PLAYLIST
  }

  const standalone = !!(navigator as any).standalone;
  const itemHeight = 56;
  let viewport: HTMLElement;
  let container: HTMLElement;
</script>

<Card
  title={name}
  bind:opened
  on:click={() => opened || !loaded || (opened = !opened)}
>
  <div
    class="viewport"
    bind:this={viewport}
    class:opened
    use:scroller={{ header: "h2" }}
  >
    {#await playlist}
      <div class="container" out:fade={{ duration: 300 }}>
        <div class="track"><Track /></div>
        <div class="track"><Track /></div>
      </div>
    {:then}
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
          items={tracks}
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
        <p>{getSummary(tracks)}</p>
      </div>
    {/await}
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
      on:touchstart|stopPropagation
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
    width: 100%;

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
    box-sizing: content-box;
    border-radius: 100%;
    margin-bottom: 8px;
    width: 24px;
    height: 24px;
    padding: 10px;
    box-shadow: 0px 0px 8px var(--color-shadow);
  }
  .options {
    position: absolute;
    right: 8px;
    bottom: 99px;

    background-color: var(--color-accent-0);
    color: #fff;

    cursor: default;
    display: none;

    transition: background-color 0.3s ease;
    &.active {
      transition-duration: 0.05s;
      background-color: var(--color-accent-75);
    }
  }
  .option {
    border: none !important;
    font-size: var(--font-tiny);

    background-color: var(--color-element);
    color: var(--color-accent-75);

    &.active {
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
